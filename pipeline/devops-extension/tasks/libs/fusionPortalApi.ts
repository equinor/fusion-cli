import rp = require("request-promise-native");
import fs = require('fs');
import auth from './fusionAuth';

import { App, AppCategory } from './models';

const DEFAULT_CATEGORY = 'my apps';
const DEFAULT_CATEGORY_COLOR = '#007079';
const DEFAULT_CATEGORY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zM12 7v10H2V7h10zm-1.5 8l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7z" fill="currentColor"/></svg>';

export default class PortalApi {

    serverHost: string;
    resource: string;

    get apps(): Promise<Array<App>> {
        return this.getAsync(`${this.serverHost}/api/admin/apps`);
    }

    get categories(): Promise<Array<AppCategory>> {
        return this.getAsync(`${this.serverHost}/api/apps/categories`);
    }

    constructor(host: string, resource: string) {
        this.serverHost = host.replace(/\/$/, '');
        this.resource = resource;
    }

    public async getApp(appKey: string): Promise<App> {
        return (await this.apps).find(app => app.key === appKey);
    }
    
    public async hasApp(appKey: string): Promise<boolean> {
        return !!(await this.getApp(appKey));
    }

    public async getCategoryByName(name: string): Promise<AppCategory> {
        return (await this.categories).find(cat => cat.name === name);
    }


    public async uploadFrameworkBundleAsync(bundlePath: string, forceReplaceExisting: boolean) {
        let endpoint = `${this.serverHost}/bundles/frameworks`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent, forceReplaceExisting);
    }

    public async uploadAppBundleAsync(appKey: string, bundlePath: string) {
        let endpoint = `${this.serverHost}/api/apps/${appKey}/versions`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent, false);
    }

    public async uploadTileBundleAsync(bundlePath: string, forceReplaceExisting: boolean) {
        let endpoint = `${this.serverHost}/bundles/tiles`
        let bundleContent = await this.readBundleFile(bundlePath);

        await this.uploadBundleAsync(endpoint, bundleContent, forceReplaceExisting);
    }

    public async createApp(appKey: string, appName: string, categoryName: string = DEFAULT_CATEGORY): Promise<void> {
        if (!!(await this.getApp(appKey))) {
            throw Error(`app '${appKey}' allready exists!`);
        }

        const category = await this.getCategoryByName(categoryName) || await this.createCategory(categoryName);

        await this.executeRequest(`${this.serverHost}/api/apps`, 'POST', {
            body: JSON.stringify({
                key: appKey,
                name: appName,
                ShortName: appName,
                description: '',
                categoryId: category.id
            })
        });
    }

    public async createCategory(name: string): Promise<AppCategory> {
        if (!!(await this.getCategoryByName(name))) {
            throw Error(`Category '${name}' allready exists!`);
        }

        await this.executeRequest(`${this.serverHost}/api/apps/categories`, 'POST', {
            body: JSON.stringify({
                name,
                color: DEFAULT_CATEGORY_COLOR,
                defaultIcon: DEFAULT_CATEGORY_ICON
            })
        });
        
        const category = await this.getCategoryByName(name);
        if(!category) {
            throw Error(`Failed to create category '${name}'`);
        }

        console.log(`Category '${name}' created`);

        return category;
    }

    public async publishFrameworkAsync() {
        let endpoint = `${this.serverHost}/bundles/frameworks/publish`
        await this.postAsync(endpoint);
    }

    public async publishAppAsync(appKey: string) {
        let endpoint = `${this.serverHost}/api/apps/${appKey}/publish`
        await this.postAsync(endpoint);
    }

    public async publishTilesAsync(tileKey: string) {
        let endpoint = `${this.serverHost}/bundles/tiles/${tileKey}/publish`
        await this.postAsync(endpoint);
    }

    private async uploadBundleAsync(endpoint: string, bundleContent: Buffer, forceReplaceExisting: boolean) {
        let token = await auth.getAppAccessTokenAsync();

        const headers = {
            'content-type': 'application/zip',
            'authorization': 'bearer ' + token,
        }

        if (forceReplaceExisting) {
            headers['x-fusion-force'] = true;
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

    private async getAsync(endpoint: string) {
        const contents = await this.executeRequest(endpoint, 'GET');
        return JSON.parse(contents);
    }

    private postAsync(endpoint: string): Promise<void> {
        return this.executeRequest(endpoint, 'POST');
    }

    private async executeRequest(endpoint: string, method: string, opt?: Partial<rp.Options>) {
        const token = await auth.getAppAccessTokenAsync();

        const options = {
            ...opt,
            method,
            uri: endpoint,
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token,
                ...(opt || {}).headers
            }
        };

        try {
            console.log(`Sending request ${method} '${endpoint}'`);
            return await rp(options);
        } catch (error) {
            this.debugErrorResponse(error);
            throw error;
        }
    }

    private debugErrorResponse(error: any) {
        console.log(`Request failed with code ${error.statusCode} - ${error.response?.statusMessage}`);
        console.log('-- BODY --');
        console.log(error.response?.body);
        console.log('-- HEADERS --');
        console.log(error.response.headers)
    }

    private readBundleFile(bundlePath: string): Buffer {
        var zipContents = fs.readFileSync(bundlePath);
        return zipContents;
    }
}