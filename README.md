# MinTerm

MinTerm is a lightweight terminal-app for serialport communication using electron-react. It provides keyfeatures in structuring 
and visualizing the data from your microcontroller.

### Installation

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

### Libraries

The app is based on a [electron-react-boilerplate](https://opencollective.com/electron-react-boilerplate-594) and with an [primereact](https://primereact.org/) overlay.

The core interface for communicating with the serialport is the [Node SerialPort](https://serialport.io/) solution.
