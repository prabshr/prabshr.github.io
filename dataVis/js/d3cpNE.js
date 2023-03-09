 var width  = 600,
     height = 350;

 var projection = d3.geo.mercator()
    .center([84.2, 28.5])
    .scale(4000)
    .translate([width / 2, height / 2]);

 var path = d3.geo.path()
    .projection(projection);

 var svg = d3.select("body").append("svg")
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

 <!--//These variables act like pointers, do not point two arrays to same one to initialize-->

 var popmsg   = [];

 d3.csv("../csvData/nepalElection_stat_2013.csv", function(error,csvdataDIS) {
   if (error) return console.log("ERROR loading the csv: " + error);
   console.log("LENGTH " + csvdataDIS.length );

   csvdataDIS.forEach(function(d) {
        d.district       =  d.district;
        d.cnum           = +d.cnum;
        d.nvote          = +d.nvote;
        d.pvote          = +d.pvote;
        d.party          =  d.party;
      });

   popmsg = extract_popmsg(csvdataDIS);

 <!--//Draw the map-->
 d3.json("../json/nepaldistricts.json", function(error,np) {
    if (error) return console.error(error);
    <!--//var npd = topojson.feature(np, np.objects.npd);-->
    svg.selectAll(".district")
      .data(topojson.feature(np, np.objects.npd).features)
    .enter().append("path")
      .attr("class", function(d) { return "district " + d.properties.name; })
      .attr("d", path)
    .style("fill", function(d) { 
       return color([parseInt(d.id)-1]);
       }) 
    .on('mousemove', function(d) {
       var mouse = d3.mouse(svg.node()).map(function(d) {
          return parseInt(d);
       });
       tooltip.classed('hidden', false)
         .attr('style', 'left:' + (mouse[0]) +'px; top:' + (mouse[1]) + 'px')
         .html(d.properties.name + popmsg[parseInt(d.id)-1]);
          })
    .on('mouseout', function() {
       tooltip.classed('hidden', true);
       });

	});

    });
<!--//------------------ -->

 function extract_popmsg(csvdataDIS) {
    for (var j=0;j<nepaldis.length;j++)
      {
        jj = j + 1;
        <!--// For popup message -->
        totalvotes = 0

        <!-- --> 
        for (var i=0;i<csvdataDIS.length;i++)
         {
           if (csvdataDIS[i].district == nepaldis[j]) { 
             dctr = i;
             varstr = varstr + csvdataDIS[i].cnum + "_____" + csvdataDIS[i].nvote + '_____' 
                           + csvdataDIS[i].pvote + '%' + "_____" + csvdataDIS[i].party + '<br>';  
             totalvotes = totalvotes + parseInt(csvdataDIS[i].nvote);
          }
          }
        <!--//POPUP MESSAGE, do not understand why the last message is taken by myMap-->
        popmsg[j] = totalvotes;
   }
      return popmsg;
   }

