import React from 'react'

export default function Keyboard({ onKey }: { onKey: (k: string) => void }) {
  const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  return (
    <div className="keyboard">
      {keys.map(k => (
        <div key={k} className="key" onClick={() => onKey(k)}>{k}</div>
      ))}
    </div>
  )
}
