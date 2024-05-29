import express from 'express'
import main from './example'
import uploadPath from './routes/uploadPath'

import cors from 'cors'

const server = express()

server.use(cors())
server.use(express.json())

server.get('/',(_,res)=>{
  res.send('server')
})
server.get('/app',(_,res)=>{
  main().then((response)=>res.send(response)).catch((err)=>res.status(500).send(err.message))
})

server.use('/uploadPath',uploadPath)



export default server