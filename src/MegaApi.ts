import { Logger } from "./Logger";
import { Express, Router, Request, Response, NextFunction } from "./express";
import { BaseModel } from "./Models/BaseModel";

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "*/*" });

export class MegaApi {
    public static get(router: Router, type: typeof BaseModel) {
        const modelName = type.modelName;
        router.get('/', async (req: Request, res: Response) => {
            Logger.info(`GET: ${modelName}`);
            const query = req.yoParams.query || req.query;
            const orderBy = req.yoParams.orderBy || req.query.orderBy;
            if (orderBy) {
                var parsedOrderBy = JSON.parse(orderBy);
                delete req.query.orderBy;
                res.json(await type.find(query).sort(parsedOrderBy).limit(200).exec());
            } else {
                res.json(await type.find(query).limit(20).exec());
            }
        });
    }

    public static getWithQuery(router: Router, type: typeof BaseModel, queryFn: (req: Request) => any) {
        const modelName = type.modelName;
        router.get('/', async (req: Request, res: Response) => {
            Logger.info(`GET: ${modelName}`);
            const query = queryFn(req);
            res.json(await type.find(query).limit(20).exec());
        });
    }

    public static getById(router: Router, type: typeof BaseModel) {
        const modelName = type.modelName;
        router.get('/:id', async (req, res, next) => {
            const id = req.params.id
            Logger.info(`GET: ${modelName}, id: ${id}`);
            try {
                res.json(await type.findOne({ _id: id }).exec());
            } catch (e) {
                next(e);
            }
        });
    }

    public static post(router: Router, type: typeof BaseModel) {
        const modelName = type.modelName;
        router.post('/', jsonParser, async (req, res, next) => {
            Logger.info(`POST: ${modelName}`);
            try {
                var model = new type(req.body);
                var result = await model.save();
                res.json(result);
                next(result);
            } catch (e) {
                next(e);
            }
        });
    }

    public static postWithData<T extends BaseModel>(
        router: Router,
        type: typeof BaseModel,
        modifyFn: (req: Request, model: T) => void) {
        const modelName = type.modelName;
        router.post('/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
            Logger.info(`POST: ${modelName}`);
            try {
                var model = new type(req.body);
                modifyFn(req, model as T);
                var result = await model.save();
                res.json(result);
                next(result);
            } catch (e) {
                next(e);
            }
        });
    }

    public static put(router: Router, type: typeof BaseModel) {
        const modelName = type.modelName;
        router.put('/:id', jsonParser, async (req, res, next) => {
            const id = req.params.id;
            Logger.info(`PUT: ${modelName}, id: ${id}`);
            try {
                var model = await type.findById<BaseModel>(id).exec();
                model.set(req.body);
                await model.save();
                res.end();
            } catch (e) {
                next(e);
            }
        });
    }

    public static all(type: typeof BaseModel): Router {
        var router = Express.Router()
        this.get(router, type);
        this.getById(router, type);
        this.post(router, type);
        this.put(router, type);
        return router;
    }
}
