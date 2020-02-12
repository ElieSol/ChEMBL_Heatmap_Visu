//const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const url = "../modules/data.json"
var jsonData = [];
var baseTemp = 0;

const colors = [
  '#5e519f',
  '#3788ba',
  '#6ac1a5',
  '#acdca6',
  '#e6f49d',
  '#fffec2',
  '#fddf90',
  '#f26d4a',
  '#d34052',
  '#9a0942',
  '#ff0000' 
];

$(function() {
  //$.getJSON(url, function(json) {
    //jsonData = json.CHEMBL1937;
    //baseTemp = len(jsonData);
    graph();
  //});
});

function graph() {
  const margin = {top: 20, right: 50, bottom: 30, left: 85},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  
  
  const min = d3.min(jsonData.map(d => d.variance));
  const max = d3.max(jsonData.map(d => d.variance));
  const colorScale = d3.scale.quantile()
    .domain([min + baseTemp, max + baseTemp])
    .range(colors);
  
  var length = jsonData.length-1, year0 = jsonData[0].year;
  var x = d3.time.scale()
          .range([0, width]);
  var y = d3.time.scale()
          .range([0, height]);
  x.domain([ new Date(year0, 0), new Date(jsonData[length].year, 0) ]);
  y.domain([new Date(2016, 0, 1), new Date(2016, 11, 31)]);
  

  d3.json("/main_interface", function(error, quotes){


  var canvas = d3.select(".graph")
                 .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var barWidth = width / (length/12); //15;//change to width / NO. years / 12
  var barHeight = height/12;//change to height / 12
  var bars = canvas.selectAll("rect")
                   .data(jsonData)
                   .enter().append("rect")
                      .attr("x", function(d, i){ return (d.year - year0) * barWidth; })//year
                      .attr("y", function(d) { return (d.month -1) * barHeight; })//month
                      .attr("height", barHeight)
                      .attr("width", barWidth)
                      .style('fill', (d) => colorScale(d.variance + baseTemp))//CHANGE
  
  .on("mouseover", function(d) {//TOOLTIP      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html("<b>"+d.year+"</b>"+
                      "<br>"+(baseTemp + d.variance).toFixed(3) +" °C"+
                      "<br>"+d.variance.toFixed(3) +" °C"
                     )  
                .style("left", (d3.event.pageX + 3) + "px")     
                .style("top", (d3.event.pageY - 55) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });

  //AXIS
  var format = d3.format("0000");
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format('%Y'));
  var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(d3.time.months)
  .tickFormat(d3.time.format('%B'))
    .orient("left");
  canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", 30)
      .style("text-anchor", "end")
      .text("Year");
  canvas.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  //TOOLTIP
   var div = d3.select("#heatmap-display").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
  
  //LEGEND
  const legend = [0,2.8,4,5.1,6.2,7.3,8.4,9.5,10.6,11.7,12.8];
  const x_axis = 520;
  const y_axis = 0;
  
  var rectWidth = 30;
  
  var svgContainer = d3.select(".graph").append("svg")
                                    .attr("width", rectWidth*legend.length+x_axis)
                                    .attr("height", 200);
  
  var rect = svgContainer.selectAll(".rect")
                          .data(legend)
                          .enter()
                          .append("rect");
  var rectAttributes = rect
                       .attr("x", (d,i) => x_axis + (rectWidth*i))
                       .attr("y", function (d, i) { return y_axis; })
                       .attr("width", rectWidth)
                       .attr("height", 20)
                       .style("fill", (d) => colorScale(d));
  svgContainer.selectAll('.text')
                        .data(legend)
                        .enter().append('text')
                        .text((d) => d.toString())
                        .attr("x", (d,i) => x_axis + (rectWidth*i))
                        .attr("y", y_axis + 35);
  
});
}
