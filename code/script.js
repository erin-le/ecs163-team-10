// consulted the following sources:
//https://d3-graph-gallery.com/index.html
//https://d3-graph-gallery.com/graph/parallel_basic.html



// put code for stem/guided narrative here: parallel plot

//put labels of axes we want to plot here
let axisNames = []


const margin = 75
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
    .attr("transform", `translate(${margin}, ${margin/2})`)
    
    
parallelPlot.append("text")
.text("Overview: Factors Influencing Student Dropout")
.attr("transform", "translate(0,-20)")
.style("text-anchor", "center")


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

    const targetDomain = ["Dropout", "Enrolled", "Graduate"]
    for (i in axisNames){
        let axisName = axisNames[i]
        if (axisName != "Target"){
            parallelYAxes[axisName] = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d[axisName]; }))
            .range([height - 2*margin,0])
        }
        else{
            parallelYAxes["Target"] = d3.scalePoint()
            .domain(targetDomain)
            .range([height - 2*margin,0])
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
    
    
    const parallelPlotColor = d3.scaleOrdinal().domain(targetDomain)
    // .interpolator(d3.interpolateViridis)
    .range(["#461857", "#31678E", "#4BAA84"])





    // const parallelPlotColor = d3.scaleOrdinal().domain(["Dropout", "Graduate", "Enrolled"]).range(["blue", "yellow"])
    // .range([0,2])
    // .interpolator(d3.interpolateViridis)

    console.log(parallelPlotColor("Enrolled"))
    const lines = parallelPlot
        .append("g")
        .selectAll("lines")
        .data(data)
        .join("path")
            .attr("d", path)
            //.style("stroke", "orange")
            .style("stroke", function(d) {
                // console.log(d.Target)
                return parallelPlotColor(d["Target"])})
            .style("opacity", 0.02)
            .style("fill", "none")

    const legend = d3.select("#legend")
    // .append("g")
    // .append("svg")
    // .attr("width", 150)
    // .attr("height", 100)
    
    // legend.style("background-color", "blue")

    legend.selectAll("legend-items")
    .data(targetDomain)
    .enter()
    .append("circle")
        .attr("cx", 30)
        .attr("cy", (d,i) => 20 + (i * 25))
        .attr("r", 10)
        .style("fill", d => {
            console.log(d)
            console.log(parallelPlotColor(d))
            return parallelPlotColor(d)})
    legend
    .selectAll("legend-labels")
    .data([0,1,2])
    .enter()
    .append("text")
    .text(d => targetDomain[d])
        .attr("x", 45)
        .attr("y", d => {
            console.log(d)
            return (25 + (d * 25))})
        
//Add tooltip
//https://d3-graph-gallery.com/graph/interactivity_tooltip.html#mostbasic


// const tooltip = d3.select("#helper-plot")
//     .append("div")
//     .style("opacity", 1)
//     .append("class", "tooltip")
//     .style("background-color", "white")
//     .style("border-radius", "10px")
//     .style("border", "solid")
//     .style("padding", "5px")


// const helperMouseover = function(d){
//     tooltip.style("opacity", 1)
//     d3.select(this)
//     .style("stroke", "black")
//     .style("opacity", 1)

// }

const axisInfo ={
    "Marital status":"1 – single 2 – married 3 – widower 4 – divorced 5 – facto union 6 – legally separated",

    "Application mode": "1 - 1st phase - general contingent 2 - Ordinance No. 612/93 5 - 1st phase - special contingent (Azores Island) 7 - Holders of other higher courses 10 - Ordinance No. 854-B/99 15 - International student (bachelor) 16 - 1st phase - special contingent (Madeira Island) 17 - 2nd phase - general contingent 18 - 3rd phase - general contingent 26 - Ordinance No. 533-A/99, item b2) (Different Plan) 27 - Ordinance No. 533-A/99, item b3 (Other Institution) 39 - Over 23 years old 42 - Transfer 43 - Change of course 44 - Technological specialization diploma holders 51 - Change of institution/course 53 - Short cycle diploma holders 57 - Change of institution/course (International)",

    "Daytime/evening attendance": "1 – daytime 0 - evening",

"Previous qualification":"1 - Secondary education 2 - Higher education - bachelor's degree 3 - Higher education - degree 4 - Higher education - master's 5 - Higher education - doctorate 6 - Frequency of higher education 9 - 12th year of schooling - not completed 10 - 11th year of schooling - not completed 12 - Other - 11th year of schooling 14 - 10th year of schooling 15 - 10th year of schooling - not completed 19 - Basic education 3rd cycle (9th/10th/11th year) or equiv. 38 - Basic education 2nd cycle (6th/7th/8th year) or equiv. 39 - Technological specialization course 40 - Higher education - degree (1st cycle) 42 - Professional higher technical course 43 - Higher education - master (2nd cycle)" ,
"Previous qualification (grade)":"Grade of previous qualification (between 0 and 200)",
 
"Mother's qualification": "1 - Secondary Education - 12th Year of Schooling or Eq. 2 - Higher Education - Bachelor's Degree 3 - Higher Education - Degree 4 - Higher Education - Master's 5 - Higher Education - Doctorate 6 - Frequency of Higher Education 9 - 12th Year of Schooling - Not Completed 10 - 11th Year of Schooling - Not Completed 11 - 7th Year (Old) 12 - Other - 11th Year of Schooling 14 - 10th Year of Schooling 18 - General commerce course 19 - Basic Education 3rd Cycle (9th/10th/11th Year) or Equiv. 22 - Technical-professional course 26 - 7th year of schooling 27 - 2nd cycle of the general high school course 29 - 9th Year of Schooling - Not Completed 30 - 8th year of schooling 34 - Unknown 35 - Can't read or write 36 - Can read without having a 4th year of schooling 37 - Basic education 1st cycle (4th/5th year) or equiv. 38 - Basic Education 2nd Cycle (6th/7th/8th Year) or Equiv. 39 - Technological specialization course 40 - Higher education - degree (1st cycle) 41 - Specialized higher studies course 42 - Professional higher technical course 43 - Higher Education - Master (2nd cycle) 44 - Higher Education - Doctorate (3rd cycle)",
"Father's qualification":"1 - Secondary Education - 12th Year of Schooling or Eq. 2 - Higher Education - Bachelor's Degree 3 - Higher Education - Degree 4 - Higher Education - Master's 5 - Higher Education - Doctorate 6 - Frequency of Higher Education 9 - 12th Year of Schooling - Not Completed 10 - 11th Year of Schooling - Not Completed 11 - 7th Year (Old) 12 - Other - 11th Year of Schooling 13 - 2nd year complementary high school course 14 - 10th Year of Schooling 18 - General commerce course 19 - Basic Education 3rd Cycle (9th/10th/11th Year) or Equiv. 20 - Complementary High School Course 22 - Technical-professional course 25 - Complementary High School Course - not concluded 26 - 7th year of schooling 27 - 2nd cycle of the general high school course 29 - 9th Year of Schooling - Not Completed 30 - 8th year of schooling 31 - General Course of Administration and Commerce 33 - Supplementary Accounting and Administration 34 - Unknown 35 - Can't read or write 36 - Can read without having a 4th year of schooling 37 - Basic education 1st cycle (4th/5th year) or equiv. 38 - Basic Education 2nd Cycle (6th/7th/8th Year) or Equiv. 39 - Technological specialization course 40 - Higher education - degree (1st cycle) 41 - Specialized higher studies course 42 - Professional higher technical course 43 - Higher Education - Master (2nd cycle) 44 - Higher Education - Doctorate (3rd cycle)",
"Admission grade":"Admission grade (between 0 and 200)",
"Displaced": "1 – yes 0 – no",
"Debtor": "1 – yes 0 – no",
"Tuition fees up to date": "1 – yes 0 – no",
"Gender":"1 – male 0 – female" ,
"Scholarship holder": "1 – yes 0 – no",

"Age at enrollment": "Age of student at enrollment",
"Curricular units 1st sem (credited)": "Number of curricular units credited in the 1st semester",
"Curricular units 1st sem (enrolled)": "Number of curricular units enrolled in the 1st semester",
"Curricular units 1st sem (evaluations)": "Number of evaluations to curricular units in the 1st semester",
"Curricular units 1st sem (approved)": "Number of curricular units approved in the 1st semester",
"Curricular units 1st sem (grade)": "Grade average in the 1st semester (between 0 and 20)" ,
"Curricular units 1st sem (without evaluations)": "Number of curricular units without evalutions in the 1st semester",
"Curricular units 2nd sem (credited)": "Number of curricular units credited in the 2nd semester",
"Curricular units 2nd sem (enrolled)": "Number of curricular units enrolled in the 2nd semester",
"Curricular units 2nd sem (evaluations)": "Number of evaluations to curricular units in the 2nd semester",
"Curricular units 2nd sem (approved)": "Number of curricular units approved in the 2nd semester", 
"Curricular units 2nd sem (grade)":"Grade average in the 2nd semester (between 0 and 20)" ,
"Curricular units 2nd sem (without evaluations)":"Number of curricular units without evalutions in the 2nd semester" ,
"Target": "Whether the student has dropped out, remained enrolled, or graduated at the end of the course duration"

}


console.log(axisNames)


const helper = (axisName) => {// code for individual helper freq plots
// referenced:
// https://observablehq.com/@d3/histogram/2?intent=fork
// https://d3js.org/d3-array/bin
// https://d3-graph-gallery.com/graph/histogram_basic.html

d3.select("#helper-plot").selectAll("g").remove()
d3.select("#axis-info").selectAll("text").remove()

// d3.select("#axis-info").append("text").text("Additional information about axis:")
d3.select("#axis-info").append("text").text(`Additional information about axis: ${axisInfo[axisName]}`)

//let axisName = "Age at enrollment"
let helperBins;
 
if ( axisName != "Previous qualification (grade)" && axisName != "Admission grade") {
    helperBins = d3.bin().value((d) =>d[axisName])(data)
    }
//https://d3js.org/d3-array/bin#bin_thresholds
//setting the domain is important; otherwise will only produce one bin
if(axisName == "Previous qualification (grade)" || axisName == "Admission grade"){
    // console.log(d3.extent(data))
    helperBins = d3.bin()
    .domain([95.0, 195.0])
    // .thresholds([95.0, 105.0, 125.0, 145.0, 165.0, 175.0, 195.0])
    .value((d) =>d[axisName])(data)
}

console.log(data[0][axisName])
console.log(helperBins)

const helperHeight = 400
const helperWidth = 400
const helperMargin = 60

let helperX;
if (axisName != "Target"){
    helperX = d3.scaleLinear()
    .domain([helperBins[0].x0, helperBins[helperBins.length - 1 ].x1])
    .range([0, helperWidth])
}
else{
    helperX = d3.scaleBand()
    .domain(targetDomain)
    .range([0, helperWidth])
}

console.log(helperX)

//parallelYAxes[axisName] //rework this later

    const helperY = d3.scaleLinear()
    .range([helperHeight, 0])
    .domain([0, d3.max(helperBins, (d)=>d.length)])




const helperPlot = d3.select("#helper-plot")
helperPlot
    .append("g")
    .append("svg")
    .attr("width", helperWidth + 2 * helperMargin)
    .attr("height", helperHeight + 2 * helperMargin)
helperPlot.append("g")
    .append("text")
    .text("Histogram: " + axisName + " vs Frequency")
    .attr("transform", `translate(0, 20)`)

    
// helperPlot.style("background-color", "gray")
//     .append("g")
//     .attr("transform", `translate(${helperMargin}, ${helperMargin})`)
console.log(data[0])

helperPlot
    .append("g")
    .call(d3.axisBottom(helperX))
    .attr("transform", `translate(${helperMargin}, ${helperHeight + helperMargin})`)
    

    
helperPlot.append("g")
    .call(d3.axisLeft(helperY))
    .attr("transform", `translate(${helperMargin},${helperMargin})`)
    
helperPlot.append("g")
    .append("text")
    .text("Frequency")
    .attr("transform", `translate(0,${helperMargin - 15})`)
helperPlot.append("g")
    .append("text")
    .text(axisName)
    .attr("transform", `translate(${helperWidth/2 - 20}, ${helperHeight + helperMargin + 35})`)

if (axisName != "Target"){
    helperPlot.selectAll("rect")
    .data(helperBins)
    .join("rect")
        .attr("x", (d) => helperX(d.x0) + 1)
        .attr("width", (d)=> helperX(d.x1) - helperX(d.x0) - 1)
        .attr("y", (d) =>helperY(d.length))
        .attr("height", (d) => helperY(0) - helperY(d.length))
        .attr("fill", "orange")
        .attr("transform", `translate(${helperMargin}, ${helperMargin})`)
    }
else{
    let counts = {}
    for (i in targetDomain){
        let curr = targetDomain[i]
        let groupByDropout = d3.group(data, (d) => d.Target)
        counts[curr] = groupByDropout.get(curr).length
    }
    console.log(counts)
    helperPlot.selectAll("rect")
    .data(targetDomain)
    .join("rect")
        .attr("x", (d) => helperX(d))
        .attr("width", helperX.bandwidth())
        .attr("y", (d) => helperY(counts[d]))
        .attr("height", (d) => helperY(0) - helperY(counts[d]))
        .attr("fill", "orange")
        .attr("transform", `translate(${helperMargin}, ${helperMargin})`)
    }
}




// implement brushing
    
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
            // if (selection === null){
            //     selections.delete(key)
            // }
            if (selection){
                //[[x0,y0], [x1,y1]] = extent
                [y0, y1] = selection
                selections.set(key, selection)
                console.log(y0, y1)
                //let axisName = invParallelXAxis(x0 + ((x1-x0)/2))
                //console.log(parallelYAxes["Target"](d["Target"]))
                //parallelPlot.selectAll("path")
                lines
                .style("stroke", "gray")
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
                .style("stroke", d => parallelPlotColor(d["Target"]))
                .data()

            }
            else{
                selections.delete(key)

                if (selections.size != 0){
                lines
                .style("stroke", "gray")
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
                .style("stroke", d => parallelPlotColor(d["Target"]))
                .data()
                }
                else(
                    lines.style("stroke", d => parallelPlotColor(d["Target"]))
                )

            }
            // parallelPlot.property("value", value).dispatch("input");
        })





        const axes = parallelPlot.selectAll("axis")
        .data(axisNames).enter()
        .append("g")
        .call(brush)
        .attr("transform", function(d) { return "translate(" + parallelXAxis(d) + ")"; })
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(parallelYAxes[d])); })
        // .on("mouseover", () => 
        // {console.log("mouseover")
        // helperBars.attr("fill", "orange")})
            // d3.select(this)
            // .style("stroke", "black")
            // .style("opacity", 1)

        .append("text")
        .style("text-anchor", "start")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("fill", "black")
        .attr("transform", `translate(0, ${height - margin * 1.75}) rotate(35)`)
        // .attr("transform", "rotate(-25)")
        .on("mouseover", (event, d) => {
            console.log("aaaaa")
            d3.select(event.currentTarget).style("fill", "orange")
            // console.log(event.currentTarget)
            // console.log(event.currentTarget.textContent)
        })
            
        .on("mouseleave",(event, d) =>{
            d3.select(event.currentTarget).style("fill", "black")
        })
        .on("click", (event, d) =>{
            let axisName = event.currentTarget.textContent
            console.log(d3.select("#helper-plot"))
            // if (d3.select("#helper-plot") != null){
            //     d3.select("#helper-plot").remove()
            // }
            console.log(axisName)
            helper(axisName)
        })
        
        // .on("mousemove",() =>{
        //     console.log("mousemove")
        //     tooltip
        //     .html("mousemove")
        //     .style("left", (d3.pointer("mousemove")[0]+70) + "px")
        //     .style("top", (d3.pointer("mousemove")[1]) + "px")
        // })


        // parallelPlot.select("rect.selection")
        // .on("mouseover", () => console.log("mouseover"))
        // .on("mousemove", ()=>console.log("mousemove") )
        // .on("click", ()=>{console.log("clicked")})
})
// code for parallel brushable plot

// code for bubble

// code for cluster

// whatever js code needed for scikit

