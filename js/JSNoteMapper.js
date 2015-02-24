//Variables for the names of the keys and the black key numbers
this.blackKeys = [1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121,
                  3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123,
                  6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126, 
                  8, 20, 32, 44, 56, 68, 80, 92, 104, 116,
                  10, 22, 34, 46, 58, 70, 82, 94, 106, 118];
//Variables for the data that concerns this keyboard size
this.lowerKey = -1;
this.higherKey = -1;
this.currentMIDINumbers = [];
this.currentWhiteMIDINumbers = [];
this.numberOfWhiteKeys = -1;

this.screenWidth = $(window).width() - 160; 
this.screenHeight = $(window).height(); 
this.keyWidth = -1;

//Map the notes to their place.
$.getJSON("mid/test-data.json", function mapNotes(data) {
    //Current keyboard has 4 octaves.
    initializeForNumberOfOctaves(4);
    
    //Make an SVG Container
    var svgContainer = d3.select("#canvas")
        .append("svg")
        .attr("width", screenWidth)
        .attr("height", 3000);
    
    var notesInRange = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].pitch >= lowerKey && data[i].pitch <= higherKey) {
            notesInRange.push(data[i]);
        }
    }
    
    var note = svgContainer.selectAll("g").data(notesInRange).enter().append("rect")  
        .attr("x", function (d) {return getKeyXPosition(d);})
        .attr("y", function (d) {return d.offset / 10;})
        .attr("width", function (d) {
            if (pitchIsWhiteKey(d.pitch)) {return keyWidth;}    //White key width is default width.
            else {return keyWidth/2;}                         //Black key width is default width/2.
        })
        .attr("height", function (d) {return d.dur / 10; })         // TODO how long should the note be?
        .style("fill", function (d) {return mapFingerToColor(d.finger)})
});
    
//Set all variables, given a keyboard with a number of octaves.
function initializeForNumberOfOctaves(numberOfOctaves) {
    setLowerHigherKey(numberOfOctaves);
    
    setMIDINumberVariables();                                      
    calculateNumberOfWhiteKeys();
    calculateKeyWidth();
}

function setMIDINumberVariables() {
    /*Set array of MIDI note numbers for this number of octaves
    and extract array of white key numbers in this array */
    for (var i = lowerKey; i <= higherKey; i++) {
        currentMIDINumbers.push(i);
        
        // If number is not a black key number, add to white number array
        if ($.inArray(i, blackKeys) === -1) {
           currentWhiteMIDINumbers.push(i);
        } 
    }
}

//Set lower and higher key for given number of octaves.
function setLowerHigherKey(numberOfOctaves) {
    /*49 key keyboard
    4 octaves
    c2-c6
    24-72*/
    if (numberOfOctaves === 4) {
        lowerKey = 24;
        higherKey = 72;
    } 
    
    /*61 key keyboard
    5 octaves
    c2 - c7
    24-84*/
    else if (numberOfOctaves === 5) {
        lowerKey = 24;
        higherKey = 84;
    }
    
    /*76 key
    6 octaves
    e2 - g8
    28-103*/
    else if (numberOfOctaves === 6) {
        lowerKey = 24;
        higherKey = 84;
    }
    
    /*88 key
    7 octaves
    a0 - c8
    9-96*/
    else if (numberOfOctaves === 7) {
        lowerKey = 24;
        higherKey = 84;
    }      
}

//Calculates number of white keys.
function calculateNumberOfWhiteKeys() {
    numberOfWhiteKeys = currentWhiteMIDINumbers.length;
}

//Calculates standard key width.
function calculateKeyWidth() {
    keyWidth = screenWidth / numberOfWhiteKeys;
}

//Returns x position of key note.
function getKeyXPosition(note) {
    var pitch = note.pitch;
    var xPosition = -1;
    
    //Only if note is in number range for keyboard, continue.
    if (pitchIsInKeyRange(pitch)) {     
        //Key should be on position of index in array times the width of one key.
        if (pitchIsWhiteKey(pitch)) {
            xPosition = currentWhiteMIDINumbers.indexOf(pitch) * keyWidth;
        } 
        //Key should be on position of index-1 in array times the width of one key + 1/2 width.
        else {
            xPosition = currentWhiteMIDINumbers.indexOf(pitch-1) * keyWidth + (3/4) * keyWidth;
        } 
    }
    return xPosition;
}

//Returns true iff pitch is a white key.
function pitchIsWhiteKey(pitch) {
    return ($.inArray(pitch, currentWhiteMIDINumbers) !== -1);
}

//Returns true iff pitch is in key range.
function pitchIsInKeyRange(pitch) {
    return ($.inArray(pitch, currentMIDINumbers) !== -1);
}

function mapFingerToColor(finger) {
    var col; 
    if (finger=== 1){col="green"}
    else if (finger === 2) {col = "red"}
    else if (finger === 3) {col = "blue"}
    else if (finger === 4) {col = "orange"}
    else if (finger === 5) {col = "hotpink"}
    else if (finger === 6) {col = "yellow"}
    else if (finger === 7) {col = "purple"}
    else if (finger === 8) {col = "black"}
    else if (finger === 9) {col = "brown"}
    else if (finger === 10) {col = "olive"} 
    return col; 
}
