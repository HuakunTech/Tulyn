---
title: System Commands
description: Commands to interact with the system.
sidebar:
  order: 2
---

KK includes built-in system commands for essential tasks such as emptying the trash, restarting, shutting down, and adjusting the volume.

Here is a list of system commands that KK supports and their status. I aim to support all commands provided by Raycast and Alfred. While some commands may be platform specific, I will try to implement them for all platforms.

## Raycast System Commands

> I will try to implement all of these for all 3 platforms, but some may not be possible/trivial.

- [x] Empty Trash
- [x] Open Trash
- [x] Lock Screen - `tell application "ScreenSaverEngine" to activate`
- [x] Sleep
- [x] Restart
- [x] Toggle System Appearance
- [ ] Toggle Hidden Files
- [x] Show Desktop
- [ ] Quit All Apps
- [x] Sleep Display
- [x] Set Volume to 0
- [x] Set Volume to 25
- [x] Set Volume to 50
- [x] Set Volume to 100
- [x] Turn Volume Up
- [x] Turn Volume Down
- [ ] Toggle Stage Manager
- [ ] Unhide All Hidden Apps
- [ ] Toggle Bluetooth
- [x] Shutdown
- [ ] Open Camera
- [x] Eject All Disks
- [x] Logout <User>
- [x] Toggle Mute
- [x] Hide All Apps Except Frontmost

## Alfred Commands

- [x] Screensaver
- [x] show trash
- [x] empty trash
- [x] logout
- [x] sleep
- [x] sleep displays
- [x] lock
- [x] restart
- [x] shutdown
- [ ] hide
  - With a list of apps to choose from
- [ ] quit
  - With a list of processes
- [ ] force quit
  - With a list of processes
- [ ] quitall
- [x] volume up
- [x] volume down
- [x] toggle mute
- [ ] eject
  - With a list to choose from
- [ ] eject all
  - With Exclude Setting
