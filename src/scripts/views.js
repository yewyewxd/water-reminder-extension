export default function () {
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
}
