import { VStack, Text } from '@chakra-ui/react'
import SurveyManagerCard from './SurveyManagerCard'

export default function SurveyManagerList({ surveys }) {
  return (
    <>
      {surveys.length === 0 && <Text>Nenhum questionário cadastrado.</Text>}
      <VStack mt={2} p={4}>
        {surveys.map((survey) => (
          <SurveyManagerCard key={survey._id} survey={survey} />
        ))}
      </VStack>
    </>
  )
}
