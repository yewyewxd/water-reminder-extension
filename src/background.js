function createDrinkWaterAlarm(interval) {
  if (interval) {
    // schedule notifications
    sendDrinkWaterNotification()
    chrome.alarms.create('drinkWaterReminder', {
      periodInMinutes: interval,
    })
  } else {
    // delete notification
    chrome.alarms.clear('drinkWaterReminder')
  }
}

// Send a notification right away
function sendDrinkWaterNotification() {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes() // minutes since midnight

  chrome.storage.sync.get(['startTime', 'endTime'], (result) => {
    const startTime = result.startTime || '06:00' // default 6:00 AM
    const endTime = result.endTime || '18:00' // default 6:00 PM

    // Convert "HH:mm" to minutes since midnight
    const [startHour, startMin] = startTime.split(':')
    const [endHour, endMin] = endTime.split(':')

    const startMinutes = +startHour * 60 + +startMin
    const endMinutes = +endHour * 60 + +endMin

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Time to drink water!',
        message: 'Stay hydrated. Take a sip of water now!',
        priority: 1,
      })
    }
  })
}

// Handle extension installed or browser restarted
chrome.runtime.onStartup.addListener(initNotification)
chrome.runtime.onInstalled.addListener(initNotification)
function initNotification() {
  chrome.storage.sync.get(['notificationInterval'], (result) => {
    const interval = result.notificationInterval
    if (interval) createDrinkWaterAlarm(interval)
  })
}

// Handle scheduled alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'drinkWaterReminder') {
    sendDrinkWaterNotification()
  }
})

// Listen for updates from popup.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateDrinkWaterReminder') {
    const { interval, startTime, endTime } = message
    // -- update storage
    chrome.storage.sync.set({
      notificationInterval: interval,
      startTime,
      endTime,
    })
    // -- new alarm state
    createDrinkWaterAlarm(interval)
  }
})
