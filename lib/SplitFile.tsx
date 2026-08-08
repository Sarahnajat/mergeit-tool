import { parseSync, stringifySync } from 'subtitle'



export async function handleSplitSubtitle(file: File) {
    // For spliting the file first we need to Read it 
    const fileText = await file.text()

    // then we parse it to array so we can manipulate the subtitles
    const  ParseFile = parseSync(fileText)


}

