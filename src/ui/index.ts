import { Express, Request, Response, Router } from "../express";
import { TemplateParser } from './templateparser';
import { TemplateReplacer } from './templatereplacer';
import { StaticRoutes } from './routes';
import { Recipe, Category } from '../Models';
import { Fs } from '../Fs';

export class UiRoutes {
    public static createRoutes(): Router {
        var router = Express.Router();

        async function authedPage(req: Request, res: Response, createPageFn: (req: Request) => Promise<string>) {
            let s = await Fs.readFile('templates/index.html')
            if (req.isAuthenticated()) {
                const content = await createPageFn(req);

                s = await TemplateReplacer.Replace(s)
                s = TemplateParser.Parse(s, { content, username: req.user.username })
                res.send(s)
            } else {
                res.redirect('/ui/login')
            }
        }

        async function ingredientSelector(): Promise<string> {
            let content = await Fs.readFile('templates/ingredients.html')
            const category = await Category.find<Category>({}).exec()
            category.unshift({ _id: 'all', name: 'all' } as any)
            return TemplateParser.Parse(content, { category })
        }

        async function templatereplacer(name: string): Promise<string> {
            switch (name) {
                case 'ingredients':
                    return await ingredientSelector();
            }
            const file = `templates/${name}.html`;
            const exist = await Fs.exists(file);
            if (exist) {
                return await Fs.readFile(file);
            }

            return 'unknown template: ' + name;
        }

        router.get('/', async (req: Request, res: Response) => {
            await authedPage(req, res, async req => {
                const orSelector = [{ "addedBy": req.user._id }, { "allowedViewers": { "$eq": [ req.user._id ] } }];
                const recipes = await Recipe.find<Recipe>({ "_id": { "$in": req.user.recipes }, "$or": orSelector }, { "name": 1, "addedOn": 1 }).exec()

                let content = await Fs.readFile('templates/recipes.html')
                return TemplateParser.Parse(content, { recipes })
            })
        })

        router.get('/ingredients', async (req: Request, res: Response) => {
            await authedPage(req, res, async req => {
                let content = await Fs.readFile('templates/ingredients.html')
                const category = await Category.find<Category>({}).exec()
                category.unshift({ _id: 'all', name: 'all' } as any)
                return TemplateParser.Parse(content, { category })
            })
        })

        router.get('/login', async (req: Request, res: Response) => {
            if (req.isAuthenticated()) {
                res.redirect('/ui')
            } else {
                let s = await Fs.readFile('templates/index.html')
                const content = await Fs.readFile('templates/login.html')

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
                let content = await Fs.readFile('templates/recipeeditor.html');
                content = await TemplateReplacer.ReplaceWithOptions(content, templatereplacer);
                return TemplateParser.Parse(content, recipe)
            })
        })

        router.use('/static', StaticRoutes.Create());

        return router;
    }
}
