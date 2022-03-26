/**
 * Instancie un debounce qui permet de se faire rappeler à la fin du timeout
 * si un autre call c'est exécuté alors le timeout est réinitialisé
 * et la fonction précédente sera annulé
 * @param handler
 * @param time
 * @constructor
 */
export const CreateDebounce = (handler: Function, time: number): ()=>void => {
  let timeoutId: number;
  return ()=>{
    window.clearTimeout(timeoutId);
    window.setTimeout(handler, time);
  }
};