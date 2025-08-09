document.addEventListener('DOMContentLoaded', () => {
  // Switch page logic
  const notificationBtn = document.getElementById('notification-button')
  const notificationBackBtn = document.getElementById(
    'notification-view-back-button'
  )
  const goalBtn = document.getElementById('goal-setting-button')
  const goalBackBtn = document.getElementById('goal-view-back-button')
  // -- to Notification View
  notificationBtn.addEventListener('click', () => {
    document.getElementById('main-view').classList.add('hidden')
    document.getElementById('notification-view').classList.remove('hidden')
  })
  // -- to Goal Setting View
  goalBtn.addEventListener('click', () => {
    document.getElementById('main-view').classList.add('hidden')
    document.getElementById('goal-view').classList.remove('hidden')
  })
  // -- to Main View
  notificationBackBtn.addEventListener('click', () => {
    document.getElementById('notification-view').classList.add('hidden')
    document.getElementById('main-view').classList.remove('hidden')
  })
  goalBackBtn.addEventListener('click', () => {
    document.getElementById('goal-view').classList.add('hidden')
    document.getElementById('main-view').classList.remove('hidden')
  })

  // Water logging logic
  const waterLogForm = document.getElementById('water-log-form')
  const waterLogInput = document.getElementById('water-log-input')
  const waterLogTotal = document.getElementById('water-log-total')
  const waterLogPercent = document.getElementById('water-log-percentage')
  const waterLogProgress = document.getElementById('water-log-progress')
  const progressContainer = document.getElementById(
    'water-log-progress-container'
  )
  waterLogForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const inputValue = +waterLogInput.value
    // -- validation
    if (isNaN(inputValue) || inputValue <= 0) return
    const currentTotal = +waterLogTotal.innerText
    const newTotal = currentTotal + inputValue
    waterLogTotal.innerText = newTotal
    // todo: save WATER_GOAL
    const GOAL = 3000
    const newPercentage = (newTotal / GOAL) * 100 // cap at 100
    waterLogPercent.innerText = newPercentage.toFixed(1) + '%'
    const waterProgressTranslateY = Math.round(100 - newPercentage)
    if (currentTotal < GOAL) {
      waterLogProgress.style.transform = `translateY(${waterProgressTranslateY}%)`
    }
    // -- bounce animation
    progressContainer.style.transform = 'scale(1.1)'
    setTimeout(() => {
      progressContainer.style.transform = 'scale(1)'
    }, 200)
  })

  // Notification setting logic
  const notificationForm = document.getElementById('notification-form')
  const intervalInput = document.getElementById('notification-interval-input')
  const notificationSaveBtn = document.getElementById(
    'notification-save-button'
  )
  const notificationStart = document.getElementById('notification-start-input')
  const notificationEnd = document.getElementById('notification-end-input')
  const notificationActiveText = document.getElementById(
    'notification-active-indicator'
  )

  chrome.storage.sync.get(
    ['startTime', 'endTime', 'notificationInterval'],
    (result) => {
      // -- set default start & end time
      const startTime = result.startTime ?? '06:00'
      const endTime = result.endTime ?? '18:00'
      notificationStart.value = startTime
      notificationEnd.value = endTime

      // -- set default interval
      const interval = result.notificationInterval
      if (interval) {
        intervalInput.value = interval
        notificationActiveText.classList.add('hidden')
      }
    }
  )

  // -- SUBMIT: update interval and start & end time
  notificationForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const intervalValue = +intervalInput.value
    const isInvalidInterval = isNaN(intervalValue) || intervalValue <= 0

    // -- validate: start & end hours
    if (!notificationStart.value) notificationStart.value = '00:00'
    if (!notificationEnd.value) notificationEnd.value = '23:59'

    const chromeMessage = {
      action: 'updateDrinkWaterReminder',
      interval: isInvalidInterval ? null : intervalValue,
      startTime: notificationStart.value,
      endTime: notificationEnd.value,
    }

    // -- save
    chrome.runtime.sendMessage(chromeMessage)

    // -- "saved" UI feedback
    if (isInvalidInterval) {
      notificationActiveText.classList.remove('hidden')
      intervalInput.value = ''
    } else {
      notificationActiveText.classList.add('hidden')
    }
    notificationSaveBtn.innerText = 'Saved!'
    notificationSaveBtn.style.opacity = 0.8
    setTimeout(() => {
      notificationSaveBtn.innerText = 'Save'
      notificationSaveBtn.style.removeProperty('opacity')
    }, 2000)
  })
})
