import Soundfont from 'soundfont-player';
import {Interval, Note} from '@tonaljs/tonal';
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let score = 0;
let waiting = false;
// Intervals
const Intervals = {
    interval: "",
    diatonic: ["M2", "M3", "P4", "P5", "M6", "M7", "P8"],
    makeButtons: () => {
        const body = document.getElementsByTagName("body")[0];
        
        const playInterval = document.createElement("button");

        const major2 = document.createElement("button");
        const major3 = document.createElement("button");
        const perfect4 = document.createElement("button");
        const perfect5 = document.createElement("button");
        const major6 = document.createElement("button");
        const major7 = document.createElement("button");
        const octave = document.createElement("button");
        
        playInterval.innerText = "Start";
        playInterval.addEventListener("click", () => Intervals.playRandom());
        major2.innerText = "Major 2nd";
        major2.id = "M2";
        major3.innerText = "Major 3rd";
        major3.id = "M3";
        perfect4.innerText = "Perfect 4th";
        perfect4.id = "P4";
        perfect5.innerText = "Perfect 5th";
        perfect5.id = "P5";
        major6.innerText = "Major 6th";
        major6.id = "M6";
        major7.innerText = "Major 7th";
        major7.id = "M7";
        octave.innerText = "Octave";
        octave.id = "P8";
        body.append(playInterval, major2, major3, perfect4, perfect5, major6, major7, octave);

        let buttons = [major2, major3, perfect4, perfect5, major6, major7, octave];
        buttons.forEach(btn => btn.addEventListener("click", (e) => {
            checkResponse(Intervals.interval,e.target.id);
            }
        ));
    },
    playRandom: () => {
        
        const getRandom = (max) => {
            return Math.floor(Math.random() * max);
        }
        // Get starting note
        const start = notes[getRandom(notes.length)];
        // Get interval        
        let interval = Intervals.diatonic[getRandom(Intervals.diatonic.length)];
        // Get second note in interval
        const end = Note.transpose(start,interval);
        // Play interval
        let audioCtx = new AudioContext();
        Soundfont.instrument(audioCtx, 'acoustic_grand_piano').then((piano) => {
            piano.play(start, audioCtx.currentTime).stop(audioCtx.currentTime + 1);
            piano.play(end, audioCtx.currentTime + 1).stop(audioCtx.currentTime + 2);
        });
        Intervals.interval = interval;
        // Wait for user input, check response
        waiting = true;
    }
}
Intervals.makeButtons();

function checkResponse(interval, response) {
    if (interval == response && waiting) {
        // Show user is correct
        score++;
        document.getElementById("score").innerText = score;
        Intervals.playRandom();
    } else {
        // Show user is incorrect, show correct answer
        score--;
        document.getElementById("score").innerText = score;
        Intervals.playRandom();
        return false;
    }
}