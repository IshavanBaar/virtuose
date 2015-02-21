var screenWidth = $(window).width() - 30; 
var screenHeight = $(window).height(); 

var numberOfKeys = 49;
var numberOfBlackKeys = 20;
var numberOfWhiteKeys = (numberOfKeys - numberOfBlackKeys);
var keyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

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

//Rectangles that represent keyboard keys
for (var i = 0; i < numberOfWhiteKeys; i++) {
    var key = container.append("rect")
        .attr("x", (i / numberOfWhiteKeys) * screenWidth)
        .attr("y", 0)
        .attr("width", screenWidth / numberOfWhiteKeys)
        .attr("height", (screenHeight / 3) - 2)
        .style("stroke", "#000000")
        .style("stroke-width", 2)
        .style("fill", "none");
    
    var text = container.append("text")
        .attr("class", "text-on-key")
        .attr("x", (i / numberOfWhiteKeys) * screenWidth + (screenWidth / numberOfWhiteKeys) / 2)
        .attr("y", (screenHeight / 3) / 2)
        .text(keyNames[i % 7]);  
}



