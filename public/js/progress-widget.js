const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const MARKUP = `
  <div class="pw-root">
    <svg viewBox="0 0 100 100">
      <g class="pw-spin">
        <circle class="pw-track" cx="50" cy="50" r="42"></circle>
        <circle class="pw-arc" cx="50" cy="50" r="42"></circle>
      </g>
    </svg>
  </div>
`

class ProgressWidget {
  constructor(el, options = {}) {
    this.el = el
    this.el.classList.add('progress-widget')
    this.el.innerHTML = MARKUP

    this._arc = this.el.querySelector('.pw-arc')
    this._spinGroup = this.el.querySelector('.pw-spin')
    this._arc.style.strokeDasharray = String(CIRCUMFERENCE)

    this._value = this._clamp(options.value ?? this.el.dataset.value ?? 0)
    this._animate = Boolean(
      options.animate ?? this.el.dataset.animate !== undefined
    )
    this._period = this._normalizePeriod(
      options.period ?? this.el.dataset.period,
      2000
    )

    this.el.setAttribute('role', this.el.getAttribute('role') || 'progressbar')
    this.el.setAttribute('aria-valuemin', '0')
    this.el.setAttribute('aria-valuemax', '100')

    this._render()
  }

  // value
  get value() {
    return this._value
  }
  set value(v) {
    this.setValue(v)
  }
  setValue(v) {
    const clamped = this._clamp(v)
    if (clamped === this._value) return
    this._value = clamped
    this._render()
    this._emitChange()
  }

  // animate
  get animate() {
    return this._animate
  }
  set animate(flag) {
    this.setAnimate(flag)
  }
  setAnimate(flag) {
    const on = Boolean(flag)
    if (on === this._animate) return
    this._animate = on
    this._render()
    this._emitChange()
  }
  toggleAnimate() {
    this.setAnimate(!this._animate)
  }

  // hidden (использую нативное сво-во)
  get hidden() {
    return this.el.hidden
  }
  set hidden(flag) {
    this.setHidden(flag)
  }
  setHidden(flag) {
    const on = Boolean(flag)
    if (on === this.el.hidden) return
    this.el.hidden = on
    this._render()
    this._emitChange()
  }
  toggleHidden() {
    this.setHidden(!this.el.hidden)
  }

  // period
  get period() {
    return this._period
  }
  set period(ms) {
    const p = this._normalizePeriod(ms, this._period)
    if (p === this._period) return
    this._period = p
    this._render()
  }

  // internals
  _clamp(v) {
    let n = Math.round(Number(v))
    if (Number.isNaN(n)) n = 0
    return Math.min(100, Math.max(0, n))
  }

  _normalizePeriod(v, fallback) {
    const p = parseFloat(v)
    return !Number.isNaN(p) && p > 0 ? p : fallback
  }

  _render() {
    const offset = CIRCUMFERENCE * (1 - this._value / 100)
    this._arc.style.strokeDashoffset = String(offset)
    this._spinGroup.style.setProperty('--pw-period', this._period + 'ms')
    this._spinGroup.style.animationPlayState = this._animate
      ? 'running'
      : 'paused'

    this.el.setAttribute('aria-hidden', this.el.hidden ? 'true' : 'false')
    this.el.setAttribute('aria-valuenow', String(this._value))
  }

  _emitChange() {
    this.el.dispatchEvent(
      new CustomEvent('progress-change', {
        bubbles: true,
        detail: {
          value: this._value,
          animate: this._animate,
          hidden: this.el.hidden,
        },
      })
    )
  }
}

window.ProgressWidget = ProgressWidget
