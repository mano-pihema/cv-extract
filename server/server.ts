import express from 'express'
import uploadPath from './routes/uploadPath'
import queryForm from './routes/queryForm'

import cors from 'cors'

const server = express()

server.use(cors())
server.use(express.json())

server.get('/', (_, res) => {
  res.send('server')
})

server.use('/uploadPath', uploadPath)
server.use('/queryForm', queryForm)

export default server
