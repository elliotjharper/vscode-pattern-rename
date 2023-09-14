## Features

This extension lets you run NX scripts from the command palette.

Run the extension from the command palette and it will list the projects from your nx monorepo.

Upon selecting a project it will then list the targets for that project.

When you have selected a project and a target, it will focus the last used terminal and send the text `npx nx run ${PROJECT} ${TARGET}` which will of course result in that script being run.

_Demo:_
<img src="https://raw.githubusercontent.com/elliotjharper/vscode-npm-script-run/main/images/demo.gif" alt="demo">

## Requirements

None

## Extension Settings

None

## Known Issues

None

## Release Notes

Initial release!
