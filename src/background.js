const DEFAULT_START_HOUR = 6 // 6 AM
const DEFAULT_END_HOUR = 18 // 6 PM
const DEFAULT_INTERVAL = 10 // minutes

// Function to set alarm with the given interval
function createDrinkWaterAlarm(interval) {
  chrome.alarms.create('drinkWaterReminder', {
    periodInMinutes: interval,
  })
}

// Function to send a notification
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
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['notificationInterval'], (result) => {
    const interval = result.notificationInterval ?? DEFAULT_INTERVAL
    createDrinkWaterAlarm(interval)
    sendDrinkWaterNotification() // Immediate notification on restart
  })
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['notificationInterval'], (result) => {
    const interval = result.notificationInterval ?? DEFAULT_INTERVAL
    createDrinkWaterAlarm(interval)
    sendDrinkWaterNotification() // Immediate notification on install
  })
})

// Handle alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'drinkWaterReminder') {
    sendDrinkWaterNotification()
  }
})

// Listen for updates from popup.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateDrinkWaterReminder') {
    const newInterval = message.interval
    createDrinkWaterAlarm(newInterval)
    sendDrinkWaterNotification() // Immediate notification after change
    chrome.storage.sync.set({ notificationInterval: newInterval }) // Persist
  }
})
