"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("../express");
const fs = require('fs');
class UiRoutes {
    static createRoutes() {
        var router = express_1.Express.Router();
        router.get('/', (req, res) => {
            const s = fs.readFileSync('templates/index.html', 'UTF-8');
            res.send(s);
        });
        return router;
    }
}
exports.UiRoutes = UiRoutes;
//# sourceMappingURL=index.js.map