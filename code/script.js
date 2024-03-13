// consulted the following sources:
//https://d3-graph-gallery.com/index.html
//https://d3-graph-gallery.com/graph/parallel_basic.html



// put code for stem/guided narrative here: parallel plot

//put labels of axes we want to plot here
let axisNames = []


const margin = 50
//https://www.w3schools.com/jsref/prop_screen_width.asp
const fullWidth = screen.width
const fullHeight = screen.height

const width = screen.width - (2*margin)
const height = screen.height - (2*margin)

const parallelPlot = d3.select("#parallel-plot")
    .append("svg")
    .attr("width", fullWidth)
    .attr("height", fullHeight)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`)

d3.csv("../data-comma.csv").then(function (data){
    //console.log (data[0].keys)
    const exclude = ["Unemployment rate", "Inflation rate", "GDP", "International", "Course", "Nacionality", "Application order", "Mother's occupation","Father's occupation", "Educational special needs"]
    // console.log(data[0])
    // console.log(data[1])
    sampleData = [data[0], data[1]]
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
    const invParallelXAxis = d3.scalePoint().domain([0,width]).range(axisNames)

    for (i in axisNames){
        let axisName = axisNames[i]
        if (axisName != "Target"){
            parallelYAxes[axisName] = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d[axisName]; }))
            .range([height - 2*margin,margin])
        }
        else{
            parallelYAxes["Target"] = d3.scalePoint()
            .domain(["Dropout", "Graduate", "Enrolled"])
            .range([height-margin,margin])
        }
    }

    function path(d) {
        //console.log(d)
        return d3.line()(axisNames.map(function(p) { 
            //console.log(p)
            if (p != "Target"){
                //console.log(Number(d[p]))
                return [parallelXAxis(p), parallelYAxes[p](Number(d[p]))];
                
            }
            else if (p == "Target"){
                //console.log(d[p])
                return [parallelXAxis(p), parallelYAxes[p](d[p])];
            }
            }
        

        ));
        
        
    }

    const lines = parallelPlot
        .append("g")
        .selectAll("lines")
        .data(data)
        .join("path")
            .attr("d", path)
            .style("stroke", "purple")
            .style("opacity", 0.03)
            .style("fill", "none")



    let selections = new Map()

//consulted https://observablehq.com/@d3/brushable-parallel-coordinates
// https://d3-graph-gallery.com/graph/interactivity_brush.html
// https://observablehq.com/@d3/brushable-scatterplot
    const brushWidth = 30
    const brush = d3.brushY()
        .extent(
            [[-brushWidth/2, 0],
            [brushWidth/2, height]]
        )
        .on("start brush end", ({selection}, key)=>{
            let value = []
            if (selection === null){
                selections.delete(key)
            }
            if (selection){
                //[[x0,y0], [x1,y1]] = extent
                [y0, y1] = selection
                selections.set(key, selection)
                console.log(y0, y1)
                //let axisName = invParallelXAxis(x0 + ((x1-x0)/2))
                //console.log(parallelYAxes["Target"](d["Target"]))
                //parallelPlot.selectAll("path")
                lines
                .style("stroke", "purple")
                .filter(d => {
                    //false if within none of the selections
                    
                    let ans = false
                    // if within one selection, set ans to true
                    for (const [key, value] of selections){
                        if (parallelYAxes[key](d[key]) <= value[1] && parallelYAxes[key](d[key]) >= value[0]){
                            ans = true;
                            break;
                        }
                    }
                    for (const [key, value] of selections){
                        if (!(parallelYAxes[key](d[key]) <= value[1] && parallelYAxes[key](d[key]) >= value[0])){
                            ans = false;
                            break;
                        }
                    }
                    return ans
                }
                )
                // .call(d => console.log(d))
                .style("stroke", "blue")
                .data()
            }
            parallelPlot.property("value", value).dispatch("input");
        })





    parallelPlot.selectAll("axis")
        .data(axisNames).enter()
        .append("g")
        .call(brush)
        .attr("transform", function(d) { return "translate(" + parallelXAxis(d) + ")"; })
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(parallelYAxes[d])); })
        .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black")
            .attr("transform", "rotate(-25)")




// code for individual helper freq plots
// referenced:
// https://observablehq.com/@d3/histogram/2?intent=fork
// https://d3js.org/d3-array/bin
// https://d3-graph-gallery.com/graph/histogram_basic.html

// helper function for interactivity. Get the Y axis based on which brushable element
const getYAxis = ()=>{

}
let axisName = "Age at enrollment"
const helperBins = d3.bin().value((d) => d[axisName])(data)

console.log(helperBins)

const helperHeight = 100
const helperWidth = 150
const helperMargin = 10


const helperX = d3.scaleLinear()
    .domain([helperBins[0].x0, helperBins[helperBins.length - 1 ].x1])
    .range([0, helperWidth])

//parallelYAxes[axisName] //rework this later

const helperY = d3.scaleLinear()
    .range([helperHeight, 0])
    .domain([0, d3.max(helperBins, (d)=>d.length)])


const helperPlot = d3.select("#helper-plot")
    .append("svg")
    .attr("width", helperWidth + 2 * margin)
    .attr("height", helperHeight + 2 * margin)
    .append("g")
    .attr("transform", `translate(${helperMargin * 4}, ${helperMargin})`)

helperPlot
    .append("g")
    .call(d3.axisBottom(helperX))
    .attr("transform", `translate(0, ${helperHeight})`)
    
helperPlot.append("g")
    .call(d3.axisLeft(helperY))
    //.attr("transform", `translate(${margin},0)`)

helperPlot.selectAll("rect")
    .data(helperBins)
    .join("rect")
        .attr("x", (d) => helperX(d.x0) + 1)
        .attr("width", (d)=> helperX(d.x1) - helperX(d.x0) - 1)
        .attr("y", (d) =>helperY(d.length))
        .attr("height", (d) => helperY(0) - helperY(d.length))
        .attr("fill", "blue")

})


// code for parallel brushable plot

// code for bubble

// code for cluster

// whatever js code needed for scikit

