import fs from "node:fs/promises";

import {
  Document,
  VectorStoreIndex,
} from "llamaindex";

async function main() {

  const path = "./server/temp/content.txt";

  const essay = await fs.readFile(path, "utf-8");

  // Create Document object with essay
  const document = new Document({ text: essay, id_: path });


  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document]);

const structuredQuery = {
  summary: "Provide a high-level summary of this CV.",
  profile: "Extract the profile section.",
  skills: "List the skills mentioned in the CV without prefix numbers.",
  education: "List the educational institutions mentioned in the CV without prefix numbers or dash,seperate with commas",
  
experience: "List the work experiences mentioned in the CV without prefix numbers or dash, seperate with commas instead of newline"
};


async function queryStructuredData(index, structuredQuery) {
  const queryEngine = index.asQueryEngine()
  const results = {}

  for (const key in structuredQuery) {
    const query = structuredQuery[key]
    const { response } = await queryEngine.query({ query })
    results[key] = response
  }
  return results;
}


const extractedData = await queryStructuredData(index, structuredQuery)

const listSkills =['skills','education','experience']

for (const key of listSkills) {
  extractedData[key] = extractedData[key].split(',')
}

console.log(extractedData)

return extractedData

}

export default main


