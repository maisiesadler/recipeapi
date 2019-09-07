"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static jsonParse(s) {
        try {
            return JSON.parse(s);
        }
        catch (_a) {
            return null;
        }
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map