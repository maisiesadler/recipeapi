import { Express, Request, Response, Router, NextFunction, Handler } from "./express";
import { RecipeRequestHandlers } from './RequestHandlers'
import { MegaApi } from "./MegaApi";
import { Ingredient } from "./Models";

const asYoRequest = async (req: Request, res: Response, next: NextFunction) => {
	req.yoParams = {};
	next();
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	console.log('got req.user', req.user)
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

		const recipes = Express.Router();
		recipes.get('/', RecipeRequestHandlers.getUserRecipes);

		const createRecipe = Express.Router();
		createRecipe.post('/', RecipeRequestHandlers.createRecipe);

		router.use('/ingredient', MegaApi.all(Ingredient));

		router.use('/recipes', recipes)
		router.use('/recipe', createRecipe)
		return router;
	}
}
