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
const DbApi_1 = require("./DbApi");
const Authenticate_1 = require("./Authenticate");
const Routes_1 = require("./Routes");
const express_1 = require("./express");
const ui_1 = require("./ui");
const app = express_1.Express.App();
const authed = new Authenticate_1.Authenticate(app);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, userid");
    next();
});
app.use((req, res, next) => {
    console.log('received request', req.method, req.url);
    next();
});
app.use('/api', authed.loginRoutes());
app.use('/ui', ui_1.UiRoutes.createRoutes());
DbApi_1.DbApi.connect()
    .then(() => {
    app.use('/api', Routes_1.Routes.createRoutes());
    app.use((err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).send('Internal server error');
    }));
    app.listen(3001, () => console.log("Example app listening on port 3001!"));
});
process.on('SIGTERM', function () {
    console.log('received SIGTERM');
    process.exit(0);
});
//# sourceMappingURL=main.js.map