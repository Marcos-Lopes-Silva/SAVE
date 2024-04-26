import clientPromise from '../../lib/mongodb'

function convertDate(date) {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year} 00:00`
}

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('SurveyTool')

  switch (req.method) {
    case 'POST':
      try {
        const id = await db.collection('answers_2020').findOne({
          firstname: req.body.name.toUpperCase(),
          datanasc: convertDate(req.body.birthDate),
        })
        if (id === null) {
          console.log(req.body.name.toUpperCase())
          console.log(convertDate(req.body.birthDate))
          return res.status(404).json({
            message: 'Não encontrado',
          })
        }
        res.status(200).json({
          id: id._id
        })
      } catch (err) {
        res.status(500).json(err)
        console.log(err)
      }
      break
  }
}
