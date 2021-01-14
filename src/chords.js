import Soundfont from 'soundfont-player';
import { Chord } from '@tonaljs/tonal';
import {cre} from './util';
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let score = 0;
const Chords = {
    type: "",
    tonic: "",
    notes: [],
    allChords: ["major", "minor", "augmented", "sus4", "sus2", "add6", "m6","diminished", "maj7", "min7", "mM7", "dom", "m7b5", "dim7", "11", "maj9"],
    selectedChords: ["major", "minor", "augmented", "diminished"],
    chordButton: (type) => {
        return cre("button", Chords.convert(type), (e) => {
            Chords.checkResponse(Chords.type, e.target.id);
        }, type);
    },
    selectionButton: (type) => {
        return cre("button", Chords.convert(type), (e) => Chords.changeSelection(type),)
    },
    makeControls: () => {
        const cre = (el) => document.createElement(el);
        const main = document.getElementsByTagName("main")[0];
        const controlDiv = document.createElement("div");
        controlDiv.id = 'controls';

        const playChord = cre("button");
        const replayChord = cre("button");
        const individual = cre("button");
        const reset = cre("button");
        
        playChord.innerText = "Start";
        replayChord.innerText = "Replay";
        reset.innerText = "Reset";
        individual.innerText = "Hear Individual Notes"
        
        playChord.addEventListener("click", () => Chords.playRandom());
        replayChord.addEventListener("click", () => Chords.playChord());
        individual.addEventListener("click", () => Chords.playIndividual());
        reset.addEventListener("click", () => Chords.resetScore())

        controlDiv.append(playChord, replayChord, individual, reset);
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
    playChord: (chord = Chords.notes) => {
        let ac = new AudioContext();
        Soundfont.instrument(ac, "acoustic_grand_piano").then((piano) => {
            for (let i = 0; i < chord.length; i++) {
                piano.play(chord[i], ac.currentTime).stop(ac.currentTime + 2);
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
    playIndividual: () => {
        let ac = new AudioContext();
        Soundfont.instrument(ac, "acoustic_grand_piano").then((piano) => {
            for (let i = 0; i < Chords.notes.length; i++) {
                piano.play(Chords.notes[i], ac.currentTime + i).stop(ac.currentTime + 1 + i);
            }
        })
    },
    checkResponse: (chord, response) => {
        if (chord == response) {
            score++;
            // Update Streak
            if (localStorage.getItem("chordStreak") < score) {
                localStorage.setItem("chordStreak", score);
                document.getElementById("streak").innerText = localStorage.getItem("chordStreak");
            }
            let correct = `<br>Correct! You answered ${Chords.convert(response)}`;
            document.getElementById("score").innerHTML = score + correct;
            Chords.playRandom();
        } else {
            // Show user is incorrect, show correct answer
            score--;
            let incorrect = `<br>Incorrect. You answered ${Chords.convert(response)} while the answer is ${Chords.convert(chord)}`;
            document.getElementById("score").innerHTML = score + incorrect;
            Chords.playRandom();
        }
    },
    hearIndividual: () => { },
    resetScore: () => {
        score = 0;
        document.getElementById("score").innerHTML = "Press 'Start' to hear an infinite loop of chords. Hit 'Replay' to hear the chord again. <br>Try to beat your streak!";

    },
    convert: (abbr) => {
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
    },
    load: () => {
        if (localStorage.getItem("chordStreak") != null) {
            document.getElementById("streak").innerText = localStorage.getItem("chordStreak");
        } else {
            localStorage.setItem("chordStreak", 0);
        }

        Chords.makeControls();
        Chords.makeChordButtons();
        Chords.makeSelections();
    },
}
Chords.load();
