import tl = require('azure-pipelines-task-lib/task');
import rp = require("request-promise-native");
import fs = require('fs');

const tenantId : string = '3aa4a235-b6e2-48d5-9195-7fcf05b459b0';


interface ServiceEndpoint {
    clientId: string;
    clientSecret: string;
}


export default class FusionAuth {
    public static isDebug: boolean = false;

    public static async getAppAccessTokenAsync() : Promise<string> {
        var connection = this.getServiceConnection();

        if (connection == null) {
            tl.setResult(tl.TaskResult.Failed, 'Could not find any service connection');
            throw new Error('Could not find any service endpoint');
        }

        var tokenResource = tl.getInput('tokenResource', true);

        if (tokenResource.toLowerCase() == 'test') { tokenResource = '5a842df8-3238-415d-b168-9f16a6a6031b' }

        
        var options = {
            method: 'POST',
            uri: `https://login.microsoftonline.com/${tenantId}/oauth2/token`,
            form: {
                client_secret: connection.clientSecret,
                grant_type: 'client_credentials',
                client_id: connection.clientId,
                resource: tokenResource
            },
            headers: {
                /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
            }
        };

        try {
            let response = await rp(options);
            return JSON.parse(response).access_token;
        } catch (error) {
            tl.setResult(tl.TaskResult.Failed, 'Could not get auth token.');
            console.log("error: ", error);
            throw error;
        }

    }
    
    private static getServiceConnection() : ServiceEndpoint | null {
        var connectedService: string = tl.getInput("fusionAppConnection", true);

        if (!connectedService) {
            return null;
        }

        if (this.isDebug) {
            // Read test connection
            var contents = fs.readFileSync('test-credentials.json', 'utf8');
            var config = JSON.parse(contents);

            return {
                clientId: config.clientId,
                clientSecret: config.clientSecret
            }
        }

        var authScheme: string = tl.getEndpointAuthorizationScheme(connectedService, true);

        let clientId = tl.getEndpointAuthorizationParameter(connectedService, 'username', true);
        let password = tl.getEndpointAuthorizationParameter(connectedService, 'password', true);
        
        return {
            clientId: clientId,
            clientSecret: password
        };
    }
}
