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

interface AssDocument {
  captions: Caption[]
  header: string
}

function getFormat(name: string): SubtitleFormat | null {
  const extension = name.split('.').pop()?.toLowerCase()
  return extension === 'srt' || extension === 'ass' ? extension : null
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

function srtTimeToMs(value: string): number {
  const match = value.trim().match(/^(\d+):(\d{2}):(\d{2})[,\.](\d{3})$/)
  if (!match) throw new Error(`Invalid SRT timestamp: ${value}`)

  return (
    (Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])) * 1000 +
    Number(match[4])
  )
}

function assTimeToMs(value: string): number {
  const match = value.trim().match(/^(\d+):(\d{1,2}):(\d{1,2})[\.:](\d{1,2})$/)
  if (!match) throw new Error(`Invalid ASS timestamp: ${value}`)

  return (
    (Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])) * 1000 +
    Number(match[4]) * 10
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

function parseAss(source: string): AssDocument {
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
    : ['layer', 'start', 'end', 'style', 'name', 'marginl', 'marginr', 'marginv', 'effect', 'text']

  const startIndex = fields.indexOf('start')
  const endIndex = fields.indexOf('end')
  const textIndex = fields.indexOf('text')

  if (startIndex < 0 || endIndex < 0 || textIndex < 0) {
    throw new Error('ASS Events format must contain Start, End, and Text.')
  }

  const captions = lines
    .filter((line) => /^Dialogue\s*:/i.test(line))
    .map((line) => {
      const values = splitAssFields(
        line.slice(line.indexOf(':') + 1).trim(),
        fields.length,
      )

      if (!values) return null

      return {
        start: assTimeToMs(values[startIndex]),
        end: assTimeToMs(values[endIndex]),
        text: values[textIndex],
      }
    })
    .filter((caption): caption is Caption => caption !== null)

  const firstDialogueIndex = lines.findIndex((line) => /^Dialogue\s*:/i.test(line))
  const header = lines
    .slice(0, firstDialogueIndex < 0 ? lines.length : firstDialogueIndex)
    .join('\r\n')
    .replace(/\r?\n*$/, '')

  return { captions, header }
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

function buildAss(header: string, captions: Caption[]): string {
  const events = captions.map(
    (caption) =>
      `Dialogue: 0,${msToAssTime(caption.start)},${msToAssTime(caption.end)},Default,,0,0,0,,${caption.text}`,
  )

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

    const documents = sources.map((source, index) => {
      const format = inputFormats[index]!

      return format === 'ass'
        ? parseAss(source)
        : { captions: parseSrt(source), header: '' }
    })

    const allCaptions: Caption[] = []
    let offset = 0

    for (const document of documents) {
      for (const caption of document.captions) {
        allCaptions.push({
          start: caption.start + offset,
          end: caption.end + offset,
          text: caption.text,
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

    const assHeader =
      documents.find((document) => document.header)?.header ?? defaultAssHeader()

    const content =
      targetFormat === 'ass'
        ? buildAss(assHeader, allCaptions)
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

