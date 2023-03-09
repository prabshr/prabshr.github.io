var margin = {top: 40, right: 40, bottom: 40, left: 150},
    vpwidth = 800,
    vpheight = 400,
    width = vpwidth - margin.left - margin.right,
    height = vpheight - margin.top - margin.bottom;

//
var rad = 5.;

// Set the domain and ranges
var x = d3.scale.linear().range([0, width]).nice();
var y = d3.scale.linear().range([height, 0]).nice();


// Define the line
var valueline1 = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Petrol); });

var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Diesel); });

var valueline3 = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Kerosene); });

var valueline4 = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.LPG); });

//ToolTip
var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Get the data asynchronus call
d3.csv("../csvData/NepalOilImport.csv", function(error, data) {
    data.forEach(function(d) {
        d.Year     = +d.Year;
        d.Petrol   = +d.Petrol;
        d.Diesel   = +d.Diesel;
        d.Kerosene = +d.Kerosene;
        d.LPG      = +d.LPG;
    });

// Obtain min max of data
var minX = d3.min(data, function(d) { return d.Year; }),
    maxX = 2020;
//    minX = minX > 0 ? 0 : minX;
var minY = 0,
    maxY = 2000000.; d3.max(data, function(d) { return d.Diesel; });
//    minY = minY > 0 ? 0 : minY;

x.domain([minX , maxX]);
y.domain([minY , maxY]);

//Tip Value
var xValue  = function(d) { return d.Year;};
var yValue1 = function(d) { return d.Petrol;};
var yValue2 = function(d) { return d.Diesel;};
var yValue3 = function(d) { return d.Kerosene;};
var yValue4 = function(d) { return d.LPG;};

// Define the axes
var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5).tickFormat(d3.format("d"));

var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

//Zoom
var zoomD = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 8])
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

// Needed for zooming
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
      .text("Year");

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
      .text("1000 Litres / KL");


  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);


//Needed to bound data while zooming
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

// Add the valueline path.
  objects.selectAll(".line1")
    .data(data)
   .enter().append("path")
   .attr("class", "line1")
    .attr("d", valueline1(data));

  objects.selectAll(".line2")
    .data(data)
   .enter().append("path")
    .attr("class", "line2")
    .attr("d", valueline2(data));

  objects.selectAll(".line3")
    .data(data)
   .enter().append("path")
    .attr("class", "line3")
    .attr("d", valueline3(data));

  objects.selectAll(".line4")
    .data(data)
   .enter().append("path")
    .attr("class", "line4")
    .attr("d", valueline4(data));

// Add the scatterplot
objects.selectAll("dot1")
     .data(data)
   .enter().append("circle")
     .attr("class","dot1")
     //.attr("r", function(d) { var x = Math.log(d.petrol) ; return x; }) 
     .attr("r", rad)
     .attr("cx", function(d) { return x(d.Year); })
     .attr("cy", function(d) { return y(d.Petrol); })
     .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Petrol [KL]" + "<br/> (" + xValue(d)
                + ", " + yValue1(d) + ")")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });

objects.selectAll("dot2")
     .data(data)
   .enter().append("circle")
     .attr("class","dot2")
     .attr("r", rad)
     .attr("cx", function(d) { return x(d.Year); })
     .attr("cy", function(d) { return y(d.Diesel); })
     .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Diesel [KL]" + "<br/> (" + xValue(d)
                + ", " + yValue2(d) + ")")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });

objects.selectAll("dot3")
     .data(data)
   .enter().append("circle")
     .attr("class","dot3")
     .attr("r", rad)
     .attr("cx", function(d) { return x(d.Year); })
     .attr("cy", function(d) { return y(d.Kerosene); })
     .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Kerosene [KL]" + "<br/> (" + xValue(d)
                + ", " + yValue3(d) + ")")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });

objects.selectAll("dot4")
     .data(data)
   .enter().append("circle")
     .attr("class","dot4")
     .attr("r", rad)
     .attr("cx", function(d) { return x(d.Year); })
     .attr("cy", function(d) { return y(d.LPG); })
     .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("LPG [MT]" + "<br/> (" + xValue(d)
                + ", " + yValue4(d) + ")")
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
       .attr("cx", function(d) { return x(d.Year); })
       .attr("cy", function(d) { return y(d.Petrol); });
  svg.selectAll(".dot2")
       .attr("cx", function(d) { return x(d.Year); })
       .attr("cy", function(d) { return y(d.Diesel); });
  svg.selectAll(".dot3")
       .attr("cx", function(d) { return x(d.Year); })
       .attr("cy", function(d) { return y(d.Kerosene); });
  svg.selectAll(".dot4")
       .attr("cx", function(d) { return x(d.Year); })
       .attr("cy", function(d) { return y(d.LPG); });
  svg.selectAll(".line1")
       .attr("d", valueline1(data));
  svg.selectAll(".line2")
       .attr("d", valueline2(data));
  svg.selectAll(".line3")
       .attr("d", valueline3(data));
  svg.selectAll(".line4")
       .attr("d", valueline4(data));
}

});
