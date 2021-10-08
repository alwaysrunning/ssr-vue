import UserModel from '../model/user';
const passport = require('passport');
const {
  Strategy: JwtStrategy,
  ExtractJwt: ExtractJwt
} = require('passport-jwt');
const config = require('../config/index');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.accessTokenJwt.secret
};

module.exports = () => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, next) => {
      UserModel.getById(jwt_payload.id)
        .then(user => next(null, user))
        .catch(err => next(err, false));
    })
  );

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', config.accessTokenJwt.jwtSession)
  };
};
