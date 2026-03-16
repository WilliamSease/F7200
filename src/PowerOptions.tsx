import { lightdm } from 'nody-greeter-types'
import { useState } from 'react'
import { clickableProps } from './accessability'

type entries = 'hibernate' | 'restart' | 'shutdown'
export function PowerOptions(props: { returnFunc: () => void }) {
  const [confirming, setConfirming] = useState<entries | null>(null)
  return (
    <>
      <ConfirmableMenuOption
        showThis={lightdm.can_hibernate}
        name={'hibernate'}
        activeKey={confirming}
        setActive={setConfirming}
        onConfirm={lightdm.hibernate}
      />
      <ConfirmableMenuOption
        showThis={lightdm.can_restart}
        name={'restart'}
        activeKey={confirming}
        setActive={setConfirming}
        onConfirm={lightdm.restart}
      />
      <ConfirmableMenuOption
        showThis={lightdm.can_shutdown}
        name={'shutdown'}
        activeKey={confirming}
        setActive={setConfirming}
        onConfirm={lightdm.shutdown}
      />
      <div
        className="clickable"
        {...clickableProps(props.returnFunc, 'return to main screen')}
      >
        <span className="clickable">{`⟵`}</span>
      </div>
    </>
  )
}

function ConfirmableMenuOption(props: {
  showThis: boolean
  name: entries
  activeKey: entries | null
  setActive: React.Dispatch<React.SetStateAction<entries | null>>
  onConfirm: () => void
}) {
  if (!props.showThis) return <></>
  return props.activeKey === props.name ? (
    <div>
      <span>really?</span>
      <span
        className="clickable"
        style={{ marginLeft: '1rem' }}
        {...clickableProps(props.onConfirm, 'yes')}
      >
        yes
      </span>
      /
      <span
        className="clickable"
        {...clickableProps(() => props.setActive(null), 'no')}
      >
        no
      </span>
    </div>
  ) : (
    <div
      className="clickable"
      {...clickableProps(() => props.setActive(props.name), props.name)}
    >
      {props.name}
    </div>
  )
}
