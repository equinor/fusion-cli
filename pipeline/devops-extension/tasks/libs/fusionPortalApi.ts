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

    public async uploadFrameworkBundleAsync(bundlePath : string, forceReplaceExisting: boolean) {
        let endpoint = `${this.serverHost}/bundles/frameworks`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent, forceReplaceExisting);
    }

    public async uploadAppBundleAsync(bundlePath : string, forceReplaceExisting: boolean) {
        let endpoint = `${this.serverHost}/bundles/apps`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent, forceReplaceExisting);
    }

    public async uploadTileBundleAsync(bundlePath : string, forceReplaceExisting: boolean) {
        let endpoint = `${this.serverHost}/bundles/tiles`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent, forceReplaceExisting);
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
        let endpoint = `${this.serverHost}/bundles/tiles/${tileKey}/publish`
        await this.postAsync(endpoint);
    }

    private async uploadBundleAsync(endpoint : string, bundleContent : Buffer, forceReplaceExisting: boolean) {
        let token = await auth.getAppAccessTokenAsync();

        const headers = {
            'content-type': 'application/zip',
            'authorization': 'bearer ' + token,
        }

        if(forceReplaceExisting) {
            headers['x-fusion-force-replace'] = true;
        }
        
        var options = {
            method: 'POST',
            uri: endpoint,
            body: bundleContent,
            headers,
        };
        
        try {
            console.log(`Uploading bundle with POST '${endpoint}'`);
            await rp(options);
        } catch (error) {
            this.debugErrorResponse(error);
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
            console.log(`Sending request POST '${endpoint}'`);
            await rp(options);
        } catch (error) {

            this.debugErrorResponse(error);
            throw error;
        }
    }

    private debugErrorResponse(error : any) {
        console.log(`Request failed with code ${error.statusCode} - ${error.response.statusMessage}`);
        console.log('-- BODY --');
        console.log(error.response.body);
        console.log('-- HEADERS --');
        console.log(error.response.headers)
    }

    private readBundleFile(bundlePath : string) : Buffer {
        var zipContents = fs.readFileSync(bundlePath);
        return zipContents;
    }
}