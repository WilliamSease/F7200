import { isNil } from 'lodash'
import type { ConfigType } from './hooks/useValidateConfig'

export function FlavorText(props: { configObject: ConfigType }) {
  return !isNil(props.configObject.flavorText) ? (
    <div className="flavortext">{props.configObject.flavorText?.textValue}</div>
  ) : (
    <></>
  )
}
