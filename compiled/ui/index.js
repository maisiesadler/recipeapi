"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("../express");
const fs = require('fs');
class UiRoutes {
    static createRoutes() {
        var router = express_1.Express.Router();
        router.get('/', (req, res) => {
            let s = fs.readFileSync('templates/index.html', 'UTF-8');
            if (req.isAuthenticated()) {
                const content = fs.readFileSync('templates/recipes.html', 'UTF-8');
                s = s.replace('{{content}}', content);
                res.send(s);
            }
            else {
                const content = fs.readFileSync('templates/login.html', 'UTF-8');
                s = s.replace('{{content}}', content);
                res.send(s);
            }
        });
        return router;
    }
}
exports.UiRoutes = UiRoutes;
//# sourceMappingURL=index.js.map