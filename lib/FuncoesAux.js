export function capitalizeWords(frase) {
    const palavras = frase.split(" ");

    for (let i = 0; i < palavras.length; i++) {
        const primeiraLetra = palavras[i][0].toUpperCase();
        const restoDaPalavra = palavras[i].slice(1).toLowerCase();

        palavras[i] = primeiraLetra + restoDaPalavra;
    }

    return palavras.join(" ");
}


export const getSurveyResult = (surveyResults) => {
    let r = []
    let index = 0;
  
    surveyResults.map((survey) => {
      Object.keys(survey).forEach((key) => {
        if (typeof survey[key] === 'object') {
          r[index] = survey[key];
          index++;
        }
      })
    })
  
    return r;
  }

export function formattedDateNow() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }).substring(0, 3);
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  return `${day} ${formattedMonth} ${year} ${time}`;
}