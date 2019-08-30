import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import fusionPortalApi from '../libs/fusionPortalApi';

tl.setResourcePath(path.join(__dirname, '../../task.json'));

export class Task {
    public static async runMain() {

        var action = tl.getInput('action', true);
        var host = tl.getInput('portalUrl', true);
        var resource = tl.getInput('tokenResource', true);

        var portalApi = new fusionPortalApi(host, resource);

        try {

            switch (action.toLowerCase()) {
                case 'deploy':
                    var pathToBundle = tl.getPathInput('bundlePath');
                    await portalApi.uploadFrameworkBundleAsync(pathToBundle);

                    break;
                case 'publish':
                    await portalApi.publishFrameworkAsync();

                    break;
            }

        } catch (error) {
            tl.setResult(tl.TaskResult.Failed, error);
        }
    }
}

Task.runMain();