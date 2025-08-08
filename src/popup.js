document.addEventListener('DOMContentLoaded', () => {
  // temporary
  document.getElementById('main-view').classList.add('hidden')
  document.getElementById('notification-view').classList.remove('hidden')

  //   const startTimeInput = document.getElementById('startTime')
  //   const endTimeInput = document.getElementById('endTime')
  //   const saveBtn = document.getElementById('saveBtn')
  //   const status = document.getElementById('status')

  //   const mainView = document.getElementById('mainView')
  //   const notifView = document.getElementById('notifView')
  const notificationBtn = document.getElementById('notification-button')
  const backBtn = document.getElementById('back-button')

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

  // Switch to Notification View
  notificationBtn.addEventListener('click', () => {
    document.getElementById('main-view').classList.add('hidden')
    document.getElementById('notification-view').classList.remove('hidden')
  })

  // Back to Main View
  backBtn.addEventListener('click', () => {
    document.getElementById('notification-view').classList.add('hidden')
    document.getElementById('main-view').classList.remove('hidden')
  })
})
