// @TODO: YOUR CODE HERE
// Set up chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20, 
    right: 40,
    bottom: 60, 
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper. append SVG group that will hold chart, shift by top and left margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("assets/data/data.csv").then(function(csvData) {
   

    // Parse data/Cast as numbers
    csvData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Create scale functions
var xScale = d3.scaleLinear()
    .domain([5, d3.max(csvData, d => d.poverty)])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(csvData, d => d.healthcare)])
    .range([height, 0]);

// Create axis functions
var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

// Append axes to the chart
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

// Create circles and add state abbreviations
var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "skyblue")
    .attr("opacity", ".5")
    .attr("stroke", "black")
    
    chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "8px")
    .selectAll("tspan")
    .data(csvData)
    .enter()
    .append("tspan")
    .attr("x", function(data) {
        return xScale(data.poverty);
    })
    .attr("y", function(data) {
        return yScale(data.healthcare -.02);
    })
    .text(function(data) {
        return data.abbr
    });
            
// Initialize tool tip
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
    });
        
// tooltip in the chart
chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
})

    // Mouseout
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

// Create axes labels  
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 1.30))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
});