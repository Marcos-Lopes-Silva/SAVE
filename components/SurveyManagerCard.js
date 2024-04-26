import {
  useColorModeValue,
  useMediaQuery,
  useDisclosure,
  Box,
  Stack,
  Text,
  Flex,
  Button,
} from '@chakra-ui/react'
import Link from 'next/link'
import DeleteConfirmationModal from "./DeleteConfirmationModal"

export default function SurveyManagerCard({ survey }) {
  const [isLargerThan720] = useMediaQuery('(min-width: 720px)')
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      py={2}
      px={4}
      minH={100}
      minW={'full'}
      bgColor={useColorModeValue('gray.200', 'gray.700')}
      borderRadius={'0.375rem'}
    >
      <DeleteConfirmationModal isOpen={isOpen} onClose={onClose} surveyId={survey._id} />
      <Stack spacing={4}>
        <Text fontWeight={600}>{survey.title}</Text>
        <Flex
          gap={2}
          justifyContent={isLargerThan720 ? 'flex-end' : 'center'}
          minW={'full'}
        >
          <Link href={`/survey/manage/${survey._id}`} passHref>
            <Button colorScheme={'teal'}>Editar</Button>
          </Link>
          <Button colorScheme={'red'} onClick={onOpen}>Excluir</Button>
        </Flex>
      </Stack>
    </Box>
  )
}
