document.addEventListener('DOMContentLoaded', () => {
  // temporary
  document.getElementById('main-view').classList.add('hidden')
  document.getElementById('notification-view').classList.remove('hidden')

  //   const startTimeInput = document.getElementById('startTime')
  //   const endTimeInput = document.getElementById('endTime')
  //   const saveBtn = document.getElementById('saveBtn')
  //   const status = document.getElementById('status')

  //   const notifView = document.getElementById('notifView')

  //   // Load saved settings
  //   chrome.storage.sync.get(['startHour', 'endHour'], (result) => {
  //     if (result.startHour !== undefined) {
  //       startTimeInput.value = `${String(result.startHour).padStart(2, '0')}:00`
  //     }
  //     if (result.endHour !== undefined) {
  //       endTimeInput.value = `${String(result.endHour).padStart(2, '0')}:00`
  //     }
  //   })

  //   // Save button logic
  //   saveBtn.addEventListener('click', () => {
  //     const startHour = parseInt(startTimeInput.value.split(':')[0])
  //     const endHour = parseInt(endTimeInput.value.split(':')[0])

  //     chrome.storage.sync.set({ startHour, endHour }, () => {
  //       status.textContent = 'Saved!'
  //       setTimeout(() => (status.textContent = ''), 2000)
  //     })
  //   })

  // Switch page logic
  const notificationBtn = document.getElementById('notification-button')
  const backBtn = document.getElementById('back-button')
  // -- to Notification View
  notificationBtn.addEventListener('click', () => {
    document.getElementById('main-view').classList.add('hidden')
    document.getElementById('notification-view').classList.remove('hidden')
  })
  // -- to Main View
  backBtn.addEventListener('click', () => {
    document.getElementById('notification-view').classList.add('hidden')
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

  // const notificationStart = document.getElementById('notification-start-input')
  // const notificationEnd = document.getElementById('notification-end-input')

  // -- set default interval
  chrome.storage.sync.get(['notificationInterval'], (result) => {
    const interval = result.notificationInterval ?? 10
    intervalInput.value = interval
  })
  // -- update interval
  notificationForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const intervalValue = +intervalInput.value
    // -- validation
    if (isNaN(intervalValue) || intervalValue <= 0) return
    chrome.runtime.sendMessage({
      action: 'updateDrinkWaterReminder',
      interval: intervalValue,
    })

    // -- "saved" UI feedback
    notificationSaveBtn.innerText = 'Saved!'
    setTimeout(() => {
      notificationSaveBtn.innerText = 'Save'
    }, 1000)
  })
})
