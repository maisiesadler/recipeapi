import { Express, Request, Response, Router } from "../express";
const fs = require('fs');
import { TemplateParser } from './templateparser';
import { TemplateReplacer } from './templatereplacer';
import { StaticRoutes } from './routes';
import { Recipe, Category } from '../Models';

export class UiRoutes {
    public static createRoutes(): Router {
        var router = Express.Router();

        async function authedPage(req: Request, res: Response, createPageFn: (req: Request) => Promise<string>) {
            let s = fs.readFileSync('templates/index.html', 'UTF-8')
            if (req.isAuthenticated()) {
                const content = await createPageFn(req);

                s = await TemplateReplacer.Replace(s)
                s = TemplateParser.Parse(s, { content, username: req.user.username })
                res.send(s)
            } else {
                res.redirect('/ui/login')
            }
        }

        router.get('/', async (req: Request, res: Response) => {
            await authedPage(req, res, async req => {
                const recipes = await Recipe.find<Recipe>({ "_id": { "$in": req.user.recipes } }, { "name": 1, "addedOn": 1 }).exec()

                let content = fs.readFileSync('templates/recipes.html', 'UTF-8')
                return TemplateParser.Parse(content, { recipes })
            })
        })

        router.get('/ingredients', async (req: Request, res: Response) => {
            await authedPage(req, res, async req => {
                let content = fs.readFileSync('templates/ingredients.html', 'UTF-8')
                const category = await Category.find<Category>({}).exec()
                category.unshift({ _id: 'all', name: 'all' } as any)
                return TemplateParser.Parse(content, { category })
            })
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

        router.get('/recipe/:id', async (req: Request, res: Response) => {
            await authedPage(req, res, async req => {
                const id = req.params.id;
                if (!id) {
                    // todo: redirect to error pages? log?
                    res.sendStatus(400);
                    return;
                }
                const recipe = await Recipe.findById<Recipe>(id).exec();
                if (!recipe) {
                    res.sendStatus(404);
                    return;
                }
                let content = fs.readFileSync('templates/recipeeditor.html', 'UTF-8')
                return TemplateParser.Parse(content, recipe)
            })
        })

        router.use('/static', StaticRoutes.Create());

        return router;
    }
}
