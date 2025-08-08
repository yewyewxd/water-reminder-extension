const DEFAULT_START_HOUR = 6 // 6 AM
const DEFAULT_END_HOUR = 18 // 6 PM

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('drinkWaterReminder', {
    periodInMinutes: 10,
  })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'drinkWaterReminder') {
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
})
