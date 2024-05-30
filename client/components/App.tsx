import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { uploadFilePath } from '../api/api'

import { Box, Button, Container, Stack } from '@chakra-ui/react'
import InputField from './InputField'

type form = { list: string[]; extract: string[]; generate: string[] }

function App() {
  const [file, setFile] = useState<File | undefined>()
  const [cv, setCV] = useState()

  const [listAttributes, setListAttributes] = useState<string[]>([])
  const [extractAttributes, setExtractAttributes] = useState<string[]>([])
  const [generateAttributes, setgenerateAttributes] = useState<string[]>([])

  const [form, setForm] = useState<form>({
    list: [],
    extract: [],
    generate: [],
  })

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

  function formSubmitHandler() {
    setForm({
      list: listAttributes,
      extract: extractAttributes,
      generate: generateAttributes,
    })
  }

  return (
    <>
      <Container maxW='lg'>
        <Box maxW='lg'>
          <Box>
            <Stack>
              <InputField
                {...{
                  title: 'List',
                  description: 'add to get a list of these attributes',
                  attributes: ['skills', 'education', 'experience'],

                  setAttributes: setListAttributes,
                }}
              />
              <InputField
                {...{
                  title: 'Extract',
                  description: 'add to extract entire attribute section',
                  attributes: ['profile', 'experience'],

                  setAttributes: setExtractAttributes,
                }}
              />
              <InputField
                {...{
                  title: 'Generate',
                  description: 'add attributes to generate summaries',
                  attributes: ['skills', 'education', 'experience'],

                  setAttributes: setgenerateAttributes,
                }}
              />
            </Stack>
            <Button onClick={formSubmitHandler}>submit</Button>
            <Button onClick={() => console.log(form)}>check</Button>
          </Box>
          <Box>
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
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default App
