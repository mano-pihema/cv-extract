import express from 'express'
import { formatQuery } from '../queryFormat'

const router = express.Router()

router.post('/', (req, res) => {
  const query = req.body
  res.send(formatQuery(query))
})

export default router
