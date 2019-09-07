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
const Logger_1 = require("./Logger");
const express_1 = require("./express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "*/*" });
class MegaApi {
    static get(router, type) {
        const modelName = type.modelName;
        router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.Logger.info(`GET: ${modelName}`);
            const query = req.yoParams.query || req.query;
            const orderBy = req.yoParams.orderBy || req.query.orderBy;
            if (orderBy) {
                var parsedOrderBy = JSON.parse(orderBy);
                delete req.query.orderBy;
                res.json(yield type.find(query).sort(parsedOrderBy).limit(200).exec());
            }
            else {
                res.json(yield type.find(query).limit(20).exec());
            }
        }));
    }
    static getById(router, type) {
        const modelName = type.modelName;
        router.get('/:id', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            Logger_1.Logger.info(`GET: ${modelName}, id: ${id}`);
            try {
                res.json(yield type.findOne({ _id: id }).exec());
            }
            catch (e) {
                next(e);
            }
        }));
    }
    static post(router, type) {
        const modelName = type.modelName;
        router.post('/', jsonParser, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.Logger.info(`POST: ${modelName}`);
            try {
                var model = new type(req.body);
                var result = yield model.save();
                res.json(result);
                next(result);
            }
            catch (e) {
                next(e);
            }
        }));
    }
    static put(router, type) {
        const modelName = type.modelName;
        router.put('/:id', jsonParser, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            Logger_1.Logger.info(`PUT: ${modelName}, id: ${id}`);
            try {
                var model = yield type.findById(id).exec();
                model.set(req.body);
                yield model.save();
                res.end();
            }
            catch (e) {
                next(e);
            }
        }));
    }
    static all(type) {
        var router = express_1.Express.Router();
        this.get(router, type);
        this.getById(router, type);
        this.post(router, type);
        this.put(router, type);
        return router;
    }
}
exports.MegaApi = MegaApi;
//# sourceMappingURL=MegaApi.js.map