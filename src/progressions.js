import Soundfont from 'soundfont-player';
import { Progression, RomanNumeral, Chord } from "@tonaljs/tonal";
let score = 0;
const Progressions = {
    selectedDegrees: ["Imaj", "iim", "iiim", "IVmaj", "Vmaj", "vim", "viio"],
    progression: ["Imaj"],
    length: 4,
    answer: [],
    progressionButton: (type) => {
        const button = document.createElement("button");
        button.id = type;
        button.innerText = type;
        button.addEventListener("click", (e) => Progressions.addResponse(e));
        return button;
    },
    addResponse: (e) => {
        let answer = e.target.id;
        console.log(answer);
        if (Progressions.answer.includes(null)) {
            Progressions.answer[Progressions.answer.indexOf(null)] = answer;
        } else {
            Progressions.answer.push(answer);
        }
        document.getElementById("answers").append(Progressions.responseSpan(answer, Progressions.answer.length - 1));
        console.log(Progressions.progression);
        console.log(Progressions.answer);
        if (Progressions.progression.length == Progressions.answer.length) {
            Progressions.checkResponse();
        }
     },
     equal: (arr1, arr2) => {
        
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) return false;
        }
        return true;
     },
    checkResponse: () => {
        console.log(`Progression : ${Progressions.progression}`);
        console.log(`Answer : ${Progressions.answer}`);
        if (Progressions.equal(Progressions.progression, Progressions.answer)) {
            score++;
            document.getElementById("score").innerText = score;
            Progressions.answer = [];
            document.getElementById("answers").innerText = "";
            Progressions.playRandom();
        } else {
            Progressions.answer.forEach((el, i) => {
                if (el != Progressions.progression[i]) {
                    document.getElementById(el).classList += " incorrect";
                } 
            })
        }
    },
    responseSpan: (answer, i) => {
        let span = document.createElement("span");
        span.innerText = answer;
        span.id = answer;
        span.classList += "answer";
        // Remove from answers
        span.addEventListener("click", () => {
            Progressions.answer.splice(i, 1, null);
            console.log(Progressions.answer);
            Array.from(document.getElementById("answers").children).forEach((el, i) => {
                if (el.id != Progressions.progression[i] && Progressions.progression[i] !=null) {
                    el.remove();
                }
            });
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
    playProgression: () => {
        console.log(Progressions.progression);
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
    chordType: (type) => {
        if (new RegExp(/.+maj/).test(type)) {
            let a = type.replace(/(.+)maj/, '$1major');
            return a;
        } else if (new RegExp(/.+(m)/).test(type)) {
            let b = type.replace(/\(.+\)m/, "$1minor");
            return b;
        } else return type;
    },
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
        Progressions.makeControls();
        Progressions.makeProgressionButtons();
    }
}
Progressions.load();
