import Link from 'next/link'
import styles from "./Item.module.css";
import { HiUserGroup, HiPencil } from "react-icons/hi";
import { AiOutlineHistory } from "react-icons/ai";
import { LuCalendarClock } from "react-icons/lu";
import { MdContentCopy } from "react-icons/md";
import { FaTrash, FaEye } from "react-icons/fa";
import { useEffect, useState } from 'react';
import statusFilters from '../../../lib/statusFilters.json';
import { toast } from 'react-toastify';
import { parseDate, refs } from '../../../lib/utils/auxiliary';
import { deleteSurvey } from '../../../lib/utils/api';
import { useRouter } from 'next/router';



export default function Item({ title, total, answers, editionDate, openDate, endDate, status, id }) {

    const [showOptions, setShowOptions] = useState(false);
    const [showOpenDate, setShowOpenDate] = useState(false);


    const initial = parseDate(editionDate);
    const hoje = new Date();
    const dif = hoje - initial;
    const diasAtras = Math.floor(dif / (1000 * 60 * 60 * 24));
    const dA = parseDate(openDate);
    const dAFormatted = dA.toLocaleDateString('pt-BR');
    const dE = parseDate(endDate);
    const dEFormatted = dE.toLocaleDateString('pt-BR');

    useEffect(() => {
        if (status === refs.draft) {
            const today = new Date();
            const timeDiff = Math.abs(today.getTime() - dA.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays == 30) {
                setShowOpenDate(true);
            }
        }
    }, [answers]);

    return (
        <div className={styles.item}>
            <div className={styles.imagem} >
                <Link href={`/survey/${'1'}`}>
                    <div />
                </Link>
            </div>
            <div className={styles.descricao}>
                <div className={styles.titulo}>
                    <h2><Link href={`/survey/${'1'}`}><a>{title}</a></Link></h2>
                </div>
                <div className={styles.tags}>
                    <div className={styles.historycalendar}>
                        {status === statusFilters[0].id && (
                            <div>
                                <AiOutlineHistory size={18} /> <p>{`${diasAtras} dias atrás`}</p>
                            </div>

                        )}
                        {status === statusFilters[1].id && (
                            <div>
                                <LuCalendarClock size={18} /> {`${dAFormatted} - ${dEFormatted}`}
                            </div>
                        )}

                        <div>
                            <HiUserGroup size={18} /> {`${answers}/${total}`}
                        </div>

                        {showOpenDate && (
                            <div className={styles.openDate}>
                                <p>{`Data de abertura: ${dAFormatted}`}</p>
                            </div>
                        )}

                    </div>

                    <div className={styles.progressandtripledot}>
                        {status === statusFilters[1].id && (
                            <div className={styles.progress}>
                                <a>{`${(answers / total) * 100}% concluíram`}</a>
                                <progress className={styles.progressbar} value={answers} max={total} />
                            </div>
                        )}
                        <div className={styles.dots}>
                            <label onClick={() => setShowOptions(!showOptions)} onBlur={() => setShowOptions(false)}>...</label>
                            {showOptions && menuOptions(status, id)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



function menuOptions(typeItem, idItem) {

    const router = useRouter();
    
    const arrPattern = [
        {
            'icon': <HiPencil size={18} />,
            'label': 'Editar',
            'path': '/survey/create'
            
        },
        {
            'icon': <MdContentCopy size={18} />,
            'label': 'Duplicar',
            'path': `/api/surveycreator/duplicate/${idItem}`
        },
        {
            'icon': <FaTrash size={18} />,
            'label': 'Remover',
            'path': `delete`
        }
    ]

    const pushRoute = (event, path) => {
        
        event.preventDefault();

        if (path == 'delete') deleteSurvey(idItem);

        router.push({
            pathname: path,
            query: { id: idItem }
        });
    };


    switch (typeItem) {
        case 'Em construção':
            break;
        case 'Ativo':
            arrPattern.push({
                'icon': <FaEye size={18} />,
                'label': 'Visualizar',
                'path': `/survey/visualizar/${idItem}`

            });
            break;
        case 'Encerrado':
            arrPattern.push({
                'label': 'Visualizar',
                'path': `/survey/visualizar/${idItem}`
            });
            break;
        default:
            toast.error('Erro ao carregar opções do menu, contate o suporte.', { autoClose: 5000 })
            break;
    }

    return (
        <div className={styles.optionContainer}>
            <div className={styles.optionCenter}>
                <ul>
                    {arrPattern.map((item) => (
                        <li key={item.label}>
                            <label 
                            onClick={(event) => pushRoute(event, item.path)}>
                                {item.icon}{`${item.label}`}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}