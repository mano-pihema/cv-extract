import superagent from 'superagent'

export function uploadFilePath(path:string) {
  
  return superagent.post('http://localhost:3000/uploadPath').send({path}).then((res)=>res.body).catch((err)=>console.log(err))
}