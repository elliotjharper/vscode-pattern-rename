## Features

Enables you to quickly extract a function/class out to a new .ts file.
It will derive a file from the name of the element that you select.
Lets say you want to extract a function:

-   Right click the function name (or really anywhere on the declaration of the function)
-   In the context menu select "Extract typescript node to new .ts file"
-   It will ask you to confirm that it recognised the correct element to extract.
-   Upon confirmation it will remove the node from the original file, create a new file with the element
-   If the element is a top level/class function it will do any required conversions to ensure that it is an exported function.

_Demo:_
<img src="https://raw.githubusercontent.com/elliotjharper/vscode-right-click-to-extract-function/main/images/demo.gif" alt="demo">

Additionally you can also right click on a text selection in a .ts file and use the extra option "Extract raw selection to new .ts file".
I created this for situations where you may want to pull many items out of a file in one go.

## Roadmap
