var margin = {top: 40, right: 40, bottom: 40, left: 40},
    vpwidth = 600,
    vpheight = 400,
    width = vpwidth - margin.left - margin.right,
    height = vpheight - margin.top - margin.bottom;

// Set the domain and ranges
var x = d3.scale.linear().range([0, width]).nice();
var y = d3.scale.linear().range([height, 0]).nice();


//ToolTip
var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip1")
    .style("opacity", 0);

// Get the data asynchronus call
d3.csv("../csvData/earthquake_USGS.csv", function(error, data) {
    data.forEach(function(d) {
        d.time       = +d.time;
        d.latitude   = +d.latitude;
        d.longitude  = +d.longitude;
        d.depth      = +d.depth;
        d.mag        = +d.mag;
    });

// Obtain min max of data
var minX = -180 //d3.min(data, function(d) { return d.longitude; }),
    maxX = 180 //d3.max(data, function(d) { return d.longitude; });
//d3.max(data, function(d) { return d.time; });

//    minX = minX > 0 ? 0 : minX;
var minY = -90 // d3.min(data, function(d) { return d.latitude; }),
    maxY = 90 //d3.max(data, function(d) { return d.latitude; });

//    minY = minY > 0 ? 0 : minY;

x.domain([minX , maxX]);
y.domain([minY , maxY]);

//Tip Value
var tValue  = function(d) { return d.time;};
var mValue  = function(d) { return d.mag;};
var xValue  = function(d) { return d.longitude;};
var yValue  = function(d) { return d.latitude;};

// Define the axes
var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5).tickFormat(d3.format("d"));

var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5).tickFormat(d3.format("d"));

//Zoom
var zoomD = d3.behavior.zoom()
    .x(x)
//    .xExtent([-180,180])
    .y(y)
//  .yExtent([-90,90])
    .scaleExtent([1, 200])
    .on("zoom", function() {
    zoomed();
});

// Adds the svg canvas
var svg = d3.select("#scatter")
    .append("svg")
        .attr("width", vpwidth )
        .attr("height", vpheight )
    .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        .call(zoomD);

svg.append("rect")
    .style("fill", "#fff")
    .attr("width", width)
    .attr("height", height);

// Add the X Axis
svg.append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + (height) + ")")
   .call(xAxis)
   .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Longitude (E)");

// Add the Y Axis
svg.append("g")
   .attr("class", "y axis")
   .call(yAxis)
   .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Latitude (N)");


  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

// Add GridLines
 objects.append("g")
   .selectAll("line")
    .data(d3.range(0, width, 10))
  .enter().append("line")
    .attr("x1", function(d) { return d; })
    .attr("y1", 0)
    .attr("x2", function(d) { return d; })
    .attr("y2", height)
    .attr("stroke", "gray")
    .style("opacity", .2);

 objects.append("g")
  .selectAll("line")
    .data(d3.range(0, height, 10))
  .enter().append("line")
    .attr("y1", function(d) { return d; })
    .attr("x2", 0)
    .attr("y2", function(d) { return d; })
    .attr("x2", width)
    .attr("stroke", "gray")
    .style("opacity", .2);

// Add the scatterplot
objects.selectAll("dot1")
     .data(data)
   .enter().append("circle")
     .attr("class","dot1")
     .attr("r",  function(d) { var x = Math.pow(1.7,d.mag)/5 ; return x; }) 
     .attr("cx", function(d) { return x(d.longitude); })
     .attr("cy", function(d) { return y(d.latitude); })
     .style("fill", function(d) {return d.color;})

     .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("EarthQuake" + "<br/>" + mValue(d) +" Mb" + "<br/> (" + xValue(d)
                + "E, " + yValue(d) + "N)")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });

function zoomed() {
  svg.select(".x.axis").call(xAxis);
  svg.select(".y.axis").call(yAxis);
  svg.selectAll(".dot1")
       .attr("cx", function(d) { return x(d.longitude); })
       .attr("cy", function(d) { return y(d.latitude); });
}

});


