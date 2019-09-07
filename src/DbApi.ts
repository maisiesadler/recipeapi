import { Logger } from "./Logger";

var mongoose = require("mongoose");

export class DbApi {
    public static connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            mongoose.connect(
                "mongodb://admin:admin@mongo:27017/yoalert-dev?authSource=admin"
            );

            var mdb = mongoose.connection;
            mdb.on("error", err => {
                Logger.error('error connecting to db', err)
                reject();
            });

            mdb.once("open", async function () {
                resolve();
            });
        });
    }
}
