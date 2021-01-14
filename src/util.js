import Soundfont from 'soundfont-player';
/**
 * 
 * @param {string} el - The name of an HTMLElement
 * @param {string} innerText - The desired text of the HTMLElement
 * @param {function} event - Callback function to be invoked whenever
 * the element is clicked
 * @param {string} id - Optional id to attribute to the retured element
 * @param {string} className - Optional html class to attach to the created element
 * @return {HTMLElement} HTMLElement with the specified attributes
 */
export function cre(el, innerText, event, id = "", className = "") {
    const element = document.createElement(el);
    element.innerText = innerText;
    element.addEventListener("click", event);
    element.classList += className;
    if (id !== "") {element.id = id};
    return element;
}
/**
 * Plays the notes of the array using the speciffied AudioContext
 * 
 * @param {string[]} notes - Array of strings representing the notes of the chord
 * @param {AudioContext} ac 
 */
export function playChord(notes, ac) {
    Soundfont.instrument(ac, "acoustic_grand_piano").then((piano) => {
            for (let i = 0; i < notes.length; i++) {
                piano.play(notes[i], ac.currentTime).stop(ac.currentTime + 2);
            }
        });
}

//export function getRandom(max) {}
