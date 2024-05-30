import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { uploadFilePath } from '../api/api'

import { Badge, Box, Button, Container, Stack, Text } from '@chakra-ui/react'

function App() {
  const [file, setFile] = useState<File | undefined>()
  const [cv, setCV] = useState()
  const [list, setList] = useState([])
  const [defaultList, setDefaultList] = useState([
    'skills',
    'education',
    'experience',
  ])
  const [tempList, setTempList] = useState<string[]>([])

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
  function addBadge(listItem: string) {
    setTempList((prev) => [...prev, listItem])
    setDefaultList((prev) => prev.filter((item) => item !== listItem))
  }

  function removeBadge(listItem: string) {
    setDefaultList((prev) => [...prev, listItem])
    setTempList((prev) => prev.filter((item) => item !== listItem))
  }

  return (
    <>
      <Container maxW='lg'>
        <Box maxW='lg'>
          <Box>
            input
            <Stack>
              <Box>
                <Text>List</Text>
                <Stack direction={'row'} padding={2}>
                  {defaultList.map((listItem) => (
                    <Button key={listItem} onClick={() => addBadge(listItem)}>
                      {listItem}
                    </Button>
                  ))}
                </Stack>
                <Box
                  borderWidth='4px'
                  borderRadius='lg'
                  minHeight={50}
                  maxHeight={100}
                >
                  {tempList &&
                    tempList.map((item) => (
                      <Badge
                        margin={1}
                        key={item}
                        cursor={'pointer'}
                        onClick={() => removeBadge(item)}
                      >
                        {item}
                      </Badge>
                    ))}
                </Box>
              </Box>
              <Box>
                <Text>extract</Text>
                <Stack></Stack>
              </Box>
              <Box>
                <Text>Generate</Text>
                <Stack></Stack>
              </Box>
            </Stack>
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
