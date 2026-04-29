"use strict";

let x = {
	fixArr: [],
	flexArr: [],
	combinatorics: [],
	combined: [],
	fixFlexArr: [],
	broadArr: [],
	phraseArr: [],
	exactArr: []
}

window.onload = init;

function init() {
	click();
}

function click() {
	document.querySelector("button#gen").addEventListener("click", function() {
		x.fixArr = document.getElementById("fixarea").value.split(/[\n\r]/g);
		x.flexArr = document.getElementById("flexarea").value.split(/[\n\r]/g);
		x.combinatorics = [];
		checkArrs();
		
		if (x.fixArr.length === 0) {
			altClearFlex();
			altDoMatches();
		} else {
			loop();
			removeDuplicities();
			combineWords();
			bigCombine();
			clearWords();
			doMatches();
		}

		fillAreas();
	});

	document.querySelector("button#reset").addEventListener("click", function(event) {
		location.reload();
	});

	document.querySelector("button#copyAll").addEventListener("click", function(event) {
		copy("all");
	});

	document.querySelector("button#copyMod").addEventListener("click", function(event) {
		copy("modified");
	});

	document.querySelector("button#copyPhr").addEventListener("click", function(event) {
		copy("phrase");
	});

	document.querySelector("button#copyEx").addEventListener("click", function(event) {
		copy("exact");
	});
}

function checkArrs() {
	let newFixArr = [];

	for (let i = 0; i < x.fixArr.length; i++) {
		let noWhite = x.fixArr[i].replace(/^\s+/, "").replace(/\s+$/, "");

		if (noWhite !== "") {
			newFixArr.push(noWhite);
		}
	}

	x.fixArr = Array.from(new Set(newFixArr));

	let newFlexArr = [];

	for (let i = 0; i < x.flexArr.length; i++) {
		let noWhite = x.flexArr[i].replace(/^\s+/, "").replace(/\s+$/, "");

		if (noWhite !== "") {
			newFlexArr.push(noWhite);
		}
	}

	x.flexArr = Array.from(new Set(newFlexArr));
}

function loop(...args) {
	if (args.length === x.fixArr.length-1) {
		for (let i = 0; i < x.fixArr.length; i++) {
			x.combinatorics.push([...args, i]);
		}
	} else {
		for (let i = 0; i < x.fixArr.length; i++) {
			loop(...args, i);
		}
	}
}

function removeDuplicities() {
	let newCombinatorics = [];

	for (let i = 0; i < x.combinatorics.length; i++) {
		let set = new Set(x.combinatorics[i]);

		if (set.size === x.combinatorics[i].length) {
			newCombinatorics.push(x.combinatorics[i]);
		}
	}

	x.combinatorics = newCombinatorics;
}

function combineWords() {
	x.combined = [];

	for (let i = 0; i < x.combinatorics.length; i++) {
		let curComb = "";

		for (let j = 0; j < x.combinatorics[i].length; j++) {
			if (curComb === "") {
				curComb += [x.fixArr[x.combinatorics[i][j]]];
			} else {
				curComb += " " + [x.fixArr[x.combinatorics[i][j]]];
			}
		}

		x.combined.push(curComb);
	}
}

function bigCombine() {
	x.fixFlexArr = [];

	for (let i = 0; i < x.combined.length; i++) {
		for (let j = 0; j < x.flexArr.length; j++) {
			x.fixFlexArr.push(x.combined[i] + " " + x.flexArr[j]);
			x.fixFlexArr.push(x.flexArr[j] + " " + x.combined[i]);
		}
	}

	if (x.fixFlexArr.length === 0) {
		x.fixFlexArr = x.combined;
	}
}

function clearWords() {
	let clearArr = [];

	for (let i = 0; i < x.fixFlexArr.length; i++) {
		let clear = x.fixFlexArr[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "");

		if (x.fixFlexArr[i] !== clear) {
			clearArr.push(clear);
		}
	}

	x.fixFlexArr = x.fixFlexArr.concat(clearArr);
}

function doMatches() {
	x.broadArr = [];
	x.phraseArr = [];
	x.exactArr = [];

	for (let i = 0; i < x.fixFlexArr.length; i++) {
		let broad = ("+" + x.fixFlexArr[i]).replace(/ /g, " +").replace(/\+\*/g, "");
		let phrase = "\"" + x.fixFlexArr[i].replace(/\*/g, "") + "\"";
		let exact = "[" + x.fixFlexArr[i].replace(/\*/g, "") + "]";

		x.broadArr.push(broad);
		x.phraseArr.push(phrase);
		x.exactArr.push(exact);
	}
}

function fillAreas() {
	let brd = x.broadArr.join("\n");
	let phr = x.phraseArr.join("\n");
	let ext = x.exactArr.join("\n");

	document.getElementById("modified").value = brd;
	document.getElementById("phrase").value = phr;
	document.getElementById("exact").value = ext;
	document.getElementById("all").value = phr + "\n\n" + ext; // 'brd + "\n\n" +' extracted

	copy("all");
}

function copy(id) {
	let copyTxt = document.getElementById(id).value;
	var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = copyTxt;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function altClearFlex() {
	let clearArr = [];

	for (let i = 0; i < x.flexArr.length; i++) {
		let clear = x.flexArr[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "");

		if (x.flexArr[i] !== clear) {
			clearArr.push(clear);
		}
	}

	x.flexArr = x.flexArr.concat(clearArr);
}

function altDoMatches() {
	x.broadArr = [];
	x.phraseArr = [];
	x.exactArr = [];

	for (let i = 0; i < x.flexArr.length; i++) {
		let broad = ("+" + x.flexArr[i]).replace(/ /g, " +").replace(/\+\*/g, "");
		let phrase = "\"" + x.flexArr[i].replace(/\*/g, "") + "\"";
		let exact = "[" + x.flexArr[i].replace(/\*/g, "") + "]";

		x.broadArr.push(broad);
		x.phraseArr.push(phrase);
		x.exactArr.push(exact);
	}
}
