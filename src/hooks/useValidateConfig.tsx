import { useEffect, useState } from 'react'

import { z } from 'zod'

const RawConfigSchema = z.object({
  mainText: z.object({
    font: z.string(),
    fontSizeInREM: z.number(),
    leftMarginPercent: z.number(),
  }),

  flavorText: z.optional(
    z.object({
      sizeREM: z.number(),
      font: z.string(),
      textValue: z.string(),
    })
  ),

  clockDate: z.optional(
    z.object({
      showClock: z.boolean(),
      showDate: z.boolean(),
      font: z.string(),
      sizeREM: z.number(),
    })
  ),

  logo: z.optional(
    z.object({
      path: z.string(),
      heightREM: z.number(),
    })
  ),

  background: z.optional(
    z.object({
      path: z.string(),
    })
  ),
})

const ColorSchemeSchema = z.object({
  background: z.string(),
  foreground: z.string(),
  hover: z.string(),
  flavorText: z.string(),
  dateTime: z.string(),
  description: z.string(),
})

type RawConfigType = z.infer<typeof RawConfigSchema>
type ColorScheme = z.infer<typeof ColorSchemeSchema>

export type ConfigType = RawConfigType & { colorScheme: ColorScheme }

export const useValidateConfig = () => {
  const [configOut, setConfigOut] = useState<ConfigType>()

  useEffect(() => {
    const base = window.location.href.replace(/index\.html.*$/, '')
    Promise.all([
      loadJson(`${base}OPTIONS.json`),
      loadJson(`${base}colorSchemes.json`),
    ]).then(([config, { colorSchemes }]) => {
      const rawConfig = config as RawConfigType

      const configVal = RawConfigSchema.safeParse(rawConfig)
      if (!configVal.success) {
        configVal.error.issues.forEach((i) =>
          console.error(`F7200 config: ${i.path} — ${i.message}`)
        )
      }

      const rawSelectedScheme = (colorSchemes as any)[
        config.colorScheme
      ] as ColorScheme

      const colorVal = ColorSchemeSchema.safeParse(rawSelectedScheme)
      if (!colorVal.success) {
        colorVal.error.issues.forEach((i) =>
          console.error(
            `F7200 referenced color scheme (${config.colorScheme}): ${i.path} — ${i.message}`
          )
        )
      }

      const fullConfig: ConfigType = {
        ...rawConfig,
        colorScheme: rawSelectedScheme,
      }

      addStyle(fullConfig)
      setConfigOut(fullConfig)
    })
  }, [])

  return configOut
}

function addStyle(config: ConfigType) {
  const style = document.createElement('style')
  const isPrimaryScreen = window.screenLeft === 0 || window.screenX === 0

  style.textContent = `

  @font-face {
    font-family: 'MyFont';
    src: url('${config.mainText.font}') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  body {
  background-image: url(${isPrimaryScreen ? config.background?.path : ''});
  background-size: cover;
  background-color:${config.colorScheme.background};
  font-family: 'MyFont', sans-serif;
}

html {
  font-size: ${config.mainText.fontSizeInREM}rem;
  color: ${config.colorScheme.foreground}
}

.clickable:hover {
  color: ${config.colorScheme.hover ?? 'white'};
}

.active {
  color: ${config.colorScheme.hover ?? 'white'}
}

@font-face {
    font-family: 'FlavorText';
    src: url('${config.flavorText?.font}') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

.flavortext {
  color:${config.colorScheme.flavorText};
  font-family: 'FlavorText';
  font-size: ${config.flavorText?.sizeREM}rem;
  font-weight: normal;
  font-style: normal;
  position: fixed;
  bottom: .5rem;
  left: .5rem;
}

@font-face {
    font-family: 'DateTime';
    src: url('${config.clockDate?.font}') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

.datetime {
  color:${config.colorScheme.dateTime};
  font-family: 'DateTime';
  font-size: ${config.clockDate?.sizeREM}rem;
  font-weight: normal;
  font-style: normal;
}

`
  document.head.appendChild(style)
}

const loadJson = (path: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', path)
    xhr.onload = () => resolve(JSON.parse(xhr.responseText))
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send()
  })
}
