# The Gradia Sourcebook

This repository contains reference material for my homebrew RPG setting,
[Gradia][], as well as the setup to build it into a website as well as a
[Foundry][] module.

All text content about Gradia (contents of the markdown files under `content/`)
is released under the [Creative Commons BY-NC-SA 4.0][cc] license. Everything
else in this repository is released under the [MIT][] license.

[Gradia]: https://gradia.org
[Foundry]: https://foundryvtt.com
[cc]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[MIT]: https://justinian.mit-license.org/

## Building

To build this project, you need [Hugo][] version 0.126 or later, [python][] 3,
and [Bun][] on a Linux system. First run `hugo` to turn the markdown into HTML
and JSON content, then run `./build_fvtt_module.sh` to turn the JSON content
into a Foundry module.

[Hugo]: https://gohugo.io
[Python]: https://python.org
[Bun]: https://bun.sh