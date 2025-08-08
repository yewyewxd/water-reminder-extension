function createDrinkWaterAlarm(interval) {
  if (interval) {
    // schedule notifications
    chrome.alarms.create('drinkWaterReminder', {
      periodInMinutes: interval,
    })
    sendDrinkWaterNotification()
  } else {
    // delete notification
    chrome.alarms.clear('drinkWaterReminder')
  }
}

// Send a notification right away
function sendDrinkWaterNotification() {
  const now = new Date()
  const currentHour = now.getHours()

  chrome.storage.sync.get(['startTime', 'endTime'], (result) => {
    const start = result.startTime
    const end = result.endTime

    if (currentHour >= start && currentHour < end) {
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
    console.log({ startTime, endTime })
    createDrinkWaterAlarm(interval)
    chrome.storage.sync.set({
      notificationInterval: interval,
      startTime,
      endTime,
    })
  }
})
