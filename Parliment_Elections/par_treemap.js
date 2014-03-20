var width = 960,
    height = 500;

var svg = d3.select(".par_treemap").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("xmlns", 'http://www.w3.org/2000/svg')
        .attr("xlink", 'http://www.w3.org/1999/xlink')
        .attr("version", '1.1');
 
function onRender() {   
 
//  d3.select("button#submit").on("click", function() {

     var group_by = document.getElementById("options_view").value,
         year = document.getElementById("year").value;
          
     d3.select('.par_treemap').select("svg")
       .remove();

    var svg = d3.select(".par_treemap").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("xmlns", 'http://www.w3.org/2000/svg')
        .attr("xlink", 'http://www.w3.org/1999/xlink')
        .attr("version", '1.1');
        
    var treemap = d3.layout.treemap()
        .padding(0.5)
        .size([width, height])
        .sticky(true)
        .value(function(d) {return d.votes;})
        .children(function(d) {return d.values;});
    
    
    d3.csv("parliament_list.csv", function(data_csv) {
     
        data_root = {"key":"treemap"};
        
         data_csv.forEach(function(o) {
          o.votes = parseInt(o.votes);
          o.electors = parseInt(o.electors);
          o.rank = parseInt(o.rank);
          o.year = parseInt(o.year);
          });
          
        var nest = d3.nest()
        .key(function(d) { if (group_by=='party') { return  d.party } else {return d.state };})
        .entries(data_csv.filter(function(d){return d.year===parseInt(year)}));
        
        console.log(nest);
    data_root["values"] = nest

  var cell = svg.data([data_root]).selectAll("g")
      .data(treemap.nodes)
    .enter().append("a")
      .attr("xlink:href",function(d) { return 'https://www.google.co.in/search?q='+d.pc} )
      .attr("target","_blank").append("rect")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.dx; })
      .attr("height", function(d) { return d.dy; })
      .attr("data-title",function(d) { return '<p>Constituency : '+d.pc+'</p> <br/> <p>Candidate : '+d.name+'</p> <br/> <p>State : '+d.state+'</p> <br/> <p>party : '+d.party+'</p> <br/><p> percentage-votes : '+((d.votes/d.electors)*100).toFixed(2);+'</p>' ;})
      .attr("sub_link",function(d) { return d.pc+d.state+d.party ;})
      .style("fill", function(d) { return (d.color); })
      .style("opacity", function(d) { return 1 - parseFloat(0.2+(d.votes/d.electors)).toFixed(1); })
      .style("stroke", '#fff')
      .style("stroke-width", 0.5);        

      $("rect").tooltip({container: '.par_treemap', html: true, placement:'top'});
      
    var lastsearch = '';
    var $box = {};
    
    function add_search(search, chart) {
      var $chart = $(chart);
      $(search).on('keypress, change, keyup', function() {
        var search = $(this).val();
        if (lastsearch != search) {
          lastsearch = search;
          var re = new RegExp(search, "i");
          $('rect', $chart).each(function(){
              $(this).css('opacity', re.test($(this).attr("sub_link")) ? '1.0': '0.1');
          });
        }
      });
    }

    add_search('.search', '.par_treemap');
    
        
        });

      }
      //);