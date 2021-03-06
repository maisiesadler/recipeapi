import { App, Express, Handler, Request, Response, NextFunction } from "./express";
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);

import { User } from "./Models";

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "*/*" });

export class Authenticate {
    constructor(app: App, url: string) {
        const store = new MongoDBStore({
            url,
            collection: 'sessions'
        });
        
        store.on('connected', function () {
            store.client; // The underlying MongoClient object from the MongoDB driver
        });

        // Catch errors
        store.on('error', function (error) {
            console.error('error from mongo store', error)
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
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
    }

    public loginRoutes() {
        var router = Express.Router();

        router.use(jsonParser);

        router.post('/register', function (req: Request, res: Response) {
            User.register(new User({
                username: req.body.username
            }), req.body.password, function (err, user) {
                if (err) {
                    console.log('error creating user', err)
                    const error = err.name === 'UserExistsError'
                        ? 'User exists'
                        : 'Unknown error';

                    return res.send(JSON.stringify({ success: false, error }));
                } else {
                    return res.send(JSON.stringify({ success: true }));
                }
            });
        });

        router.post('/login', passport.authenticate('local'), function (req, res) {
            res.status(200).end();
        });

        router.get('/logout', function (req, res) {
            req.logout();
            res.status(200).end();
        });

        router.get('/validate-session', async function (req: Request, res: Response) {
            const user = req.user || {};
            const result = {
                authenticated: req.isAuthenticated(),
                // username: user.username || null,
                // spaces: user.spaces || []
                user
            };
            res.send(result);
        });

        return router;
    }

    public checkAuthenticationMiddleware(): Handler {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.status(401).end();
            }
        }
    }
}
