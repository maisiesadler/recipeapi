const fs = require('fs');

export class Fs {
    public static readFile(file: string) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(file, 'UTF-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }
}