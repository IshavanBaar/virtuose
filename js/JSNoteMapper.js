$.getJSON("midi-data/test-data.json", function(data) {
    //var pitch = data[0].vel;
    
    var screenWidth = $(window).width() - 30; 
    var screenHeight = $(window).height(); 

    var numberOfKeys = 49;
    var numberOfBlackKeys = 20
    var numberOfWhiteKeys = (numberOfKeys - numberOfBlackKeys);
    var keyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

    //Make an SVG Container
    var svgContainer = d3.select("#canvas")
        .append("svg")
        .attr("width", screenWidth)
        .attr("height", 3000);
    
    var note = svgContainer.selectAll("g").data(data).enter().append("rect")  
        .attr("x", function (d) {return d.pitch * 10; }) //TODO change
        .attr("y", function (d) {return d.offset / 10; }) //TODO change
        .attr("width", screenWidth / numberOfWhiteKeys)
        .attr("height", function (d) {return d.dur / 10; }) // TODO change
        .style("fill", function (d) {
            var col; 
            if (d.finger== 1){col="green"}
            else if (d.finger === 2) {col = "red"}
            else if (d.finger === 3) {col = "blue"}
            else if (d.finger === 4) {col = "orange"}
            else if (d.finger === 5) {col = "hotpink"}
            else if (d.finger === 6) {col = "yellow"}
            else if (d.finger === 7) {col = "purple"}
            else if (d.finger === 8) {col = "black"}
            else if (d.finger === 9) {col = "brown"}
            else if (d.finger === 10) {col = "olive"} 
            return col; 
        })
        .style("opacity", function (d) {
            var opa;
            if (d.vel <= 42){opa = 0.2}
            else if (d.vel <= 85){opa = 0.6}
            else if (d.vel <= 127){opa = 1}
            return opa;
        });
});