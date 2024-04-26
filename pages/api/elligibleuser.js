import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('SurveyTool')

  switch (req.method) {
    case 'POST':
      try {
        const id = await db.collection('elligibleUsers').insertOne(req.body)
        res.status(201).json(id)
      } catch (err) {
        res.status(500).json(err)
        console.log(err)
      }
      break
  }
}
