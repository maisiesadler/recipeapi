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
const express_1 = require("./express");
const RequestHandlers_1 = require("./RequestHandlers");
const MegaApi_1 = require("./MegaApi");
const Models_1 = require("./Models");
const asYoRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.yoParams = {};
    next();
});
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('got req.user', req.user);
    if (!req.user) {
        res.status(401).end();
    }
    else {
        next();
    }
});
class Routes {
    static createRoutes() {
        var router = express_1.Express.Router();
        router.use(asYoRequest);
        router.use(authenticate);
        const recipes = express_1.Express.Router();
        recipes.get('/', RequestHandlers_1.RecipeRequestHandlers.getUserRecipes);
        const createRecipe = express_1.Express.Router();
        createRecipe.post('/', RequestHandlers_1.RecipeRequestHandlers.createRecipe);
        router.use('/ingredient', MegaApi_1.MegaApi.all(Models_1.Ingredient));
        router.use('/recipes', recipes);
        router.use('/recipe', createRecipe);
        return router;
    }
}
exports.Routes = Routes;
//# sourceMappingURL=Routes.js.map