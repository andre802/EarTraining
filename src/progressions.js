import Soundfont from 'soundfont-player';
import { Progression, RomanNumeral, Chord } from "@tonaljs/tonal";
let score = 0;
const Progressions = {
    selectedDegrees: ["Imaj", "iim", "iiim", "IVmaj", "Vmaj", "vim", "viio"],
    progression: ["Imaj"],
    length: 4,
    answer: [],
    /**
     * 
     * @param {string} chordName - name of one of the chords that could be
     * played in the progression
     * @return {HTMLButtonElement}
     * @TODO make into class 
     */
    progressionButton: (type) => {
        const button = document.createElement("button");
        button.id = type;
        button.innerText = type;
        button.addEventListener("click", (e) => Progressions.addResponse(e));
        return button;
    },
    addResponse: (e) => {
        console.log(Progressions.answer.length)
        let answer = e.target.id;
        let i;
        if (Progressions.answer.includes(null)) {
            i = Progressions.answer.indexOf(null);
            Progressions.answer[Progressions.answer.indexOf(null)] = answer;
            document.getElementById("answers").insertBefore(Progressions.responseSpan(answer, i), document.getElementById("answers").children[i]);
        } else {
            Progressions.answer.push(answer);
            document.getElementById("answers").append(Progressions.responseSpan(answer, Progressions.answer.length - 1))
        }
        // Check answer
        if (Progressions.progression.length == Progressions.answer.length) {
            Progressions.checkResponse();
        }
    },
    /**
     * @param {string[]} arr1 Chord Progression randomly generated
     * @param {string[]} arr2 Chord Progression identified by user
     * @return {boolean} true if chord progressions are the same between the arrays
     */
    equal: (arr1, arr2) => {
        if (arr1.length != arr2.length) {return false}
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) return false;
        }
        return true;
    },
    checkResponse: () => {
        if (Progressions.equal(Progressions.progression, Progressions.answer)) {
            // Update score
            score++;
            // Update HTML
            document.getElementById("score").innerText = "Correct!";
            setTimeout(() => {
                document.getElementById("score").innerText = score;
                document.getElementById("answers").innerText = "";
            
            }, 3000)
            // Update array presenting user's responses
            Progressions.answer = [];
            // Set local storage if necessary
             if (localStorage.getItem("progressionStreak") < score) {
                localStorage.setItem("progressionStreak", score);
                document.getElementById("streak").innerText = localStorage.getItem("progressionStreak");
            }
            // Play new progression
            Progressions.playRandom();
        } else {
            score = 0;
            document.getElementById("score").innerText = score;
            Progressions.answer.forEach((el, i) => {
                if (el != Progressions.progression[i] && Progressions.answer[i] != null) {
                    Array.from(document.getElementById("answers").children)[i].classList += " incorrect";
                }
            })
        }

    },
    /**
     * 
     * @param {string} answer - abbreviated name of the chord selected by the user
     * @param {number} i - index of the chord within the Progression.answer array 
     * @return {HTMLSpanElement} span element with text of the chord name, id, appropriate
     * class name and event handler to remove node from selected chords
     */
    responseSpan: (answer, i) => {
        let span = document.createElement("span");
        span.innerText = answer;
        span.id = answer;
        span.classList += "answer";
        // Remove from answers
        span.addEventListener("click", (e) => {
            if (e.target.id != Progressions.progression[i] && e.target.classList.contains("incorrect")) {
                Progressions.answer.splice(i, 1, null);
                e.target.remove();
            }
        });
        return span;
    },
    makeControls: () => {
        const cre = (el) => document.createElement(el);
        const main = document.getElementsByTagName('main')[0];
        const controlDiv = cre("div");
        controlDiv.id = 'controls';

        const playProgression = cre("button");
        const replayProgression = cre("button");
        const reset = cre("button");

        playProgression.innerText = "Start";
        replayProgression.innerText = "Replay";
        reset.innerText = "Reset";

        playProgression.addEventListener("click", () => {
            Progressions.playRandom();
        })
        replayProgression.addEventListener("click", () => {
            Progressions.playProgression();
        })
        reset.addEventListener("click", () => {
            Progressions.resetScore();
        })
        controlDiv.append(playProgression, replayProgression, reset);
        main.append(controlDiv);
    },
    makeProgressionButtons: () => {
        const main = document.getElementsByTagName("main")[0];
        const progressionDiv = document.createElement("div");
        progressionDiv.id = "progressions";
        for (let i = 0; i < Progressions.selectedDegrees.length; i++) {
            progressionDiv.append(Progressions.progressionButton(Progressions.selectedDegrees[i]));
        }
        main.append(progressionDiv);
    },
    /** Plays the randomly generated chord progression. 
     * @see Progressions.playChord
    */
    playProgression: () => {
        for (let i = 0; i < Progressions.length; i++) {
            setTimeout(() => {
                Progressions.playChord(Progressions.progression[i]);
            }, 1000 * i);
        }
    },
    playChord: (chord) => {
        let ac = new AudioContext();
        let notes = Chord.get(Progression.fromRomanNumerals("C5", [Progressions.chordType(chord)])).notes;
        Soundfont.instrument(ac, "acoustic_grand_piano").then((piano) => {
            for (let i = 0; i < notes.length; i++) {
                piano.play(notes[i], ac.currentTime).stop(ac.currentTime + 1);
            }
        })
    },
    /**
     * @param {string} chord - Abbreviated name for the chord 
     * @return {string} Full name for the chord
     */
    chordType: (type) => {
        if (new RegExp(/.+maj/).test(type)) {
            let a = type.replace(/(.+)maj/, '$1major');
            return a;
        } else if (new RegExp(/.+(m)/).test(type)) {
            let b = type.replace(/\(.+\)m/, "$1minor");
            return b;
        } else return type;
    },
    /** Generates a random chord progression from the available chords then calls
     * Progressions.playProgression to play the progression.
     *  @see Progressions.playProgression
     */
    playRandom: () => {
        Progressions.progression = ["Imaj"];
        const getRandom = (max) => {
            return Math.floor(Math.random() * max);
        }
        for (let i = 1; i < Progressions.length; i++) {
            Progressions.progression.push(Progressions.selectedDegrees[getRandom(Progressions.selectedDegrees.length)]);
        }
        Progressions.playProgression();
    },
    load: () => {
        if (localStorage.getItem("progressionStreak") != null) {
            document.getElementById("streak").innerText = localStorage.getItem("progressionStreak");
        } else {
            localStorage.setItem("progressionStreak", 0);
        }

        Progressions.makeControls();
        Progressions.makeProgressionButtons();
    }
}
Progressions.load();
