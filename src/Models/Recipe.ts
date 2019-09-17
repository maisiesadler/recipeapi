import { model, Schema } from "mongoose";
import { BaseModel } from './BaseModel';

var ingredientSchema = new Schema({
    name: String,
    type: String,
    addedBy: Schema.Types.ObjectId,
    addedOn: Date,
    category: Schema.Types.ObjectId,
})

var recipeSchema: Schema = new Schema({
    name: String,
    addedOn: Date,
    active: { type: Boolean, default: true },
    ingredients: Array
});

export class Ingredient extends BaseModel {
    name: string;
    type: string;
    addedBy: string;
    addedOn: Date;
    category: string;
}

export class RecipeIngredient {
    name: string;
    ingredientId: string;
    amount: string;
}

export class Recipe extends BaseModel {
    name: string;
    addedOn: Date;
    active: boolean;
    ingredients: RecipeIngredient[];
}

exports.Ingredient = model("r_Ingredient", ingredientSchema);
exports.Recipe = model("r_Recipe", recipeSchema);
