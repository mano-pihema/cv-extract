import fs from 'node:fs/promises'

import { Document, VectorStoreIndex } from 'llamaindex'

async function main(schema) {
  const path = './server/temp/content.txt'

  const essay = await fs.readFile(path, 'utf-8')

  // Create Document object with essay
  const document = new Document({ text: essay, id_: path })

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document])

  const structuredQuery = schema

  async function queryStructuredData(index, structuredQuery) {
    const queryEngine = index.asQueryEngine()
    const results = {}

    for (const key in structuredQuery) {
      const query = structuredQuery[key]
      const { response } = await queryEngine.query({ query })
      results[key] = response
    }
    return results
  }

  const extractedData = await queryStructuredData(index, structuredQuery)

  for (const key in extractedData) {
    extractedData[key] = extractedData[key].split(',,')
  }

  console.log(extractedData)

  return extractedData
}

export default main
