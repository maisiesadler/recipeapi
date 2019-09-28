import { Logger } from "./Logger";

var mongoose = require("mongoose");

export class DbApi {
    public static connect(uri: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            mongoose.connect(uri, { useNewUrlParser: true });

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
