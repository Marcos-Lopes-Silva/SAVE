import { getSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import clientPromise from '../../lib/mongodb'
import mongoose from 'mongoose'
import { Box, Container, Drawer, useDisclosure } from '@chakra-ui/react'
import Sidebar from '../../components/Sidebar'
import Head from 'next/head'

const SurveyWidget = dynamic(() => import('../../components/SurveyWidget'), {
  ssr: false,
})



export default function Survey({ survey, results, answersFrom2020 }) {


  const pages = survey.pages

  let arr = pages.map((page) => { return page.title })

  const LinkItems = arr.map((item, index) => { return { name: item, icon: `D0${index + 1}` } })

  return (
    <>
      <Head>
        <title>SAVE - Questionário</title>
      </Head>
      <Sidebar linkItems={LinkItems} />

      <Container
        as={'main'}
        bgColor={'white'}
        border={'1px solid'}
        borderColor={'gray.200'}
        maxW={'3xl'}
        my={{ base: 14, md: 22 }}
        borderRadius={'0.375rem'}
      >

        <SurveyWidget
          survey={survey}
          results={results}
          answersFrom2020={answersFrom2020}
          timeSpent={results?.timeSpent || 0}
        />
      </Container>
    </>
  )
}

const QuestionsProgress = ({ survey, results }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box>
      <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} linkItems={linkItems} />
                </DrawerContent>
            </Drawer>

    </Box>
  )
}

export async function getServerSideProps(context) {
  const client = await clientPromise
  const db = client.db('SurveyTool')
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let survey = await db
    .collection('surveys')
    .findOne({ _id: mongoose.Types.ObjectId(context.query.surveyId) })
  survey = JSON.parse(JSON.stringify(survey))

  let results = []
  let answersFrom2020 = []
  let elligibleId = ''

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (session) {
    results = await db
      .collection('surveyResults')
      .findOne({ surveyId: context.query.surveyId, userId: session.user._id })
    results = JSON.parse(JSON.stringify(results))

    elligibleId = await db
      .collection('elligibleUsers')
      .findOne({ userId: session.user._id })

    answersFrom2020 = await db.collection('answers_2020').findOne({
      _id: mongoose.Types.ObjectId(elligibleId.answers_from_2020_id),
    })

    answersFrom2020 = JSON.parse(JSON.stringify(answersFrom2020))
  }

  return {
    props: {
      survey,
      results,
      answersFrom2020,
    },
  }
}
