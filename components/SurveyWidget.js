import * as Survey from 'survey-react-ui'
import { StylesManager, Model } from 'survey-core'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SurveyWidget({ survey, results, answersFrom2020, timeSpent }) {
  const { data: session } = useSession()
  const surveyModel = new Survey.Model(survey)
  const surveyM = new Model(survey)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    if (!hasMounted) {
      StylesManager.applyTheme('modern')
      setHasMounted(true)
    }
  }, [])

  const saveSurvey = async () => {
    const surveyResult = {
      surveyId: survey._id,
      userId: session.user._id,
      surveyResult: surveyModel.data,
      currentPage: surveyModel.currentPageNo,
      timeSpent: timeSpent + surveyModel.timeSpent,
    }

    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyResult),
      })
    } catch (error) {
      console.log(error)
    }
  }

 

  surveyModel.mergeData(answersFrom2020)
  if (results) {
    surveyModel.mergeData(results.surveyResult)
    surveyModel.currentPageNo = results.currentPage
  }
  surveyModel.progressBarType = 'questions'
  surveyModel.locale = 'pt-br'
  surveyModel.onComplete.add(saveSurvey)
  surveyModel.onCurrentPageChanged.add(saveSurvey)
  surveyModel.startTimer()

  return (
    <>
      <Survey.Survey model={surveyModel} />
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      survey: context.query.survey,
      answers: context.query.answers,
    },
  }
}
