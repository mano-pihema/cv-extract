import superagent from 'superagent'
import { QueryForm } from '../models/models'
//@ts-expect-error type
export function uploadFilePath(path: string, schema) {
  return superagent
    .post('http://localhost:3000/uploadPath')
    .send({ path, schema })
    .then((res) => res.body)
    .catch((err) => console.log(err))
}

export function uploadQuery(form: QueryForm) {
  return superagent
    .post('http://localhost:3000/queryForm')
    .send(form)
    .then((res) => res.body)
    .catch((err) => console.log(err))
}
