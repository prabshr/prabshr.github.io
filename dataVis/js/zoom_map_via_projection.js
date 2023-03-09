 var width  = 600,
     height = 350;

 var projection = d3.geo.mercator()
    .center([84.2, 28.5])
    .scale(4000)
    .translate([width / 2, height / 2]);

 var path = d3.geo.path()
    .projection(projection);

 var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([height, 8 * height])
    .on("zoom", zoomed);

 var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

 var g = svg.append("g")
    .call(zoom);

 g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

 var tooltip = d3.select('body').append('div')
            .attr('class', 'hidden tooltip');

 var nepaldis = ["Taplejung","Panchthar","Ilam","Jhapa","Morang","Sunsari","Dhankuta",
                  "Terhathum","Sankhuwasabha","Bhojpur","Solukhumbu","Okhaldhunga","Khotang","Udaypur",
                  "Saptari","Siraha","Dhanusha","Mahottari","Sarlahi","Sindhuli","Ramechhap","Dolakha",
                  "Sindhupalchok","Kabhrepalanchok","Lalitpur","Bhaktapur","Kathmandu","Nuwakot","Rasuwa",
                  "Dhading","Makawanpur","Rautahat","Bara","Parsa","Chitawan","Gorkha","Lamjung","Tanahu",
                  "Syangja","Kaski","Manang","Mustang","Myagdi","Parbat","Baglung","Gulmi","Palpa",
                  "Nawalparasi","Rupandehi","Kapilbastu","Arghakhanchi","Pyuthan","Rolpa","Rukum","Salyan",
                  "Dang","Banke","Bardiya","Surkhet","Dailekh","Jajarkot","Dolpa","Jumla","Kalikot",
                  "Mugu","Humla","Bajura","Bajhang","Achham","Doti","Kailali","Kanchanpur","Dadeldhura",
                  "Baitadi","Darchula"];

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
   console.log("LENGTH " + csvdataDIS.length );

   csvdataDIS.forEach(function(d) {
        d.district       =  d.district;
        d.phase          = +d.phase;
        d.pvote          = +d.pvote;
        d.nlu            = +d.nlu;
      });

   popmsg = extract_popmsg(csvdataDIS);

 <!--//Draw the map-->
 d3.json("../json/nepaldistrict.json", function(error,np) {
    if (error) return console.error(error);
    <!--//var npd = topojson.feature(np, np.objects.npd);-->
    g.append("g")
     .attr("id","district")
    .selectAll("path")
      .data(topojson.feature(np, np.objects.NPL_adm_distric_ward).features)
    .enter().append("path")
      .attr("class", function(d) { return "district " + d.properties.name; })
      .attr("d", path)
    .style("fill", function(d) { 
       return fillcol[parseInt(d.id)-1];
       }) 
    .on('mousemove', function(d) {
       var mouse = d3.mouse(svg.node()).map(function(d) {
          return parseInt(d);
       });
       tooltip.classed('hidden', false)
         .attr('style', 'left:350px; top:120px')
         //.attr('style', 'left:' + (mouse[0]) +'px; top:' + (mouse[1]) + 'px')
         .html(d.properties.name + popmsg[parseInt(d.id)-1]);
          })
    .on('mouseout', function() {
       tooltip.classed('hidden', true);
       });

// Add Legend
// Adopted from Michelle Chandra’s Block 0b2ce4923dc9b5809922
 flegend = 0
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
	});

    });
<!--//------------------ -->
 function zoomed() {
  projection.translate(d3.event.translate).scale(d3.event.scale);
  g.selectAll("path").attr("d", path);
 }

 function extract_popmsg(csvdataDIS) {
    for (var j=0;j<nepaldis.length;j++)
      {
        jj = j + 1;
        <!--// For popup message -->
        varstr = '<br><strong>Phase __LUs__ %Votes </strong> <br>';
        for (var i=0;i<csvdataDIS.length;i++)
         {
           if (csvdataDIS[i].district == nepaldis[j]) { 
             dctr = i;
             varstr = varstr + csvdataDIS[i].phase + "__" + csvdataDIS[i].nlu + "__" + csvdataDIS[i].pvote + '%'; 
        if (csvdataDIS[i].phase == 1) {
          fillcol[j] = "#3CB371";
        } else {
          fillcol[j] = '#A9A9A9';
        }
        }
        }
        popmsg[j] = varstr;
   }
      return popmsg;
   }
