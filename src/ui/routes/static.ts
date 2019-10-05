import { Express, Request, Response, Router, NextFunction } from "../../express";
const fs = require('fs');

export class StaticRoutes {
    public static Create(): Router {
        const mime = {
            html: 'text/html',
            txt: 'text/plain',
            css: 'text/css',
            gif: 'image/gif',
            jpg: 'image/jpeg',
            png: 'image/png',
            svg: 'image/svg+xml',
            js: 'application/javascript'
        };

        const router = Express.Router();

        router.get('/*', async (req: Request, res: Response) => {
            // ignore query string
            const path = /^([^?]+)/.exec(req.url)
            const file = `templates/static${path[1]}`;
            const extensionmatch = /\.(\w+)$/.exec(file)
            const extension = extensionmatch === null ? 'txt' : extensionmatch[1];

            const s = fs.createReadStream(file);
            const type = mime[extension] || 'text/plain';
            s.on('open', function () {
                res.set('Content-Type', type);
                s.pipe(res);
            });
            s.on('error', function () {
                res.set('Content-Type', 'text/plain');
                res.status(404).end('Not found');
            });
        })

        return router;
    }
}