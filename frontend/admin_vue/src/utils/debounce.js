/**
 * Crea una función debounced que retrasa la invocación de func 
 * hasta que hayan pasado delay milisegundos desde la última vez que fue invocada.
 * 
 * @param {Function} func - La función a debounce
 * @param {number} delay - El número de milisegundos a retrasar
 * @returns {Function} - La función debounced
 */
export function debounce(func, delay) {
  let timeoutId
  
  return function (...args) {
    // Cancelar la ejecución anterior si existe
    clearTimeout(timeoutId)
    
    // Programar nueva ejecución
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}