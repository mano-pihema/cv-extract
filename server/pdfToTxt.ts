import PDFParser from 'pdf2json'
import fs from 'fs'

async function parsePDF() {
  const pdfParser = new PDFParser(this, true)

  pdfParser.on('pdfParser_dataError', (errData) =>
    console.error(errData.parserError)
  )
  pdfParser.on('pdfParser_dataReady', () => {
    fs.writeFile(
      './server/temp/content.txt',
      pdfParser.getRawTextContent(),
      () => {
        console.log('Done.')
      }
    )
  })

  pdfParser.loadPDF('./server/temp/temp.pdf')
}

export default parsePDF
