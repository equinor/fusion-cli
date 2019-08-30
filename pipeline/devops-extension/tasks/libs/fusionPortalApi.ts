import rp = require("request-promise-native");
import fs = require('fs');
import auth from './fusionAuth';

export default class PortalApi {

    serverHost: string;
    resource: string;

    constructor(host: string, resource : string) {
        this.serverHost = host.replace(/\/$/, '');
        this.resource = resource;
    }

    public async uploadFrameworkBundleAsync(bundlePath : string) {
        let endpoint = `${this.serverHost}/bundles/frameworks`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent);
    }

    public async uploadAppBundleAsync(bundlePath : string) {
        let endpoint = `${this.serverHost}/bundles/apps`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent);
    }

    public async uploadTileBundleAsync(bundlePath : string) {
        let endpoint = `${this.serverHost}/bundles/tiles`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent);
    }

    public async publishFrameworkAsync() {
        let endpoint = `${this.serverHost}/bundles/frameworks/publish`
        await this.postAsync(endpoint);
    }

    public async publishAppAsync(appKey : string) {
        let endpoint = `${this.serverHost}/bundles/apps/${appKey}/publish`
        await this.postAsync(endpoint);
    }

    public async publishTilesAsync(tileKey : string) {
        let endpoint = `${this.serverHost}/bundles/apps/${tileKey}/publish`
        await this.postAsync(endpoint);
    }

    private async uploadBundleAsync(endpoint : string, bundleContent : Buffer) {
        
        let token = await auth.getAppAccessTokenAsync();
        
        var options = {
            method: 'POST',
            uri: endpoint,
            body: bundleContent,
            headers: {
                'content-type': 'application/zip',
                'authorization': 'bearer ' + token
            }
        };
        
        try {
            await rp(options);
        } catch (error) {

            console.log("error: ", error);
            throw error;
        }
    }

    private async postAsync(endpoint : string) {
        
        let token = await auth.getAppAccessTokenAsync();
        
        var options = {
            method: 'POST',
            uri: endpoint,
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            }
        };
        
        try {
            await rp(options);
        } catch (error) {

            console.log("error: ", error);
            throw error;
        }
    }

    private readBundleFile(bundlePath : string) : Buffer {
        var zipContents = fs.readFileSync(bundlePath);
        return zipContents;
    }
}