import Soundfont from 'soundfont-player';
import './style.css'
const main = document.getElementsByTagName("main")[0];
const pages = {
    "Home": {
        introduction: ""
    },
    "Intervals": {
        introduction: "Press 'Start' to hear an infinite loop of intervals. This will show your score and the correct answer. Hit 'Replay' to hear the interval again. 'Change Direction' determines whether the interval is ascending (going up in pitch) or descending. A melodic interval is played at different times while the notes of a harmonic interval are played together.<br>The score represents your net number of correct and incorrect answers. Try to beat your streak!"
    },
    "Chords": {
        introduction: "Press 'Start' to hear an infinite loop of chords. Between each chord, try to identify the type. Press 'Replay' to hear the chord again."
    },
    "Progressions": {
        introduction: 'Press "Start" to hear a series of <id="count">4</id> chords. Attempt to identify which chords were played. The tonic will always be C.'
    },
    "Register": {
        introduction: ""
    },
    "Log In": {
        introduction: ""
    }
}
/**
 * 
 * @param {string} el - The name of an HTMLElement
 * @param {string} innerText - The desired text of the HTMLElement
 * @param {function} event - Callback function to be invoked whenever
 * the element is clicked
 * @param {string} id - Optional id to attribute to the returned element
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


/**Appends a header html element with nav children and
 * the navs appropriate anchor tags and href.
 * 
 * @param {string} page - the name of the page to generate the header for 
 * 
 */
export function Header(page) {
    const header = document.createElement("header");
    const nav = document.createElement("nav");
    const list = document.createElement("ul");
    Object.keys(pages).forEach((pageName) => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.innerText = pageName;
        let ref = `\.\/${pageName.toLowerCase()}\.html`;
        a.href = ref;
        if (page == pageName) {
            li.id = "current";
        }
        li.append(a);
        list.append(li);
    });
    nav.appendChild(list);
    header.appendChild(nav);
    main.prepend(header);
}

/**
 * Appends the introduction span that gives direction
 * and keeps score as well as the paragraph element containing
 * the streak to the main element.
 * @param {string} page 
 */
export function Score(page) {

    let span = document.createElement("span");
    span.id = "score";
    span.innerHTML = pages[page].introduction;
    main.append(span);

    if (page == "Progressions") {
        let answer = document.createElement("span");
        answer.id = "answers";
        main.append(answer);
    }

    let streak = document.createElement("p");
    streak.innerHTML = 'Streak: <span id="streak"></span>';
    streak.id = "streakContainer";
    
    main.append(streak);
    
}