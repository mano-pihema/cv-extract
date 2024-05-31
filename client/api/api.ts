import superagent from 'superagent'
import { QueryForm } from '../models/models'

export function uploadFilePath(path: string) {
  return superagent
    .post('http://localhost:3000/uploadPath')
    .send({ path })
    .then((res) => res.body)
    .catch((err) => console.log(err))
}

export function uploadQuery(form: QueryForm) {
  console.log('form', form)
  return superagent
    .post('http://localhost:3000/query')
    .send(form)
    .then((res) => res.body)
    .catch((err) => console.log(err))
}
