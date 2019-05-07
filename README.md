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
@equinor/fusion-cli/0.0.0 win32-x64 node-v8.11.3
$ fusion --help [COMMAND]
USAGE
  $ fusion COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fusion create-app`](#fusion-create-app)
* [`fusion start-app`](#fusion-start-app-file)

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

_See code: [src\commands\create-app.ts](https://github.com/equinor/fusion-cli/blob/v0.0.0/src\commands\create-app.ts)_

## `fusion start-app`

Starts fusion apps

```
USAGE
  $ fusion start-app

OPTIONS
  -h, --help            show CLI help
  -a, --apps            Compile one or more fusion apps. E.g. --apps AppKey1 AppKey2 AppKey3
  -p, --progress        Display build progress
  -P, --production      Use production config
```

_See code: [src\commands\start-app.ts](https://github.com/equinor/fusion-cli/blob/v0.0.0/src\commands\start-app.ts)_
<!-- commandsstop -->
