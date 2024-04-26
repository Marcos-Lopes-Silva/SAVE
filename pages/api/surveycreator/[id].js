import clientPromise from '../../../lib/mongodb'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('SurveyTool')
  const { id } = req.query

  switch (req.method) {
    case 'POST':
      try {
        const survey = await db.collection('surveys').insertOne(req.body)
        res.status(201).json(survey)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
      break
    case 'PATCH':
      try {
        const survey = await db
          .collection('surveys')
          .findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: req.body },
            { upsert: false, returnOriginal: false }
          )
        res.status(200).json(survey)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
      break
    case 'GET':
      try {
        const survey = await db
          .collection('surveys')
          .findOne({ _id: mongoose.Types.ObjectId(id) })
        res.status(200).json(survey)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
      break
    case 'DELETE':
      try {
        await db
          .collection('surveys')
          .deleteOne({ _id: mongoose.Types.ObjectId(id) })
        res.status(204).end()
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
      break
  }
}
