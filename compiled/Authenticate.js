"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Models_1 = require("./Models");
const store = new MongoDBStore({
    uri: 'mongodb://admin:admin@mongo:27017/yoalert-dev?authSource=admin',
    collection: 'r_sessions'
});
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "*/*" });
const cookieParser = require('cookie-parser');
class Authenticate {
    constructor(app) {
        store.on('connected', function () {
            store.client; // The underlying MongoClient object from the MongoDB driver
        });
        // Catch errors
        store.on('error', function (error) {
            console.error('error from mongo store', error);
        });
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            store: store
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        // passport config
        passport.use(new LocalStrategy(Models_1.User.authenticate()));
        passport.serializeUser(Models_1.User.serializeUser());
        passport.deserializeUser(Models_1.User.deserializeUser());
        app.use(cookieParser());
    }
    loginRoutes() {
        var router = express_1.Express.Router();
        router.use(jsonParser);
        router.post('/register', function (req, res) {
            Models_1.User.register(new Models_1.User({
                username: req.body.username,
                email: req.body.email
            }), req.body.password, function (err, user) {
                if (err) {
                    console.log('error creating user', err);
                    const error = err.name === 'UserExistsError'
                        ? 'User exists'
                        : 'Unknown error';
                    return res.send(JSON.stringify({ success: false, error }));
                }
                else {
                    return res.send(JSON.stringify({ success: true }));
                }
            });
        });
        router.post('/login', function (req, res, next) {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    console.log('err', err);
                    return next(err);
                }
                if (!user) {
                    console.log('no user');
                    return next('/login');
                }
                req.logIn(user, function (err) {
                    if (err) {
                        console.log('err at 1', err);
                        return next(err);
                    }
                    console.log(user);
                    res.cookie('userid', user._id);
                    res.send({ yay: 'yay', user });
                });
            })(req, res, next);
        });
        router.get('/logout', function (req, res) {
            req.logout();
            res.status(200).end();
        });
        router.get('/validate-session', function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { authenticated, user } = yield Authenticate.isAuthenticated(req);
                const result = { authenticated, user: null };
                if (user) {
                    result.user = user.name || user.email;
                }
                res.send(result);
            });
        });
        return router;
    }
    static isAuthenticated(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userid = req.headers.userid;
            console.log(req.cookies);
            if (!userid) {
                return { authenticated: false };
            }
            const user = yield Models_1.User.findById(userid).exec();
            if (!user) {
                return { authenticated: false };
            }
            return { authenticated: true, user };
        });
    }
    appendUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authenticated, user } = yield Authenticate.isAuthenticated(req);
            console.log('authenticated, req.user', authenticated, user);
            req.user = user;
            next();
        });
    }
    checkAuthenticationMiddleware() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if ((yield Authenticate.isAuthenticated(req)).authenticated) {
                //req.isAuthenticated() will return true if user is logged in
                next();
            }
            else {
                res.status(401).end();
            }
        });
    }
}
exports.Authenticate = Authenticate;
//# sourceMappingURL=Authenticate.js.map