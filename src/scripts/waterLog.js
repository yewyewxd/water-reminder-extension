export default function () {
  let streak = 0

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

  const streakContainer = document.getElementById('streak-container')
  const streakText = document.getElementById('streak-text')
  const streakDayText = document.getElementById('streak-day-text')

  // helpers
  function updateStreakText() {
    if (streak <= 0) {
      streakContainer.style.display = 'none'
      return
    }
    streakContainer.style.removeProperty('display')
    streakText.innerText = streak
    streakDayText.innerText = `${streak} day${streak > 1 ? 's' : ''}`
  }

  // -- GET: states
  chrome.storage.sync.get(
    ['dailyGoal', 'dailyTotal', 'streak', 'defaultAmountToLog'],
    (result) => {
      const dailyTotal = result.dailyTotal || 0
      const dailyGoal = result.dailyGoal || 3000
      streak = result.streak || 0

      // -- set default streak, water logged, goal
      if (streak > 0) updateStreakText()
      goalText.innerText = dailyGoal
      goalInput.value = dailyGoal
      waterLogTotal.innerText = dailyTotal
      waterLogInput.value = result.defaultAmountToLog || 1000

      // -- set default progress circle UI
      const newPercentage = (dailyTotal / dailyGoal) * 100
      waterLogPercent.innerText = newPercentage.toFixed(1) + '%'
      // cap at 100
      const translateY = Math.round(100 - Math.min(newPercentage, 100))
      waterLogProgress.style.transform = `translateY(${translateY}%)`
    }
  )

  // -- SUBMIT: log water
  waterLogForm.onsubmit = function (e) {
    e.preventDefault()
    const waterLogged = +waterLogInput.value

    // -- validation
    if (isNaN(waterLogged) || waterLogged <= 0) return

    // -- update progress
    const prevWaterLogged = +waterLogTotal.innerText
    const newTotal = prevWaterLogged + waterLogged
    waterLogTotal.innerText = newTotal
    chrome.storage.sync.set({
      dailyTotal: newTotal,
      defaultAmountToLog: waterLogged,
    })

    // -- update progress circle UI
    const dailyGoal = +goalText.innerText
    const newPercentage = (newTotal / dailyGoal) * 100
    waterLogPercent.innerText = newPercentage.toFixed(1) + '%'
    // -- if goal has not been made
    if (prevWaterLogged < dailyGoal) {
      // cap at 100
      const translateY = Math.round(100 - Math.min(newPercentage, 100))
      waterLogProgress.style.transform = `translateY(${translateY}%)`

      if (newTotal >= dailyGoal) {
        streak++
        chrome.storage.sync.set({ streak })
        updateStreakText()
      }
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
    const prevDailyGoal = +goalText.innerText
    const newDailyGoal = +goalInput.value

    // -- validation
    if (isNaN(newDailyGoal) || newDailyGoal <= 0) return

    // -- update progress circle UI
    const waterLogged = +waterLogTotal.innerText
    const newPercentage = (waterLogged / newDailyGoal) * 100
    waterLogPercent.innerText = newPercentage.toFixed(1) + '%'
    const translateY = Math.round(100 - Math.min(newPercentage, 100))
    waterLogProgress.style.transform = `translateY(${translateY}%)`

    // -- update streak
    // Goal was hit -> not anymore
    if (waterLogged >= prevDailyGoal && waterLogged < newDailyGoal) {
      streak--
    } else if (waterLogged < prevDailyGoal && waterLogged >= newDailyGoal) {
      // Goal was not hit -> YES now
      streak++
    }
    updateStreakText()

    // -- update daily goal
    chrome.storage.sync.set({ streak, dailyGoal: newDailyGoal })
    goalText.innerText = newDailyGoal

    // -- "saved" UI feedback
    goalSaveBtn.innerText = 'Saved!'
    goalSaveBtn.style.opacity = 0.8
    setTimeout(() => {
      goalSaveBtn.innerText = 'Save'
      goalSaveBtn.style.removeProperty('opacity')
    }, 2000)
  }

  // -- CLICK: reset today's progress
  progressResetBtn.onclick = function () {
    // -- update streak
    const dailyTotal = +waterLogTotal.innerText
    const dailyGoal = +goalText.innerText
    // if streak was hit before reset
    if (dailyTotal >= dailyGoal) {
      streak--
      updateStreakText()
    }

    // -- reset
    chrome.storage.sync.set({ streak, dailyTotal: 0 })
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
