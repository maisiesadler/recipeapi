export class Logger {
    public static debug(message?: any, ...optionalParams: any[]) {
        message = this.formatMessage(message);
        console.debug(message, optionalParams);
    }

    public static info(message?: any, ...optionalParams: any[]) {
        message = this.formatMessage(message);
        if (optionalParams && optionalParams.length > 0) {
            console.log(message, optionalParams);
        } else {
            console.log(message);
        }
    }

    public static error(message?: any, ...optionalParams: any[]) {
        message = this.formatMessage(message);
        console.error(message, optionalParams)
    }

    private static formatMessage(message) {
        return new Date().toLocaleString() + ' - ' + message;
    }
}
