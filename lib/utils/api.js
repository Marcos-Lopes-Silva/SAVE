export const saveSurveyStatus = async (survey, surveyId, toast) => {
    const updatedSurvey = { ...survey };
    delete updatedSurvey._id;
    
    try {
        const response = await fetch(`/api/surveycreator/${surveyId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSurvey),
        });

        if (response.ok) {
            toast.success('Seu questionário acabou de ser salvo!');
        } else {
            toast.error('Erro ao salvar questionário.');
        }
    } catch (error) {
        toast.error(error);
    }
}

export const nextStep = async (data) => {

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
    } catch (error) {
        console.log(error);
    }
}

export const deleteSurvey = async (surveyId) => {
    try {
        const response = await fetch(`/api/surveycreator/${surveyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            toast.success('Questionário removido com sucesso!');
        } else {
            toast.error('Erro ao remover questionário.');
        }
    } catch (err) {
        console.error(err);
    }
}