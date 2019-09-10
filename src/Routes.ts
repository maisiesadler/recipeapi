import { Express, Request, Response, Router, NextFunction, Handler } from "./express";
import { RecipeRequestHandlers } from './RequestHandlers'
import { MegaApi } from "./MegaApi";
import { Ingredient, Recipe } from "./Models";

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

		recipe.use('/ingredient', appendToRecipe)

		const ingredient = Express.Router();
		MegaApi.getWithQuery(ingredient, Ingredient, req => {
			if (!!req.query.sw) {
				const query = { name: {} }
				query.name['$regex'] = req.query.sw;
				return query;
			}
			return {};
		});
		MegaApi.postWithData<Ingredient>(ingredient, Ingredient, (req, model) => {
			model.addedBy = req.user._id;
			model.addedOn = new Date();
		})
		router.use('/ingredient', ingredient)

		router.use('/recipe', recipe)
		return router;
	}
}
