this.screenWidth = $(window).width() - 234; 
this.screenHeight = $(window).height(); 

//Other variables with dummy values.
this.numberOfWhiteKeys = -1;
this.keyWidth=-1;
this.startKey = '';
this.startOctave = -1;
this.endKey = '';
this.endOctave = -1;
this.keyNames = ['b','a','g','f','e','d','c'];

//Fill other variables accordingly.
adaptToNumberOfOctaves(4)   //4 octaves now.
drawKeyboard();

function adaptToNumberOfOctaves(numberOfOctaves) {
    /*49 key keyboard
    4 octaves
    c2-c6
    24-72*/
    if (numberOfOctaves === 4) {
        startKey = 'C';
        startOctave = 2;
        endKey = 'C';
        endOctave = 6;
        numberOfWhiteKeys = 29;
    } 

    /*61 key keyboard
    5 octaves
    c2 - c7
    24-84*/
    else if (numberOfOctaves === 5) {
        startKey = 'C';
        startOctave = 2;
        endKey = 'C';
        endOctave = 7;
        numberOfWhiteKeys = 36;
    }

    /*76 key
    6 octaves
    e2 - g8
    28-103*/
    else if (numberOfOctaves === 6) {
        startKey = 'E';
        startOctave = 2;
        endKey = 'G';
        endOctave = 8;
        numberOfWhiteKeys = 45;
    }

    /*88 key
    7 octaves
    a0 - c8
    9-96*/
    else if (numberOfOctaves === 7) {
        startKey = 'A';
        startOctave = 2;
        endKey = 'C';
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
    var keyboardLengthLine = container.append("line")
        .attr("x1", 0)
        .attr("y1", (screenHeight / 3) - 1)
        .attr("x2", screenWidth - 1 )
        .attr("y2", (screenHeight / 3) -1)
        //Style
        .style("stroke", "#000000")
        .style("stroke-width", 5)
        .style("stroke-opacity", 0.6);

    var beginKeyPosition = keyNames.indexOf(startKey);

    //Rectangles that represent keyboard keys
    for (var i = beginKeyPosition; i < (numberOfWhiteKeys + beginKeyPosition); i++) {
        var key = container.append("rect")
            .attr("x", (i / numberOfWhiteKeys) * screenWidth - beginKeyPosition * keyWidth)
            .attr("y", 0)
            .attr("width", keyWidth)
            .attr("height", (screenWidth * 0.21))
            .style("stroke", "#000000")
            .style("stroke-width", 2)
            .style("fill", "none");

        var text = container.append("text")
            .attr("class", "text-on-key")
            .attr("x", (i / numberOfWhiteKeys) * screenWidth + keyWidth / 2 - beginKeyPosition * keyWidth)
            .attr("y", 10)
            .text(keyNames[i % 7]);  
    }

}

//Add listener for custom events.
document.addEventListener('build', function eventHandler(e) {
    var splitString = e.detail.split(',');
    alert('The pitch is: ' + splitString[0] + ', the note is: ' + splitString[1]);
}, false);

//Create note event.
function createNoteEvent(onOrOff) {
    var noteEvent;
    
    noteEvent = new CustomEvent('build', { 'detail': '24,'+onOrOff});
    
    return noteEvent;  
}

var noteOnOrOff = 'on';
// The first key will be played for 3 seconds, then left off for 3 seconds, etc.
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
}, 5000);