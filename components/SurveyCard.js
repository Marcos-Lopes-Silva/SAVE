import { WarningIcon } from '@chakra-ui/icons'
import {
  useDisclosure,
  useColorModeValue,
  Button,
  Text,
  Box,
  Flex,
  Progress,
  Stack,
  useMediaQuery,
  Tooltip,
  IconButton,
  Icon,
} from '@chakra-ui/react'
import Link from 'next/link'
import IdentificationModal from './IdentificationModal'

function getAmountOfQuestions(survey) {
  let amountOfQuestions = 0

  survey.pages.forEach((page) => {
    page.elements.forEach((element) => {
      if (element.isRequired) {
        amountOfQuestions++
      }
    })
  })

  return amountOfQuestions
}

function getAmountOfAnswers(result, survey) {
  let i = 0

  if (result) {
    survey.pages.forEach((page) => {
      page.elements.forEach((element) => {
        if (element.name in result.surveyResult && element.isRequired) {
          i++
        }
      })
    })
  }
  return i
}

function getPercentageOfAnswers(result, survey) {
  return Math.floor(
    (getAmountOfAnswers(result, survey) / getAmountOfQuestions(survey)) * 100
  )
}

export default function SurveyCard({
  survey,
  results,
  elligibleIds,
  answersFrom2020Id,
}) {
  const [isLargerThan720] = useMediaQuery('(min-width: 720px)')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isElligible = elligibleIds.includes(answersFrom2020Id)
  const percentageOfAnswers = getPercentageOfAnswers(results, survey)

  return (
    <Box
      py={2}
      px={4}
      minH={100}
      minW={'full'}
      bgColor={useColorModeValue('gray.200', 'gray.700')}
      borderRadius={'0.375rem'}
    >
      <IdentificationModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} />
      <Stack spacing={4}>
        <Text fontWeight={600}>{survey.title}</Text>
        <Progress
          value={percentageOfAnswers}
          colorScheme={'teal'}
        />
        <Flex
          gap={2}
          justifyContent={isLargerThan720 ? 'flex-end' : 'center'}
          minW={'full'}
        >
          {!isElligible && (
            <Tooltip
              label={'Confirme sua identidade'}
              hasArrow
              placement={'top'}
            >
              <IconButton
                onClick={onOpen}
                icon={<Icon as={WarningIcon} />}
                colorScheme={'red'}
              />
            </Tooltip>
          )}
          <Link href={`/survey/${survey._id}`} passHref>
            <Button colorScheme={'teal'} isDisabled={!isElligible}>
              {percentageOfAnswers < 100 ? 'Responder agora' : 'Revisar respostas'}
            </Button>
          </Link>
        </Flex>
      </Stack>
    </Box>
  )
}
