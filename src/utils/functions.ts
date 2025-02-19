/**
 *
 * @param {string} text
 * @param {number} [max=50]
 * @constructor
 * @returns string
 */
export const TextSlicer = (text: string, max:number = 50):string => {
    return text.length >= max   ? `${text.slice(0, max)}...` : text
}