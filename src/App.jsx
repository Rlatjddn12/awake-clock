import { useEffect, useState } from 'react'
import FlipClock from './FlipClock.jsx'

const WAKE_KEY = 'awake-clock:wake'
const BED_KEY = 'awake-clock:bed'

function toSec(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 3600 + m * 60
}

function mod86400(n) {
  return ((n % 86400) + 86400) % 86400
}

function nowToSec(date) {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
}

function formatDigits(totalSec) {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = Math.floor(totalSec % 60)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(h)}${pad(m)}${pad(s)}`
}

export default function App() {
  const [wakeTime, setWakeTime] = useState(
    () => localStorage.getItem(WAKE_KEY) || '07:00'
  )
  const [bedTime, setBedTime] = useState(
    () => localStorage.getItem(BED_KEY) || '23:00'
  )
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    localStorage.setItem(WAKE_KEY, wakeTime)
  }, [wakeTime])

  useEffect(() => {
    localStorage.setItem(BED_KEY, bedTime)
  }, [bedTime])

  const wakeSec = toSec(wakeTime)
  const bedSec = toSec(bedTime)
  const awakeDur = mod86400(bedSec - wakeSec)
  const sleepDur = 86400 - awakeDur
  const nowSec = nowToSec(now)
  const relNow = mod86400(nowSec - wakeSec)

  const isAwake = relNow < awakeDur
  const remaining = isAwake ? awakeDur - relNow : 86400 - relNow
  const label = isAwake ? '오늘 남은 시간' : '취침 중 · 기상까지'

  const phaseTotal = isAwake ? awakeDur : sleepDur
  const phaseElapsed = isAwake ? relNow : relNow - awakeDur
  const percent = phaseTotal > 0 ? (phaseElapsed / phaseTotal) * 100 : 0

  const openPicker = (e) => {
    try {
      e.target.showPicker?.()
    } catch {
      /* unsupported browser — focus alone still opens the native picker on most */
    }
  }

  const clampedPercent = Math.min(100, Math.max(0, percent))
  const remainingPercent = Math.round(100 - clampedPercent)

  return (
    <div className="app">
      <div className="hero">
        <div className="phase-label">{label}</div>
        <FlipClock hms={formatDigits(remaining)} />
      </div>

      <div className="progress-block">
        <div className="progress">
          <div className="progress-fill" style={{ width: `${clampedPercent}%` }} />
        </div>
        <div className="progress-meta">
          <span>{remainingPercent}% 남음</span>
        </div>
      </div>

      <div className="filler" />

      <div className="controls">
        <div className="pill">
          <input
            type="time"
            className="pill-input"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            onClick={openPicker}
            aria-label="기상 시간"
          />
          <span className="pill-label">{wakeTime} 기상</span>
        </div>
        <div className="pill">
          <input
            type="time"
            className="pill-input"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            onClick={openPicker}
            aria-label="취침 시간"
          />
          <span className="pill-label">{bedTime} 취침</span>
        </div>
      </div>
    </div>
  )
}
