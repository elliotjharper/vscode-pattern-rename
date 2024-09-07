## Features

This extension lets you easily construct a new typescript file out of a chunk of a .ts file.

-   Select the text that you want to extract (must be in a .ts file).
-   Right click and the context menu will include the option "Extract to new .ts file"
-   The extension will then ask you for the name for your new .ts file.
    -   (You can end with .ts or you can leave that to the extension that will append .ts if your input does not end with .ts)
-   The extension will then cut your selection and write it out to a new .ts file in the same folder

_Demo:_
<img src="https://raw.githubusercontent.com/elliotjharper/vscode-right-click-to-extract-function/main/images/demo.gif" alt="demo">

## Roadmap

-   make it possible to just invoke by right clicking within a function and then the extension should find if the point of invocation was within a
    function and ask the user "Please confirm, you wanted to extract {TARGET FUNCTION NAME}?" - use the typescript compiler API to get an AST and use that to get the function out - handle if the original function was not exported or if it was part of a class (`public theSelectedFunction() {}`) in other words, do what is necessary to turn it into an exported function
