import { lightdm } from 'nody-greeter-types'
import { clickableProps } from './accessability'

export function SessionOptions(props: {
  returnFunc: () => void
  session: string
  setSession: (newValue: string) => void
}) {
  return (
    <>
      {lightdm?.sessions.map((sess) => (
        <div
          className="clickable"
          {...clickableProps(
            () => {
              props.setSession(sess.key)
            },
            `set sesion to ${sess.name}. ${sess.key === props.session ? 'currently selected' : ''}`
          )}
        >
          {sess.name}
          {sess.key === props.session && (
            <span style={{ lineHeight: 1 }}>*</span>
          )}
        </div>
      ))}
      <div
        className="clickable"
        {...clickableProps(props.returnFunc, 'return to main screen')}
      >
        <span className="clickable">{`⟵`}</span>
      </div>
    </>
  )
}
