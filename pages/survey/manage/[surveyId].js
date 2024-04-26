import clientPromise from '../../../lib/mongodb'
import mongoose from 'mongoose'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import { useContext, useEffect } from 'react'
import { SurveyContext } from '../../../SurveyContext'

const SurveyCreatorWidget = dynamic(() => import('../../../components/SurveyCreatorWidget/[surveyId]'), {
  ssr: false,
  loading: () => <div>Carregando...</div>,
})

export default function ManageSurvey({ survJSON }) {
  const surveyContext = useContext(SurveyContext)
  const { setSurvId } = surveyContext

  useEffect(() =>{
    setSurvId(survJSON._id)
  },[])
  
  return (
    <>
      <Head>
        <title>SAVE - Editar questionário</title>
      </Head>
      <SurveyCreatorWidget prefill={survJSON} />
    </>
  )
}

export async function getServerSideProps(context) {
  const client = await clientPromise
  const db = client.db('SurveyTool')
  const session = await getSession(context)
  const { surveyId } = context.params

  if (!session || session.user.role === 'user') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  let survJSON = await db.collection('surveys').findOne({
    _id: mongoose.Types.ObjectId(surveyId),
  })
  survJSON = JSON.parse(JSON.stringify(survJSON))

  return {
    props: {
      surveyId,
      survJSON,
    },
  }
}
