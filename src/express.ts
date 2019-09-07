import { IncomingMessage, ServerResponse } from "http";
const requireExpress = require("express");

export interface MongoUser {
    _id: string;
    username: string;
}

export interface Request extends IncomingMessage {

    //req.isAuthenticated() will return true if user is logged in
    isAuthenticated(): boolean;

    params: {
        [param: string]: string,
        [captureGroup: number]: string
    };

    query: {
        [param: string]: string,
        [captureGroup: number]: string
    };

    body: { [param: string]: any };

    yoParams: any;

    user: MongoUser;

    cookies: any;
}

export interface Response extends ServerResponse {
    status(code: number): this;
    sendStatus(code: number): this;
    send(body: string | Buffer | Object): this;
    json(obj: any): this;
    cookie(name: string, value: string): void;
}

export type PathArgument = string | RegExp | (string | RegExp)[];

export interface NextFunction {
    (err?: any): void;
}

interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
}

export interface ErrorHandler {
    (err: any, req: Request, res: Response, next: NextFunction): any;
}

export type Handler = RequestHandler | ErrorHandler;

/** Can be passed to all methods like `use`, `get`, `all` etc */
export type HandlerArgument = Handler | Handler[];

export interface ParamHandler {
    (req: Request, res: Response, next: NextFunction, value: any, name: string): any;
}

declare class Route {
    constructor(path: string);

    all(...handlers: HandlerArgument[]): this;
    get(...handlers: HandlerArgument[]): this;
    post(...handlers: HandlerArgument[]): this;
    put(...handlers: HandlerArgument[]): this;
}

export interface Router extends RequestHandler {

    /**
     * Map the given param placeholder `name`(s) to the given callback(s).
     *
     * Parameter mapping is used to provide pre-conditions to routes
     * which use normalized placeholders. For example a _:user_id_ parameter
     * could automatically load a user's information from the database without
     * any additional code,
     *
     * The callback uses the samesignature as middleware, the only differencing
     * being that the value of the placeholder is passed, in this case the _id_
     * of the user. Once the `next()` function is invoked, just like middleware
     * it will continue on to execute the route, or subsequent parameter functions.
     *
     *      app.param('user_id', function(req, res, next, id){
     *        User.find(id, function(err, user){
     *          if (err) {
     *            next(err);
     *          } else if (user) {
     *            req.user = user;
     *            next();
     *          } else {
     *            next(new Error('failed to load user'));
     *          }
     *        });
     *      });
     */
    param(name: string, handler: ParamHandler): this;

    get(path: PathArgument, ...handlers: HandlerArgument[]): this;

    post(path: PathArgument, ...handlers: HandlerArgument[]): this;

    put(path: PathArgument, ...handlers: HandlerArgument[]): this;

    /**
     * The HEAD method is identical to GET except that the server MUST NOT send a
     * message body in the response (i.e., the response terminates at the end of the
     * header section).
     */
    head(path: PathArgument, ...handlers: HandlerArgument[]): this;

    /**
     * The DELETE method requests that the origin server remove the association
     * between the target resource and its current functionality.  In effect, this
     * method is similar to the rm command in UNIX: it expresses a deletion operation
     * on the URI mapping of the origin server rather than an expectation that the
     * previously associated information be deleted.
     */
    delete(path: PathArgument, ...handlers: HandlerArgument[]): this;

    use(...handlers: HandlerArgument[]): this;
    use(mountPoint: string | RegExp | (string | RegExp)[], ...handlers: HandlerArgument[]): this;

    route(prefix: PathArgument): Route;
}

export class Express {

    public static App(): App {
        return requireExpress();
    }

    public static Router(): Router {
        return requireExpress.Router();
    }
}

export interface App {
    use(...handlers: HandlerArgument[]): this;
    use(mountPoint: string | RegExp | (string | RegExp)[], ...handlers: HandlerArgument[]): this;

    listen(port: number, callback?: () => void);
}