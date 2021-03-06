var margin = { top: 40, right: 20, bottom: 50, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ['#ffffff','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b'] 
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

      d3.csv("heat_map.csv",
        function(d) {
          return {
            day: +d.day,
            hour: +d.hour,
            value: +d.value
          };
        },
        function(error, data) {
          var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

	
		var margin = {top: height/10,left: width/10};
		
		var svg = d3.select('#chart').append("svg")
			.attr("width", '100%')
			.attr("data-height", '0.5678')
			.attr("viewBox",'0 0 '+(width+margin.left+margin.left)+' '+(height))
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          var dayLabels = svg.selectAll(".dayLabel")
              .data(days)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

          var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

          var heatMap = svg.selectAll(".hour")
              .data(data)
              .enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 2)
              .attr("ry", 2)
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", function(d) { return colorScale(d.value); })
              .style("stroke", "#ccc")
              .attr('data-title',function(d) { return 'No of Vists : '+d.value; });
              
        $("rect").tooltip({container: 'body', html: true, placement:'right'});        
      });