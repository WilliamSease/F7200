import { useEffect, useState } from 'react'
import type { ConfigType } from './hooks/useValidateConfig'
import { isNil } from 'lodash'

export function DateTime(props: { configObject: ConfigType }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      setTime(`${h}${m}`)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const [date, setDate] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const d = String(now.getDate()).padStart(2, '0')
      const m = String(now.getMonth() + 1).padStart(2, '0')
      const y = String(now.getFullYear()).slice(-2)
      setDate(`${d}${m}${y}`)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  return !isNil(props.configObject.clockDate) &&
    (props.configObject.clockDate.showClock ||
      props.configObject.clockDate.showDate) ? (
    <div className="datetime">
      {props.configObject.clockDate.showClock && (
        <span style={{ marginRight: '1rem' }}>{time}</span>
      )}
      {props.configObject.clockDate.showDate && <span>{date}</span>}
    </div>
  ) : (
    <></>
  )
}
