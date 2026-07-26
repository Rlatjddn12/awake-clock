import { useEffect, useRef, useState } from 'react'

const FLIP_MS = 300

function FlipCard({ digit }) {
  const [displayDigit, setDisplayDigit] = useState(digit)
  const [flapDigit, setFlapDigit] = useState(null)
  const prevRef = useRef(digit)
  const timerRef = useRef(null)

  useEffect(() => {
    if (digit === prevRef.current) return
    const old = prevRef.current
    prevRef.current = digit

    clearTimeout(timerRef.current)
    setFlapDigit(old)
    timerRef.current = setTimeout(() => {
      setDisplayDigit(digit)
      setFlapDigit(null)
    }, FLIP_MS)
  }, [digit])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div className="flip-card">
      <div className="flip-card-digit">{displayDigit}</div>
      {flapDigit !== null && (
        <div className="flip-flap" key={flapDigit}>
          <div className="flip-flap-digit">{flapDigit}</div>
        </div>
      )}
      <div className="flip-card-crease" />
    </div>
  )
}

export default function FlipClock({ hms }) {
  const digits = hms.split('')

  const group = (start, end) => (
    <div className="flip-group">
      {digits.slice(start, end).map((d, i) => (
        <FlipCard key={start + i} digit={d} />
      ))}
    </div>
  )

  return (
    <div className="flip-clock">
      {group(0, 2)}
      <span className="clock-colon">:</span>
      {group(2, 4)}
      <span className="clock-colon">:</span>
      {group(4, 6)}
    </div>
  )
}
