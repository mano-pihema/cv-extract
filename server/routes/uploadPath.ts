
import express  from "express"
import downloadPdf from '../download.ts'
import parsePDF from "../pdfToTxt"
import main from "../example.ts"

const router = express.Router()

router.post('/',async (req,res)=>{
  const {path} = req.body
 
  try {
    await downloadPdf(path)
    await parsePDF()
    const cvExtract = await main()
    res.send(cvExtract)
  } catch (error) {
    console.error(error)
    res.status(500).send('endpt problem: ' + error.message)
  }
 
  
})
export default router