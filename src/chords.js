import Soundfont from 'soundfont-player';
import { Chord } from '@tonaljs/tonal';
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let score = 0;
const Chords = {
    type: "",
    tonic: "",
    notes: [],
    allChords: ["major", "minor", "augmented", "diminished", "maj7", "min7", "dom"],
    selectedChords: ["major", "minor", "augmented", "diminished"],
    chordButton: (type) => {
        const button = document.createElement("button");
        button.id = type;
        button.innerText = type;
        button.addEventListener("click", (e) => {
            Chords.checkResponse(Chords.type, e.target.id);
        })
        return button;
    },
    selectionButton: (type) => {
        const button = document.createElement("button");
        button.classList = "select";
        button.innerText = type;
        button.addEventListener("click", (e) => {
            Chords.changeSelection(type);
        })
        return button;
    },
    makeControls: () => {
        const cre = (el) => document.createElement(el);
        const main = document.getElementsByTagName("main")[0];
        const controlDiv = cre("div");
        controlDiv.id = 'controls';

        const playChord = cre("button");
        const replayChord = cre("button");
        const reset = cre("button");

        playChord.innerText = "Start";
        replayChord.innerText = "Replay";
        reset.innerText = "Reset";

        playChord.addEventListener("click", () => Chords.playRandom());
        replayChord.addEventListener("click", () => Chords.playChord());
        reset.addEventListener("click", () => Chords.resetScore())

        controlDiv.append(playChord, replayChord, reset);
        main.append(controlDiv);
    },
    makeChordButtons: () => {
        const main = document.getElementsByTagName("main")[0];
        const chordDiv = document.createElement("div");
        chordDiv.id = "chords";
        for (let i = 0; i < Chords.selectedChords.length; i++) {
            chordDiv.append(Chords.chordButton(Chords.selectedChords[i]));
        }
        main.append(chordDiv);
    },
    makeSelections: () => {
        const main = document.getElementsByTagName("main")[0];
        const section = document.createElement("section");
        const  p = document.createElement("p");
        p.innerText = "Click to add or remove types of chords to test"
        section.id = "selections";
        section.appendChild(p);
        for (let i = 0; i < Chords.allChords.length; i++) {
            section.append(Chords.selectionButton(Chords.allChords[i]));
        }
        main.append(section);
        
    },
    changeSelection: (type) => {
        // Remove chord type from selection
        if (Chords.selectedChords.includes(type)) {
            Chords.selectedChords = Chords.selectedChords.filter(chord => chord != type);
            // Remove button from chord selections
            Array.from(document.getElementById("chords").children).filter(el => el.id == type)[0].remove();
            // TODO Undisable button from section
            //Array.from(document.getElementById("selections").children).filter(el => el.id == type)[0].disabled = "false";
        } else {
            // Add chord to selection
            Chords.selectedChords.push(type);
            document.getElementById("chords").append(Chords.chordButton(type));
           // TODO disable
            //Array.from(document.getElementById("selections").children).filter(el => el.innerText == type)[0].disabled = "true";
        }
    },
    playChord: () => {
        let ac = new AudioContext();
        Soundfont.instrument(ac, "acoustic_grand_piano").then((piano) => {
            for (let i = 0; i < Chords.notes.length; i++) {
                piano.play(Chords.notes[i], ac.currentTime).stop(ac.currentTime + 2);
            }
        })
    },
    playRandom: () => {
        const getRandom = (max) => {
            return Math.floor(Math.random() * max);
        }
        // Get random tonic of chord
        Chords.tonic = notes[getRandom(notes.length)];
        // Get random type
        Chords.type = Chords.selectedChords[getRandom(Chords.selectedChords.length)];
        // Get notes of chord using tonal library
        Chords.notes = Chord.getChord(Chords.type, Chords.tonic).notes;
        // Play chord
        Chords.playChord();
    },
    checkResponse: (chord, response) => {
        if (chord == response) {
            score++;
            // Update Streak
            if (localStorage.getItem("chordStreak") != null || localStorage.getItem("chordStreak") < score) {
                localStorage.setItem("chordStreak", score);
                document.getElementById("streak").innerText = localStorage.getItem("chordStreak");
            }
            let correct = `<br>Correct! You answered ${response}`;
            document.getElementById("score").innerHTML = score + correct;
            Chords.playRandom();
        } else {
            // Show user is incorrect, show correct answer
            score--;
            let incorrect = `<br>Incorrect. You answered ${response} while the answer is ${chord}`;
            document.getElementById("score").innerHTML = score + incorrect;
            Chords.playRandom();
        }
    },
    hearIndividual: () => { },
    resetScore: () => {
        score = 0;
        document.getElementById("score").innerHTML = "Press 'Start' to hear an infinite loop of chords. Hit 'Replay' to hear the chord again. <br>Try to beat your streak!";

    },
    load: () => {
        if (localStorage.getItem("chordStreak") != null) {
            document.getElementById("streak").innerText = localStorage.getItem("chordStreak");
        }

        Chords.makeControls();
        Chords.makeChordButtons();
        Chords.makeSelections();
    },
}
Chords.load();