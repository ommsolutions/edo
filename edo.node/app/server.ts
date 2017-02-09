import * as express from "express";
import {Request, Response, Express, Router} from "express";
import {CLIService} from "./cli/cli.service";
import {ICLIResponse} from "./interfaces/interfaces";
import {json} from "body-parser";
import * as morgan from "morgan";


const PORT: number = 1337;

export class Server {
    private app: Express;

    constructor() {
        this.init();
    }

    private init(): void {
        this.app = express();

        this.app.set("views", __dirname + "/views");
        this.app.set("view engine", "pug");

        let router: Router = express.Router();
        this.app.use(json());

        router.use(express.static(__dirname + "/public"));
        router.use(morgan("combined"));

        this.app.use("/", router);

        // catch errors thrown by bodyParser module
        router.use((err: any, req: Request, res: Response, next: Function) => {
            if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
                let badJsonErrorMessage: string = "JSON is not valid; error: " + err + " Request path: " + req.path;
                res.status(400).send(badJsonErrorMessage);
            }
            next();
        });

        router.get("/", (req: Request, res: Response) => {
            res.render("main", {title: "Electronic door opener", message: "Please click the below button to open the door ;-)"});
        });

        router.get("/command/:command", (req: Request, res: Response) => {
            // TODO: this is kept dynamic and "insecure" for now, in case we need some more commands to execute
            let command: string = req.params.command;
            if (!(command === "opendoor" || command === "ls")) {
                res.status(403).send("Command not allowed");
                return;
            }
            CLIService.runCommand(req.params.command)
                .subscribe((response: ICLIResponse) => {
                    res.status(200).send(response);
                }, (error: any) => Server.sendError(res, error.message));
        });

        router.get("/bat", (req: Request, res: Response) => {
            CLIService.runBatFile(__dirname + "/cli/dir.bat").subscribe((response: any) => {
                res.status(200).send(response);
            }, (error: any) => Server.sendError(res, error.message));
        });

        this.app.listen(PORT, () => {
            console.log("Server listening on port: " + PORT);
        });
    }

    private static sendError(res: Response, error: string): void {
        res.status(500).send({error: error});
    }
}
new Server();