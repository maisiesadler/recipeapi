import { Express, Request, Response, Router } from "../express";
const fs = require('fs');
import { TemplateParser } from './templateparser';
import { Ingredient } from '../Models';

export class UiRoutes {
    public static createRoutes(): Router {
        var router = Express.Router();

        router.get('/', async (req: Request, res: Response) => {
            let s = fs.readFileSync('templates/index.html', 'UTF-8')
            if (req.isAuthenticated()) {
                const content = fs.readFileSync('templates/search.html', 'UTF-8')
                // const ingredientsresult = await Ingredient.find<Ingredient>({}).exec()
                // const ingredients = ingredientsresult.map(i => i.name);

                s = TemplateParser.Parse(s, { content, username: req.user.username })
                res.send(s)
            } else {
                const content = fs.readFileSync('templates/login.html', 'UTF-8')

                s = TemplateParser.Parse(s, { content })
                res.send(s)
            }

        })

        return router;
    }
}
