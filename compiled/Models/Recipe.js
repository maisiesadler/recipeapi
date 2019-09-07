"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BaseModel_1 = require("./BaseModel");
var ingredientSchema = new mongoose_1.Schema({
    name: String,
    addedBy: mongoose_1.Schema.Types.ObjectId,
    addedOn: Date
});
var recipeSchema = new mongoose_1.Schema({
    name: String,
    active: { type: Boolean, default: true },
    ingredients: Array
});
class Ingredient extends BaseModel_1.BaseModel {
}
exports.Ingredient = Ingredient;
class RecipeIngredient {
}
exports.RecipeIngredient = RecipeIngredient;
class Recipe extends BaseModel_1.BaseModel {
}
exports.Recipe = Recipe;
exports.Ingredient = mongoose_1.model("r_Ingredient", ingredientSchema);
exports.Recipe = mongoose_1.model("r_Recipe", recipeSchema);
//# sourceMappingURL=Recipe.js.map