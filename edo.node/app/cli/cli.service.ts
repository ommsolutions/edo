import {Observable} from "rxjs";
import {ICLIResponse} from "../interfaces/interfaces";
import {exec} from "child_process";
import "rxjs/add/observable/bindNodeCallback";

export class CLIService {

    public static runBatFile(path: string): Observable<ICLIResponse> {
        return Observable.of(path).switchMap(CLIService.execute);
    }

    public static runCommand(command: string): Observable<ICLIResponse> {
        return Observable.of(command).switchMap(CLIService.execute);
    }

    private static execute(commandOrBatFile: string): Observable<ICLIResponse> {
        let execObservable: (commandOrBatFile: string) => Observable<any> = Observable.bindNodeCallback(exec);

        return execObservable(commandOrBatFile)
            .map((args: any[]) => {
                return {stdout: args[0], stderr: args[1]};
            });
    }
}