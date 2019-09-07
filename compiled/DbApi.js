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
var mongoose = require("mongoose");
class DbApi {
    static connect() {
        return new Promise((resolve, reject) => {
            mongoose.connect("mongodb://admin:admin@mongo:27017/yoalert-dev?authSource=admin");
            var mdb = mongoose.connection;
            mdb.on("error", err => {
                Logger_1.Logger.error('error connecting to db', err);
                reject();
            });
            mdb.once("open", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    resolve();
                });
            });
        });
    }
}
exports.DbApi = DbApi;
//# sourceMappingURL=DbApi.js.map