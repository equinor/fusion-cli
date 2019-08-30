import tl = require('azure-pipelines-task-lib/task');
import path = require('path');

let taskFolder : string = __dirname.substring(0, __dirname.lastIndexOf('/'));

if (tl.getPlatform() == tl.Platform.Windows) {
    taskFolder = __dirname.substring(0, __dirname.lastIndexOf('\\'));
}

tl.setResourcePath(path.join(taskFolder, 'task.json'));

export class fusionclitask {

    public static isDebug: boolean = false;

    public static async runMain() {
        // var connection = this.getServiceConnection();
        var args = tl.getInput('arguments', true);
        var appPath = tl.getInput('appFolder', true);

        var cliPath = path.join(taskFolder, "node_modules/@equinor/fusion-cli/bin/run");

        console.log('Chaning dir to ' + taskFolder + ' to install fusion-cli');
        tl.cd(taskFolder);

        console.log('Installing fusion cli');
        tl.execSync('npm', 'install @equinor/fusion-cli');

        console.log('Changing directory to ' + appPath + ' to execute cli command: ' + args);

        tl.cd(appPath);

        // Install prereqs...
        tl.execSync("npm", "install");
        tl.execSync("npm", "install @types/react@16.9.2");
        tl.execSync("npm", "install @types/react-router-dom@4.3.4");

        let commandResult = tl.execSync(cliPath, args);
        
        if (commandResult.code != 0) {
            tl.setResult(tl.TaskResult.Failed, 'Failed executing cli command: ' + args);
        }

    }

}

// Can set this by 'export TASK_DEBUG_MODE=true' in console (unix)
fusionclitask.runMain();

/*
    To debug the task build the index.ts file and run by using 'node index.js'

    Arguments can be faked by setting environment variables for the process, in the format INPUT_[input-name]

    export INPUT_CLICOMMAND=

    Refs:
    https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops
    https://montemagno.com/building-vsts-tasks-with-typescript-and-vs-code/
    https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops

*/
