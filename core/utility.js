 const utility = {};

 utility.removeQuotationMarks = (string) => {
     return (typeof string === 'string') ? parseInt(Number(string.replace(/"|'/g, ''))) : string;
 }
 export default utility;