 var width  = 900,
     height = 600,
     centered;

 var projection = d3.geo.mercator()
    .center([84.2, 28.5])
    .scale(6000)
    .translate([width / 2, height / 2]);

 var path = d3.geo.path()
    .projection(projection);

 var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

 var g = svg.append("g")

 g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white");

 var tooltip = d3.select('body').append('div')
            .attr('class', 'hidden tooltip');

 // THIS HAS TO MATCH WITH THE TopoJSON IDS//

 var nepaldis = ["Bhaktapur","Dhading","Kathmandu","Kavrepalanchok","Lalitpur","Nuwakot","Rasuwa",
                 "Sindhupalchok","Dhanusa","Dolakha","Mahottari","Ramechhap","Sarlahi","Sindhuli",
                 "Bara","Chitawan","Makwanpur","Parsa","Rautahat","Bhojpur","Dhankuta",
                 "Morang","Sankhuwasabha","Sunsari","Terhathum","Ilam","Jhapa","Panchthar",
                 "Taplejung","Khotang","Okhaldhunga","Saptari","Siraha","Solukhumbu","Udayapur",
                 "Baitadi","Dadeldhura","Darchula","Kanchanpur","Achham","Bajhang","Bajura",
                 "Doti","Kailali","Banke","Bardiya","Dailekh","Jajarkot","Surkhet",
                 "Dolpa","Humla","Jumla","Kalikot","Mugu","Dang","Pyuthan",
                 "Rolpa","Rukum","Salyan","Baglung","Mustang","Myagdi","Parbat",
                 "Gorkha","Kaski","Lamjung","Manang","Syangja","Tanahu","Arghakhanchi", 
                 "Gulmi","Kapilbastu","Nawalparasi","Palpa","Rupandehi"];

 //This is also defined in the function below
 var partyNepal  = [ {name:"NC", fillc:"#3CB371",seats:0}, {name:"CPN_UML",fillc:"#00BFFF", seats:0},
                     {name:"UCPN_MAOIST",fillc:"#FF4500",seats:0}, {name:"MJFL", fillc: "#D2691E",seats:0},
                     {name:"TML", fillc:"#dd4477", seats:0}, {name:"RPP", fillc:"#316395",  seats:0},
                     {name:"TMS", fillc:"#00FFFF", seats:0}, {name:"NMK", fillc: "#B8860B", seats:0},
                     {name:"INDP", fillc: "#FF00FF", seats:0}, {name:"DIV", fillc: "#A9A9A9", seats:0}];

 <!--//These variables act like pointers, do not point two arrays to same one to initialize-->

 var districtVotes = [];

 var popmsg   = [];

 var fillcol  = [];

 var fillu    = [];

 var lunitname = [];

// For legend
 var legendText = [];
 var colorname  = [];
 for (var p=0;p<partyNepal.length;p++) {
   legendText[p] = partyNepal[p].name;
   colorname[p]  = partyNepal[p].fillc;
  }

 var legendColor = d3.scale.ordinal()
  .domain(["<1", "1-2", "2-3", "3-4", "4-5", "5-6", "7-8", "8-9", "9-10",">10"])
  .range(colorname)
//For legend

 d3.csv("../csvData/localElectionNepal2017.csv", function(error,csvdataDIS) {
   if (error) return console.log("ERROR loading the csv: " + error);
   console.log("LENGTH " + csvdataDIS.district );

   csvdataDIS.forEach(function(d) {
        d.district       =  d.district;
        d.phase          = +d.phase;
        d.pvote          = +d.pvote;
        d.nlu            = +d.nlu;
        d.lunit          =  d.lunit;
        d.party          =  d.party;
      });

   popmsg = extract_popmsg(csvdataDIS);

 <!--//Draw the map-->
 d3.json("../json/nepalADM.json", function(error,np) {
    if (error) return console.error(error);
    g.append("g")
     .attr("id","district")
    .selectAll("path")
      .data(topojson.feature(np, np.objects.nepal_adm).features)
    .enter().append("path")
      .attr("class", function(d) { return "district " + d.id; })
      .attr("d", path)
      .on("click", clicked)
    .style("fill", function(d) {
               var lid = lunitname.indexOf(d.properties.NAME_4); 
               if (lid >= 0) 
                  { return fillu[lid];}
               else {return fillcol[parseInt(d.id)-1]; } 
       })
    .style("fill-opacity",.7)
    .on('mouseover', function(d) {
       d3.select(this).style('fill-opacity', 1.);
       var mouse = d3.mouse(svg.node()).map(function(d) {
          return parseInt(d);
       });
       tooltip.classed('hidden', false)
         .attr('style', 'left:450px; top:150px')
         //.attr('style', 'left:' + (mouse[0]) +'px; top:' + (mouse[1]) + 'px')
         .html('District: ' + d.properties.name + '<br>' + d.properties.NAME_4 + popmsg[parseInt(d.id)-1]);
          })
    .on('mouseout', function() {
       tooltip.classed('hidden', true);
       d3.selectAll('path')
           .style({
               'fill-opacity':.7
                 });
       });
// Add Legend
// Adopted from Michelle Chandra’s Block 0b2ce4923dc9b5809922
 flegend = 1 
 if (flegend == 1) {
   var legend = d3.select("body").append("svg")
 		.attr("class", "legend")
        	.attr("width", 140)
    		.attr("height", 200)
   		.selectAll("g")
   		.data(legendColor.domain()) //.domain())
   		.enter()
   		.append("g")
     		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", legendColor);

  	legend.append("text")
  	  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
      }
//Add legend

	});

    });
<!--//------------------ -->
 function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 20;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .attr("stroke-width", 0.5 / k + "px");
}

 function zoomed() {
  projection.translate(d3.event.translate).scale(d3.event.scale);
  g.selectAll("path").attr("d", path);
 }

 function extract_popmsg(csvdataDIS) {
   for (var i=0;i<csvdataDIS.length;i++)
     {
     var j = nepaldis.indexOf(csvdataDIS[i].district);
     var k = legendText.indexOf(csvdataDIS[i].party);
     lunitname[i] = csvdataDIS[i].lunit;
     varstr = '<br><strong>Phase __LUs__ %Votes </strong> <br>';
     if (csvdataDIS[i].district == nepaldis[j]) { 
      varstr = varstr + csvdataDIS[i].phase + "__" + csvdataDIS[i].nlu + "__" + csvdataDIS[i].pvote + '%'; 
      if (k >= 0) { fillu[i] = colorname[k];}
      if (csvdataDIS[i].phase == 1) { fillcol[j] = "#D8BFD8";}
      else {fillcol[j] = '#A9A9A9';}
      }
      popmsg[j] = varstr;
      }
      return popmsg;
   }
