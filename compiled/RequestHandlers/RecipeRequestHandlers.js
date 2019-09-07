"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Models_1 = require("../Models");
class RecipeRequestHandlers {
    static createRecipe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            const user = yield Models_1.User.findById(userId).exec();
            // todo: validation
            var recipe = new Models_1.Recipe({ name: req.body.name, ingredients: [] });
            var result = yield recipe.save();
            user.recipes = (user.recipes || []).concat(recipe._id);
            yield user.save();
            res.end();
        });
    }
    static getUserRecipes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            const user = yield Models_1.User.findById(userId).exec();
            const groups = yield Models_1.Recipe.find({ _id: { $in: user.recipes } }).exec();
            res.json(groups).end();
        });
    }
}
exports.RecipeRequestHandlers = RecipeRequestHandlers;
//# sourceMappingURL=RecipeRequestHandlers.js.map