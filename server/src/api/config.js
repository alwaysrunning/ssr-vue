const { assign, omit, includes} = require('lodash')
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

function parseBody (type, data) {
    switch (type) {
        case 'form-data':
            return { formData: data };
        case 'x-www-form-urlencoded':
            return { form: data };
        case 'json':
            return { body: data };
        default:
            // do nothing
    }
    return {}
}

class Config {

    static requestOpts (options) {
        let { url, method, token, type, data, roleType } = options;
        type = type || 'json';
        return assign({
            method,
            url,
            headers: assign(
                { 'cache-control': 'no-cache' },
                roleType ? { roleType } : {},
                token ? { authorization: token } : {},
                method === 'GET' || method === 'DELETE'
                ? {}
                : { 'content-type': `${ type === 'form-data' ? 'multipart/form-data' : `application/${type} `};charset=UTF-8` },
            ),
            json: true,
        }, data ? parseBody(type, data) : {});
    }

    // To avoid request-promise cut off the long data(expect a json but got a bad json string), change ApiCaller from request-promise to node-fetch.
    static async fetchDotNetApi (url, options) {
        const opts = this.requestOpts({ url, ...options })
        return fetch(url, opts)
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(err => {
                this.logError2CloudWatch(url, options, err)
                return Promise.reject(err);
            })
    }

    static logError2CloudWatch (url, options, err, includes) {
        // const { pushLog, isSensitive, data } = options
        // // if (pushLog) {
        //     const { statusCode=500 } = err || {}
        //     if (includes && _includes(includes, +statusCode) || statusCode) {
        //         const opt = { ...options, data: isSensitive ? "Sensitive information" : data }
        //         logger.error(`${url}`, { error: omit(err, ['stack', '__error_callsites', 'response']), options: opt })
        //     }
        // // }
    }

}

Config._apiUrl = `${process.env.API_URL}/NewApi`;

module.exports = Config
