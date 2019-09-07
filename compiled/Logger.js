"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    static debug(message, ...optionalParams) {
        message = this.formatMessage(message);
        console.debug(message, optionalParams);
    }
    static info(message, ...optionalParams) {
        message = this.formatMessage(message);
        if (optionalParams && optionalParams.length > 0) {
            console.log(message, optionalParams);
        }
        else {
            console.log(message);
        }
    }
    static error(message, ...optionalParams) {
        message = this.formatMessage(message);
        console.error(message, optionalParams);
    }
    static formatMessage(message) {
        return new Date().toLocaleString() + ' - ' + message;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map