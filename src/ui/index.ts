import { Express, Request, Response, Router } from "../express";
const fs = require('fs');

export class UiRoutes {
	public static createRoutes(): Router {
        var router = Express.Router();

        router.get('/', (req: Request, res: Response) => {
            const s = fs.readFileSync('templates/index.html', 'UTF-8')
            res.send(s)
        })
        
		return router;
	}
}
