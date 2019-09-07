import { Express, Request, Response, Router } from "../express";
const fs = require('fs');

export class UiRoutes {
    public static createRoutes(): Router {
        var router = Express.Router();

        router.get('/', (req: Request, res: Response) => {
            let s = fs.readFileSync('templates/index.html', 'UTF-8')
            if (req.isAuthenticated()) {
                const content = fs.readFileSync('templates/recipes.html', 'UTF-8')

                s = s.replace('{{content}}', content)
                res.send(s)
            } else {
                const content = fs.readFileSync('templates/login.html', 'UTF-8')

                s = s.replace('{{content}}', content)
                res.send(s)
            }

        })

        return router;
    }
}
