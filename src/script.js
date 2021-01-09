import Soundfont from 'soundfont-player';
import {Interval, Note} from '@tonaljs/tonal';
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let score = 0;
let waiting = false;
// Button factory
const Button = (id, interval) => {
    const button = document.createElement("button");
    button.id = id;
    button.innerText = interval;
    button.addEventListener("click", (e) => {
        checkResponse(Intervals.interval, e.target.id)
    })
    return button;
}
const Intervals = {
    type: "melodic",
    interval: "",
    start: "",
    direction: "asc",
    intervals: ["m2", "M2", "m3", "M3", "P4", "P5", "m6", "M6", "m7", "M7", "P8"],
    makeButtons: () => {
        if (localStorage.getItem("streak") > score) {
            document.getElementById("streak").innerText = localStorage.getItem("streak");
        }
        const body = document.getElementsByTagName("main")[0];
        
        const controlDiv = document.createElement("div");

        const playInterval = document.createElement("button");
        const replayInterval = document.createElement("button");
        const changeDirection = document.createElement("button");
        const changeType = document.createElement("button");
        controlDiv.append(playInterval, replayInterval, changeDirection, changeType);
        const intervalDiv = document.createElement("div");
        intervalDiv.append(
            Button("m2", "Minor 2nd"),
            Button("M2", "Major 2nd"),
            Button("m3", "Minor 3rd"), 
            Button("M3", "Major 3rd"),
            Button("P4", "Perfect 4th"),
            Button("P5", "Perfect 5th"),
            Button("m6", "Minor 6th"),
            Button("M6", "Major 6th"),
            Button("m7", "Minor 7th"),
            Button("M7", "Major 7th"),
            Button("P8", "Octave"));
        intervalDiv.id = "intervals";
        controlDiv.id = "controls";
        playInterval.innerText = "Start";
        replayInterval.innerText = "Replay";
        changeDirection.innerText = "Change Direction";
        changeType.innerText = "Melodic";
        playInterval.addEventListener("click", () => Intervals.playRandom());
        replayInterval.addEventListener("click", () => Intervals.playInterval(Intervals.interval))
        changeDirection.addEventListener("click", () => Intervals.changeDirection());
        changeType.addEventListener("click", () => Intervals.changeType(changeType));
        body.append(controlDiv, intervalDiv);
        
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
        btn.innerText = Intervals.type.substring(0,1).toUpperCase() + Intervals.type.substring(1,);
    },
    playMelodic: (interval) => {
        let end;
        // Determine end depending on if direction of interval is ascending or descending
        if (Intervals.direction == "asc") {
            end = Note.transpose(Intervals.start,interval);
        } else end = Note.transpose(Intervals.start, interval.substr(0,1) + '-' + interval.substr(1));
        // Play interval
        let audioCtx = new AudioContext();
        Soundfont.instrument(audioCtx, 'acoustic_grand_piano').then((piano) => {
            piano.play(Intervals.start, audioCtx.currentTime).stop(audioCtx.currentTime + 1);
            piano.play(end, audioCtx.currentTime + 1).stop(audioCtx.currentTime + 2);
        });
    },
    playHarmonic: (interval) => {
        let  end = Note.transpose(Intervals.start,interval);

        // Play interval
        let audioCtx = new AudioContext();
        Soundfont.instrument(audioCtx, 'acoustic_grand_piano').then((piano) => {
            piano.play(Intervals.start, audioCtx.currentTime).stop(audioCtx.currentTime + 1);
            piano.play(end, audioCtx.currentTime1).stop(audioCtx.currentTime + 1);
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
        // Get starting note
        const start = notes[getRandom(notes.length)];
        Intervals.start = start;
        // Get interval        
        let interval = Intervals.intervals[getRandom(Intervals.intervals.length)];
        Intervals.interval = interval;
        // Get second note in interval
        if (Intervals.type == "harmonic") {
            Intervals.playHarmonic(interval);
        } else Intervals.playMelodic(interval);
        
         
        // Wait for user input, check response
        waiting = true;
    },
    convert: (intervalAbbr) => {
        switch(intervalAbbr) {
            case("M2"):
                return "Major 2nd";
            case("m2"):
                return "Minor 2nd";
            case("M3"):
                return "Major 3rd";
            case("m3"):
                return "Minor 3rd";
            case ("P4"):
                return "Perfect 4th";
            case("P5"):
                return "Perfect 5th";
            case("M6"):
                return "Major 6th";
            case("m6"):
                return "Minor 6th";
            case("M7"):
                return "Major 7th";
            case("m7"):
                return "Minor 7th";
            case("P8"):
                return "Octave";
        }
    }
}
Intervals.makeButtons();

function checkResponse(interval, response) {
    if (interval == response && waiting) {
        // Show user is correct
        score++;
        // Update Streak
        if (localStorage.getItem("streak") > score) {
            document.getElementById("streak").innerText = localStorage.getItem("streak");
        }
        if (localStorage.getItem("streak") == null || localStorage.getItem("streak") < score) {
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
}