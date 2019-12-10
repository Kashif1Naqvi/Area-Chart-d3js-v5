function render(data){
  let width = window.innerWidth,
      height = window.innerHeight,
      margin = { top :90 , left:80 ,right:80, bottom:90 },
      barWidth = width - margin.right - margin.left ,
      barHeight = height - margin.top - margin.bottom,
      xValue  = d => d.timestamp,
      yValue = d => d.temprature,
      circleRadius = 5;
      let tooltips = d3.select("#area").append("div").attr("class","tooltips")


      let xScale = d3.scaleTime()
          .domain(d3.extent(data,xValue))
          .range([0 , barWidth]);
      let yScale = d3.scaleLinear()
          .domain(d3.extent(data,yValue))
          .range([barHeight,0]).nice();
      let areaGenrator = d3.area()
              .x(d=>xScale(xValue(d)))
              .y0(barHeight)
              .y1(d=>yScale(yValue(d)));
      let lineGenrator = d3.line()
            .x(d=>xScale(xValue(d)))
            .y(d=>yScale(yValue(d)));
      let xAxis = d3.axisBottom(xScale).ticks(5).tickPadding(15)
      let yAxis = d3.axisLeft(yScale).ticks(15).tickPadding(5).tickSize(-barWidth)
      let svg = d3.select("#area").append("svg").attr("viewBox",`0 0 ${width} ${height}`)
      let g = svg.append("g").attr("transform",`translate(${margin.top},${margin.left})`)
      let path = g.append("path").attr("d",areaGenrator(data)).attr("class","path")
      let line = g.append("path").attr("d",lineGenrator(data)).attr("class","line")
      let circle= g.selectAll("circle").data(data).enter()
                  .append("circle")
                  .attr("cx",0)
                  .attr("cy",d=>yScale(yValue(d)))
                  .attr("r",circleRadius)
                  .attr("class","circle")
                  .on("mouseover",function(d,i){
                     let dt = new Date(d.timestamp)
                     tooltips.html(`<div><p>Temperature ${Math.round(d.temperature)}<b>F</b> <br><b>Month no:</b><i>${dt.getMonth()}</i></p> </div>`)
                        .style("top",  ( d3.event.pageY - 114 ) + "px")
                        .style("left", ( d3.event.pageX - 25 ) + "px")
                  })
                  .on("mouseout",function(d,i){
                    tooltips.html("")
                  });
      circle.transition()
            .attr("cx",d=>xScale(xValue(d)))
            .duration(1000)

      let xGroup = g.append("g").call(xAxis).attr("transform",`translate(0,${barHeight})`).attr("class","xAxis")
          xGroup.select(".domain").remove()
      let yGroup = g.append("g").call(yAxis).attr("class","yAxis")
          yGroup.select(".domain").remove()
      let time = g.append("text").attr("x",barWidth/2).attr("y",10).text("Time").attr("transform",`translate(0 , ${innerHeight/2 + 370})`).attr("text-anchor","middle").attr("class","text")
      let temprature = g.append("text").attr("x",0).attr("y",0).attr("transform",`rotate(-90) translate(${barHeight/barWidth - 290  },${barWidth/barHeight - 50}) `).text("Temprature").attr("class","text").attr("text-anchor","middle")
      let title  = g.append("text").attr("x",barWidth/2).attr("y",-12).text("Temprature vs Time Graph").attr("class","text")
}



d3.csv("temp.csv").then(data=>{
  data.forEach(d=>
  {
      d.temprature = +d.temperature
      d.timestamp  = new Date(d.timestamp)
  })
  render(data)
})
