import Soundfont from 'soundfont-player';
import { Note } from '@tonaljs/tonal';
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let score = 0;
/* Object containing appropriate methods and properties
* for testing the user on intervals. 
*/
const Intervals = {
    type: "melodic", // Or harmonic
    interval: "", // The interval being played for the user to identify
    start: "", // note
    direction: "asc", // Or descending (desc)
    intervals: ["m2", "M2", "m3", "M3", "P4", "P5", "m6", "M6", "m7", "M7", "P8"],
    intervalButton: (id, interval) => {
        const button = document.createElement("button");
        button.id = id;
        button.innerText = interval;
        button.addEventListener("click", (e) => {
            Intervals.checkResponse(Intervals.interval, e.target.id)
        })
        return button;
    },
    makeControls: () => {
        const main = document.getElementsByTagName("main")[0];
        const controlDiv = document.createElement("div");
        controlDiv.id = "controls";

        const playInterval = document.createElement("button");
        const replayInterval = document.createElement("button");
        const changeDirection = document.createElement("button");
        const changeType = document.createElement("button");
        const reset = document.createElement("button");

        playInterval.innerText = "Start";
        replayInterval.innerText = "Replay";
        changeDirection.innerText = "Change Direction";
        changeType.innerText = "Melodic";
        reset.innerText = "Reset";

        playInterval.addEventListener("click", () => Intervals.playRandom());
        replayInterval.addEventListener("click", () => Intervals.playInterval(Intervals.interval))
        changeDirection.addEventListener("click", () => Intervals.changeDirection());
        changeType.addEventListener("click", () => Intervals.changeType(changeType));
        reset.addEventListener("click", () => Intervals.resetScore())

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
    changeDirection: () => {
        if (Intervals.direction == "asc") {
            Intervals.direction = "desc";
        } else {
            Intervals.direction = "asc";
        }
    },
    changeType: (btn) => {
        if (Intervals.type == "melodic") {
            Intervals.type = "harmonic";
        } else Intervals.type = "melodic";
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
    playHarmonic: (interval) => {
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
    resetScore: () => {
        score = 0;
        document.getElementById("score").innerText = "Press 'Start' to hear an infinite loop of intervals. Hit 'Replay' to hear the interval again. 'Change Direction' determines whether the interval is ascending (going up in pitch) or descending. A melodic interval is played at different times while the notes of a harmonic interval are played together.<br>The score represents your net number of correct and incorrect answers. Try to beat your streak!";
    },
    /* Convert abbreviations of intervals to their full name.
    *  Must update if any new intervals are added.
    */
    convert: (intervalAbbr) => {
        switch (intervalAbbr) {
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
        }
    },
    checkResponse: (interval, response) => {
        if (interval == response) {
            // Show user is correct
            score++;
            // Update Streak
            if (localStorage.getItem("streak") != null && localStorage.getItem("streak") < score) {
                localStorage.setItem("streak", score);
                document.getElementById("streak").innerText = localStorage.getItem("streak");
            }
            let correct = `<br>Correct! You answered ${Intervals.convert(response)}`;
            document.getElementById("score").innerHTML = score + correct;
            Intervals.playRandom();
        } else {
            // Show user is incorrect, show correct answer
            score--;
            let incorrect = `<br>Incorrect. You answered ${Intervals.convert(response)} while the answer is ${Intervals.convert(interval)}`;
            document.getElementById("score").innerHTML = score + incorrect;
            Intervals.playRandom();
        }
    },
    load: () => {
        if (localStorage.getItem("streak") != null) {
            document.getElementById("streak").innerText = localStorage.getItem("streak");
        }

        Intervals.makeControls();
        Intervals.makeIntervalButtons();
    }
}
Intervals.load();

