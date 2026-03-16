import * as nody from 'nody-greeter-types'
import { clickableProps } from './accessability'

export function Utilities(props: {
  setScreen: (newScreen: 'main' | 'user' | 'power' | 'session') => void
}) {
  return (
    <div className="cell">
      <span
        className="clickable"
        {...clickableProps(() => props.setScreen('power'), 'power options')}
      >
        ☒
      </span>
      <span
        className="clickable"
        {...clickableProps(() => props.setScreen('session'), 'session options')}
      >
        ⚙
      </span>
      {nody.lightdm?.battery_data?.level !== undefined && (
        <span style={{ marginLeft: '.5rem' }}>
          {`${nody.lightdm?.battery_data?.level <= 25 ? '–' : '⌁'}${
            nody.lightdm?.battery_data?.level <= 50 ? '–' : '⌁'
          }${nody.lightdm?.battery_data?.level <= 75 ? '–' : '⌁'}`}
        </span>
      )}
    </div>
  )
}
