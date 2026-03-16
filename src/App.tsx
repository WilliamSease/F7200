import * as nody from 'nody-greeter-types'
import './App.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PowerOptions } from './PowerOptions'
import { SessionOptions } from './SessionOptions'
import { Utilities } from './Utilities'
import { FlavorText } from './FlavorText'
import { DateTime } from './DateTime'
import { useValidateConfig } from './hooks/useValidateConfig'
import { isNil } from 'lodash'
import { Logo } from './Logo'
import { clickableProps } from './accessability'

function App() {
  const config = useValidateConfig()

  const isPrimaryScreen = window.screenLeft === 0 || window.screenX === 0

  const [state, setState] = useState<'prep' | 'firing' | 'fail' | 'okay'>(
    'prep'
  )

  const [userName, setUserName] = useState<string | null>('') //sentinel value null -- guest mode
  const usernameFieldRef = useRef<HTMLInputElement>(null)

  const [password, setPasswordState] = useState('')
  const setPassword = useCallback((word: string) => {
    setPasswordState(word)
    passRef.current = word
  }, [])
  const passRef = useRef(password)
  const passwordFieldRef = useRef<HTMLInputElement>(null)
  const [passInClear, setPassInClear] = useState(false)

  const [validation, setValidation] = useState<
    'nouser' | 'nopass' | undefined
  >()
  useEffect(() => {
    if (validation !== undefined) {
      setTimeout(() => setValidation(undefined), 500)
    }
  }, [validation])
  const loginInvoke = useCallback(() => {
    if (userName === null && nody.lightdm.has_guest_account) {
      nody.lightdm.authenticate_as_guest()
    } else {
      if (userName === '') {
        setValidation('nouser')
      } else if (password === '') {
        setValidation('nopass')
      } else {
        setState('firing')
        nody.lightdm.authenticate(userName)
      }
    }
  }, [userName, password])

  const [session, setSessionState] = useState<string>(
    nody.lightdm.default_session
  )
  const sessRef = useRef(session)
  const setSession = useCallback((sess: string) => {
    setSessionState(sess)
    sessRef.current = sess
  }, [])

  useEffect(() => {
    //init
    nody.lightdm.authentication_complete.connect(() => {
      if (nody.lightdm.is_authenticated) {
        setState('okay')
        setTimeout(() => nody.lightdm.start_session(sessRef.current), 200)
      } else {
        setUserName('')
        setPassword('')
        usernameFieldRef.current?.focus()
        setState('fail')
        setTimeout(() => setState('prep'), 500)

        nody.lightdm.cancel_authentication()
      }
    })
    nody.lightdm.show_prompt.connect((_message, _type) => {
      nody.lightdm.respond(passRef.current)
    })
    setTimeout(() => usernameFieldRef.current?.focus(), 100)
  }, [])

  const [screen, setScreen] = useState<'main' | 'user' | 'power' | 'session'>(
    'main'
  )

  return isNil(config) ? (
    <div>wait...</div>
  ) : isPrimaryScreen ? (
    <div style={{ alignSelf: 'center', width: '100%' }}>
      <div style={{ marginLeft: `${config.mainText.leftMarginPercent}%` }}>
        {screen === 'main' && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column' }}
              className="field"
            >
              <div className="cell">
                user
                <span
                  className="clickable"
                  {...clickableProps(() => setScreen('user'), 'user screen')}
                >
                  ?
                </span>
              </div>
              <div className="cell">
                pass
                <span
                  className={`clickable ${passInClear ? 'active' : ''}`}
                  {...clickableProps(
                    () => setPassInClear((e) => !e),
                    'show password in clear'
                  )}
                >
                  {`!`}
                </span>
              </div>
              <Utilities setScreen={setScreen} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="cell">
                {userName === null ? (
                  <span className="input">
                    {'<guest>'}
                    <span
                      className="clickable"
                      {...clickableProps(
                        () => setUserName(''),
                        'clear guest session seleection'
                      )}
                    >
                      {'x'}
                    </span>
                  </span>
                ) : validation === 'nouser' ? (
                  <span style={{ lineHeight: 1 }}>‼</span>
                ) : (
                  <input
                    className="input"
                    value={userName === null ? '<guest>' : userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && passwordFieldRef.current?.focus()
                    }
                    ref={usernameFieldRef}
                  />
                )}
              </div>
              <div className="cell">
                {validation === 'nopass' ? (
                  <span style={{ lineHeight: 1 }}>‼</span>
                ) : (
                  <input
                    ref={passwordFieldRef}
                    className="input"
                    value={password}
                    type={passInClear ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loginInvoke()}
                  />
                )}
              </div>
              <div
                className="cell"
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <span>
                  {state === 'fail' ? (
                    <span>↯</span>
                  ) : state === 'firing' ? (
                    <span>⟿</span>
                  ) : state === 'okay' ? (
                    <span>→⟴</span>
                  ) : (
                    <span
                      {...clickableProps(loginInvoke, 'login')}
                      className="clickable"
                      style={{ position: 'relative' }}
                    >
                      {`⟶`}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
        {screen === 'user' && (
          <>
            {nody?.lightdm?.users.map((user) => (
              <div
                className="clickable"
                {...clickableProps(() => {
                  setUserName(user.username)
                  setScreen('main')
                }, `choose user ${user.username}`)}
              >
                {user.display_name}
              </div>
            ))}
            {nody.lightdm.has_guest_account && (
              <div
                className="clickable"
                {...clickableProps(() => {
                  setUserName(null)
                  setPassInClear(false)
                  setPassword('')
                  setScreen('main')
                }, 'choose guest user')}
              >
                {'<guest>'}
              </div>
            )}
            <div
              className="clickable"
              {...clickableProps(() => {
                setScreen('main')
              }, 'return to main screen')}
            >
              <span className="clickable">{`⟵`}</span>
            </div>
          </>
        )}
        {screen === 'session' && (
          <SessionOptions
            returnFunc={() => setScreen('main')}
            session={session}
            setSession={setSession}
          />
        )}
        {screen === 'power' && (
          <PowerOptions returnFunc={() => setScreen('main')} />
        )}
        <FlavorText configObject={config} />
        <div
          style={{
            bottom: '.5rem',
            right: '.5rem',
            position: 'fixed',
          }}
        >
          <Logo configObject={config} />
          <DateTime configObject={config} />
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default App
