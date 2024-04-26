import { VStack } from "@chakra-ui/react"
import SurveyCard from "./SurveyCard"

export default function SurveyList({ surveys, results, elligibleIds, answersFrom2020Id }) {
  return (
    <VStack mt={2} p={4}>
      {surveys.map((survey) => (
        <SurveyCard
          key={survey._id}
          survey={survey}
          results={results.find((result) => result.surveyId === survey._id)}
          elligibleIds={elligibleIds}
          answersFrom2020Id={answersFrom2020Id}
        />
      ))}
    </VStack>
  )
}