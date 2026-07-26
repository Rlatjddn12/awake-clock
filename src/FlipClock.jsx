import { useEffect, useRef, useState } from 'react'

const FLIP_MS = 300

function useDigitFlips(digits) {
  const prevRef = useRef(digits)
  const timeoutsRef = useRef([])
  const [flips, setFlips] = useState(() => digits.map(() => null))

  useEffect(() => {
    const prev = prevRef.current
    const changed = []
    digits.forEach((d, i) => {
      if (d !== prev[i]) changed.push(i)
    })

    if (changed.length) {
      setFlips((current) => {
        const next = [...current]
        changed.forEach((i) => {
          next[i] = prev[i]
        })
        return next
      })
      changed.forEach((i) => {
        clearTimeout(timeoutsRef.current[i])
        timeoutsRef.current[i] = setTimeout(() => {
          setFlips((current) => {
            const next = [...current]
            next[i] = null
            return next
          })
        }, FLIP_MS)
      })
    }

    prevRef.current = digits
  }, [digits.join('')])

  return flips
}

function FlipCard({ digit, prevDigit }) {
  const flipping = prevDigit !== null && prevDigit !== undefined

  return (
    <div className="flip-card">
      <div className="flip-card-digit">{digit}</div>
      {flipping && (
        <div className="flip-flap" key={`${prevDigit}-${digit}`}>
          <div className="flip-flap-digit">{prevDigit}</div>
        </div>
      )}
      <div className="flip-card-crease" />
    </div>
  )
}

export default function FlipClock({ hms }) {
  const digits = hms.split('')
  const flips = useDigitFlips(digits)

  const group = (start, end) => (
    <div className="flip-group">
      {digits.slice(start, end).map((d, i) => (
        <FlipCard key={start + i} digit={d} prevDigit={flips[start + i]} />
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
