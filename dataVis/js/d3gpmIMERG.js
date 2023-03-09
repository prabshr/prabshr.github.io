var width = 900,
        height = 600;
    
    var svg = d3.select( "body" )
          .append( "svg" )
          .attr( "width", width )
          .attr( "height", height );
      
    var projection = d3.geo.albers()
        .center([0, 37.8])
		.rotate([85.8,0])
        .scale(8000)
        .translate([width / 2, height / 2]);
    var geoPath = d3.geo.path()
        .projection(projection);
    
    queue()
        .defer(d3.json, "../json/gpm_1d.20180712.topojson.gz.json")
        .await(ready);
      
    function ready(error, counties){
        
         svg.append("g")
            .selectAll("path")
            .data( topojson.feature(counties, counties.objects.counties).features)
            .enter()
            .append("path")
            .attr( "d", geoPath )
            .attr("class","county");  
        
    }
