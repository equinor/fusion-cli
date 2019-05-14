Fusion CLI
===================

A cli for creating, starting, building, deploying and publishing Fusion apps and tiles

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@equinor/fusion-cli.svg)](https://npmjs.org/package/@equinor/fusion-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@equinor/fusion-cli.svg)](https://npmjs.org/package/@equinor/fusion-cli)
[![License](https://img.shields.io/npm/l/@equinor/fusion-cli.svg)](https://github.com/equinor/fusion-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @equinor/fusion-cli
$ fusion COMMAND
running command...
$ fusion (-v|--version|version)
@equinor/fusion-cli/0.0.0 darwin-x64 node-v10.11.0
$ fusion --help [COMMAND]
USAGE
  $ fusion COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fusion create-app`](#fusion-create-app)
* [`fusion help [COMMAND]`](#fusion-help-command)
* [`fusion start-app`](#fusion-start-app)

## `fusion create-app`

Creates a new fusion app

```
USAGE
  $ fusion create-app

OPTIONS
  -N, --shortName=shortName      App short name
  -d, --description=description  App description
  -g, --git                      Initialize git repository
  -h, --help                     show CLI help
  -i, --install                  Install dev dependencies
  -k, --key=key                  Key for app/tile
  -n, --name=name                Name for app/tile(use quotes for spaces)
```

_See code: [src\commands\create-app.ts](https://github.com/equinor/fusion-cli/blob/v0.0.1/src\commands\create-app.ts)_

## `fusion help [COMMAND]`

display help for fusion

```
USAGE
  $ fusion help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src\commands\help.ts)_

## `fusion start-app`

Start a fusion app

```
USAGE
  $ fusion start-app

OPTIONS
  -P, --production  Use production config
  -a, --apps=apps   Compile one or more fusion apps. E.g. --apps AppKey1 AppKey2 AppKey3
  -h, --help        show CLI help
  -p, --progress    Display build progress
```

_See code: [src\commands\start-app.ts](https://github.com/equinor/fusion-cli/blob/v0.0.1/src\commands\start-app.ts)_
<!-- commandsstop -->
