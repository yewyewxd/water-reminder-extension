document.addEventListener('DOMContentLoaded', () => {
  const startTimeInput = document.getElementById('startTime')
  const endTimeInput = document.getElementById('endTime')
  const saveBtn = document.getElementById('saveBtn')
  const status = document.getElementById('status')

  const mainView = document.getElementById('mainView')
  const notifView = document.getElementById('notifView')
  const notifBtn = document.getElementById('notifBtn')
  const backBtn = document.getElementById('backBtn')

  // Load saved settings
  chrome.storage.sync.get(['startHour', 'endHour'], (result) => {
    if (result.startHour !== undefined) {
      startTimeInput.value = `${String(result.startHour).padStart(2, '0')}:00`
    }
    if (result.endHour !== undefined) {
      endTimeInput.value = `${String(result.endHour).padStart(2, '0')}:00`
    }
  })

  // Save button logic
  saveBtn.addEventListener('click', () => {
    const startHour = parseInt(startTimeInput.value.split(':')[0])
    const endHour = parseInt(endTimeInput.value.split(':')[0])

    chrome.storage.sync.set({ startHour, endHour }, () => {
      status.textContent = 'Saved!'
      setTimeout(() => (status.textContent = ''), 2000)
    })
  })

  // Switch to Notification View
  notifBtn.addEventListener('click', () => {
    mainView.classList.add('hidden')
    notifView.classList.remove('hidden')
    backBtn.classList.remove('hidden')
  })

  // Back to Main View
  backBtn.addEventListener('click', () => {
    notifView.classList.add('hidden')
    mainView.classList.remove('hidden')
    backBtn.classList.add('hidden')
  })
})
