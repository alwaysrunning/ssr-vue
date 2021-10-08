const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const { createBundleRenderer } = require('vue-server-renderer');

const isLocal = !process.env.SECRET_ENV;
const isProd = process.env.NODE_ENV === 'production';
const resolve = file => path.resolve(__dirname, file);

const app = express();

let renderer;
let readyPromise;
let templatePath;

const createRenderer = (bundle, options) => {
    return createBundleRenderer(
    bundle,
    Object.assign(options, {
        cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
        }),
        basedir: resolve('./dist'),
        runInNewContext: false
    })
    );
};
if (isProd) {
    templatePath = resolve(`./src/index.${process.env.ON_LINE === 'true' ? 'prd' : 'template'}.html`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    const bundle = require('./dist/vue-ssr-server-bundle.json');
    const clientManifest = require('./dist/vue-ssr-client-manifest.json');
    renderer = createRenderer(bundle, { template, clientManifest });
} else {
    templatePath = resolve('./src/index.template.html');
    readyPromise = require('./build/setup-dev-server')(
        app,
        templatePath,
        (bundle, options) => {
            renderer = createRenderer(bundle, options);
        }
    );
}

const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});
// const auth = require('./server/dist/middleware/auth')();

app.set('trust proxy', true)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(auth.initialize());
app.use(compression({ threshold: 0 }));
app.use(favicon('./public/logo-48.png'));
app.use('/dist', serve('./dist', true));
app.use('/public', serve('./public', true));


const session = require('express-session');
const cookieParser = require('cookie-parser');
const redisStore = require('connect-redis')(session);
const redisOpt = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: +process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
}
const secret = process.env.EXPRESS_SESSION_SECRET_KEY || 'HPA Session Secret Key'
app.use(cookieParser(secret));
app.use(session({
    name: 'WSID',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: isProd },
    store: new redisStore(redisOpt)
}));

require('./server/src/router/index')(app);

const render = async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    const errorHandler = err => {
        if (err.url) {
            res.redirect(err.url);
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found');
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error');
            console.error(`error during render : ${req.url}`);
            console.error(err.stack);
        }
    };

    // const { OPTANON_CATEGORY } = require('./build/definition.js');
    const context = {
        title: '',
        desc: '',
        keyword: '',
        url: req.url,
        redirect: '/user/login',
    };

    let html = ''
    const stream = renderer.renderToStream(context)

    stream.on('data', data => {
        html += data.toString()
    })

    stream.on('end', () => {
        res.end(html)
    })

    stream.on('error', errorHandler)
};

app.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req, res));
});

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`\nServer(${isLocal ? 'Local' : process.env.NODE_ENV}) Started at 127.0.0.1:${port}`);
});

process.on('unhandledRejection', (reason, p) => {
    console.log(`Possibly Unhandled Rejection at: Promise, ${p}, reason: ${reason}`);
});
