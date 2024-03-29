import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import fusionPortalApi from '../libs/fusionPortalApi';
import { isNullOrUndefined } from 'util';

tl.setResourcePath(path.join(__dirname, '../../task.json'));

export class Task {
    
    private static portalApi : fusionPortalApi;

    public static async runMain() {

        var action = tl.getInput('action', false);
        var host = tl.getInput('portalUrl', false);
        var resource = tl.getInput('tokenResource', false);

        if (isNullOrUndefined(action)) {
            throw new Error("[!] Missing required input: action");
        }
        if (isNullOrUndefined(host)) {
            throw new Error("[!] Missing required input: portalUrl");
        }
        if (isNullOrUndefined(resource)) {
            throw new Error("[!] Missing required input: tokenResource");
        }

        this.portalApi = new fusionPortalApi(host, resource);

        try {

            switch (action.toLowerCase()) {
                case 'create':
                    await this.createAppAsync();
                    break;

                case 'deploy':
                    await this.deployAppBundleAsync();
                    break;

                case 'publish':
                    await this.publishAppAsync();
                    break;

                case 'config':
                    await this.configAppAsync();
                    break;
            }

        } catch (error) {
            tl.setResult(tl.TaskResult.Failed, error);
        }
    }

    private static async createAppAsync() {
        const appKey = tl.getInput('appKey', false);
        const appName = tl.getInput('appName', false);
        const appCategory = tl.getInput('appCategory', false);

        if (isNullOrUndefined(appKey)) {
            throw new Error("[!] Missing required input: appKey");
        }

        if(await this.portalApi.hasApp(appKey)){
            return tl.setResult(tl.TaskResult.Skipped, 'App already exists');
        }

        if (isNullOrUndefined(appName)) {
            throw new Error("[!] Missing required input: appName");
        }

        await this.portalApi.createApp(appKey, appName, appCategory);
    }

    private static async deployAppBundleAsync() {
        var appKey = tl.getInput('appKey', false);
        var pathToBundle = tl.getPathInput('bundlePath');
        var pathToBundle = tl.getPathInput('bundlePath');
        var allowVersionConflict = tl.getBoolInput('ignoreVersionConflict', false);

        if (isNullOrUndefined(pathToBundle)) {
            throw new Error("[!] Missing required input: bundlePath");
        }
        
        try {
            await this.portalApi.uploadAppBundleAsync(appKey, pathToBundle);
        } catch (error) {
            if (allowVersionConflict && error.statusCode == 409) {
                var appKey = tl.getInput('appKey', false);
                tl.setResult(tl.TaskResult.SucceededWithIssues, 'Version already exists. Ignore version conflict enabled.');
                tl.setVariable(`ignorePublish_${appKey}`, 'true');
            } else {
                throw error; 
            }
        }        
    }

    private static async publishAppAsync() {
        var appKey = tl.getInput('appKey', false);

        if (tl.getVariable(`ignorePublish_${appKey}`) == 'true') {
            tl.setResult(tl.TaskResult.Skipped, 'Located marker for version conflict in bundle upload. Skipping publish.');
            return;
        }

        if (isNullOrUndefined(appKey)) {
            throw new Error("[!] Missing required input: appKey");
        }
        await this.portalApi.publishAppAsync(appKey);
    }

    private static async configAppAsync() {
        var appKey = tl.getInput('appKey', false);

        if (!appKey) {
            throw new Error("[!] Missing required input: appKey");
        }

        const inputConfig = this.getConfigInputObject();
        const { environment, endpoints} = await this.portalApi.getAppConfigAsync(appKey);
       
        console.log("Config to set:");
        console.log(inputConfig);

        const newConfig = { 
            environment: {...environment, ...inputConfig.environment},
            endpoints: {...endpoints, ...inputConfig.endpoints}
        }

        console.log("Setting new config: ");
        console.log(newConfig);

        await this.portalApi.updateAppConfigAsync(appKey, newConfig);
        console.log("Config updated...");

        tl.setResult(tl.TaskResult.Succeeded, 'Config was updated');
    }

    private static getConfigInputObject() : any {
        var endpointConfigJson = tl.getInput('endpointsConfig', false);
        var environmentConfigJson = tl.getInput('environmentConfig', false);

         // Will build this object by parsing the configs. Doing this in order to be able to give feedback on invalid values.
         let inputConfig = { environment: {}, endpoints: {} };

         try {
             inputConfig.endpoints = JSON.parse(endpointConfigJson) ?? {};
         } catch (error) {
             console.log("Invalid endpoint json:");
             console.log(endpointConfigJson);
 
             throw new Error("Endpoint config is not valid json: " + endpointConfigJson);
         }
         try {
             inputConfig.environment = JSON.parse(environmentConfigJson) ?? {};
         } catch (error) {
             console.log("Invalid environment json:");
             console.log(environmentConfigJson);
 
             throw new Error("Environment config is not valid json: " + environmentConfigJson);
         }

         return inputConfig;
    }

}

Task.runMain();