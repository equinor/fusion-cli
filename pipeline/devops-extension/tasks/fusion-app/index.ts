import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import fusionPortalApi from '../libs/fusionPortalApi';
import { isNullOrUndefined } from 'util';

tl.setResourcePath(path.join(__dirname, '../../task.json'));

export class Task {
    public static async runMain() {

        var action = tl.getInput('action', false);
        var host = tl.getInput('portalUrl', false);
        var resource = tl.getInput('tokenResource', false);
        var appKey = tl.getInput('appKey', false);

        if (isNullOrUndefined(action)) {
            throw new Error("[!] Missing required input: action");
        }
        if (isNullOrUndefined(host)) {
            throw new Error("[!] Missing required input: portalUrl");
        }
        if (isNullOrUndefined(resource)) {
            throw new Error("[!] Missing required input: tokenResource");
        }

        var portalApi = new fusionPortalApi(host, resource);

        try {

            switch (action.toLowerCase()) {
                case 'deploy':
                    var pathToBundle = tl.getPathInput('bundlePath');
                    await portalApi.uploadAppBundleAsync(pathToBundle);

                    break;
                case 'publish':
                    if (isNullOrUndefined(appKey)) {
                        throw new Error("[!] Missing required input: appKey");
                    }
                    await portalApi.publishAppAsync(appKey);

                    break;
            }

        } catch (error) {
            tl.setResult(tl.TaskResult.Failed, error);
        }
    }
}

Task.runMain();