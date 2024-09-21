const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const notifier = require('node-notifier');

let mainWindow;

// Store multiple notifications
let notifications = [];

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('set-notification', (event, { coin, date }) => {
  const parsedDate = Date.parse(date); // Try to parse the date string directly
  
  if (!isNaN(parsedDate)) { // Check if date is valid
    const notificationTime = parsedDate - Date.now();
  
    if (notificationTime > 0) {
      // Schedule the notification
      const timeoutId = setTimeout(() => {
        notifier.notify({
          title: 'Crypto Notification',
          message: `Time to sell your ${coin}!`,
          icon: path.join(__dirname, 'icon.png'), // optional
          sound: true, // optional
        });
      }, notificationTime);

      // Add this notification to the array but exclude timeoutId from what we send to the renderer
      notifications.push({ coin, date, timeoutId });
      const notificationsToSend = notifications.map(notif => ({ coin: notif.coin, date: notif.date }));
      
      // Send back only serializable data
      event.sender.send('notification-scheduled', notificationsToSend);
    } else {
      console.log('Notification date is in the past!');
    }
  } else {
    console.log('Invalid date format!');
  }
});



// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');
// const notifier = require('node-notifier');

// let mainWindow;

// const createWindow = () => {
//   mainWindow = new BrowserWindow({
//     width: 600,
//     height: 400,
//     webPreferences: {
//       preload: path.join(__dirname, 'renderer.js'),
//       nodeIntegration: true,
//       contextIsolation: false
//     }
//   });

//   mainWindow.loadFile('index.html');
// };

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });

// ipcMain.on('set-notification', (event, { coin, date }) => {
//     const parsedDate = Date.parse(date);  // Try to parse the date string directly
  
//     if (!isNaN(parsedDate)) {  // Check if date is valid
//       const notificationTime = parsedDate - Date.now();
  
//       if (notificationTime > 0) {
//         setTimeout(() => {
//           notifier.notify({
//             title: 'Crypto Notification',
//             message: `Time to sell your ${coin}!`,
//             icon: path.join(__dirname, 'icon.png'), // optional
//             sound: true, // optional
//           });
//         }, notificationTime);
//       } else {
//         console.log('Notification date is in the past!');
//       }
//     } else {
//       console.log('Invalid date format!');
//     }
//   });
  
