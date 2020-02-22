
const margin = {top: 50, right: 50, bottom: 50, left: 50}
, width = 800 - margin.left - margin.right
, height = 600 - margin.top - margin.bottom

d3.csv('data/gapminder.csv').then((data) => {

    const div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

    const svg = d3.select('body').append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    let d1980 = data.filter(d => d['year'] == 1980)
    let functions = drawAxis(d1980,svg)
    let xScale = functions[0]
    let yScale = functions[1]
    svg.selectAll('.dot').data(d1980)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(d['fertility']))
            .attr('cy', d => yScale(d['life_expectancy']))
            .attr('r', function(d) {return (d['population'])/15000000})
            .attr('stroke-width', '2')
            .attr('stroke', '#85C1E9 ')
            .attr("fill","#D5D8DC")
            .attr("fill-opacity", "0.5")
            .on("mouseover", function(d) {
              let country = d['country']
              let dus = data.filter(d => d['country'] == country && Number.isInteger(parseInt(d['population'])))
              addToolTip(dus,svg,div);
            })
            .on("mouseout", function(d) {
                div.transition()
                    .style('opacity', 0)
                div.selectAll("svg").remove()
            })
            let popmil = data.filter(d => d['population'] > 100000000 && d['year'] == 1980)
            countryLabel(popmil,svg,xScale,yScale)

})

function label(svg) {
      svg.append('text')
        .attr('x', 240)
        .attr('y', 50)
        .attr('font-size', '30px')
        .text("Fertility vs Life Expectancy (1980)")
      svg.append('text')
        .attr('x', 400)
        .attr('y', 590)
        .attr('font-size', '20px')
        .text("Fertility")
      svg.append('text')
        .attr('x', 15)
        .attr('y', 40)
        .attr('font-size', '20px')
        .text("Life Expectancy")
}

function ttlabel(tooltipSvg) {
  tooltipSvg.append('text')
    .attr('x', 400)
    .attr('y', 590)
    .attr('font-size', '20px')
    .text("Year")
  tooltipSvg.append('text')
    .attr('x', 15)
    .attr('y', 40)
    .attr('font-size', '20px')
    .text("Population/million")
}

function countryLabel(popmil,svg,xScale,yScale) {
  svg.selectAll('.text')
      .data(popmil)
      .enter()
      .append('text')
          .attr('x', function(d) { return xScale(+d['fertility'])+20 })
          .attr('y', function(d) { return yScale(+d['life_expectancy'])})
          .attr('font-size', "12px")
          .attr('fill',"#3498DB")
          .text(function(d) {
            return d['country'] })

}
function addToolTip(dus,svg,div) {
  const tooltipSvg = div.append("svg")
     .attr('width', width + margin.left + margin.right)
     .attr('height', height + margin.top + margin.bottom)
  const yelim = d3.extent(dus, d => d['year'])
  const tXScale = d3.scaleLinear()
      .domain([yelim[0], yelim[1]])
      .range([margin.left, width + margin.left])
  const tXAxis = tooltipSvg.append("g")
      .attr("transform", "translate(0," + (height + margin.top) + ")")
      .call(d3.axisBottom(tXScale))
  const plim = d3.extent(dus, d => d['population']/1000000)
  const tYScale = d3.scaleLinear()
      .domain([plim[1], plim[0]])
      .range([margin.top, margin.top + height])
  const tYAxis = tooltipSvg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(tYScale))
  const line = d3.line()
      .x(d => tXScale(d['year'])) // set the x values for the line generator
      .y(d => tYScale(d['population']/1000000)) // set the y values for the line generator
  tooltipSvg.append("path")
      .datum(dus)
      .attr("d", function(d) { return line(d) })
      .attr("stroke", "black")
    div.transition()
        .duration(200)
        .style('opacity', 0.9)
    div.style('left', d3.event.pageX + "px")
        .style('top', (d3.event.pageY - 28) + "px")
    ttlabel(tooltipSvg);
}

function drawAxis(d1980,svg) {
  const ferlim = d3.extent(d1980, d => d['fertility'])
  const xScale = d3.scaleLinear()
      .domain([ferlim[0], ferlim[1]])
      .range([margin.left, width + margin.left])

  const xAxis = svg.append("g")
      .attr("transform", "translate(0," + (height + margin.top) + ")")
      .call(d3.axisBottom(xScale))

  const liflim = d3.extent(d1980, d => d['life_expectancy'])

  const yScale = d3.scaleLinear()
      .domain([liflim[1], liflim[0]])
      .range([margin.top, margin.top + height])
  const yAxis = svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(yScale))
  label(svg);
  const rlimit = d3.extent(d1980, d => d['population'])
  const rScale = d3.scaleLinear()
      .domain([rlimit[0], rlimit[1]])
      .range([margin.top, margin.top + height])
  return [xScale,yScale]
}
