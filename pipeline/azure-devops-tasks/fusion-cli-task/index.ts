import tl = require('vsts-task-lib');
import path = require('path');

tl.setResourcePath(path.join(__dirname, 'task.json'));

interface ServiceEndpoint {
    clientId: string;
    clientSecret: string;
}

export class fusionclitask {

    public static isDebug: boolean = false;

    public static async runMain() {
        var connection = this.getServiceConnection();
        var args = tl.getInput('cliCommand', true);

        if (connection != null) {
            args += ` --service-principal-id ${connection.clientId} --service-principal-key ${connection.clientSecret}`
        }
        var cliPath = path.join(__dirname, "node_modules/@equinor/fusion-cli/bin/run");
        tl.execSync(cliPath, args);
    }

    private static getServiceConnection() : ServiceEndpoint | null {
        var connectedService: string = tl.getInput("connectedServiceNameARM", true);

        if (!connectedService) {
            return null;
        }

        if (this.isDebug) {
            tl.debug('Detected debug mode');

            return {
                clientId: '1234',
                clientSecret: 'secret!'
            }
        }

        var authScheme: string = tl.getEndpointAuthorizationScheme(connectedService, true);
        var subscriptionID: string = tl.getEndpointDataParameter(connectedService, "SubscriptionID", true);

        tl.debug('found auth scheme ' + authScheme);
        var endpoint = tl.getEndpointAuthorization(connectedService, true);
        
        //tl.debug(JSON.stringify(endpoint));

        if(authScheme.toLowerCase() == "serviceprincipal") {
        
            let authType: string = tl.getEndpointAuthorizationParameter(connectedService, 'authenticationType', true);
            var servicePrincipalId: string = tl.getEndpointAuthorizationParameter(connectedService, "serviceprincipalid", false);
            // var tenantId: string = tl.getEndpointAuthorizationParameter(connectedService, "tenantid", false);

            tl.debug('key based endpoint');
            let cliPassword: string = tl.getEndpointAuthorizationParameter(connectedService, "serviceprincipalkey", false);

            return {
                clientId: servicePrincipalId,
                clientSecret: cliPassword,
            };
        }

        tl.error('Unsupported service connection type. Only support key based service principal.');
        throw new Error('Unsupported service connection type.');
    } 
}

// Can set this by 'export TASK_DEBUG_MODE=true' in console (unix)
if (tl.getVariable('TASK_DEBUG_MODE') == 'true') {
    fusionclitask.isDebug = true;
}

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
