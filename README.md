## Features

Helps you to rename multiple files quickly straight from the file explorer.

-   Either select many files or select a folder and then right click
-   In the context menu select "Pattern Rename"
-   Then configure the rename operate by specifying the match text and the replacement.
-   You will be presented with a preview of what files will be renamed and what their new files names will be.

### Token Replacement

You can use special tokens in the replacement string that will be replaced with actual values:

**Date Tokens:**
- `$DD` - Day of month (01-31)
- `$MM` - Month (01-12)
- `$YYYY` - Full year (e.g., 2024)
- `$YY` - Two-digit year (e.g., 24)

**Time Tokens:**
- `$HH` - Hours (00-23)
- `$MIN` - Minutes (00-59)
- `$SS` - Seconds (00-59)

**Example:**
- Pattern: `file`
- Replacement: `backup-$DD-$MM-$YYYY`
- Result: `file.txt` → `backup-20-09-2024.txt`

_Demo:_
Todo....
