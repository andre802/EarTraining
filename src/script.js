import './style.css';
import Soundfont from 'soundfont-player';
import { Note } from '@tonaljs/tonal';
import { cre, expand, Header, Score } from './util';

const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let score = 0;
let main = document.getElementsByTagName("main")[0];

Header("Intervals")
Score("Intervals");

/** Object containing appropriate methods and properties
* for testing the user on intervals. 
*/
const Intervals = {
    type: "melodic", // Or harmonic
    interval: "", // The interval being played for the user to identify
    start: "", // note
    direction: "asc", // Or descending (desc)
    intervals: ["M2", "M3", "P4", "P5", "M6", "M7", "P8"],
    allIntervals: ["m2", "M2", "m3", "M3", "P4", "d5", "P5", "m6", "M6", "m7", "M7", "P8", "m9", "M9"],
    intervalButton: (id, interval) => {
        return cre("button", interval, (e) => {
            Intervals.checkResponse(Intervals.interval, e.target.id)
        }, id);
    },
    makeControls: () => {
        const main = document.getElementsByTagName("main")[0];
        const controlDiv = document.createElement("div");
        controlDiv.id = "controls";

        const playInterval = cre("button", "Start", () => Intervals.playRandom());
        const replayInterval = cre("button", "Replay", () => Intervals.playInterval(Intervals.interval));
        const changeDirection = cre("button", "Change Direction", () => Intervals.changeDirection());
        const changeType = cre("button", "Melodic", () => Intervals.changeType(changeType));
        const reset = cre("button", "Reset", () => Intervals.resetScore());

        controlDiv.append(playInterval, replayInterval, changeDirection, changeType, reset);
        main.append(controlDiv);
    },
    makeIntervalButtons: () => {
        const main = document.getElementsByTagName("main")[0];
        const intervalDiv = document.createElement("div");
        intervalDiv.id = "intervals";
        for (let i = 0; i < Intervals.intervals.length; i++) {
            intervalDiv.append(Intervals.intervalButton(Intervals.intervals[i], Intervals.convert(Intervals.intervals[i])));
        }
        main.append(intervalDiv);

    },
    makeSelections: () => {
        const section = document.createElement("section");
        const p = document.createElement("p");
        p.innerText = "Click to add or remove the types of intervals to hear.";
        section.id = "selections";
        section.appendChild(p);
        for (let i = 0; i < Intervals.allIntervals.length; i++) {
            section.append(Intervals.selectionButton(Intervals.allIntervals[i]))
        }
        main.append(section);
    },
    selectionButton: (name) => {
        let disabled = (Intervals.intervals.includes(name)) ? "disabled" : "";
        return cre("button", Intervals.convert(name), () => {
            Intervals.changeSelection(name);
        }, disabled, "select");
    },
    changeDirection: () => {
        Intervals.direction == "asc" ? Intervals.direction = "desc" : Intervals.direction = "asc";
    },
    /**
     * @param {string} name - Interval to be either removed or added
     * to the selection of intervals being tested. 
     */
    changeSelection: (name) => {
        /**
        * If interval selected is in the pool of heard 
        * intervals, remove it from pool and delete the
        * corresponding Element from the HTML tree.
        */
        if (Intervals.intervals.includes(name)) {
            Intervals.intervals = Intervals.intervals.filter((interName) => interName != name);
            // Find single element using filter, then remove Element from its tree
            Array.from(document.getElementById("intervals").children).filter(el => el.id == name)[0].remove();
        } else {
            // Else add to heard intervals in inner arr and for the user
            Intervals.intervals.push(name);
            document.getElementById("intervals").append(Intervals.intervalButton(name, Intervals.convert(name)));
        }
    },
    /**
     * Callback function attached as an event listener to the specified button.
     * Changes the type of the interval played, either harmonic or melodic
     * and updates the text of the button.
     * @param {HTMLButtonElement} btn 
     */
    changeType: (btn) => {
        Intervals.type == "melodic" ? Intervals.type = "harmonic" : Intervals.type = "melodic";
        btn.innerText = Intervals.type.substring(0, 1).toUpperCase() + Intervals.type.substring(1,);
    },
    playMelodic: (interval) => {
        let end;
        // Determine end depending on if direction of interval is ascending or descending
        if (Intervals.direction == "asc") {
            end = Note.transpose(Intervals.start, interval);
        } else end = Note.transpose(Intervals.start, interval.substr(0, 1) + '-' + interval.substr(1));
        // Play interval
        let audioCtx = new AudioContext();
        Soundfont.instrument(audioCtx, 'acoustic_grand_piano').then((piano) => {
            piano.play(Intervals.start, audioCtx.currentTime).stop(audioCtx.currentTime + 1);
            piano.play(end, audioCtx.currentTime + 1).stop(audioCtx.currentTime + 2);
        });
    },
    /**
     * Plays the harmonic
     * @param {string} interval - Name of the randomly generated interval
     * to be played to the user. 
     */
    playHarmonic: (interval) => {
        // Determine the other note in the interval
        let end = Note.transpose(Intervals.start, interval);
        // Play interval
        let audioCtx = new AudioContext();
        Soundfont.instrument(audioCtx, 'acoustic_grand_piano').then((piano) => {
            piano.play(Intervals.start, audioCtx.currentTime).stop(audioCtx.currentTime + 1);
            piano.play(end, audioCtx.currentTime).stop(audioCtx.currentTime + 1);
        });
    },
    playInterval: (interval) => {
        if (Intervals.type == "melodic") {
            Intervals.playMelodic(interval);
        } else Intervals.playHarmonic(interval);
    },
    playRandom: () => {
        const getRandom = (max) => {
            return Math.floor(Math.random() * max);
        }
        // Get random starting note
        const start = notes[getRandom(notes.length)];
        Intervals.start = start;
        // Get random interval        
        let interval = Intervals.intervals[getRandom(Intervals.intervals.length)];
        Intervals.interval = interval;
        // Play interval depending on type
        if (Intervals.type == "harmonic") {
            Intervals.playHarmonic(interval);
        } else Intervals.playMelodic(interval);
    },
    /**
     * Resets the score of the user and updates the text for the user.
     */
    resetScore: () => {
        score = 0;
        document.getElementById("score").innerText = "Press 'Start' to hear an infinite loop of intervals. Hit 'Replay' to hear the interval again. 'Change Direction' determines whether the interval is ascending (going up in pitch) or descending. A melodic interval is played at different times while the notes of a harmonic interval are played together.<br>The score represents your net number of correct and incorrect answers. Try to beat your streak!";
    },
    /* Convert abbreviations of intervals to their full name,
    * calling the expand function within util with the appropriate
    * identifier for the page.
    * Must update if any new intervals are added.
    */
    convert: (intervalAbbr) => {
        return expand(intervalAbbr, "interval");
    },
    /**
     * Compares the correct interval to the interval chosen by the user
     * and displays the appropriate message and updates the score as well
     * as the streak in local storage if need be.
     * @param {string} interval - The interval that was played for the user.
     * @param {string} response  - The interval that the user chose for their answer.
     */
    checkResponse: (interval, response) => {
        if (interval == response) {
            // Show user is correct
            score++;
            // Update Streak
            if (localStorage.getItem("streak") < score) {
                localStorage.setItem("streak", score);
                document.getElementById("streak").innerText = localStorage.getItem("streak");
            }
            let correct = `<br>Correct! You answered ${Intervals.convert(response)}`;
            document.getElementById("score").innerHTML = score + correct;
        } else {
            // Show user is incorrect, show correct answer
            score--;
            let incorrect = `<br>Incorrect. You answered ${Intervals.convert(response)} while the answer is ${Intervals.convert(interval)}`;
            document.getElementById("score").innerHTML = score + incorrect;
        }
        Intervals.playRandom();
    },
    /**
     * Shows the streak of the user to the value held within local storage.
     *  If the value is null, meaning the user is new, the item is set to 0. 
     * The methods to build and show the controls, buttons, and selections are then called.
     */
    load: () => {
        if (localStorage.getItem("streak") != null) {
            document.getElementById("streak").innerText = localStorage.getItem("streak");
        } else {
            localStorage.setItem("streak", 0);
        }
        Intervals.makeControls();
        Intervals.makeIntervalButtons();
        Intervals.makeSelections();
    }
}
Intervals.load();

