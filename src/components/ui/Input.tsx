import { useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
  help?: string
  trailing?: ReactNode
}
export function Input({ label, icon, error, help, trailing, className = '', ...rest }: InputProps) {
  return (
    <label className={`stack ${className}`}>
      {label && <span className="field-label">{label}</span>}
      <span className={`field ${error ? 'error' : ''}`}>
        {icon && <span className="c-secondary row">{icon}</span>}
        <input {...rest} />
        {trailing}
      </span>
      {(error || help) && <span className={`field-help ${error ? 'error' : ''}`}>{error || help}</span>}
    </label>
  )
}

export function TextArea({ label, value, onChange, placeholder, icon }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: ReactNode }) {
  return (
    <label className="stack">
      {label && <span className="field-label">{label}</span>}
      <span className="field area">
        {icon && <span className="c-secondary row" style={{ paddingTop: 1 }}>{icon}</span>}
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} />
      </span>
    </label>
  )
}

export function OtpInput({ length = 6, value, onChange }: { length?: number; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [focus, setFocus] = useState(true)
  useEffect(() => { ref.current?.focus() }, [])
  return (
    <div className="row gap-8" style={{ position: 'relative' }} onClick={() => ref.current?.focus()}>
      {Array.from({ length }).map((_, i) => {
        const ch = value[i]
        const isFocus = focus && i === Math.min(value.length, length - 1) && value.length < length
        return (
          <div key={i} className={`otp-cell ${isFocus ? 'focus' : ''}`}>
            {ch ? <span style={{ animation: 'none' }}>{ch}</span> : isFocus ? <span className="caret" /> : null}
          </div>
        )
      })}
      <input
        ref={ref}
        value={value}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="Verification code"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
        style={{ position: 'absolute', inset: 0, opacity: 0 }}
      />
    </div>
  )
}
