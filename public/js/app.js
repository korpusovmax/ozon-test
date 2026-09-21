document.addEventListener('DOMContentLoaded', function () {
  const widget = new ProgressWidget(document.getElementById('widget'))
  const valueInput = document.getElementById('valueInput')
  const animateToggle = document.getElementById('animateToggle')
  const hideToggle = document.getElementById('hideToggle')

  function clamp(n) {
    n = Math.round(Number(n))
    if (Number.isNaN(n)) return 0
    return Math.min(100, Math.max(0, n))
  }

  function setToggleState(button, on) {
    button.setAttribute('aria-checked', on ? 'true' : 'false')
  }

  valueInput.addEventListener('input', function () {
    if (valueInput.value === '') return
    widget.setValue(clamp(valueInput.value))
  })
  valueInput.addEventListener('blur', function () {
    const clamped = clamp(valueInput.value || 0)
    valueInput.value = String(clamped)
    widget.setValue(clamped)
  })

  animateToggle.addEventListener('click', function () {
    widget.toggleAnimate()
  })

  hideToggle.addEventListener('click', function () {
    widget.toggleHidden()
  })

  // widget -> controls (keep UI in sync with widget's real state)
  widget.el.addEventListener('progress-change', function (e) {
    const { value, animate, hidden } = e.detail

    if (document.activeElement !== valueInput) {
      valueInput.value = String(value)
    }
    setToggleState(animateToggle, animate)
    setToggleState(hideToggle, hidden)
  })

  // initial sync
  valueInput.value = String(widget.value)
  setToggleState(animateToggle, widget.animate)
  setToggleState(hideToggle, widget.hidden)
})
