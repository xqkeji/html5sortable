/**
 * Get or set data on element
 * @param {HTMLElement} element
 * @param {string} key
 * @param {any} value
 * @return {*}
 */

function addData (element: HTMLElement, key: string, value?: any): HTMLElement|configuration|string|void {
  if (value === undefined) {
    //@ts-ignore
    return element && element.h5s && element.h5s.data && element.h5s.data[key]
  } else {
    //@ts-ignore
    element.h5s = element.h5s || {}
    //@ts-ignore
    element.h5s.data = element.h5s.data || {}
    //@ts-ignore
    element.h5s.data[key] = value
  }
}
/**
 * Remove data from element
 * @param {HTMLElement} element
 */
function removeData (element: HTMLElement) {
  //@ts-ignore
  if (element.h5s) {
    //@ts-ignore
    delete element.h5s.data
  }
}

export { addData, removeData }
