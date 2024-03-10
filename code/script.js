// consulted the following sources:
//https://d3-graph-gallery.com/index.html
//https://d3-graph-gallery.com/graph/parallel_basic.html


// put code for stem/guided narrative here: parallel plot

//put labels of axes we want to plot here
let axisNames = []


const margin = 30
//https://www.w3schools.com/jsref/prop_screen_width.asp
const fullWidth = screen.width
const fullHeight = screen.height

const width = screen.width - (2*margin)
const height = screen.height - (2*margin)

const parallelPlot = d3.select("#parallel-plot")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`)

d3.csv("../data-comma.csv").then(function (data){
    console.log (data[0].keys)
    const exclude = ["Unemployment rate", "Inflation rate", "GDP", "International", "Course", "Nacionality", "Application order", "Mother's occupation","Father's occupation", "Educational special needs"]
    console.log(data[0])
    console.log(data[1])
    //filter: https://stackabuse.com/bytes/remove-items-from-arrays-by-value-in-javascript/
    axisNames = Object.keys(data[0]).filter((d)=>
        !exclude.includes(d)
    )

    console.log("axis names", axisNames)
    console.log("number of axis names", axisNames.length)

    const parallelYAxes = {}
    const parallelXAxis = d3.scalePoint()
        .domain(axisNames)
        .range([0,width])

    for (i in axisNames){
        let axisName = axisNames[i]
        if (axisName != "Target"){
            parallelYAxes[axisName] = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d[axisName]; }))
            .range([height,0])
        }
        else{
            parallelYAxes["Target"] = d3.scaleLinear()
            .domain(["Dropout", "Graduate", "Enrolled"])
            .range([height,0])
        }
    }

    function path(d) {
        return d3.line()(axisNames.map(function(p) { return [parallelXAxis(p), parallelYAxes[p](d[p])]; }));
    }

    parallelPlot
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("d", path)
        .style("stroke", "orange")
        .style("opacity", 0.3)

    parallelPlot.selectAll("axis")
        .data(axisNames).enter()
        .append(g)
        .attr("transform", function(d) { return "translate(" + parallelXAxis(d) + ")"; })
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })


})

// code for parallel brushable plot

// code for bubble

// code for cluster

// whatever js code needed for scikit

