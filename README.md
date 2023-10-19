## Features

This extension lets you easily construct a new angular component out of a chunk of a .html file.
- Select the text that you want to extract (must be in a .html file).
- Right click and the context menu will include the option "Cut as Angular component"
- The extension will then ask you for the name for your new component. 
    - (This name will be passed to `ng g c` so must not have any spaces)
- Then you must select the folder you want the new component to be created in. You select the folder with a file browser dialog. 
    - (No need to figure out the full path for your nested components, you just select the folder!)
- The extension will then invoke the ng cli for you creating the new component, it will remove the selection from the existing component and then open up the new component in an editor for you inserting the selection that you wanted to extract.

_Demo:_
TODO...

## Requirements

None

## Extension Settings

None

## Known Issues

None

## Release Notes

Initial release!
