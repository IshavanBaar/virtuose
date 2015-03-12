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

this.screenWidth = $(window).width() - 234; 
this.screenHeight = $(window).height();
this.songHeight = -1;
this.keyWidth = -1;


//overvire variables
this.overviewWidth = 234;
this.overviewHeight = $(window).height();
overviewKeyWidth = -1

this.overviewXscale = overviewWidth / screenWidth;
this.overviewYscale = -1;



//Variables for user selection
this.handsShown = '';
this.tempo = 'Normal';



//Map the notes to their place.
$.getJSON("mid/passenger.json", function mapNotes(data) {
    //Current keyboard has 4 octaves.
    initializeForNumberOfOctaves(4);
    calculateSongHeight(data);
    //Initialize the variables for the selection of the user.
    initializeUserSelection();
    //sets up the overview 
    initializeOverview();
    setScrollSpeed();
    //Make an SVG Container
    var svgContainer = d3.select("#canvas")
        .append("svg")
        .attr("width", screenWidth)
        .attr("height", songHeight);
    
    var overviewContainer = d3.select("#overview")
        .append("svg")
        .attr("width", overviewWidth)
        .attr("height", screenHeight);  

    var notesInRange = [];
    for (var i = 0; i < data.length; i++) {
        data[i].pitch = data[i].pitch - 7;
        if (data[i].pitch >= lowerKey && data[i].pitch <= higherKey) {
            
            // Only push the notes in the array that match with the user hands selection
            if (handsShown === 'Left') { if (data[i].finger < 6) { notesInRange.push(data[i]); }}
            else if (handsShown === 'Right') { if(data[i].finger > 5) { notesInRange.push(data[i]); }}
            else {notesInRange.push(data[i]);}
        }
    }
    var note = svgContainer.selectAll("g").data(notesInRange).enter().append("rect")  
        .attr("x", function (d) {return getKeyXPosition(d);})
        .attr("y", function (d) {return d.offset / 10;})
        .attr("width", function (d) {
            if (pitchIsWhiteKey(d.pitch)) {return keyWidth;}    //White key width is default width.
            else {return keyWidth/2;}                           //Black key width is default width/2.
        })
        .attr("height", function (d) {return d.duration / 10; })         // TODO how long should the note be?
        .style("fill", function (d) {return mapFingerToColor(d.finger)});

    var overviewNote = overviewContainer.selectAll("g").data(notesInRange).enter().append("rect")  
        .attr("x", function (d) {return getOverviewKeyXPosition(d);})
        .attr("y", function (d) {return (d.offset / 10)*overviewYscale;})
        .attr("width", function (d) {
            if (pitchIsWhiteKey(d.pitch)) {return overviewKeyWidth;}    //White key width is default width.
            else {return (overviewKeyWidth/2);}                           //Black key width is default width/2.
        })
        .attr("height", function (d) {return (d.duration / 10)*overviewYscale; })         // TODO how long should the note be?
        .style("fill", function (d) {return mapFingerToColor(d.finger)});

});
    
//Set all variables, given a keyboard with a number of octaves.
function initializeForNumberOfOctaves(numberOfOctaves) {
    setLowerHigherKey(numberOfOctaves);
    
    setMIDINumberVariables();                                      
    calculateNumberOfWhiteKeys();
    calculateKeyWidth();
    calculateOverviewKeyWidth();
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
    var pitch = note.pitch - 7;
    var xPosition = -1;
    
    //Only if note is in number range for keyboard, continue.
    if (pitchIsInKeyRange(pitch)) {     
        //Key should be on position of index in array times the width of one key.
        if (pitchIsWhiteKey(pitch)) {
            xPosition = (currentWhiteMIDINumbers.length - 1 - currentWhiteMIDINumbers.indexOf(pitch)) * keyWidth;
        } 
        //Key should be on position of index-1 in array times the width of one key + 1/2 width.
        else {
            xPosition = (currentWhiteMIDINumbers.length - 1 - currentWhiteMIDINumbers.indexOf(pitch+1)) * keyWidth + (3/4) * keyWidth;
        } 
    }
    return xPosition;
}
//calculates song height
function calculateSongHeight(data) {
    songHeight = (218112 + data[data.length-1].duration) / 10;
    overviewYscale = screenHeight / songHeight;
}

//Returns true iff pitch is a white key.
function pitchIsWhiteKey(pitch) {
    return ($.inArray(pitch, currentWhiteMIDINumbers) !== -1);
}

