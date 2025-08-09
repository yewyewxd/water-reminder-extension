export default function () {
  // Switch page logic
  const mainView = document.getElementById('main-view')
  const notificationView = document.getElementById('notification-view')
  const goalView = document.getElementById('goal-view')

  // -- to Notification View
  const notificationBtn = document.getElementById('notification-button')
  notificationBtn.onclick = function () {
    mainView.classList.add('hidden')
    notificationView.classList.remove('hidden')
  }

  // -- to Goal Setting View
  const goalBtn = document.getElementById('goal-setting-button')
  goalBtn.onclick = function () {
    mainView.classList.add('hidden')
    goalView.classList.remove('hidden')
  }

  // -- from Notification to Main View
  const notificationBackBtn = document.getElementById(
    'notification-view-back-button'
  )
  notificationBackBtn.onclick = function () {
    notificationView.classList.add('hidden')
    mainView.classList.remove('hidden')
  }

  // -- from Goal Setting View to Main View
  const goalBackBtn = document.getElementById('goal-view-back-button')
  goalBackBtn.onclick = function () {
    goalView.classList.add('hidden')
    mainView.classList.remove('hidden')
  }
}
