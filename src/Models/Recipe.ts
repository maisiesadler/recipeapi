import { model, Schema } from "mongoose";
import { BaseModel } from './BaseModel';

var ingredientSchema = new Schema({
    name: String,
    addedBy: Schema.Types.ObjectId,
    addedOn: Date
})

var recipeSchema: Schema = new Schema({
    name: String,
    active: { type: Boolean, default: true },
    ingredients: Array
});

export class Ingredient extends BaseModel {
    name: string;
    addedBy: string;
    addedOn: Date
}

export class RecipeIngredient {
    name: string;
    amount: string;
}

export class Recipe extends BaseModel {
    name: string;
    active: boolean;
    ingredients: RecipeIngredient[]
}

exports.Ingredient = model("r_Ingredient", ingredientSchema);
exports.Recipe = model("r_Recipe", recipeSchema);
