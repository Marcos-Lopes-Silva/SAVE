import clientPromise from '../../../lib/mongodb'
import SurveyManagerList from '../../../components/SurveyManagerList'
import Head from 'next/head'
import {
  Container,
  Heading,
  Divider,
} from '@chakra-ui/react'
import { getSession } from 'next-auth/react'

export default function ManageSurveys({ surveys }) {
  return (
    <>
      <Head>
        <title>SAVE - Gerenciar questionários</title>
      </Head>
      <Container maxW={'3xl'} as={'main'} py={{ base: 14, md: 22 }}>
        <Heading>Gerenciar questionários ✍️</Heading>
        <Divider my={4} />
        <SurveyManagerList surveys={surveys} />
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  const client = await clientPromise
  const session = await getSession(context)
  const db = client.db('SurveyTool')

  if (!session || session.user.role === 'user') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  let surveys = await db.collection('surveys').find({}).toArray()
  surveys = JSON.parse(JSON.stringify(surveys))

  return {
    props: {
      surveys,
    },
  }
}
