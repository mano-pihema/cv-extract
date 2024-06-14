import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { uploadFilePath, uploadQuery } from '../api/api'

import {
  Box,
  Button,
  Container,
  Stack,
  Heading,
  Text,
  Collapse,
  useDisclosure,
  Input,
  Fade,
  IconButton,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'

import InputField from './InputField'
import { QueryForm } from '../models/models'

function App() {
  const [file, setFile] = useState<File | undefined>()
  const [cv, setCV] = useState()
  const [selectedAttributes, setSelectedAttributes] = useState(false)
  const [querySchema, setQuerySchema] = useState()

  const { isOpen, onToggle } = useDisclosure()
  const [hideUpload, setHideUpload] = useState(true)

  const [listAttributes, setListAttributes] = useState<string[]>([])
  const [extractAttributes, setExtractAttributes] = useState<string[]>([])
  const [generateAttributes, setgenerateAttributes] = useState<string[]>([])

  const [form, setForm] = useState<QueryForm>({
    list: [],
    extract: [],
    summarize: [],
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
      title: 'Summarize',
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
      const cvData = await uploadFilePath(data.path, querySchema)
      setCV(cvData)
    }
    setHideUpload(false)
  }

  function formPreviewHandler() {
    setForm({
      list: listAttributes,
      extract: extractAttributes,
      summarize: generateAttributes,
    })

    setSelectedAttributes(true)
  }

  function submitQuery() {
    onToggle()
    uploadQuery(form)
      .then((response) => setQuerySchema(response))
      .catch((err) => console.error(err))
  }

  return (
    <>
      <Container maxW='lg'>
        <Box maxW='lg'>
          <Collapse in={!isOpen}>
            <Box>
              {
                <>
                  <Collapse in={!selectedAttributes}>
                    <Stack>
                      {defaultAttribute.map(
                        (
                          { title, description, attributes, setAttributes },
                          i
                        ) => (
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
                  </Collapse>
                </>
              }

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
          </Collapse>

          {hideUpload && (
            <Collapse in={isOpen}>
              <Heading>Upload</Heading>
              <Text>choose a file </Text>
              <Stack direction='row'>
                <Input
                  type='file'
                  id='myFileInput'
                  style={{ display: 'none' }}
                  onChange={handleOnChange}
                />
                <Button
                  onClick={() =>
                    document.getElementById('myFileInput')?.click()
                  }
                >
                  choose a file
                </Button>
                <Box
                  borderWidth='4px'
                  borderRadius='lg'
                  padding={1}
                  minWidth={200}
                >
                  <Text>{file?.name}</Text>
                </Box>
                <Fade in={!!file}>
                  <Button onClick={submitHandler}>upload file</Button>
                </Fade>
              </Stack>
            </Collapse>
          )}

          <Box>
            {cv && (
              <Box>
                <Heading>Results</Heading>
                <Collapse in={cv}>
                  <Box>
                    {Object.keys(cv).map((attribute) => (
                      <Box>
                        <Heading key={attribute}>{attribute}</Heading>
                        <Stack spacing={2}>
                          {cv[attribute].map((attr, i) => (
                            <Box
                              padding={2}
                              paddingRight={10}
                              borderWidth='4px'
                              borderRadius='lg'
                              position='relative'
                            >
                              <Text key={i}>{attr}</Text>
                              <IconButton
                                size='sm'
                                aria-label='copy'
                                onClick={() => {
                                  navigator.clipboard.writeText(attr)
                                }}
                                icon={<CopyIcon />}
                                style={{
                                  position: 'absolute',
                                  top: '2px',
                                  right: '2px',
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default App
