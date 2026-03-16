import { isNil } from 'lodash'
import type { ConfigType } from './hooks/useValidateConfig'

export function Logo(props: { configObject: ConfigType }) {
  return !isNil(props.configObject.logo) ? (
    <img
      src={props.configObject.logo.path}
      style={{
        height: `${props.configObject.logo.heightREM}rem`,
      }}
    />
  ) : (
    <></>
  )
}
