const displayChart = async () => {
  await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  )
    .then((response) => response.json())
    .then((data) => {
      data.forEach((d) => {
        const parsedTime = d.Time.split(':');
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });
      console.log(data);

      const width = 600;
      const height = 280;
      const padding = 60;

      const svg = d3
        .select('.container')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`);

      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', width / 2)
        .attr('y', padding / 3)
        .attr('text-anchor', 'middle')
        .style('fill', 'red')
        .style('font-size', '1.2rem')
        .text('Doping in Professional Bicycle Racing');
      svg
        .append('text')
        .attr('id', 'subtitle')
        .attr('x', width / 2)
        .attr('y', padding / 1.4)
        .attr('text-anchor', 'middle')
        .style('fill', 'red')
        .style('font-size', '1rem')
        .text(`35 Fastest times up Alpe d'Huez`);

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -115)
        .attr('y', 15)
        .style('font-size', '.6rem')
        .text('Time in Minutes');

      const timeFormat = d3.timeFormat('%M:%S');

      // check domain again
      const xScale = d3
        .scaleLinear()
        .domain([1990, 2016])
        .range([padding, width - padding]);

      const yScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.Time))
        .range([height - padding, padding]);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
      const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

      const recWidth = (width - padding - padding) / data.length;

      svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${height - padding})`)
        .call(xAxis);

      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);
    })
    .then(hideLoader())
    .catch((error) => console.log(error));
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChart();
