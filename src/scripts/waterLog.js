export default function () {
  // Water logging logic
  const waterLogForm = document.getElementById('water-log-form')
  const waterLogInput = document.getElementById('water-log-input')
  const waterLogTotal = document.getElementById('water-log-total')
  const waterLogPercent = document.getElementById('water-log-percentage')
  const waterLogProgress = document.getElementById('water-log-progress')
  const progressContainer = document.getElementById(
    'water-log-progress-container'
  )
  const goalText = document.getElementById('daily-water-goal')
  const goalInput = document.getElementById('daily-water-goal-input')

  // -- GET: states
  chrome.storage.sync.get(['dailyGoal', 'dailyTotal'], (result) => {
    const dailyTotal = result.dailyTotal ?? 0
    const dailyGoal = result.dailyGoal ?? 3000

    // -- set default water goal
    goalText.innerText = dailyGoal
    goalInput.value = dailyGoal

    // -- set default water progress
    waterLogTotal.innerText = dailyTotal

    // -- set default progress circle UI
    const newPercentage = (dailyTotal / dailyGoal) * 100
    waterLogPercent.innerText = newPercentage.toFixed(1) + '%'
    const waterProgressTranslateY = Math.round(100 - newPercentage)
    waterLogProgress.style.transform = `translateY(${waterProgressTranslateY}%)`
  })

  // todo: streak
  // -- SUBMIT: log water
  waterLogForm.onsubmit = function (e) {
    e.preventDefault()
    const waterLogged = +waterLogInput.value

    // -- validation
    if (isNaN(waterLogged) || waterLogged <= 0) return

    // -- update progress
    const prevWaterLogged = +waterLogTotal.innerText
    const newTotal = prevWaterLogged + waterLogged
    chrome.storage.sync.set({ dailyTotal: newTotal })
    waterLogTotal.innerText = newTotal

    // -- update progress circle UI
    const dailyGoal = +goalText.innerText
    const newPercentage = (newTotal / dailyGoal) * 100
    waterLogPercent.innerText = newPercentage.toFixed(1) + '%'
    if (prevWaterLogged < dailyGoal) {
      const waterProgressTranslateY = Math.round(100 - newPercentage)
      waterLogProgress.style.transform = `translateY(${waterProgressTranslateY}%)`
    }

    // -- bounce progress circle
    progressContainer.style.transform = 'scale(1.1)'
    setTimeout(() => {
      progressContainer.style.removeProperty('transform')
    }, 200)
  }

  //
  //
  //

  // Goal setting logic
  const goalForm = document.getElementById('goal-form')
  const goalSaveBtn = document.getElementById('goal-save-button')
  const progressResetBtn = document.getElementById('progress-reset-button')

  // -- SUBMIT: save daily goal
  goalForm.onsubmit = function (e) {
    e.preventDefault()
    const newDailyGoal = +goalInput.value

    // -- validation
    if (isNaN(newDailyGoal) || newDailyGoal <= 0) return

    // -- update progress circle UI
    const waterLogged = +waterLogTotal.innerText
    const newPercentage = (waterLogged / newDailyGoal) * 100
    waterLogPercent.innerText = newPercentage.toFixed(1) + '%'
    if (waterLogged < newDailyGoal) {
      const waterProgressTranslateY = Math.round(100 - newPercentage)
      waterLogProgress.style.transform = `translateY(${waterProgressTranslateY}%)`
    }

    // -- update daily goal
    chrome.storage.sync.set({ dailyGoal: newDailyGoal })
    goalText.innerText = newDailyGoal

    // todo: update streak

    // -- "saved" UI feedback
    goalSaveBtn.innerText = 'Saved!'
    goalSaveBtn.style.opacity = 0.8
    setTimeout(() => {
      goalSaveBtn.innerText = 'Save'
      goalSaveBtn.style.removeProperty('opacity')
    }, 2000)
  }

  // todo: cancel streak
  // -- CLICK: reset today's progress
  progressResetBtn.onclick = function () {
    chrome.storage.sync.set({ dailyTotal: 0 })
    waterLogTotal.innerText = '0'
    waterLogPercent.innerText = '0.0%'
    waterLogProgress.style.transform = `translateY(100%)`

    // -- "reset" UI feedback
    progressResetBtn.innerText = 'Reset done!'
    progressResetBtn.style.opacity = 0.8
    setTimeout(() => {
      progressResetBtn.innerText = 'Reset'
      progressResetBtn.style.removeProperty('opacity')
    }, 2000)
  }
}
