export type SubtitleFormat = 'srt' | 'ass'

export interface MergeResult {
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

interface AssCaption extends Caption {
  dialogueValues?: string[]
}

interface AssDocument {
  captions: AssCaption[]
  header: string
  formatFields: string[]
}

type ParsedDocument = AssDocument

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

  return (
    (Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])) * 1000 +
    assFractionToMs(match[4])
  )
}

function msToSrtTime(ms: number): string {
  const safeMs = Math.max(0, Math.round(ms))
  const hours = Math.floor(safeMs / 3600000)
  const minutes = Math.floor((safeMs % 3600000) / 60000)
  const seconds = Math.floor((safeMs % 60000) / 1000)
  const milliseconds = safeMs % 1000

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`
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
  const cleanSource = source.replace(/^\uFEFF/, '').trim()
  if (!cleanSource) return []

  return cleanSource
    .split(/\r?\n\s*\r?\n/)
    .map((block) => {
      const lines = block.split(/\r?\n/)
      const timeLineIndex = lines.findIndex((line) => line.includes('-->'))
      if (timeLineIndex < 0) return null

      const [start, end] = lines[timeLineIndex].split('-->')
      return {
        start: srtTimeToMs(start),
        end: srtTimeToMs(end),
        text: lines.slice(timeLineIndex + 1).join('\n'),
      }
    })
    .filter((caption): caption is Caption => caption !== null)
}

function splitAssFields(value: string, fieldCount: number): string[] | null {
  const fields: string[] = []
  let remaining = value

  for (let index = 0; index < fieldCount - 1; index += 1) {
    const commaIndex = remaining.indexOf(',')
    if (commaIndex < 0) return null

    fields.push(remaining.slice(0, commaIndex))
    remaining = remaining.slice(commaIndex + 1)
  }

  fields.push(remaining)
  return fields
}

function parseAssFormatFields(header: string): string[] {
  const lines = header.split(/\r?\n/)
  const eventsIndex = lines.findIndex((line) => /^\[Events\]\s*$/i.test(line.trim()))
  if (eventsIndex < 0) return DEFAULT_ASS_FORMAT_FIELDS

  const formatLine = lines.find(
    (line, index) => index > eventsIndex && /^Format\s*:/i.test(line),
  )

  return formatLine
    ? formatLine
        .slice(formatLine.indexOf(':') + 1)
        .split(',')
        .map((field) => field.trim().toLowerCase())
    : DEFAULT_ASS_FORMAT_FIELDS
}

function convertSrtTextToAss(text: string): string {
  return text
    .replace(/\r?\n/g, '\\N')
    .replace(/<i>/gi, '{\\i1}')
    .replace(/<\/i>/gi, '{\\i0}')
    .replace(/<b>/gi, '{\\b1}')
    .replace(/<\/b>/gi, '{\\b0}')
    .replace(/<u>/gi, '{\\u1}')
    .replace(/<\/u>/gi, '{\\u0}')
}

function convertAssTextToSrt(text: string): string {
  return text
    .replace(/\\N/gi, '\n')
    .replace(/\\n/gi, '\n')
    .replace(/\{\\i1\}/gi, '<i>')
    .replace(/\{\\i0\}/gi, '</i>')
    .replace(/\{\\b1\}/gi, '<b>')
    .replace(/\{\\b0\}/gi, '</b>')
    .replace(/\{\\u1\}/gi, '<u>')
    .replace(/\{\\u0\}/gi, '</u>')
    .replace(/\{[^}]*\}/g, '')
    .trim()
}

function normalizeCaptionText(
  text: string,
  sourceFormat: SubtitleFormat,
  targetFormat: SubtitleFormat,
): string {
  if (sourceFormat === targetFormat) return text
  return targetFormat === 'ass' ? convertSrtTextToAss(text) : convertAssTextToSrt(text)
}

function parseSrtDocument(source: string): ParsedDocument {
  return {
    captions: parseSrt(source),
    header: '',
    formatFields: DEFAULT_ASS_FORMAT_FIELDS,
  }
}

function parseAss(source: string): ParsedDocument {
  const lines = source.replace(/^\uFEFF/, '').split(/\r?\n/)
  const eventsIndex = lines.findIndex((line) => /^\[Events\]\s*$/i.test(line.trim()))

  if (eventsIndex < 0) {
    throw new Error('ASS file has no [Events] section.')
  }

  const formatLine = lines.find(
    (line, index) => index > eventsIndex && /^Format\s*:/i.test(line),
  )

  const fields = formatLine
    ? formatLine
        .slice(formatLine.indexOf(':') + 1)
        .split(',')
        .map((field) => field.trim().toLowerCase())
    : DEFAULT_ASS_FORMAT_FIELDS

  const startIndex = fields.indexOf('start')
  const endIndex = fields.indexOf('end')
  const textIndex = fields.indexOf('text')

  if (startIndex < 0 || endIndex < 0 || textIndex < 0) {
    throw new Error('ASS Events format must contain Start, End, and Text.')
  }

  const captions: AssCaption[] = []

  for (const line of lines.filter((entry) => /^Dialogue\s*:/i.test(entry))) {
    const values = splitAssFields(
      line.slice(line.indexOf(':') + 1).trim(),
      fields.length,
    )

    if (!values) continue

    captions.push({
      start: assTimeToMs(values[startIndex]),
      end: assTimeToMs(values[endIndex]),
      text: values[textIndex],
      dialogueValues: values,
    })
  }

  const firstDialogueIndex = lines.findIndex((line) => /^Dialogue\s*:/i.test(line))
  const header = lines
    .slice(0, firstDialogueIndex < 0 ? lines.length : firstDialogueIndex)
    .join('\r\n')
    .replace(/\r?\n*$/, '')

  return { captions, header, formatFields: fields }
}

function defaultAssHeader(): string {
  return `[Script Info]
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,28,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,0,2,30,30,30,0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`
}

function buildSrt(captions: Caption[]): string {
  return (
    captions
      .map(
        (caption, index) =>
          `${index + 1}\r\n${msToSrtTime(caption.start)} --> ${msToSrtTime(caption.end)}\r\n${caption.text}`,
      )
      .join('\r\n\r\n') + '\r\n'
  )
}

function buildAss(header: string, formatFields: string[], captions: AssCaption[]): string {
  const startIndex = formatFields.indexOf('start')
  const endIndex = formatFields.indexOf('end')
  const textIndex = formatFields.indexOf('text')

  const events = captions.map((caption) => {
    if (caption.dialogueValues && startIndex >= 0 && endIndex >= 0) {
      const values = [...caption.dialogueValues]
      values[startIndex] = msToAssTime(caption.start)
      values[endIndex] = msToAssTime(caption.end)
      if (textIndex >= 0) values[textIndex] = caption.text
      return `Dialogue: ${values.join(',')}`
    }

    return `Dialogue: 0,${msToAssTime(caption.start)},${msToAssTime(caption.end)},Default,,0,0,0,,${caption.text}`
  })

  return `${header}\r\n${events.join('\r\n')}\r\n`
}

export async function mergeSubtitles(
  files: File[],
  outputFormat?: SubtitleFormat,
  gapMs = 100,
): Promise<MergeResult> {
  try {
    if (files.length < 2) {
      return { success: false, error: 'Select at least two subtitle files to merge.' }
    }

    if (!Number.isFinite(gapMs) || gapMs < 0) {
      return { success: false, error: 'The gap must be zero or greater.' }
    }

    const inputFormats = files.map((file) => getFormat(file.name))

    if (inputFormats.some((format) => format === null)) {
      return { success: false, error: 'Only .srt and .ass files are supported.' }
    }

    const targetFormat = outputFormat ?? inputFormats[0]!
    const sources = await Promise.all(files.map((file) => file.text()))

    const documents: ParsedDocument[] = sources.map((source, index) => {
      const format = inputFormats[index]!

      return format === 'ass'
        ? parseAss(source)
        : parseSrtDocument(source)
    })

    const allCaptions: AssCaption[] = []
    let offset = 0

    for (const [documentIndex, document] of documents.entries()) {
      const sourceFormat = inputFormats[documentIndex]!

      for (const caption of document.captions) {
        allCaptions.push({
          start: caption.start + offset,
          end: caption.end + offset,
          text: normalizeCaptionText(caption.text, sourceFormat, targetFormat),
          dialogueValues: sourceFormat === 'ass' && targetFormat === 'ass'
            ? caption.dialogueValues
            : undefined,
        })
      }

      const lastEnd = document.captions.reduce(
        (maximum, caption) => Math.max(maximum, caption.end),
        0,
      )

      offset += lastEnd + gapMs
    }

    if (allCaptions.length === 0) {
      return { success: false, error: 'The selected files contain no subtitle entries.' }
    }

    const assSource = documents.find((document) => document.header)
    const assHeader = assSource?.header ?? defaultAssHeader()
    const assFormatFields = assSource?.formatFields ?? DEFAULT_ASS_FORMAT_FIELDS

    const content =
      targetFormat === 'ass'
        ? buildAss(assHeader, assFormatFields, allCaptions)
        : buildSrt(allCaptions)

    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    })

    const firstFileName = files[0].name.replace(/\.(srt|ass)$/i, '')

    return {
      success: true,
      blob,
      filename: `${firstFileName}_merged.${targetFormat}`,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Merging failed.',
    }
  }
}

