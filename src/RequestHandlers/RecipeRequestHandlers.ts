import { NextFunction, Request, Response } from "../express";
import { Recipe, User, RecipeIngredient } from "../Models";

export class RecipeRequestHandlers {
    public static async createRecipe(req: Request, res: Response, next: NextFunction) {
        const userId = req.user._id;
        const user = await User.findById<User>(userId).exec();

        // todo: validation

        var recipe = new Recipe({ name: req.body.name, ingredients: [], addedOn: new Date(), addedBy: userId });
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
        if (!req.body.ingredient || !req.body.ingredientId) {
            res.sendStatus(400)
            return;
        }

        const ingredient: RecipeIngredient = { name: req.body.ingredient, amount: '', ingredientId: req.body.ingredientId }

        recipe.ingredients.push(ingredient)

        var result = await recipe.save();

        res.end();
    }

    public static async shareWith(req: Request, res: Response, next: NextFunction) {
        const recipeId = req.body.recipeId;
        const userId = req.body.userId;

        if (!recipeId || !userId) {
            console.log('recipeId or userId undefined', recipeId, userId);
            res.sendStatus(400)
            return;
        }

        const recipe = await Recipe.findById<Recipe>(recipeId).exec();

        // todo: is there a better way to compare users?
        if (recipe.addedBy.toString() !== req.user._id.toString()) {
            console.log('not added by user', recipe.addedBy, req.user._id);
            res.sendStatus(401);
            return;
        }

        const user = await User.findById<User>(userId).exec();
        if (user === null) {
            res.sendStatus(400);
            return;
        }

        user.recipes.push(recipeId);
        await user.save();

        // todo: can user edit?
        // todo: validation

        recipe.allowedViewers.push({ _id: user._id });

        var result = await recipe.save();

        res.end();
    }
}