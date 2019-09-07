"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireExpress = require("express");
class Express {
    static App() {
        return requireExpress();
    }
    static Router() {
        return requireExpress.Router();
    }
}
exports.Express = Express;
//# sourceMappingURL=express.js.map