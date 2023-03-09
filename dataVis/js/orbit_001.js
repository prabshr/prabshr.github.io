var myFrame = d3.select("#viz")
var width = 500,
    height = 500,
    pi     = Math.PI,
    radians= pi / 180,
    scaleV = 36500,
    radius = (Math.min(width, height))/4;

var tnow  = Date.now();

var graha = [
    { orbit: radius * 1.075, orbit2: radius * 1.521, radii: radius/20, phi: 90, spd: 224.701, spd2: 365.256},
    { orbit: radius * 1.521, orbit2: radius * 1.075, radii: radius/21, phi: 90, spd: 365.256, spd2: 224.701}
    ];

var svg = myFrame.insert("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color","black");

var container = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

container.selectAll("g.grahas")
        .data(graha)
        .enter()
        .append("g")
        .each(function(d, i) {
           d3.select(this)
             .append("circle")
             .style("stroke", "gray")
             .style("fill", "none")
             .style('opacity', 0.6)
             .attr("class", "orbit")
             .attr("r", d.orbit);
           d3.select(this)
             .append("circle")
             .attr("class", "grahas")
              .style("fill", "steelblue")
             .style('opacity', 0.8)
             .attr("r", d.radii)
             .attr("cx" ,Math.sin(radians * d.phi )*d.orbit)
             .attr("cy",-Math.cos(radians * d.phi )*d.orbit)
           d3.select(this)
             .append("line")
             .attr("class", "maha")
             .style("stroke", "steelblue")
             .style('opacity', 0.5)
             .attr("x1",  Math.sin(radians * d.phi )*d.orbit) 
             .attr("y1", -Math.cos(radians * d.phi )*d.orbit) 
             .attr("x2",  Math.sin(radians * d.phi )*d.orbit2) 
             .attr("y2", -Math.cos(radians * d.phi )*d.orbit2); 
           d3.select(this)
             .attr("class", "fabric")
          });

// Add rotation 
d3.timer(function() {
     var dt = (Date.now() - tnow)*10;
     addmaha(dt,".maha") 
     addgrahas(dt,".grahas")
     addfabric(dt,".fabric")
   });

function addfabric(dt,dom) {
    container.selectAll(".fabric")
       .append("line")
       .style("stroke", "gray")
       .style('opacity', 0.2)
       .attr("x1", function(d) {
           return  Math.sin(radians * (d.phi + dt * d.spd/scaleV) )*d.orbit ;
           })
        .attr("y1", function(d) {
           return -Math.cos(radians * (d.phi + dt * d.spd/scaleV) )*d.orbit ;
           })
        .attr("x2", function(d) {
           return Math.sin(radians * (d.phi + dt * d.spd2/scaleV) )*d.orbit2  ;
           })
        .attr("y2", function(d) {
           return -Math.cos(radians * (d.phi + dt * d.spd2/scaleV) )*d.orbit2  ;
           });
      };

function addgrahas(dt,dom) {
     svg.selectAll(dom)
        .attr("transform", function(d) {
           return "rotate(" + d.phi + dt * d.spd/scaleV + ")";
           });
      };

function addmaha(dt,dom) {
     svg.selectAll(dom)
        .attr("x1", function(d) {
           return  Math.sin(radians * (d.phi + dt * d.spd/scaleV) )*d.orbit ;
           })
        .attr("y1", function(d) {
           return -Math.cos(radians * (d.phi + dt * d.spd/scaleV) )*d.orbit ;
           })
        .attr("x2", function(d) {
           return Math.sin(radians * (d.phi + dt * d.spd2/scaleV) )*d.orbit2  ;
           })
        .attr("y2", function(d) {
           return -Math.cos(radians * (d.phi + dt * d.spd2/scaleV) )*d.orbit2  ;
           });
     };
