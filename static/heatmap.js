/*
Script that allows the generation of an Heatmap
Author: Julie Solacroup
Last modified: 14/02/20
*/

$(function() {
  graph();
});

/*
Method used to generate the heatmap
*/
function graph() {

  // Initialization of the display
  const margin = {top: 30, right: 10, bottom: 80, left: 100},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  var svg = d3.select(".graph")
                 .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 
  d3.json("/data", function(data){
    // Loading and formatting of the data
    data.forEach(function(d){
      d.pchembl_value = +d.pchembl_value;
    })
    dataset = data;

    var formattedData = formatData(data);

    var targetGroup = d3.map(formattedData, function(d){return d.target_chembl_id;}).keys()
    var molGroup = d3.map(formattedData, function(d){return d.molecule_chembl_id;}).keys()

    // Creation of a parameter dropdown menu
    var listOfparamsName = ["of Average pChEMBL value", "of Maximum pChEMBL value", "of Number of activity data points"];
    var listOfparams = ["avg", "max", "count"];
    var index = 0;

    var parametersMenu = d3.select("#parametersDropdown");
    parametersMenu
      .append("select")
      .attr("id", "parametersMenu")
      .selectAll("option")
        .data(listOfparamsName)
        .enter()
        .append("option")
        .attr("value", function(d, i) { return i; })
        .text(function(d) { return d; });

    // Subfunction to generate the heatmap using the value type that was selected in the dropdown menu
    var drawHeatmap = function(param){
      const min = d3.min(formattedData.map(d => d[param]));
      const max = d3.max(formattedData.map(d => d[param]));

       // Building of x scale and axis
      var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(targetGroup)
        .paddingInner(0.02)
        .paddingOuter(0.01)
        svg.append("g")
        .attr("class", "axis")
        .style("font-size", 15)
        .attr("transform", "translate(0," + height+ ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("transform", "rotate(-65)")
      
      // Building of x scale and axis
      var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(molGroup)
        .paddingInner(0.05);
        svg.append("g")
        .attr("class", "axis")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

      // Building of the color scale
      var myColor = d3.scaleSequential()
      .interpolator(d3.interpolateYlOrRd)
      .domain([min,max])

      // Creation of the tooltip
      var tooltip = d3.select("#heatmap-display")
        .append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

      // Functions that change the tooltip when user hover / move or leave a cell
      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        tooltip
          .html("The exact value of<br>this cell is: " + d[param])
          .style("left", (d3.mouse(this)[0]+70) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
      var mouseleave = function(d) {
        tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
      }

      // Fill the heatmap
      svg.selectAll()
        .data(formattedData, function(d){return d.target_chembl_id +':'+d.molecule_chembl_id})
        .enter()
        .append("rect")
          .attr("x", function(d) { return x(d.target_chembl_id) })
          .attr("y", function(d) { return y(d.molecule_chembl_id) })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d) { return myColor(d[param])} )
          .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

      // Creation and formatting of the legend scale of the heatmap
      var xScale = d3.scaleLinear()
        .domain([min,max])
        .range([0, max+200]);

      var step = (max - min)/10

      var legendData = range(min, max, step);
      console.log(legendData);
      var legend = svg.selectAll(".legend")
        .data(legendData)
				.enter()
        .append("g")
				.attr("class", "legend")
        .attr("transform","translate("+0+","+(-20)+")")
			
			legend.append("rect")
        .attr("x", (d) => Math.floor(xScale(d)))
        .attr("y", 0)
				.attr("width", width-30)
				.attr("height", 10)
				.style("fill", function(d) {return myColor(d)})
			
			legend.append("text")
				.attr("class", "label")
				.attr("x", 0)
				.attr("y", 10);
    }

    drawHeatmap(listOfparams[index]);

    // Allows to run update function when the dropdown selection changes
    parametersMenu.on("change", function() {
      var selectedParam = d3.select(this)
        .select("select")
        .property("value");
      index = +selectedParam;
      drawHeatmap(listOfparams[index]);
    });    
  
  })
  
}


/*
  Function that allows:
    - to format data,
    - to merge the duplicate,
    - to compute average value, count and max for each pair of target-molecules
  Parameters: JSON
  Return: Object [{}]
*/
function formatData(arr){
  var helper = {};
  var result = arr.reduce(function(r, o) {
    var key = o.target_chembl_id + '-' + o.molecule_chembl_id;
  
    if(!helper[key]) {
      helper[key] = Object.assign({}, o); // create a copy of o
      helper[key]["count"] = 1;
      helper[key]["avg"] = o.pchembl_value / helper[key].count;
      helper[key]["max"] = 0;
      if(o.pchembl_value>helper[key].max){helper[key].max=o.pchembl_value}
      r.push(helper[key]);
    } else {
      helper[key].pchembl_value += o.pchembl_value;
      helper[key].count += 1;
      helper[key].avg = helper[key].pchembl_value / helper[key].count;
      if(o.pchembl_value>helper[key].max){helper[key].max=helper[key].pchembl_value}
    }
    return r;
  }, []);

  return result;
}


/*
  Utility function that allows the generation of an array starting and ending with specific values
  Parameters; start (number), end (number), step (number)
  Return: []
*/
function range(start, end, step) {
  const len = Math.floor((end - start) / step) + 1
  return Array(len).fill().map((_, idx) => start + (idx * step))
}