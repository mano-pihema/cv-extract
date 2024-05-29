import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'
import dotenv from 'dotenv'

dotenv.config()

async function downloadPdf(path:string) {

  const supabase = createClient(
  String(process.env.VITE_STORAGE_URL),
  String(process.env.VITE_ANON_STORAGE_KEY)
)

const {data,error} = await supabase.storage.from('cv-bucket').download(path) 
if(error){
  console.error(error)
}
else{
  const filePath = './server/temp/temp.pdf';
  const buffer = Buffer.from(await data.arrayBuffer())
  fs.writeFile(filePath, buffer)
}
}





export default downloadPdf

