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
}
