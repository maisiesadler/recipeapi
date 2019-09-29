import { Express, Request, Response, Router, NextFunction, Handler } from "./express";
import { RecipeRequestHandlers } from './RequestHandlers'
import { MegaApi } from "./MegaApi";
import { Ingredient, Recipe, Category } from "./Models";

const asYoRequest = async (req: Request, res: Response, next: NextFunction) => {
	req.yoParams = {};
	next();
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		res.status(401).end();
	} else {
		next();
	}
};

export class Routes {
	public static createRoutes(): Router {
		var router = Express.Router()

		router.use(asYoRequest);
		router.use(authenticate);

		const recipe = Express.Router();
		MegaApi.getById(recipe, Recipe)
		MegaApi.put(recipe, Recipe)
		recipe.post('/', RecipeRequestHandlers.createRecipe);

		const appendToRecipe = Express.Router();
		appendToRecipe.post('/', RecipeRequestHandlers.appendToRecipe);

		const shareWith = Express.Router();
		shareWith.post('/', RecipeRequestHandlers.shareWith);

		recipe.use('/ingredient', appendToRecipe)
		recipe.use('/share', shareWith)

		const ingredient = Express.Router();
		MegaApi.getWithQuery(ingredient, Ingredient, req => {
			const query: any = {};
			if (!!req.query.sw) {
				query.name = {};
				query.name['$regex'] = req.query.sw;
				query.name['$options'] = 'i'
			}
			if (!!req.query.category) {
				query.category = req.query.category;
			}
			return query;
		});
		MegaApi.postWithData<Ingredient>(ingredient, Ingredient, (req, model) => {
			model.addedBy = req.user._id;
			model.addedOn = new Date();
		})
		router.use('/ingredient', ingredient);
		router.use('/category', MegaApi.all(Category));

		router.use('/recipe', recipe)
		return router;
	}
}
