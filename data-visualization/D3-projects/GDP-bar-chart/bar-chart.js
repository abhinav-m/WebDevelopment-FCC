const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

fetch(url)
    .then(data => data.json())
    .then(data => makeChart(data))


function makeChart(data) {
    const chartData = data.data;

    //Maximum and minimum date in our fetched data.
    const minDate = new Date(chartData[0][0])
    const maxDate = new Date(chartData[chartData.length - 1][0]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currFormatter = d3.format("$,.2f");

    //Margins for our chart svg.
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    }

    //Selecting svg element.
    var svg = d3.select('.chart')

    //Setting height and width by subtracting margins.
    var width = svg.attr('width') - margin.left - margin.right;
    var height = svg.attr('height') - margin.top - margin.bottom;

    var barWidth = Math.ceil(width / chartData.length);

    //Initialise scales

    //x scale with range from 0 ->  width of chart domain from minimum date to max date.
    var x = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width])


    //y scale range from height -> 0 (since svg origin is at top left.) will represent GDP.
    var y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d[1])])
        .range([height, 0])

    //offsetting chart by left and top margin.
    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //Appending and translating both axis to chart.
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

    var infoCard = d3.select("#content").append("div")
        .attr("class", "info")
        .style("opacity", 0);


    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).ticks(10, ".0f"))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .style('text-anchor', 'end')
        .text('GDP, USA')

    //Adding properties of each bar in chart.
    g.selectAll('.bar')
        .data(chartData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(new Date(d[0])))
        .attr('y', d => y(d[1]))
        .attr('width', barWidth)
        .attr('height', d => height - y(d[1]))
        .on('mouseover', (d) => {
            let date = new Date(d[0]);
            let year = date.getFullYear();
            let month = date.getMonth();
            let amount = d[1];

            infoCard.transition()
                .duration(200)
                .style('opacity', 0.8);

            infoCard.html('<span >' + currFormatter(amount) + '&nbsp;Billion </span><br><span >' + months[month] + ' , ' + year + '</span>')
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 80) + "px");

        })
        .on("mouseout", function() {
            infoCard.transition()
                .duration(500)
                .style("opacity", 0);
        });





}