//Returns true iff pitch is in key range.
function pitchIsInKeyRange(pitch) {
    return ($.inArray(pitch, currentMIDINumbers) !== -1);
}

//Maps fingers to colors.
function mapFingerToColor(finger) {
    var col; 
    if (finger=== 1){col="purple"}
    else if (finger === 2) {col = "purple"}
    else if (finger === 3) {col = "purple"}
    else if (finger === 4) {col = "purple"}
    else if (finger === 5) {col = "purple"}
    else if (finger === 6) {col = "green"}
    else if (finger === 7) {col = "red"}
    else if (finger === 8) {col = "blue"}
    else if (finger === 9) {col = "orange"}
    else if (finger === 10) {col = "yellow"} 
    return col; 
}

//Initializes the users choices by reading the cookies.
function initializeUserSelection() {
    handsShown = getCookieItem('handSelection');
    tempo = getCookieItem('tempoSelection');
    
    //Directly set tempo of the animation in the css.
    setTempo(tempo);
}

var tempoOfAnimation = '';
//Sets tempo in css to slow, normal or fast.
function setTempo(tempo) {
    if (tempo === 'Slow') {
        tempoOfAnimation = 16;
    } else if (tempo === 'Normal') {
        tempoOfAnimation = 8;
    } else if (tempo === 'Fast') {
        tempoOfAnimation = 4;
    }
}

//Gets value of the key in the cookie.
function getCookieItem(key) {
    if (!key) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") +      "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

function startAnimation() {
    $('#canvas').css("animation", "scroll "+tempoOfAnimation+"s linear infinite");
}

function setScrollSpeed() {
    $("#canvas").removeAttr("animation").css("animation", "scroll "+songHeight / 100+"s linear infinite"); //length of the track.

    //Set the speed of the scrolling
    var cssAnimation = document.createElement('style');
    cssAnimation.type = 'text/css';
    var rules = document.createTextNode('@-webkit-keyframes scroll {'+
    '0% { top: 0px }'+
    '100% { top: -'+songHeight+'px; }'+
    '}'+
    '@keyframes scroll {'+
    '0% { top: 0px }'+
    '100% { top: -'+songHeight+'px; }'+
    '}');
    cssAnimation.appendChild(rules);
    $("#canvas").append(cssAnimation);

    $("#overviewTracker").removeAttr("animation").css("animation", "scroll2 "+songHeight / 100+"s linear infinite"); //length of the track.

    //Set the speed of the scrolling
    var cssAnimation = document.createElement('style');
    cssAnimation.type = 'text/css';
    var rules = document.createTextNode('@-webkit-keyframes scroll2 {'+
    '0% { top: 0px }'+
    '100% { top: '+screenHeight+'px; }'+
    '}'+
    '@keyframes scroll2 {'+
    '0% { top: 0px }'+
    '100% { top: '+screenHeight+'px; }'+
    '}');
    cssAnimation.appendChild(rules);
    $("#overviewTracker").append(cssAnimation);
}       

/* OVERVIEW FUNCTIONS */

//Calculates overview key width.
function calculateOverviewKeyWidth() {
    overviewKeyWidth = overviewWidth / numberOfWhiteKeys;
}

//Returns x position of overview note.
function getOverviewKeyXPosition(note) {
    var pitch = note.pitch;
    var xPosition = -1;
    
    //Only if note is in number range for keyboard, continue.
    //if (pitchIsInKeyRange(pitch)) {     
        //Key should be on position of index in array times the width of one key.
        if (pitchIsWhiteKey(pitch)) {
            xPosition = (currentWhiteMIDINumbers.length - 1 - currentWhiteMIDINumbers.indexOf(pitch)) * overviewKeyWidth;
        } 
        //Key should be on position of index-1 in array times the width of one key + 1/2 width.
        else {
            xPosition = (currentWhiteMIDINumbers.length - 1 - currentWhiteMIDINumbers.indexOf(pitch+1)) * overviewKeyWidth + (3/4) * overviewKeyWidth;
        } 
    //}
    return xPosition;
}
function initializeOverview() {
    //set size of overview
    $(function() {
        $("#overview")
                .width(overviewWidth-keyWidth)
                .height(screenHeight)
                .css("top",0-(songHeight+50+screenHeight/3)); //hardcoded =(
    });

    //set size of overview tracker
    $(function() {
        $("#overviewTracker").width(overviewWidth-keyWidth).height(songHeight/screenHeight);     
    });     
}