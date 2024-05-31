import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { uploadFilePath, uploadQuery } from '../api/api'

import { Box, Button, Container, Stack, Heading, Text } from '@chakra-ui/react'

import InputField from './InputField'
import { QueryForm } from '../models/models'

function App() {
  const [file, setFile] = useState<File | undefined>()
  const [cv, setCV] = useState()
  const [selectedAttributes, setSelectedAttributes] = useState(false)

  const [listAttributes, setListAttributes] = useState<string[]>([])
  const [extractAttributes, setExtractAttributes] = useState<string[]>([])
  const [generateAttributes, setgenerateAttributes] = useState<string[]>([])

  const [form, setForm] = useState<QueryForm>({
    list: [],
    extract: [],
    generate: [],
  })

  const defaultAttribute = [
    {
      title: 'List',
      description: 'add to get a list of these attributes',
      attributes: ['skills', 'education', 'experience'],
      setAttributes: setListAttributes,
    },
    {
      title: 'Extract',
      description: 'add to extract entire attribute section',
      attributes: ['profile', 'experience'],
      setAttributes: setExtractAttributes,
    },
    {
      title: 'Generate',
      description: 'add attributes to generate summaries',
      attributes: ['skills', 'education', 'experience'],
      setAttributes: setgenerateAttributes,
    },
  ]

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

  function formPreviewHandler() {
    setForm({
      list: listAttributes,
      extract: extractAttributes,
      generate: generateAttributes,
    })
    setSelectedAttributes(true)
  }

  function submitQuery() {
    uploadQuery(form).then().catch()
  }

  return (
    <>
      <Container maxW='lg'>
        <Box maxW='lg'>
          <Box>
            {!selectedAttributes && (
              <>
                <Stack>
                  {defaultAttribute.map(
                    ({ title, description, attributes, setAttributes }, i) => (
                      <InputField
                        key={i}
                        {...{
                          title,
                          description,
                          attributes,
                          setAttributes,
                        }}
                      />
                    )
                  )}
                </Stack>
                <Button onClick={formPreviewHandler}>preview query</Button>
              </>
            )}

            {selectedAttributes && (
              <Box>
                <Heading>Preview Query</Heading>
                {Object.keys(form).map((attribute) => (
                  <Box>
                    <Heading key={attribute}>{attribute}</Heading>

                    {form[attribute].map((attr, i) => (
                      <Text key={i}>{attr}</Text>
                    ))}
                  </Box>
                ))}
                <Button onClick={submitQuery}>confirm query</Button>
              </Box>
            )}
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
