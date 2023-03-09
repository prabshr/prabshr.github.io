var myFrame = d3.select("#viz")
var width = 400,
    height = 250,
    radius = Math.min(width, height);

var radii = {
    "earthOrbit": radius / 2.5,
    "earth": radius/32,
    "venusOrbit": radius / 4.5,
    "venus": radius/30
            };

var dur = {
    "earth": 13000,
    "venus": 8000
              };

var svg = myFrame.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Earth Orbit
    svg.append("circle")
        .style("stroke", "gray")
        .style("fill", "none")
        .style("class","earthOrbit")
        .attr("r", radii.earthOrbit)

// Earth
    svg.append("circle")
        .style("stroke", "gray")
        .style("fill", "aliceblue")
        .style("class","earth")
        .attr("r", radii.earth)
        .attr("cx", 0)
        .attr("cy",radii.earthOrbit)
        .on("mouseover", animateEarthOrbit);

// Venus Orbit
    svg.append("circle")
        .style("stroke", "gray")
        .style("fill", "none")
        .style("class","venusOrbit")
        .attr("r", radii.venusOrbit)

// Venus
    svg.append("circle")
        .style("stroke", "gray")
        .style("fill", "red")
        .style("class","venus")
        .attr("r", radii.venus)
        .attr("cx", 0)
        .attr("cy",radii.venusOrbit)
        .on("mouseover", animateVenusOrbit);

// Earth and Venus connector
    var cx1 = d3.select(".earth");
    svg.append("line")
        .style("stroke", "black")
        .attr("x1", 0 )
        .attr("y1",radii.earthOrbit )
        .attr("x2",0)
        .attr("y2",radii.venusOrbit );

// Transition Earth
function animateEarthOrbit() {
    d3.select(this)
      .transition()
        .delay(0)
        .duration(dur.earth)
        .style("fill", "grey")
        .attrTween("transform", rotTween)
        .ease("linear")
        .each("end", animateEarthOrbitBack);
};


// Transition Venus
function animateVenusOrbit(){
    d3.select(this)
      .transition()
        .delay(0)
        .duration(dur.venus)
        .style("fill", "grey")
        .attrTween("transform", rotTween)
        .ease("linear")
        .each("end", animateVenusOrbitBack);
};

// Transition Back Earth
function animateEarthOrbitBack(){
    d3.select(this)
      .transition()
        .delay(0)
        .duration(dur.earth)
        .style("fill", "grey")
        .attrTween("transform", rotTween)
        .ease("linear")
        .each("end", animateEarthOrbit);
};

// Transition Back Venus
function animateVenusOrbitBack(){
    d3.select(this)
      .transition()
        .delay(0)
        .duration(dur.venus)
        .style("fill", "grey")
        .attrTween("transform", rotTween)
        .ease("linear")
        .each("end", animateVenusOrbit);
};

function rotTween() {
    var i = d3.interpolate(0, 360);
    return function(t) {
        return "rotate(" + i(t) + ")";
    };
}
