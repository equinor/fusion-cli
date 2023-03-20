Azure Devops Custom Tasks
===================

For now the tasks are not published to the market place. To use the task you must add it to you own organisation, by using the tfx cli.

# Creating new task
```
cd devops-extension/tasks
mkdir [my-task]
cd my-task

npm init
```
Accept defaults.

Install packages
```
npm install azure-pipelines-task-lib --save
npm install @types/node --save-dev
npm install @types/q --save-dev
echo node_modules > .gitignore

tsc --init
```

Copy task.json from another task, change id, name etc accordingly.

https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops#createpublisher

# Installation

### Tfx

Install the tfx cli
```
npm install -g tfx-cli
```

Sign in to the cli using a PAT token. The token is generated in devops.
```
tfx login --authType pat
```


### Extension

The extension is built using gulp.
```
    cd pipeline/devops-extension
    npm install

    gulp
```

Install / update the extension using tfx. 
To install the extension you will be quried for a PAT, this needs to be generated for all organisations you have access to.

```    
    tfx extension publish --manifest-globs ./vss-extension.json --share-with statoil-proview
```

Not sure how devops will handle multiple installations of the same extension. 
A fork and new ids will work for sure.

### Individual tasks

Each task can be installed / updated individually even after the extension is installed. 
Easiest approach when developing/updating.

```
    cd tasks/[task-folder]
    tsc
    tfx build tasks upload --task-path ./
```


```
tsc index.ts --lib es2015
tfx build tasks upload --task-path .\fusion-cli-task
```

# Debuging tasks
To debug the task build the index.ts file and run by using `node index.js`.

Arguments can be faked by setting environment variables for the process, in the format `INPUT_[input-name]`

```bash
# Unix
export INPUT_ARGUMENTS=help
```

```ps
# Powershell
$env:INPUT_ARGUMENTS = "help"
```


Required arguments:

```
$env:INPUT_ISDEBUG = "true"
$env:INPUT_ACTION = "config"
$env:INPUT_PORTALURL = "https://fusion-s-portal-ci.azurewebsites.net"
$env:INPUT_TOKENRESOURCE = "5a842df8-3238-415d-b168-9f16a6a6031b"
$env:INPUT_APPKEY = "cvppoc"
$env:INPUT_testCredentials = "./.testCredentials"
```

To debug:
```
$> cd ./tasks/fusion-app
$> tsc 
$> cd ./built/fusion-app

## Set env variables for arguments as above

$> node index.js
```

To debug `fusion-app` task:
```
$> cd ./tasks/fusion-app
$> $env:INPUT_testCredentials = "../../.testCredentials"
$> npm run task
```

# Tasks

Shared properties:

**tokenResource**: The resource we need to get an app token against. This will be the Azure AD App backing the portal. Can be the client id, or 'Test' (which will map to the test client app)<br>
**action**: Deploy | Publish<br>
**portalUrl**: Host for the portal to manage apps at.<br>
**fusionCredentials**: Service connection type deployed by the extension. This is a client id / client secret combination of the Azure AD App that will be performing the http requests. The app needs the Manage Bundles scope permission.

## Shared libs
In the `tasks/libs` folder there are shared libraries that can be used to interact with the portal api etc.
Shared logic should be placed here.

## Fusion CLI task
Task to execute fusion cli.<br>
The task will install the cli when executing. Cli is installed to the task folder.
This lets the agent be clean for global cli. 

#### Usage
Pipeline yaml
```yaml
steps:
- task: FusionCLI
  inputs:
    arguments: help

- task: FusionCLI@0
  inputs:
    command: 'build-app'
    appFolder: frontend/Apps/pro-org

```

## Fusion App management task
Task to interact with the portal api, for managing tasks. 

Actions supported are deploying of bundle and publishing.

#### Usage
```yml
steps:
- task: FusionApp@2
  displayName: 'Create slot for app'
  inputs:
    fusionCredentials: 'Fusion test'
    tokenResource: '5a842df8-3238-415d-b168-9f16a6a6031b'
    portalUrl: 'https://pr-0000.fusion-dev.net'
    action: Create
    appKey: 'test-app'
    appName: 'test app'
    appCategory: 'testing'

- task: FusionApp@2 
  displayName: Deploy app bundle
  inputs:
    fusionCredentials: 'Fusion Test'
    tokenResource: '5a842df8-1111-0000-2222-9f16a6a6031b'
    portalUrl: 'https://ci.fusion-dev.net'
    action: Deploy
    bundlePath: '$(pipeline.workspace)/app-bundle/pro-org.zip'

- task: FusionApp@2 
  displayName: Publish app bundle
  inputs:
    fusionCredentials: 'Fusion Test'
    tokenResource: Test
    portalUrl: 'https://ci.fusion-dev.net'
    action: Publish
    appKey: 'pro-org'

- task: FusionApp@2
  displayName: Update app config
  inputs:
    fusionCredentials: 'Fusion Test'
    tokenResource: Test
    portalUrl: 'https://ci.fusion-dev.net'
    appKey: 'pro-org'
    action: Config
    endpointsConfig: |
      {
        "api": "https://my-api.com"
      }
    environmentConfig: |
      {
        "enableNewFeature": true,
        "defaultScopes": [
          "api://my-app-identifier/.default"
        ]
      }
```

## Fusion Tile management task
Task to interact with the portal api, for managing tasks. 

Actions supported are deploying of bundle and publishing.

#### Usage
```yml
steps:
- task: FusionTile@0 
  displayName: Deploy app bundle
  inputs:
    fusionCredentials: 'Fusion Test'
    tokenResource: '5a842df8-1111-0000-2222-9f16a6a6031b'
    portalUrl: 'https://ci.fusion-dev.net'
    action: Deploy
    bundlePath: '$(pipeline.workspace)/tile-bundle/myTile.zip'

- task: FusionTile@0 
  displayName: Publish app bundle
  inputs:
    fusionCredentials: 'Fusion Test'
    tokenResource: Test
    portalUrl: 'https://ci.fusion-dev.net'
    action: Publish
    tileKey: 'pro-org'
```

## Fusion Tile management task
Task to interact with the portal api, for managing tasks. 

Actions supported are deploying of bundle and publishing.

#### Usage
```yml
steps:
- task: FusionFramework@0 
  displayName: Deploy app bundle
  inputs:
    fusionCredentials: 'Fusion Test'
    tokenResource: '5a842df8-1111-0000-2222-9f16a6a6031b'
    portalUrl: 'https://ci.fusion-dev.net'
    action: Deploy
    bundlePath: '$(pipeline.workspace)/bundles/frameworks.zip'

- task: FusionFramework@0 
  displayName: Publish app bundle
  inputs:
    fusionCredentials: 'Fusion Test'
    tokenResource: Test
    portalUrl: 'https://ci.fusion-dev.net'
    action: Publish
```

# Issues 

To use shared libs for all tasks, the .ts files were placed in `./tasks/libs` and referenced by `import fusionPortalApi from '../libs/fusionPortalApi'`. 
For this to compile with `tsc`, the root folder for `.tsconfig.json` had to be set to `./tasks` (or `../`). But now the output in `built` was structured in the same folders, `built/[taskname]/index.js` and `built/libs/*.js`.

The task json entry points are pointing to the `built/[task-name]/index.js` file, and 

# References

- https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops
- https://montemagno.com/building-vsts-tasks-with-typescript-and-vs-code/
- https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops
- https://docs.microsoft.com/en-us/azure/devops/extend/develop/service-endpoints?view=azure-devops