import { DbApi } from "./DbApi";
import { Authenticate } from "./Authenticate";
import { Routes } from "./Routes";
import { Express, Request, Response, NextFunction } from './express';
import { UiRoutes } from './ui';

const connectionstring = process.env.connectionstring;

const app = Express.App();

const authed = new Authenticate(app, connectionstring);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, userid");
    next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('received request', req.method, req.url)
    next();
});

app.use('/api', authed.loginRoutes());
app.use('/ui', UiRoutes.createRoutes())

DbApi.connect(connectionstring)
    .then(() => {
        app.use('/api', Routes.createRoutes());
        app.use(async (err, req, res, next) => {
            if (res.headersSent) {
                return next(err)
            }
            res.status(500).send('Internal server error')
        })
        app.listen(3001, () => console.log("Example app listening on port 3001!"));
    });

process.on('SIGTERM', function () {
    console.log('received SIGTERM');
    process.exit(0);
});