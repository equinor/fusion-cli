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
                    await this.deployTileBundleAsync();

                    break;
                case 'publish':
                    await this.publishTileAsync();

                    break;
            }

        } catch (error) {        
            tl.setResult(tl.TaskResult.Failed, error.message);
        }
    }

    private static async deployTileBundleAsync() {
        var pathToBundle = tl.getPathInput('bundlePath');
        var allowVersionConflict = tl.getBoolInput('ignoreVersionConflict', false);
        var tileKey = tl.getInput('tileKey', false);
        var forceReplaceExisting = tl.getBoolInput('forceReplaceExisting', false);

        if (isNullOrUndefined(pathToBundle)) {
            throw new Error("[!] Missing required input: bundlePath");
        }

        try {
            await this.portalApi.uploadTileBundleAsync(pathToBundle, forceReplaceExisting);
        } catch (error) {
            if (allowVersionConflict && error.statusCode == 409) {
                tl.logIssue(tl.IssueType.Warning, 'Version already exist, but i\'ve been ordered to ignore it...');
                tl.setResult(tl.TaskResult.SucceededWithIssues, 'Ignoring already existing version conflict');
                tl.setVariable(`ignorePublish_${tileKey}`, 'true');
            } else {
                throw error; 
            }
        }
    }

    private static async publishTileAsync() {
        var tileKey = tl.getInput('tileKey', false);

        if (tl.getVariable(`ignorePublish_${tileKey}`) == 'true') {
            tl.setResult(tl.TaskResult.Skipped, 'Located marker for version conflict in bundle upload. Skipping publish.');
            return;
        }

        if (isNullOrUndefined(tileKey)) {
            throw new Error("[!] Missing required input: tileKey");
        }
        await this.portalApi.publishTilesAsync(tileKey);
    }
}

Task.runMain();