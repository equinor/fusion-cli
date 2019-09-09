import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import fusionPortalApi from '../libs/fusionPortalApi';

tl.setResourcePath(path.join(__dirname, '../../task.json'));

export class Task {

    public static async runMain() {

        var action = tl.getInput('action', true);
        var host = tl.getInput('portalUrl', true);
        var resource = tl.getInput('tokenResource', true);
        var allowVersionConflict = tl.getBoolInput('ignoreVersionConflict', false);
        
        var portalApi = new fusionPortalApi(host, resource);

        try {

            switch (action.toLowerCase()) {
                case 'deploy':
                    var pathToBundle = tl.getPathInput('bundlePath');

                    try {
                        await portalApi.uploadFrameworkBundleAsync(pathToBundle);
                    } catch (error) {
                        if (allowVersionConflict && error.statusCode == 409) {
                            tl.setResult(tl.TaskResult.SucceededWithIssues, 'Version already exists. Ignore version conflict enabled.');
                            tl.setVariable('ignorePublish_framework', 'true');
                        } else {
                            throw error; 
                        }
                    }
            
                    break;
                    
                case 'publish':
                    if (tl.getVariable('ignorePublish_framework') == 'true') {
                        tl.setResult(tl.TaskResult.Skipped, 'Located marker for version conflict in bundle upload. Skipping publish.');
                        return;
                    }                
                    
                    await portalApi.publishFrameworkAsync();

                    break;
            }

        } catch (error) {
            tl.setResult(tl.TaskResult.Failed, error);
        }
    }
}

Task.runMain();