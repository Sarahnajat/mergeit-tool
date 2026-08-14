export type SubtitleFormat = 'srt' | 'ass'
export type SplitMethod = 'duration' | 'lines' | 'files'

export interface SplitOptions {
  method: SplitMethod

  value: number
}

export interface SplitPart {
  index: number
  filename: string
  blob: Blob
}

export interface SplitResult {
  success: boolean
  parts?: SplitPart[]
  error?: string
}

interface Caption {
  start: number
  end: number
  text: string
}

interface AssCaption extends Caption {
  dialogueValues: string[]
}

interface AssDocument {
  captions: AssCaption[]
  header: string
  formatFields: string[]
}

const DEFAULT_ASS_FORMAT_FIELDS = [
  'layer', 'start', 'end', 'style', 'name', 'marginl', 'marginr', 'marginv', 'effect', 'text',
]

function getFormat(name: string): SubtitleFormat | null {
  const extension = name.split('.').pop()?.toLowerCase()
  return extension === 'srt' || extension === 'ass' ? extension : null
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
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
      text: lines.slice(timeLineIndex + 1).join('\n'),
    }
  }).filter((caption): caption is Caption => caption !== null)
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

function parseAss(source: string): AssDocument {
  const lines = source.replace(/^\uFEFF/, '').split(/\r?\n/)
  const eventsIndex = lines.findIndex((line) => /^\[Events\]\s*$/i.test(line.trim()))
  if (eventsIndex < 0) throw new Error('ASS file has no [Events] section.')

  const formatLine = lines.find((line, index) => index > eventsIndex && /^Format\s*:/i.test(line))
  const fields = formatLine
    ? formatLine.slice(formatLine.indexOf(':') + 1).split(',').map((field) => field.trim().toLowerCase())
    : DEFAULT_ASS_FORMAT_FIELDS
  const startIndex = fields.indexOf('start')
  const endIndex = fields.indexOf('end')
  const textIndex = fields.indexOf('text')
  if (startIndex < 0 || endIndex < 0 || textIndex < 0) throw new Error('ASS Events format must contain Start, End, and Text.')

  const captions = lines.filter((line) => /^Dialogue\s*:/i.test(line)).map((line) => {
    const values = splitAssFields(line.slice(line.indexOf(':') + 1).trim(), fields.length)
    if (!values) return null
    return {
      start: assTimeToMs(values[startIndex]),
      end: assTimeToMs(values[endIndex]),
      text: values[textIndex],
      dialogueValues: values,
    }
  }).filter((caption): caption is AssCaption => caption !== null)

  const firstDialogueIndex = lines.findIndex((line) => /^Dialogue\s*:/i.test(line))
  const header = lines.slice(0, firstDialogueIndex < 0 ? lines.length : firstDialogueIndex).join('\r\n').replace(/\r?\n*$/, '')
  return { captions, header, formatFields: fields }
}

function buildSrt(captions: Caption[]): string {
  return captions.map((caption, index) => `${index + 1}\r\n${msToSrtTime(caption.start)} --> ${msToSrtTime(caption.end)}\r\n${caption.text}`).join('\r\n\r\n') + '\r\n'
}

function buildAss(document: AssDocument, captions: AssCaption[]): string {
  const startIndex = document.formatFields.indexOf('start')
  const endIndex = document.formatFields.indexOf('end')
  const textIndex = document.formatFields.indexOf('text')

  const events = captions.map((caption) => {
    const values = [...caption.dialogueValues]
    values[startIndex] = msToAssTime(caption.start)
    values[endIndex] = msToAssTime(caption.end)
    if (textIndex >= 0) values[textIndex] = caption.text
    return `Dialogue: ${values.join(',')}`
  })

  return `${document.header}\r\n${events.join('\r\n')}\r\n`
}

function makeGroups(captions: Caption[], options: SplitOptions): Caption[][] {
  if (!Number.isFinite(options.value) || options.value <= 0) throw new Error('Split value must be greater than zero.')
  if (captions.length === 0) throw new Error('The subtitle file contains no dialogue entries.')

  if (options.method === 'lines') {
    const size = Math.max(1, Math.floor(options.value))
    const groups: Caption[][] = []
    for (let index = 0; index < captions.length; index += size) groups.push(captions.slice(index, index + size))
    return groups
  }

  if (options.method === 'files') {
    const count = Math.min(captions.length, Math.max(1, Math.floor(options.value)))
    const groups: Caption[][] = []
    for (let index = 0; index < count; index += 1) {
      const start = Math.floor(index * captions.length / count)
      const end = Math.floor((index + 1) * captions.length / count)
      groups.push(captions.slice(start, end))
    }
    return groups.filter((group) => group.length > 0)
  }

  const durationMs = options.value * 60 * 1000
  const firstStart = captions[0].start
  const groups: Caption[][] = []
  let group: Caption[] = []
  let boundary = firstStart + durationMs
  for (const caption of captions) {
    if (group.length > 0 && caption.start >= boundary) {
      groups.push(group)
      group = []
      boundary = caption.start + durationMs
    }
    group.push(caption)
  }
  if (group.length > 0) groups.push(group)
  return groups
}

export async function splitSubtitle(file: File, options: SplitOptions): Promise<SplitResult> {
  try {
    const format = getFormat(file.name)
    if (!format) return { success: false, error: 'Only .srt and .ass files are supported.' }

    const source = await file.text()
    const document = format === 'ass' ? parseAss(source) : null
    const captions = format === 'ass' ? document!.captions : parseSrt(source)
    const groups = makeGroups(captions, options)
    const baseName = file.name.replace(/\.(srt|ass)$/i, '')

    const parts = groups.map((group, index) => {
      const content = format === 'ass'
        ? buildAss(document!, group as AssCaption[])
        : buildSrt(group)
      const filename = `${baseName}_part_${pad(index + 1)}.${format}`
      return { index: index + 1, filename, blob: new Blob([content], { type: 'text/plain;charset=utf-8' }) }
    })

    return { success: true, parts }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Splitting failed.' }
  }
}
