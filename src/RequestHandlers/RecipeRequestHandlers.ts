import { NextFunction, Request, Response } from "../express";
import { Recipe, User } from "../Models";

export class RecipeRequestHandlers {
    public static async createRecipe(req: Request, res: Response, next: NextFunction) {
        const userId = req.user._id;
        const user = await User.findById<User>(userId).exec();

        // todo: validation

        var recipe = new Recipe({ name: req.body.name, ingredients: [] });
        var result = await recipe.save();

        user.recipes = (user.recipes || []).concat(recipe._id);
        await user.save();

        res.end();
    }

    public static async getUserRecipes(req: Request, res: Response, next: NextFunction) {
        const userId = req.user._id;
        const user = await User.findById<User>(userId).exec();
        const groups = await Recipe.find<Recipe>({ _id: { $in: user.recipes } }).exec();
        res.json(groups).end();
    }
}