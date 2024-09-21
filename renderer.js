const { ipcRenderer } = require('electron');

// Update the UI with the list of scheduled notifications
const updateNotificationList = (notifications) => {
  const notificationList = document.getElementById('notificationList');
  notificationList.innerHTML = ''; // Clear existing notifications

  notifications.forEach((notif, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${notif.coin} - ${notif.date}`;
    notificationList.appendChild(listItem);
  });
};

// When the user clicks "Set Notification"
document.getElementById('setNotification').addEventListener('click', () => {
  const coin = document.getElementById('coin').value;
  const dateString = document.getElementById('date').value;

  const parseDate = (input) => {
    const parts = input.match(/(\w+) (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2})([ap]m)/i);
    if (!parts) return null;

    const months = {
      January: '01', February: '02', March: '03', April: '04', May: '05',
      June: '06', July: '07', August: '08', September: '09', October: '10',
      November: '11', December: '12'
    };

    const month = months[parts[1]];
    const day = parts[2].padStart(2, '0');
    const year = parts[3];
    let hour = parseInt(parts[4]);
    const minute = parts[5];
    const ampm = parts[6].toLowerCase();

    if (ampm === 'pm' && hour !== 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;

    return `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${minute}:00`;
  };

  const parsedDateString = parseDate(dateString);
  if (parsedDateString) {
    const date = new Date(parsedDateString); // Convert parsed string to Date object
    if (!isNaN(date.getTime())) {
      ipcRenderer.send('set-notification', { coin, date: parsedDateString });
    } else {
      alert('Please enter a valid date.');
    }
  } else {
    alert('Please enter a valid date format like September 21, 2024 6:15pm.');
  }
});

// Listen for the updated notification list from the main process
ipcRenderer.on('notification-scheduled', (event, notifications) => {
  updateNotificationList(notifications);
});



// const { ipcRenderer } = require('electron');

// document.getElementById('setNotification').addEventListener('click', () => {
//     const coin = document.getElementById('coin').value;
//     const dateString = document.getElementById('date').value;
  
//     // Function to convert "September 21, 2024 6:15pm" into a valid date string format
//     const parseDate = (input) => {
//       const parts = input.match(/(\w+) (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2})([ap]m)/i);
//       if (!parts) return null;
  
//       const months = {
//         January: '01', February: '02', March: '03', April: '04', May: '05',
//         June: '06', July: '07', August: '08', September: '09', October: '10',
//         November: '11', December: '12'
//       };
  
//       const month = months[parts[1]];
//       const day = parts[2].padStart(2, '0');
//       const year = parts[3];
//       let hour = parseInt(parts[4]);
//       const minute = parts[5];
//       const ampm = parts[6].toLowerCase();
  
//       if (ampm === 'pm' && hour !== 12) hour += 12;
//       if (ampm === 'am' && hour === 12) hour = 0;
  
//       return `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${minute}:00`;
//     };
  
//     const parsedDateString = parseDate(dateString);
//     if (parsedDateString) {
//       const date = new Date(parsedDateString); // Convert parsed string to Date object
//       if (!isNaN(date.getTime())) {
//         ipcRenderer.send('set-notification', { coin, date: parsedDateString });
//         alert(`Notification set for ${coin} on ${dateString}`);
//       } else {
//         alert('Please enter a valid date.');
//       }
//     } else {
//       alert('Please enter a valid date format like September 21, 2024 6:15pm.');
//     }
//   });
  
  
