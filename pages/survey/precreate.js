import { useEffect, useState } from "react";
import Container from "../../components/layout/Container";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import styles from './Precreate.module.css';
import { TbTextPlus, TbCalendarTime } from "react-icons/tb";
import { RiCalendar2Line } from "react-icons/ri";
import { z } from "zod";
import { Form } from "../../components/Form";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateSurvey } from "../../redux/actions";
import { formattedDateNow } from "../../lib/FuncoesAux";
import { ToastContainer, toast } from "react-toastify";
import { dateIsRecent, twoDatesAreValid } from "../../lib/utils/validation";
import 'react-toastify/dist/ReactToastify.min.css';
import { parseDate } from "../../lib/utils/auxiliary";


const createSurveySchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(250),
    horaOpen: z.string().min(1).max(2),
    minutoOpen: z.string().min(1).max(2),
    horaEnd: z.string().min(1).max(2),
    minutoEnd: z.string().min(1).max(2),
    complete: z.string().max(100),
});


export default function PreCreateSurvey() {
    const days = [], months = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
    ], years = [];

    const dispatch = useDispatch();
    const survey = useSelector(state => state.survey);
    const router = useRouter();
    
    const [ dayClose, setDayClose ] = useState('');
    const [ monthClose, setMonthClose ] = useState('');
    const [ yearClose, setYearClose ] = useState('');

    const [ dayOpen, setDayOpen ] = useState('');
    const [ monthOpen, setMonthOpen ] = useState('');
    const [ yearOpen, setYearOpen ] = useState('');

    function calculateTime(time, type) {

        if (time.length > 0) return time;

        let j = 0;
        let i = 1;
        
        switch(type) {
            case 'days': j = 31; break;
            case 'years': j = 2075; i = 2024; break;
        }

        for(i; i <= j; i++) { 
            time.push(i);
        }

        return time;
    }
    

    const createSurveyForm = useForm({
        resolver: zodResolver(createSurveySchema),
    });

    const style = {
        menu: {
            display: "flex",
            flexDirection: "column",
            width: "auto",
        },
        button: {
            display: "flex",
            width: "90px",
            boxShadow: "0px 4px 4px 1px rgba(0, 0, 0, 0.25)",
            borderRadius: "5px",
            padding: "10px",
            alignItems: "center",
            justifyContent: "center",
        },
        span: {
            fontSize: "14px",
            fontWeight: "600",
        },
        options: {
            width: "90px",
            position: "absolute",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        }
    }

    const { 
    handleSubmit, 
    formState: { isSubmitting }, 
    } = createSurveyForm;

    const nextStep = async (data) => {

        if ((dayOpen || monthOpen || yearOpen || dayClose || monthClose || yearClose) === '') {
            toast.error('Preencha todos os campos de data.');
            return;
        }

        const updatedSurvey = {
            ...survey,
            title: data.title,
            description: data.description,
            openDate: `${dayOpen} ${monthOpen} ${yearOpen} ${data.horaOpen}:${data.minutoOpen}`,
            endDate: `${dayClose} ${monthClose} ${yearClose} ${data.horaEnd}:${data.minutoEnd}`,
            completeMessage: data.complete,
            status: 'draft',
            editionDate: formattedDateNow(),
        }

        if (dateIsRecent(new Date(updatedSurvey.openDate))) {
            toast.error('Data de abertura do questionário não pode ser anterior a data atual.');
            return;
        }

        if (twoDatesAreValid(new Date(parseDate(updatedSurvey.openDate)), new Date(parseDate(updatedSurvey.endDate)))) {
            toast.error('Data de encerramento do questionário não pode ser anterior a data de abertura.');
            return;
        }

        dispatch(updateSurvey(updatedSurvey));

        try {
            const response = await fetch(`/api/surveycreator/1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSurvey),
            });

            if (response.statusText === 'Created') {
                toast.success('Questionário criado com sucesso!');
                response.json().then(data => {
                    router.push({
                        pathname: '/survey/create',
                        query: { id: data.insertedId }
                    })
                });
            }
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {}, [0]);

    return (
        <Container>
            <div className={styles.header}>
                <div className={styles.headerup}>
                    <div className={styles.headerupiconbackground}>
                        <TbTextPlus size={30} color="white"/>
                    </div>
                    <h1>Novo questionário</h1>
                </div>
                <div className={styles.headerdescription}>
                    <h2>Personalize seu questionário definindo título, descrição e datas.</h2>
                </div>
            </div>
            <ToastContainer />
            <FormProvider {...createSurveyForm}>
                <form 
                    onSubmit={ 
                        handleSubmit(nextStep)
                    }
                    className={styles.formSurvey}
                >
                    <Form.Field>
                        <Form.Label htmlFor="title">*  Título do questionário</Form.Label>
                        <Form.Input 
                            type="text" 
                            id="title" 
                            name="title"
                        />
                        <Form.ErrorMessage field="title" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="description">   Descrição</Form.Label>
                        <Form.Input 
                            type="text" 
                            id="description" 
                            name="description"
                            style={{width: '55%'}}
                        />
                        <Form.ErrorMessage field="description" style={{color: 'red'}}/>
                    </Form.Field>

                    <h1>Duração</h1>

                    <Form.Field >
                        <Form.Label htmlFor="start">*  Abrir questionário</Form.Label>
                        <div className={styles.questionsOpen}>
                            <RiCalendar2Line size={20}/>
                            <Form.Dropdown 
                                span={"Dia"}
                                style={style}
                                arrFields={calculateTime(days, 'days')}
                                selected={dayOpen}
                                setSelected={setDayOpen}
                            />
                            <Form.Dropdown
                                span={"Mês"}
                                style={style}
                                arrFields={months}
                                selected={monthOpen}
                                setSelected={setMonthOpen}
                            />
                            <Form.Dropdown
                                span={"Ano"}
                                style={style}
                                arrFields={calculateTime(years, 'years')}
                                selected={yearOpen}
                                setSelected={setYearOpen}
                            />
                            {/**TO DO: Verificar se é pra manter number ou alterar para outra coisa, no firefox não é suportado esse tipo de input */}

                            <TbCalendarTime size={20}/>
                            <Form.Input
                                type="number"
                                id="horaOpen"
                                min="0"
                                max="23"
                                placeholder="Hora"
                                name="horaOpen"
                            />
                            <Form.Input
                                type="number"
                                id="minutoOpen"
                                min="0"
                                max="59"
                                placeholder="Min"
                                name="minutoOpen"   
                            />
                        </div>
                        <Form.ErrorMessage field="dia" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="start">*  Encerrar questionário</Form.Label>
                        <div className={styles.questionsOpen}>
                            <RiCalendar2Line size={20}/>
                            <Form.Dropdown 
                                span={"Dia"}
                                style={style}
                                arrFields={calculateTime(days, 'days')}
                                selected={dayClose}
                                setSelected={setDayClose}
                            />
                            <Form.Dropdown
                                span={"Mês"}
                                style={style}
                                arrFields={months}
                                selected={monthClose}
                                setSelected={setMonthClose}
                            />
                            <Form.Dropdown
                                span={"Ano"}
                                style={style}
                                arrFields={calculateTime(years, 'years')}
                                selected={yearClose}
                                setSelected={setYearClose}
                            />
                            {/**TO DO: Verificar se é pra manter number ou alterar para outra coisa, no firefox não é suportado esse tipo de input */}
                            <TbCalendarTime size={20}/>
                            <Form.Input
                                type="number"
                                id="horaEnd"
                                min="0"
                                max="23"
                                placeholder="Hora"
                                name="horaEnd"
                            />
                            <Form.Input
                                type="number"
                                id="minutoEnd"
                                min="0"
                                max="59"
                                placeholder="Min"
                                name="minutoEnd"   
                            />
                        </div>
                        <Form.ErrorMessage field="dia" />
                    </Form.Field>
                    <Form.Field>
                        <Form.Label htmlFor="">Ao completar o questionário: </Form.Label>
                        <Form.Input type="text" id="complete" name="complete" />
                    </Form.Field>
                    <div 
                    className={styles.form_button_submit}>
                        <button type="submit">Concluído</button>
                    </div>
                </form>
            </FormProvider>
        </Container>
    )
}