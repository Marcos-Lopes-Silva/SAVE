import { getSession, useSession } from 'next-auth/react'
import clientPromise from '../lib/mongodb'
import styles from './Dashboard.module.css'
import Link from 'next/link';
import { useEffect, useState } from 'react'
import Buscador from '../components/Buscador'
import Itens from '../components/Itens'
import statusquest from '../lib/statusFilters.json'
import { refs } from '../lib/utils/auxiliary';



export default function Dashboard({
	surveys,
	// results,
	// elligibleIds,
	// answersFrom2020Id,
}) {
	const { data: session } = useSession()
	const [busca, setBusca] = useState('');

	const [filtro, setFiltro] = useState(refs.draft);
	const [loaded, setLoaded] = useState(false);

	surveys.sort((a, b) => {
		if (a.status === refs.draft && b.status !== refs.draft) {
			a.openDate > b.openDate ? 1 : -1;
		} else {
			a.endDate > b.endDate ? 1 : -1;
		}
	});

	const selecionarFiltro = (status) => {
		if (filtro === status.id) return setFiltro(null);
		else return setFiltro(status.id);
	}

	useEffect(() => {
		setLoaded(true);
	}, [0])

	return (
		session && loaded && (
			<div className={styles.section}>
				<div className={styles.bemvindo}>
					<h1>Bem vindo ao SAVE!</h1>
					<a>Explore e gerencie e acompanhe o progresso dos seus questionários abertos e veja os já concluídos. Além disso, crie novos questionários, tudo em um só lugar.</a>
					<div className={styles.bvbar1} />
					<div className={styles.bvbar2} />
				</div>
				<div className={styles.questionarios}>
					<div className={styles.divbutton}>
						<button className={styles.button}>
							<Link href={'/survey/precreate'}>Novo questionário</Link>
						</button>
					</div>
					<div className={styles.filtro}>
						<ul>
							{statusquest.map((status) => (
								<li
									key={status.id}
									onClick={() => selecionarFiltro(status)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											selecionarFiltro(status);
										}
									}}
									tabIndex={0}
									className={
										filtro === status.id
											? styles.filtroitemselecionado
											: styles.filtroitem
									}
								>
									{status.nome}
								</li>
							))}
						</ul>
					</div>
					<div className={styles.barrabusca}>
						<Buscador busca={busca} setBusca={setBusca} content={'Procure por questionários'} />
					</div>
					<Itens busca={busca} filtro={filtro} data={surveys} />
				</div>
			</div>
		)
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


	let surveys = await db.collection('surveys').find({}).toArray()
	surveys = JSON.parse(JSON.stringify(surveys))

	// let results = []
	// let elligibleIds = []

	// let answersFrom2020Id = ''
	// let answersFrom2020 = null



	// results = await db
	// 	.collection('surveyResults')
	// 	.find({ userId: session.user._id })
	// 	.toArray()
	// results = JSON.parse(JSON.stringify(results))

	// elligibleIds = await db.collection('answers_2020').find({}).toArray()

	// elligibleIds = elligibleIds.map((id) => id._id)
	// elligibleIds = JSON.parse(JSON.stringify(elligibleIds))

	// answersFrom2020 = await db
	// 	.collection('elligibleUsers')
	// 	.findOne({ userId: session.user._id })

	// answersFrom2020Id = answersFrom2020
	// 	? answersFrom2020.answers_from_2020_id
	// 	: ''



	return {
		props: {
			surveys,
			// results,
			// elligibleIds,
			// answersFrom2020Id
		},
	}
}
