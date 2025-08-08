const DEFAULT_START_HOUR = 6 // 6 AM
const DEFAULT_END_HOUR = 18 // 6 PM

function createDrinkWaterAlarm(interval) {
  if (interval) {
    // schedule notifications
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
  const currentHour = now.getHours()

  chrome.storage.sync.get(['startHour', 'endHour'], (result) => {
    const start = result.startHour ?? DEFAULT_START_HOUR
    const end = result.endHour ?? DEFAULT_END_HOUR

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
    const { interval, startHour, endHour } = message
    const storage = { notificationInterval: interval }
    // chrome.storage.sync.remove()
    if (startHour) storage.startHour = startHour
    if (endHour) storage.endHour = endHour
    createDrinkWaterAlarm(interval)
    chrome.storage.sync.set(storage)
  }
})
