import { Badge, Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'

function InputField({
  title,
  description,
  attributes,

  setAttributes,
}: {
  title: string
  description: string
  attributes: string[]

  setAttributes: (value: string[]) => void
}) {
  const [defaultList, setDefaultList] = useState(attributes)
  const [tempList, setTempList] = useState<string[]>([])

  function addBadge(listItem: string) {
    setTempList((prev) => [...prev, listItem])
    setDefaultList((prev) => prev.filter((item) => item !== listItem))

    // @ts-expect-error type
    setAttributes((prev) => [...prev, listItem])
  }

  function removeBadge(listItem: string) {
    setDefaultList((prev) => [...prev, listItem])
    setTempList((prev) => prev.filter((item) => item !== listItem))
    // @ts-expect-error type
    setAttributes((prev) => prev.filter((item: string) => item !== listItem))
  }

  return (
    <Box>
      <Heading>{title}</Heading>
      <Text>{description}</Text>
      <Stack direction={'row'} padding={2}>
        {defaultList.map((listItem) => (
          <Button key={listItem} onClick={() => addBadge(listItem)}>
            {listItem}
          </Button>
        ))}
      </Stack>
      <Box borderWidth='4px' borderRadius='lg' minHeight={50} maxHeight={100}>
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
  )
}

export default InputField
