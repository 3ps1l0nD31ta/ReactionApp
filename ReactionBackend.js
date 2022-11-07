var experimentActive = false; var testActive = false;
var times = new Array();
var lastTimeColorChanged;
var colours = ["red","yellow","blue"];
var colourData = new Array();
for(var i = 0;i < colours.length;i++)
{
   colourData.push(new ColourData(colours[i]));
}
function ColourData(colour)
{
   this.colour = colour;
   this.values = new Array();
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
	timeInSeconds = Math.random() * 4 + 2; // 2 - 6s 
	window.setTimeout("showStimulus()", timeInSeconds * 1000);
}

function showStimulus() { 
	testActive = true;
	changeTextColor(colours[Math.floor(Math.random()*colours.length)]);
}

function stopTest() {
	var currTime = new Date().getTime();
	var deltaTime = currTime - lastTimeColorChanged; 
	times.push(deltaTime); 
	document.getElementById("time").innerHTML = deltaTime + "ms"; 
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
	document.getElementById("count").innerHTML = "Count: " + times.length; 
	document.getElementById("mean").innerHTML = "Mean: " + meanDeltaTime + "ms"; 
	document.getElementById("sd").innerHTML = "SD: " + standardDerivation + "ms"; 
	document.getElementById("instruction").innerHTML = "Press SPACE to start!"; 
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