import 'survey-creator-core/survey-creator-core.i18n'
import 'survey-core/survey.i18n'
import { SurveyCreatorComponent, SurveyCreator } from 'survey-creator-react'
import { localization } from 'survey-creator-core'
import { useContext, useEffect, useMemo } from 'react'
import { SurveyContext } from '../../SurveyContext'

export default function SurveyCreatorWidget({ prefill }) {
  const context = useContext(SurveyContext)
  let { setSurveyJSON } = context

  const creator = useMemo(() => {
    const creatorOptions = {
      showLogicTab: true,
    }
    return new SurveyCreator(creatorOptions)
  }, [])

  useEffect(() => {
    if (prefill) {
      creator.JSON = prefill
    }
  }, [])

  localization.currentLocale = 'pt-br'
  creator.onModified.add(() => {
    setSurveyJSON(creator.JSON)
  })

  return <SurveyCreatorComponent creator={creator} />
}
