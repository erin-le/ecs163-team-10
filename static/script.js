// put code for stem/guided narrative here: parallel plot

// put labels of axes we want to plot here
axis_names = []

y_axis_scalers = []

// code for parallel brushable plot

// code for bubble

d3.dsv(';', '/get_data').then(data => {
    console.log("data:" + data)
    // Data processing here
    const courseStats = data.reduce((acc, val) => {
        if (!acc[val.Course]) {
            acc[val.Course] = {Total : 0, Graduate : 0, Dropout : 0};
        }
        acc[val.Course].Total += 1;
        if (val.Target === "Graduate") {
            acc[val.Course].Graduate += 1;
        } else if (val.Target === "Dropout") {
            acc[val.Course].Dropout += 1;
        }
        return acc;
    }, {});

    const bubbleData = Object.keys(courseStats).reduce((acc, key) => {
        const total = courseStats[key].Total;
        const graduateRate = (courseStats[key].Graduate / total) * 100;
        const dropoutRate = (courseStats[key].Dropout / total) * 100;

        acc.push({
            Course : key,
            Total : total,
            Status : 'Graduate',
            Rate : graduateRate,
            Size : total * graduateRate
        });
        acc.push({
            Course : key,
            Total : total,
            Status : 'Dropout',
            Rate : dropoutRate,
            Size : total * dropoutRate
        });

        return acc;
    }, []);

    console.log(bubbleData);
    // Extract unique course numbers
    const courses = [...new Set(bubbleData.map(d => d.Course)) ];

    // Define an ordinal scale for course colors
    const color = d3.scaleOrdinal().domain(courses).range(
        d3.schemeTableau10); // This uses one of D3's built-in color schemes

    // set the dimensions and margins of the graph
    var margin = {top : 10, right : 20, bottom : 100, left : 70},
        width = parseInt(d3.select('#graph-container').style("width")) - margin.left - margin.right,
        height = parseInt(d3.select('#graph-container').style("height")) - margin.top - margin.bottom;

    // append the svg object to the div with id "my_dataviz"
    var svg = d3.select("#bubble")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

    // Create a clipping region to ensure elements don't go outside the bounds
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    // X axis: Scale and draw:
    var x = d3.scaleLinear()
                .domain([ 0, 100 ]) // Assuming Rate is from 0 to 100%
                .range([ 0, width ]);
    svg.append("g")
        .attr("class", "x-axis") // Add class for x-axis
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Y axis: a scale and draw:
    var y = d3.scaleBand()
                .domain(bubbleData.map(d => d.Status))
                .range([ height, 0 ])
                .padding(0.1);
    svg.append("g").call(d3.axisLeft(y));

    // A scale for bubble size
    var z =
        d3.scaleLinear().domain([ 0, d3.max(bubbleData, d => d.Size) ]).range([
            2, 40
        ]);
    // Add the bubbles
    svg.append('g')
        .selectAll("dot")
        .data(bubbleData)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.Rate); })
        .attr("cy", function(d) { return y(d.Status) + y.bandwidth() / 2; })
        .attr("r", function(d) { return z(d.Size); })
        .style("fill", function(d) { return color(d.Course); })
        .style("opacity", "0.7")
        .attr("stroke", "black")
        .on("mouseover",
            function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip
                    .html("Course: " + d.Course + "<br/>Status: " + d.Status +
                          "<br/>Rate: " + d.Rate.toFixed(2))
                    // "<br/>Total: " + d.Graduate * (d.Rate / 100).toFixed(0))

                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
        .on("mouseout",
            function(
                d) { tooltip.transition().duration(500).style("opacity", 0); });

    svg.append("text")
        .attr("class", "x axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 2) + " ," +
                               (height + margin.top + 20) + ")")
        .text("Dropout / Graduation Rate");

    var tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0)
                      .style("position", "absolute")
                      .style("text-align", "center")
                      .style("width", "120px")
                      .style("height", "auto")
                      .style("padding", "2px")
                      .style("font", "12px sans-serif")
                      .style("background", "lightsteelblue")
                      .style("border", "0px")
                      .style("border-radius", "8px")
                      .style("pointer-events", "none");

    // Define the zoom behavior
    var zoom =
        d3.zoom()
            .scaleExtent([ 0.5, 20 ])
            .translateExtent([ [ -100, -100 ], [ width + 90, height + 100 ] ])
            .on("zoom", zoomed);

    // Apply the zoom behavior to the SVG element
    svg.call(zoom);

    // Zoomed function
    function zoomed(event) {
        // Rescale the x axis
        const newX = event.transform.rescaleX(x);
        svg.select(".x-axis").call(d3.axisBottom(newX));

        // Update the bubble positions
        svg.selectAll("circle")
            .attr("cx", d => newX(d.Rate))
            .attr("cy", d => y(d.Status) + y.bandwidth() / 2)
            .attr("r", d => z(d.Size));
    }
});
