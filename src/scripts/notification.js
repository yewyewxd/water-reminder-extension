export default function () {
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
      notificationStart.value = result.startTime ?? '06:00'
      notificationEnd.value = result.endTime ?? '18:00'

      if (result.notificationInterval) {
        intervalInput.value = result.notificationInterval
        notificationActiveText.classList.add('hidden')
      }
    }
  )

  notificationForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const intervalValue = +intervalInput.value
    const isInvalidInterval = isNaN(intervalValue) || intervalValue <= 0

    if (!notificationStart.value) notificationStart.value = '00:00'
    if (!notificationEnd.value) notificationEnd.value = '23:59'

    const chromeMessage = {
      action: 'updateDrinkWaterReminder',
      interval: isInvalidInterval ? null : intervalValue,
      startTime: notificationStart.value,
      endTime: notificationEnd.value,
    }

    chrome.runtime.sendMessage(chromeMessage)

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
}
