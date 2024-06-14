const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/userModel');
const JWT = require('jsonwebtoken');
require('dotenv').config();

const notAuthorized = { message: 'Não autorizado', status: 401 };
const mustbeAdmin = { message: 'O usuário não possui o cargo administrativo', status: 401 };

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(new JWTStrategy(options, async (payload, done) => {
    try {
        const user = await User.getUserByEmail(payload.email);
        if (user) {
            return done(null, user);
        } else {
            return done(notAuthorized, false);
        }
    } catch (error) {
        console.log(error)
        return done(error, false);
    }
}));

const generatejwt = (data) => {
    return JWT.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};

const isAdmin = (req, res, next) => {
    let jwt = req.headers.authorization 
    const bearerRemover = jwt.replace('Bearer ', '');
    try {
        const decodedToken = JWT.verify(bearerRemover, process.env.JWT_SECRET_KEY);
        return decodedToken.isAdmin ? next() : next(mustbeAdmin);
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
};


const onlyAuthenticate = (req, res, next) => {
    if (['/login','/register'].includes(req.originalUrl)) {
        return next()
    }

    passport.authenticate('jwt', (err, user) => {
        if (err) {
            return next(err);
        }
        req.user = user;
        return user ? next() : next(notAuthorized);
    })(req, res, next);
};

module.exports = {
    generatejwt,
    isAdmin,
    onlyAuthenticate,
    passport
};
