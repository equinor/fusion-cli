Azure Devops Custom Tasks
===================

For now the tasks are not published to the market place. To use the task you must add it to you own organisation, by using the tfx cli.

# Installation
Install single task to your organization.

Install the tfx cli
```
npm install -g tfx-cli
```

Sign in to the cli using a PAT token. The token is generated in devops.
```
tfx login --authType pat
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

# Fusion CLI task
Task to execute fusion cli.

The task comes with the fusion cli node module pre-installed. This lets the agent be clean for global cli. 

#### Usage
Pipeline yaml
```yaml
steps:
- task: FusionCLI
  inputs:
    arguments: help

- task: FusionCLI
  inputs:
    azureSubscription: serviceConnection
    arguments: deploy-app ...

```


# References

- https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops
- https://montemagno.com/building-vsts-tasks-with-typescript-and-vs-code/
- https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops