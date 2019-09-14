import { NextFunction, Request, Response } from "../express";
import { Recipe, User, RecipeIngredient } from "../Models";

export class RecipeRequestHandlers {
    public static async createRecipe(req: Request, res: Response, next: NextFunction) {
        const userId = req.user._id;
        const user = await User.findById<User>(userId).exec();

        // todo: validation

        var recipe = new Recipe({ name: req.body.name, ingredients: [], addedOn: new Date() });
        var result = await recipe.save();

        user.recipes = (user.recipes || []).concat(recipe._id);
        await user.save();

        res.end();
    }

    public static async appendToRecipe(req: Request, res: Response, next: NextFunction) {
        const recipeId = req.body.recipeId;
        const recipe = await Recipe.findById<Recipe>(recipeId).exec();

        // todo: can user edit?
        // todo: validation

        const ingredient: RecipeIngredient = { name: req.body.ingredient, amount: '' }

        recipe.ingredients.push(ingredient)

        var result = await recipe.save();

        res.end();
    }
}