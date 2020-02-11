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
                case 'deploy':
                    await this.deployAppBundleAsync();

                    break;
                case 'publish':
                    await this.publishAppAsync();

                    break;
            }

        } catch (error) {
            tl.setResult(tl.TaskResult.Failed, error);
        }
    }

    private static async deployAppBundleAsync() {
        var appKey = tl.getInput('appKey', false);
        var pathToBundle = tl.getPathInput('bundlePath');
        var pathToBundle = tl.getPathInput('bundlePath');
        var allowVersionConflict = tl.getBoolInput('ignoreVersionConflict', false);
        var forceReplaceExisting = tl.getBoolInput('forceReplaceExisting', false);

        if (isNullOrUndefined(pathToBundle)) {
            throw new Error("[!] Missing required input: bundlePath");
        }
        
        try {
            await this.portalApi.uploadAppBundleAsync(pathToBundle, pathToBundle, forceReplaceExisting);
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

}

Task.runMain();