<img src="./src/renderer/resources/images/erb-banner.svg" width="100%" />

<br>

<p>
  MinTerm is a lightweight terminal-app for serialport communication using <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a>, <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a> and <a href="https://www.npmjs.com/package/serialport">Node SerialPort</a>.
</p>

<br>

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]


</div>

## Installation

MinTerm is cross-functional and supports windows and linux. For Linux an AppImage can be downloaded that is directly executable, no libaries, no setup-installation.
On Windows on the other hand an executable needs to be installed. After the setup process a desktop shortcut is created and the App is ready to go.

[Latest release](https://github.com/peace317/minterm/releases/latest)

### What is MinTerm?

Like many other serialport communication tools, MinTerm provides a basic set of functionality to exchange data with your microcontroller. But many of these apps differ in how to process or visualize the data, where one app has a feature the other doesen't have and vise versa. Also most of the time, they are kinda old, unsopported and not cross-functional.

So MinTerm shall become a modern solution in combining varies features and a fresh look.

Features:
  - table view like seen in HTerm
  - normal text monitor
  - a plotter to display values
  - macro creation
  - varies export options
  - use of parsers for grouping data (byte parser, delimiter parser, ready parser etc.)
  - user storage

![Screenshot_11](https://user-images.githubusercontent.com/102929517/230526092-feaa0b63-0f6f-4840-a702-c5d87522f907.png)

## Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/peace317/minterm.git
cd minterm
npm install
```

**Having issues installing? See the [debugging guide](https://www.electronforge.io/advanced/debugging)**

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Docs

See docs and guides for [electron-forge](https://js.electronforge.io/)

## Maintainers

- [Janik Piepenhagen](https://github.com/peace317)

## License

MIT © [Minterm](https://github.com/peace317/minterm)

[github-actions-status]: https://github.com/peace317/minterm/workflows/Test/badge.svg
[github-actions-url]: https://github.com/peace317/minterm/actions
[github-tag-image]: https://img.shields.io/github/v/tag/peace317/minterm.svg?label=version
[github-tag-url]: https://github.com/peace317/minterm/releases/latest
