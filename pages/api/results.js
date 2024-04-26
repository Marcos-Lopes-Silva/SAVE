import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('SurveyTool')

  switch (req.method) {
    case 'POST':
      try {
        const survey = await db
          .collection('surveyResults')
          .findOneAndUpdate(
            { surveyId: req.body.surveyId, userId: req.body.userId },
            { $set: req.body },
            { upsert: true, returnOriginal: false }
          )
        res.status(200).json(survey)
      } catch (error) {
        res.status(500).json(error)
        console.log(error)
      }
      break
  }
}
