#! /usr/bin/env node

// This will work in a renderer process, but be `undefined` in the
// main process:
const {app, BrowserWindow, ipcMain} = require('electron')
const readline = require('readline');
const lineReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//
const events_queue = [];

//
let window = null;

//
app.on('ready', () => {

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 800,
    frame: true,
    resizable: false
  })

  win.webContents.openDevTools()

  // and load the index.html of the app.
  win.loadFile('./client/index.html')

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })

  ipcMain.on('ready', () => {

    for (let event of events_queue) {
      win.send('command', event);
    }

    window = win;

  })

})

lineReader.on('line', (input) => {
    if (!window) {
      events_queue.push(input);
    } else {
      window.send('command', input);
    }
});
