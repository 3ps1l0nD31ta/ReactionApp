var experimentActive = false; var testActive = false;
var times = new Array();
var lastTimeColorChanged;
var colours = ["red","blue","green","yellow","grey"];
var colourData = new Array();
var currColour = 0;
var textFile = null;
for(var i = 0;i < colours.length;i++)
{
   colourData.push(new ColourData(colours[i]));
}
function CreateTextFile(text)
{
	var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
}
function ColourData(colour)
{
   this.colour = colour;
   this.values = new Array();
   this.meanDeltaTime;
   this.standardDerivation;
   this.calculateData = function(){
   	this.meanDeltaTime = 0.0;
		for (var i = 0; i < this.values.length; ++i) {
			this.meanDeltaTime += this.values[i]; 
		}
		this.meanDeltaTime = Math.round(this.meanDeltaTime / this.values.length);
		this.standardDerivation = 0.0;
		for (var i = 0; i < this.values.length; ++i) {
			var diff = (this.values[i] - this.meanDeltaTime);
			this.standardDerivation += diff * diff; 
		}
		this.standardDerivation =  Math.round(Math.sqrt(this.standardDerivation / this.values.length));
   }
}
function startExperiment() {
	experimentActive = true; 
	document.getElementById("time").innerHTML = "";
 	document.getElementById("count").innerHTML = ""; 
 	document.getElementById("mean").innerHTML = ""; 
 	document.getElementById("sd").innerHTML = ""; 
 	document.getElementById("instruction").innerHTML = "Press SPACE when color changes! Press 'a' for results!";
	startTest();
}

function startTest() {
	changeTextColor("black");
	timeInSeconds = Math.random() * 1 + 0; // 2 - 6s 
	window.setTimeout("showStimulus()", timeInSeconds * 1000);
}

function showStimulus() { 
	testActive = true;
	currColour = Math.floor(Math.random()*colours.length);
	changeTextColor(colours[currColour]);
}

function stopTest() {
	
	var currTime = new Date().getTime();
	var deltaTime = currTime - lastTimeColorChanged; 
	
	colourData[currColour].values.push(deltaTime);
	times.push(deltaTime);
	testActive = false;
	startTest();
}

function stopExperiment() { 
	window.setTimeout("showStimulus()", 0); 
	testActive = false;
	var meanDeltaTime = 0.0;
	for (var i = 0; i < times.length; ++i) {
		meanDeltaTime += times[i]; }
	meanDeltaTime = Math.round(meanDeltaTime / times.length);
	var standardDerivation = 0.0;
	for (var i = 0; i < times.length; ++i) {
		var diff = (times[i] - meanDeltaTime);
		standardDerivation += diff * diff; }
	standardDerivation =  Math.round(Math.sqrt(standardDerivation / times.length));
	for(var i = 0;i < colourData.length;i++)
	{
		colourData[i].calculateData();
	}
	outputText = "NAME,COUNT,MEAN,SD\n";
	for(var i = 0;i<colourData.length;i++)
	{
		outputText = outputText.concat(colours[i]+", " + colourData[i].values.length+", "+colourData[i].meanDeltaTime+", "+colourData[i].standardDerivation+"\n");
	}
	var create = document.getElementById('downloadData');
	create.addEventListener('click',function(){
		var link = document.getElementById('downloadlink');
    	link.href = CreateTextFile(outputText);
    	link.style.display = 'block';
	},false);
	times = [];
	experimentActive = false; 
}
function changeTextColor(newColor) { 
	document.getElementById("text").style.color = newColor; 
	document.getElementById("text").style.backgroundColor = newColor;
   document.body.style.background = newColor;
	lastTimeColorChanged = new Date().getTime();
}

document.onkeydown = onKey;
function onKey(e) { if (e == null) {
        e = window.event;
    }
	switch (e.which || e.charCode || e.keyCode) { 
		case 32:
		// space
		if (!experimentActive) {
			startExperiment(); } 
			else {
				if (testActive) {
					stopTest();
				} 
			}
		break;
		case 65: // a
		if (experimentActive) {
			stopExperiment(); 
		}
		break;
		case 66:
		// b
		// here you can extend... alert("pressed the b key"); break;
	} 
}