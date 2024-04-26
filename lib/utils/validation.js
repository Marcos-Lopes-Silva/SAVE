export const hasAtLeastThreeElements = (page) => page.elements.length >= 3;
 
export const hasTitle = (page) => page.title !== '';

export const elementIsValid = (element) => element.title !== '' && element.type !== '';

export const dateIsRecent = (date) => {
  const today = new Date();
  const dateToCheck = new Date(date);
  return dateToCheck <= today;
}

export const twoDatesAreValid = (date1, date2) => {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    return firstDate <= secondDate;
}