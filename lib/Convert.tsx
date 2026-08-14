export type SubtitleFormat = 'srt' | 'ass'

export interface ConvertResult {
  success: boolean
  blob?: Blob
  filename?: string
  error?: string
}

interface Caption {
  start: number
  end: number
  text: string
}

export function extensionOf(name: string): SubtitleFormat | null {
  const extension = name.split('.').pop()?.toLowerCase()
  return extension === 'srt' || extension === 'ass' ? extension : null
}

export function formatLabel(format: SubtitleFormat): string {
  return format.toUpperCase()
}

export function formatExtension(format: SubtitleFormat): string {
  return `.${format}`
}

function srtTimeToMs(value: string): number {
  const normalized = value
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/\s+/g, '')

  const match = normalized.match(
    /^(\d+):([0-5]?\d):([0-5]?\d)[,.](\d{1,3})$/
  )

  if (!match) {
    throw new Error(`Invalid SRT timestamp: ${value.trim()}`)
  }

  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3])
  const milliseconds = Number(match[4].padEnd(3, '0'))

  return ((hours * 3600 + minutes * 60 + seconds) * 1000) + milliseconds
}

function assFractionToMs(fraction: string): number {
  const normalized = fraction.padEnd(2, '0').slice(0, 2)
  return Number(normalized) * 10
}

function assTimeToMs(value: string): number {
  const match = value.trim().match(/^(\d+):(\d{1,2}):(\d{1,2})[\.:](\d{1,2})$/)
  if (!match) throw new Error(`Invalid ASS timestamp: ${value}`)
  return ((Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])) * 1000) + assFractionToMs(match[4])
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

function msToSrtTime(ms: number): string {
  const safeMs = Math.max(0, Math.round(ms))
  const hours = Math.floor(safeMs / 3600000)
  const minutes = Math.floor((safeMs % 3600000) / 60000)
  const seconds = Math.floor((safeMs % 60000) / 1000)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(safeMs % 1000, 3)}`
}

function msToAssTime(ms: number): string {
  const safeMs = Math.max(0, Math.round(ms))
  const hours = Math.floor(safeMs / 3600000)
  const minutes = Math.floor((safeMs % 3600000) / 60000)
  const seconds = Math.floor((safeMs % 60000) / 1000)
  const centiseconds = Math.floor((safeMs % 1000) / 10)
  return `${hours}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
}

function parseSrt(source: string): Caption[] {
  return source.replace(/^\uFEFF/, '').trim().split(/\r?\n\s*\r?\n/).map((block) => {
    const lines = block.split(/\r?\n/)
    const timeLineIndex = lines.findIndex((line) => line.includes('-->'))
    if (timeLineIndex < 0) return null

    const [start, end] = lines[timeLineIndex].split('-->')
    return {
      start: srtTimeToMs(start),
      end: srtTimeToMs(end),
      text: lines.slice(timeLineIndex + 1).join('\\N'),
    }
  }).filter((caption): caption is Caption => caption !== null)
}

function convertSrtTextToAss(text: string, preserveStyling: boolean): string {
  if (!preserveStyling) {
    return text.replace(/<\/?(?:i|b|u)>/gi, '')
  }

  return text
    .replace(/<i>/gi, '{\\i1}')
    .replace(/<\/i>/gi, '{\\i0}')
    .replace(/<b>/gi, '{\\b1}')
    .replace(/<\/b>/gi, '{\\b0}')
    .replace(/<u>/gi, '{\\u1}')
    .replace(/<\/u>/gi, '{\\u0}')
}

function srtToAss(source: string, preserveStyling: boolean): string {
  const captions = parseSrt(source)
  if (captions.length === 0) throw new Error('The subtitle file contains no dialogue entries.')

  const header = `[Script Info]\r\nScriptType: v4.00+\r\n\r\n[V4+ Styles]\r\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\r\nStyle: Default,Arial,28,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,0,2,30,30,30,0\r\n\r\n[Events]\r\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\r\n`
  const events = captions.map((caption) => `Dialogue: 0,${msToAssTime(caption.start)},${msToAssTime(caption.end)},Default,,0,0,0,,${convertSrtTextToAss(caption.text, preserveStyling)}`)
  return `${header}${events.join('\r\n')}\r\n`
}

