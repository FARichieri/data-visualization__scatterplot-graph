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
      data.sort((a, b) => a.Year - b.Year);

      console.log({ data });

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

      const xScale = d3
        .scaleLinear()
        .domain([data[0].Year, data[data.length - 1].Year])
        .range([padding, width - padding]);

      const yScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.Time))
        .range([height - padding, padding].reverse());

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
      const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

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

      svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', (d) => d.Year)
        .attr('data-yvalue', (d) => d.Time.toISOString())
        .attr('cx', (d, i) => xScale(d.Year))
        .attr('cy', (d) => yScale(d.Time))
        .attr('r', 3)
        .attr('fill', 'green');

      svg.append('g').attr('id', 'legend');

      const types = ['doping', 'clean'];

      types.map((type) =>
        svg
          .select('#legend')
          .append('g')
          .attr('class', 'legend-label')
          .append('rect')
          .attr('x', width - padding)
          .attr('y', (height - padding) / 2)
          .attr('width', 25)
          .attr('height', 25)
          .attr('fill', 'yellow')
          .append('text')
          .attr('x', width - padding)
          .attr('y', (height - padding) / 2 + 40)
          .attr('text-anchor', 'end')
          .style('font-size', '.5rem')
          .text(
            `${
              type === 'doping'
                ? 'Riders with doping allegations'
                : 'No doping allegations'
            }`
          )
      );

      // legendContainer
      //   .selectAll('.legend-label')
      //   .append('text')
      //   .attr('x', width - padding)
      //   .attr('y', (height - padding) / 2 + 40)
      //   .attr('text-anchor', 'end')
      //   .style('font-size', '.5rem')
      //   .text(
      //     types.map((type) =>
      //       type === 'doping'
      //         ? 'Riders with doping allegations'
      //         : 'No doping allegations'
      //     )
      //   );
    })
    .then(hideLoader())
    .catch((error) => console.log(error));
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChart();
