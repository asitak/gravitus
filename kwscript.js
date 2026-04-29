$(function() {
	let kw = {
		fix: [],
		modiFixRaw: "+",
		cleanFix: [],
		modiFixClean: "+",
		combFix: [],
		combFixRaw: [],
		combFixClean: [],
		flex: [],
		cleanFlex: [],
		fullArray: [],
		fullArrayRaw: [],
		fullArrayClean: [],
		fullArrayRawModified: [],
		fullArrayCleanModified: [],
		fullArrayRawPhrase: [],
		fullArrayCleanPhrase: [],
		fullArrayRawExact: [],
		fullArrayCleanExact: [],
		modifiedString: "",
		phraseString: "",
		exactString: "",

		addFix(val) {
			this.fix.push(val);
		},
		
		addFlex(val) {
			this.flex.push(val);
		},

		res() {
			this.fix = [];
			this.cleanFix = [];
			this.combFix = [];
			this.modiFixRaw = "+";
			this.modiFixClean = "+";
			this.combFixRaw = [];
			this.combFixClean = [];
			this.flex = [];
			this.cleanFlex = [];

			this.fullArray = [];
			this.fullArrayRaw = [];
			this.fullArrayClean = [];
			this.fullArrayRawModified = [];
			this.fullArrayCleanModified = [];
			this.fullArrayRawPhrase = [];
			this.fullArrayCleanPhrase = [];
			this.fullArrayRawExact = [];
			this.fullArrayCleanExact = [];

			if (!$("#inflate").is(":checked")) {
				this.modifiedString = "";
				this.phraseString = "";
				this.exactString = "";
			}

			return this;
		},
		
		clear() {
			for (let i = 0; i < this.fix.length; i++) {
				this.cleanFix[i] = this.fix[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			}			

			for (let i = 0; i < this.flex.length; i++) {
				this.cleanFlex[i] = this.flex[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			}

			return this;			
		},

		clearText() {
			this.fix = [];
			this.cleanFix = [];
			this.combFix = [];
			this.modiFixRaw = "+";
			this.modiFixClean = "+";
			this.modifiedString = "";
			this.phraseString = "";
			this.exactString = "";

			this.fullArray = [];
			this.fullArrayRaw = [];
			this.fullArrayClean = [];
			this.fullArrayRawModified = [];
			this.fullArrayCleanModified = [];
			this.fullArrayRawPhrase = [];
			this.fullArrayCleanPhrase = [];
			this.fullArrayRawExact = [];
			this.fullArrayCleanExact = [];
		},
		
		combineFix() {
			if (this.fix[1]) {
				for (let i = 0; i < this.fix.length; i++) {
					for (let j = 0; j < this.fix.length; j++) {
						if (this.fix[2]) {
							for (let k = 0; k < this.fix.length; k++) {
								if (i != j && i != k && j != k) {
									this.combFix.push(this.fix[i] + " " + this.fix[j] + " " + this.fix[k]);
									this.combFixRaw.push(this.fix[i] + " " + this.fix[j] + " " + this.fix[k]);
								}	
							}
						} else {
							if (i != j) {
								this.combFix.push(this.fix[i] + " " + this.fix[j]);
								this.combFixRaw.push(this.fix[i] + " " + this.fix[j]);
							}
						}
					}
				}

				for (let i = 0; i < this.cleanFix.length; i++) {
					for (let j = 0; j < this.cleanFix.length; j++) {
						if (this.cleanFix[2]) {
							for (let k = 0; k < this.cleanFix.length; k++) {
								if (i != j && i != k && j != k) {
									this.combFix.push(this.cleanFix[i] + " " + this.cleanFix[j] + " " + this.cleanFix[k]);
									this.combFixClean.push(this.cleanFix[i] + " " + this.cleanFix[j] + " " + this.cleanFix[k]);	
								}	
							}
						} else {
							if (i != j) {
								this.combFix.push(this.cleanFix[i] + " " + this.cleanFix[j]);
								this.combFixClean.push(this.cleanFix[i] + " " + this.cleanFix[j]);
							}
						}
					}
				}	
			} else if (this.fix[0]) {
				if (this.cleanFix[0]) {
					this.combFix = [this.fix[0], this.cleanFix[0]];
					this.combFixRaw = [this.fix[0]];
					this.combFixClean = [this.cleanFix[0]];
				} else {
					this.combFix = [this.fix[0]];
				}
			} else {
				alert("Najskôr zadaj aspoň jedno kľúčové slovo...");
			}

			return this;
		},

		createNoFlexArray() { //***
			let combFixSet = new Set();

			for (let x of this.combFix) {
				combFixSet.add(x);
			}

			this.combFix = [];
			for (let x of combFixSet) {
				this.combFix.push(x);
			}

			if ($("#fullPlus").is(":checked")) {
				let noFlexModifArr = [];

				for (let i = 0; i < this.combFix.length; i++) {
					let newStr = this.combFix[i].replace(/ /g, " +");
					noFlexModifArr.push("+" + newStr);				
				}

				for (let x of noFlexModifArr) {
					this.modifiedString += x + "\n";
				}
			} else {
				for (let i = 0; i < this.fix.length; i++) {
					if (i == 0) {
						this.modiFixRaw += this.fix[i];
						this.modiFixClean += this.cleanFix[i];	
					} else {
						this.modiFixRaw += " +" + this.fix[i];
						this.modiFixClean += " +" + this.cleanFix[i];
					}
				}

				let modifSet = new Set([this.modiFixRaw, this.modiFixClean]);

				for (let x of modifSet) {
					this.modifiedString += x + "\n";
				}			
			}

			for (let x of this.combFix) {
				this.phraseString += "\"" + x + "\"" + "\n";
				this.exactString += "[" + x + "]\n";
			}			

			return this;
		},

		createFullArray() {
			for (let i = 0; i < this.combFixRaw.length; i++) {
				for (let j = 0; j < this.flex.length; j++) {
					this.fullArrayRaw.push(this.combFixRaw[i] + " " + this.flex[j]);
				}

				for (let j = 0; j < this.flex.length; j++) {
					this.fullArrayRaw.push(this.flex[j] + " " + this.combFixRaw[i]);
				}				
			}

			for (let i = 0; i < this.combFixClean.length; i++) {
				for (let j = 0; j < this.cleanFlex.length; j++) {
					this.fullArrayClean.push(this.combFixClean[i] + " " + this.cleanFlex[j]);
				}

				for (let j = 0; j < this.cleanFlex.length; j++) {
					this.fullArrayClean.push(this.cleanFlex[j] + " " + this.combFixClean[i]);
				}				
			}

			for (let i = 0; i < this.fix.length; i++) {
				if (i == 0) {
					this.modiFixRaw += this.fix[i];
					this.modiFixClean += this.cleanFix[i];	
				} else {
					this.modiFixRaw += " +" + this.fix[i];
					this.modiFixClean += " +" + this.cleanFix[i];
				}
			}

			if ($("#fullPlus").is(":checked")) {
				for (let i = 0; i < this.fullArrayClean.length; i++) {
					let newStr = this.fullArrayClean[i].replace(/ /g, " +");
					this.fullArrayCleanModified.push("+" + newStr);				
				}

				for (let i = 0; i < this.fullArrayRaw.length; i++) {
					let newStr = this.fullArrayRaw[i].replace(/ /g, " +");
					this.fullArrayRawModified.push("+" + newStr);				
				}
			} else {
				for (let i = 0; i < this.flex.length; i++) {
					this.fullArrayRawModified.push(this.modiFixRaw + " +" + this.flex[i]);
					this.fullArrayCleanModified.push(this.modiFixClean + " +" + this.cleanFlex[i]);			
				}
			}

			for (let i = 0; i < this.fullArrayClean.length; i++) {
				this.fullArrayCleanPhrase.push("\"" + this.fullArrayClean[i] + "\"");				
			}

			for (let i = 0; i < this.fullArrayRaw.length; i++) {
				this.fullArrayRawPhrase.push("\"" + this.fullArrayRaw[i] + "\"");				
			}

			for (let i = 0; i < this.fullArrayClean.length; i++) {
				this.fullArrayCleanExact.push("[" + this.fullArrayClean[i] + "]");				
			}

			for (let i = 0; i < this.fullArrayRaw.length; i++) {
				this.fullArrayRawExact.push("[" + this.fullArrayRaw[i] + "]");				
			}

			let modifSet = new Set();
			for (let x of this.fullArrayRawModified) {
				modifSet.add(x);
			}

			for (let x of this.fullArrayCleanModified) {
				modifSet.add(x);
			}

			for (let x of modifSet) {
				this.modifiedString += x + "\n";
			}

			let phraseSet = new Set();
			for (let x of this.fullArrayRawPhrase) {
				phraseSet.add(x);
			}

			for (let x of this.fullArrayCleanPhrase) {
				phraseSet.add(x);
			}

			for (let x of phraseSet) {
				this.phraseString += x + "\n";
			}

			let exactSet = new Set();
			for (let x of this.fullArrayRawExact) {
				exactSet.add(x);
			}

			for (let x of this.fullArrayCleanExact) {
				exactSet.add(x);
			}

			for (let x of exactSet) {
				this.exactString += x + "\n";
			}

			return this;
		},

		fillEm() {
			$("#modified").text(this.modifiedString);
			$("#phrase").text(this.phraseString);
			$("#exact").text(this.exactString);

			let all = this.modifiedString + "\n" + this.phraseString + "\n" + this.exactString;

			$("#all").text(all);
		}
	};

	$("#fixMore").on("click", function() {		
		$(this).before("<span class=\"fixSpan\"><br><input class=\"fix\"></span>");
		$("#fixLess").attr("disabled", false);
		
		if ($(".fix").length == 3) {
			$(this).attr("disabled", true);
		}
	});

	$("#fixLess").on("click", function() {		
		$(".fixSpan").last().remove();
		$("#fixMore").attr("disabled", false);
		
		if ($(".fixSpan").length == 0) {
			$(this).attr("disabled", true);
		}
	});

	$("#flexMore").on("click", function() {		
		$(this).before("<span class=\"flexSpan\"><br><input class=\"flex\"></span>");
		$("#flexLess").attr("disabled", false);
		
		/*if ($(".flex").length == 3) {
			$(this).attr("disabled", true);
		}*/
	});

	$("#flexLess").on("click", function() {		
		$(".flexSpan").last().remove();
		$("#flexMore").attr("disabled", false);
		
		if ($(".flexSpan").length == 0) {
			$(this).attr("disabled", true);
		}
	});

	$("#gen").on("click", function() {
		kw.res();

		$(".fix").each(function() {
			kw.addFix($(this).val());
		});

		$(".flex").each(function() {
			kw.addFlex($(this).val());
		});

		if ($(".flex").first().val() == "") {
			kw.clear().combineFix().createNoFlexArray().fillEm();			
		} else {
			kw.clear().combineFix().createFullArray().fillEm();
		}


		console.dir(kw);
	});

	$("#clean").on("click", function() {
		kw.clearText();
		$("textarea").each(function() {
			$(this).text("");
			kw.res();
		});
	});

	$("#reset").on("click", function() {
		location.reload();
	});

	$("#copyAll").on("click", function() {
		let x = $("#all").text();

		var $temp = $("<textarea></textarea>");
 		$("body").append($temp);
		$temp.text(x).select();
		document.execCommand("copy");
		$temp.remove();
	});

	$("#copyMod").on("click", function() {
		let x = $("#modified").text();

		var $temp = $("<textarea></textarea>");
 		$("body").append($temp);
		$temp.text(x).select();
		document.execCommand("copy");
		$temp.remove();
	});

	$("#copyPhr").on("click", function() {
		let x = $("#phrase").text();

		var $temp = $("<textarea></textarea>");
 		$("body").append($temp);
		$temp.text(x).select();
		document.execCommand("copy");
		$temp.remove();
	});

	$("#copyEx").on("click", function() {
		let x = $("#exact").text();

		var $temp = $("<textarea></textarea>");
 		$("body").append($temp);
		$temp.text(x).select();
		document.execCommand("copy");
		$temp.remove();
	});	
});

/*$("button#copy").click(function() {
	$("textarea#script").select();
	document.execCommand("copy");
	// https://ourcodeworld.com/articles/read/143/how-to-copy-text-to-clipboard-with-javascript-easily
});*/