function splitAssFields(value: string, count: number): string[] | null {
  const fields: string[] = []
  let remaining = value
  for (let index = 0; index < count - 1; index += 1) {
    const comma = remaining.indexOf(',')
    if (comma < 0) return null
    fields.push(remaining.slice(0, comma))
    remaining = remaining.slice(comma + 1)
  }
  fields.push(remaining)
  return fields
}

function convertAssTextToSrt(text: string, preserveStyling: boolean): string {
  let converted = text
    .replace(/\\N/gi, '\n')
    .replace(/\\n/gi, '\n')

  if (!preserveStyling) {
    return converted.replace(/\{[^}]*\}/g, '').trim()
  }

  converted = converted
    .replace(/\{\\i1\}/gi, '<i>')
    .replace(/\{\\i0\}/gi, '</i>')
    .replace(/\{\\b1\}/gi, '<b>')
    .replace(/\{\\b0\}/gi, '</b>')
    .replace(/\{\\u1\}/gi, '<u>')
    .replace(/\{\\u0\}/gi, '</u>')

  return converted.replace(/\{[^}]*\}/g, '').trim()
}

function assToSrt(source: string, preserveStyling: boolean): string {
  const lines = source.replace(/^\uFEFF/, '').split(/\r?\n/)
  const eventsIndex = lines.findIndex((line) => /^\[Events\]\s*$/i.test(line.trim()))
  if (eventsIndex < 0) throw new Error('ASS file has no [Events] section.')

  const formatLine = lines.find(
    (line, index) => index > eventsIndex && /^Format\s*:/i.test(line)
  )
  const fields = formatLine
    ? formatLine.slice(formatLine.indexOf(':') + 1).split(',').map((field) => field.trim().toLowerCase())
    : ['layer', 'start', 'end', 'style', 'name', 'marginl', 'marginr', 'marginv', 'effect', 'text']
  const startIndex = fields.indexOf('start')
  const endIndex = fields.indexOf('end')
  const textIndex = fields.indexOf('text')
  if (startIndex < 0 || endIndex < 0 || textIndex < 0) throw new Error('ASS file has no usable Events format.')

  const captions = lines.filter((line) => /^Dialogue\s*:/i.test(line)).map((line) => {
    const values = splitAssFields(line.slice(line.indexOf(':') + 1).trim(), fields.length)
    if (!values) return null
    const text = convertAssTextToSrt(values[textIndex], preserveStyling)
    return { start: assTimeToMs(values[startIndex]), end: assTimeToMs(values[endIndex]), text }
  }).filter((caption): caption is Caption => caption !== null)

  if (captions.length === 0) throw new Error('The subtitle file contains no dialogue entries.')

  return captions.map((caption, index) => `${index + 1}\r\n${msToSrtTime(caption.start)} --> ${msToSrtTime(caption.end)}\r\n${caption.text}`).join('\r\n\r\n') + '\r\n'
}

export async function convertSubtitle(
  file: File,
  targetFormat: SubtitleFormat,
  preserveStyling = true,
): Promise<ConvertResult> {
  try {
    const inputFormat = extensionOf(file.name)
    if (!inputFormat) return { success: false, error: 'Only .srt and .ass files are supported.' }
    if (inputFormat === targetFormat) return { success: false, error: `The file is already ${formatExtension(targetFormat)}.` }

    const source = await file.text()
    const converted = inputFormat === 'srt'
      ? srtToAss(source, preserveStyling)
      : assToSrt(source, preserveStyling)
    const baseName = file.name.replace(/\.(srt|ass)$/i, '')
    const filename = `${baseName}.${targetFormat}`
    return { success: true, blob: new Blob([converted], { type: 'text/plain;charset=utf-8' }), filename }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Conversion failed.' }
  }
}
