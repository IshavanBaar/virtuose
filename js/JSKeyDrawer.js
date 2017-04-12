this.screenWidth = $(window).width() - 234; 
this.screenHeight = $(window).height(); 
this.milliSeconds = new Date().getTime();

//Other variables with dummy values.
this.numberOfWhiteKeys = -1;
this.keyWidth=-1;
this.startKey = '';
this.startOctave = -1;
this.endKey = '';
this.endOctave = -1;
this.keyNames = ['b','a','g','f','e','d','c'];

this.allKeyNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']
this.allNotes;

//Fill other variables accordingly.
adaptToNumberOfOctaves(4)   //4 octaves now.
drawKeyboard();
$.getJSON("mid/passenger.json", function mapNotes(data) {
    allNotes = data;
});
timer(
    6000, // milliseconds
    function(timeleft) { // called every step to update the visible countdown
       // $('#timer').html(timeleft+"");
    },
    function() {
        //dispatchNoteEvents(); //Send random events to test what happens if a note has been played
        //$('#timer').html("");
        startAnimation();
        this.milliSeconds = new Date().getTime();
    }
);

function timer(time,update,complete) {
    var start = new Date().getTime();
    var interval = setInterval(function() {
        var now = time-(new Date().getTime()-start);
        if( now <= 0) {
            clearInterval(interval);
            complete();
        }
        else update(Math.floor(now/1000));
    },100); // the smaller this number, the more accurate the timer will be
}

function adaptToNumberOfOctaves(numberOfOctaves) {
    /*49 key keyboard
    4 octaves
    c2-c6
    24-72*/
    if (numberOfOctaves === 4) {
        startKey = 'c';
        startOctave = 2;
        endKey = 'c';
        endOctave = 6;
        numberOfWhiteKeys = 29;
    } 

    /*61 key keyboard
    5 octaves
    c2 - c7
    24-84*/
    else if (numberOfOctaves === 5) {
        startKey = 'c';
        startOctave = 2;
        endKey = 'c';
        endOctave = 7;
        numberOfWhiteKeys = 36;
    }

    /*76 key
    6 octaves
    e2 - g8
    28-103*/
    else if (numberOfOctaves === 6) {
        startKey = 'e';
        startOctave = 2;
        endKey = 'g';
        endOctave = 8;
        numberOfWhiteKeys = 45;
    }

    /*88 key
    7 octaves
    a0 - c8
    9-96*/
    else if (numberOfOctaves === 7) {
        startKey = 'a';
        startOctave = 2;
        endKey = 'c';
        endOctave = 8;
        numberOfWhiteKeys = 52;
    }   
    
    keyWidth = screenWidth / numberOfWhiteKeys;;
}

function drawKeyboard() {
    var container = d3.select("#piano-key")
        .append("svg")
        .attr("width", screenWidth)  
        .attr("height", screenHeight / 3);

    //Line that represents keyboard length  
    /*var keyboardLengthLine = container.append("line")
        .attr("x1", 0)
        .attr("y1", (screenHeight / 3) - 1)
        .attr("x2", screenWidth - 1 )
        .attr("y2", (screenHeight / 3) -1)
        //Style
        .style("stroke", "#000000")
        .style("stroke-width", 5)
        .style("stroke-opacity", 0.6);*/

    var beginKeyPosition = keyNames.indexOf(startKey);
    
    var j = 7;
    var currentOctave = endOctave;
    //Rectangles that represent keyboard keys
    for (var i = beginKeyPosition; i < (numberOfWhiteKeys + beginKeyPosition); i++) {
        var key = container.append("rect")
            .attr("id", "key" + keyNames[i % 7] + currentOctave) //Give id based on notenumber
            .attr("x", (i / numberOfWhiteKeys) * screenWidth - beginKeyPosition * keyWidth)
            .attr("y", 0)
            .attr("width", keyWidth)
            .attr("height", (screenWidth * 0.21))
            .style("stroke", "#000000")
            .style("stroke-width", 2)
            .style("fill", "white");

        var text = container.append("text")
            .attr("class", "text-on-key")
            .attr("x", -((i / numberOfWhiteKeys) * screenWidth + keyWidth / 2 - beginKeyPosition * keyWidth))
            .attr("y", -10)
            .text(keyNames[i % 7]);  
        
        //Adjust currentOctave at the end of each octave.
        if (j === 7) { j = 1; currentOctave--; }
        else { j++; }
    }

}

/* --------------- FUNCTIONS TO LISTEN IF A NOTE WAS ACTUALLY PLAYED CORRECTLY, UNFINISHED -------------- */

document.addEventListener('build', function eventHandler(e) {
    var splitString = e.detail.split(',');
    var incomingPitch = splitString[0];
    var incomingOnOff = splitString[1];
    var timeSinceStart = new Date().getTime() - milliSeconds;
    
    if (incomingOnOff === 'on') {
        if(noteShouldBeOn(timeSinceStart, incomingPitch)) {colorRectangle('#3FBB3C', incomingPitch)}
        else {colorRectangle('#D8170B', incomingPitch)}
    } else if (incomingOnOff === 'off') {
        colorRectangle('white', incomingPitch)
    }
}, false);

//Returns true iff note on event on the current time since start with pitch pitch should be on.
function noteShouldBeOn(timeSinceStart, pitch) {
    for (var i = 0; i < allNotes.length; i++) {
        if (allNotes[i].pitch == pitch) {
            if (timeSinceStart >= allNotes[i].offset && timeSinceStart < (allNotes[i].offset + allNotes[i].duration)) {
                return true;
            }
        }
    }
    return false;
}

//Gives rectangle with id based on incoming pitch color color.
function colorRectangle(color, incomingPitch) {
    var rectangleId = 'key' + pitchToNoteNumber(incomingPitch); 
    $('#' + rectangleId).removeAttr("fill").css('fill', color);
}

//Converts pitch to notenumber (e.g. 24 to C2).
function pitchToNoteNumber(pitch) {
    var note = allKeyNames[pitch % 12];
    var octave = Math.floor(pitch / 12);
    return "" + note + octave;
}

//Create random note event.
function createNoteEvent(onOrOff) {
    var noteEvent = new CustomEvent('build', { 'detail': '69,'+onOrOff});
    return noteEvent;  
}

// The first key will be played for 5 seconds, then left off for 5 seconds, etc.
function dispatchNoteEvents() {
    var noteOnOrOff = 'on';

    setInterval(function() {
        if (noteOnOrOff === 'on') {
            var noteOn = createNoteEvent('on');   
            document.dispatchEvent(noteOn);
            noteOnOrOff = 'off';
        } else { 
            var noteOff = createNoteEvent('off');   
            document.dispatchEvent(noteOff);
            noteOnOrOff = 'on';
        }
    }, 3072);
}
