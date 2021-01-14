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
export function expand(abbr, type) {
    if (type == "chord") {
        switch(abbr) {
            case("major"):
                return "Major";
            case("minor"):
                return "Minor";
            case("augmented"):
                return("Augmented")
            case("diminished"):
                return("Diminished")
            case("sus2"):
                return("Suspended Second")
            case("sus4"):
                return("Suspended Fourth")
            case("add6"):
                return("Sixth")
            case("m6"):
                return("Minor Sixth")
            case("maj7"):
                return("Major Seventh")
            case("min7"):
                return("Minor Seventh")
            case("dom"):
                return("Dominant Seventh")
            case('mM7'):
                return('Minor/Major Seventh')
            case("m7b5"):
                return("Half-Diminished")
            case("dim7"):
                return("Diminished Seventh")
            case("11"):
                return("Eleventh")
            case("maj9"):
                return("Major Ninth")
        }
    } else if (type == "interval") {
        switch (abbr) {
            case ("M2"):
                return "Major 2nd";
            case ("m2"):
                return "Minor 2nd";
            case ("M3"):
                return "Major 3rd";
            case ("m3"):
                return "Minor 3rd";
            case ("P4"):
                return "Perfect 4th";
            case ("d5"):
                return "Tritone";
            case ("P5"):
                return "Perfect 5th";
            case ("M6"):
                return "Major 6th";
            case ("m6"):
                return "Minor 6th";
            case ("M7"):
                return "Major 7th";
            case ("m7"):
                return "Minor 7th";
            case ("P8"):
                return "Octave";
            case ('m9'):
                return "Minor 9th";
            case ('M9'):
                return "Major 9th";
        }
    }
}
//export function getRandom(max) {}
