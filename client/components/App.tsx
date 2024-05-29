import { FormEvent, useState } from 'react'

import { createClient } from '@supabase/supabase-js'
import { uploadFilePath } from '../api/api'

function App() {
  const [file, setFile] = useState<File | undefined>()
  const [cv, setCV] = useState()

  const supabase = createClient(
    String(import.meta.env.VITE_STORAGE_URL),
    String(import.meta.env.VITE_ANON_STORAGE_KEY)
  )

  function handleOnChange(event: FormEvent<HTMLInputElement>) {
    const target = event.target as HTMLElement & { files: FileList }
    setFile(target.files[0])
  }

  async function submitHandler(event: FormEvent<HTMLElement>) {
    event.preventDefault()

    if (!file) {
      console.log('no file')
      return
    }

    const { data, error } = await supabase.storage
      .from('cv-bucket')
      .upload(`cv/${Date.now()}${file.name}`, file)
    if (error) {
      console.error('Error at upload front func', error)
    } else {
      console.log('File uploaded successfully', data)
      const cvData = await uploadFilePath(data.path)
      setCV(cvData)
    }
  }

  return (
    <>
      <div>
        file
        <input type='file' onChange={handleOnChange} />
        <button onClick={submitHandler}>upload file</button>
        {cv && (
          <div>
            <p>summary</p>
            <p>{cv?.summary}</p>
            <p>skills</p>
            <div>
              {cv.skills?.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <p>experience</p>
            <div>
              {cv.experience?.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
