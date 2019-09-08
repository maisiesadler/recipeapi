import { Express, Request, Response, Router } from "../express";
const fs = require('fs');
import { TemplateParser } from './templateparser';
import { TemplateReplacer } from './templatereplacer';

export class UiRoutes {
    public static createRoutes(): Router {
        var router = Express.Router();

        router.get('/', async (req: Request, res: Response) => {
            let s = fs.readFileSync('templates/index.html', 'UTF-8')
            if (req.isAuthenticated()) {
                const content = fs.readFileSync('templates/search.html', 'UTF-8')
                s = await TemplateReplacer.Replace(s)
                s = TemplateParser.Parse(s, { content, username: req.user.username })
                res.send(s)
            } else {
                res.redirect('/ui/login')
            }
        })

        router.get('/login', async (req: Request, res: Response) => {
            if (req.isAuthenticated()) {
                res.redirect('/ui')
            } else {
                let s = fs.readFileSync('templates/index.html', 'UTF-8')
                const content = fs.readFileSync('templates/login.html', 'UTF-8')

                s = TemplateParser.Parse(s, { content })
                res.send(s)
            };
        })

        var mime = {
            html: 'text/html',
            txt: 'text/plain',
            css: 'text/css',
            gif: 'image/gif',
            jpg: 'image/jpeg',
            png: 'image/png',
            svg: 'image/svg+xml',
            js: 'application/javascript'
        };

        router.get('/static/*', async (req: Request, res: Response) => {
            const t = /static\/(.*)\/?/.exec(req.url)
            const templatename = t[1]
            const file = `templates/static/${templatename}`;
            const extensionmatch = /\.(\w\+)^/.exec(file)
            const extension = extensionmatch === null ? 'txt' : extensionmatch[1];

            var s = fs.createReadStream(file);
            var type = mime[extension] || 'text/plain';
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
