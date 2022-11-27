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

      const width = 600;
      const height = 280;
      const padding = 60;

      const types = ['doping', 'clean'];
      const typeColor = (type) => (type === 'doping' ? 'red' : 'green');
      const typeText = (type) =>
        type === 'doping'
          ? 'Riders with doping allegations'
          : 'No doping allegations';
      const circleColor = (Doping) => (Doping === '' ? 'green' : 'red');

      const tooltip = d3
        .select('.container')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

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
        .style('font-size', '1.2rem')
        .text('Doping in Professional Bicycle Racing');
      svg
        .append('text')
        .attr('id', 'subtitle')
        .attr('x', width / 2)
        .attr('y', padding / 1.5)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text(`35 Fastest times up Alpe d'Huez`);

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -130)
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
        .attr('fill', (d) => circleColor(d.Doping))
        .on('mouseover', function (d, item) {
          d3.select(this).transition().duration('50').attr('opacity', '.85');
          tooltip.transition().duration(100).style('opacity', 1);
          tooltip
            .html(
              `
            ${item.Name}: ${item.Nationality} </br> Year: ${
                item.Year
              }, Time: ${item.Time.toTimeString().slice(3, 8)} </br> ${
                item.Doping ? '</br>' + item.Doping : ''
              }
          `
            )
            .attr('data-year', item.Year)
            .style('left', d.pageX + 10 + 'px')
            .style('top', d.pageY + 10 + 'px');
        })
        .on('mouseout', function (d, item) {
          d3.select(this).transition().duration('50').attr('opacity', '1');
          tooltip.transition().duration(100).style('opacity', 0);
        });

      svg.append('g').attr('id', 'legend');

      types.map((type, index) =>
        svg
          .select('#legend')
          .append('g')
          .attr('class', 'legend-label')
          .append('rect')
          .attr('x', width - padding + 5)
          .attr('y', (height - 15 - (padding * index) / 2) / 2)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', typeColor(type))
      );

      types.map((type, index) =>
        svg
          .selectAll('.legend-label')
          .append('text')
          .attr('x', width - padding)
          .attr('y', (height - (padding * index) / 2) / 2)
          .attr('text-anchor', 'end')
          .style('font-size', '.5rem')
          .text(typeText(type))
      );
    })
    .then(hideLoader())
    .catch((error) => console.log(error));
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChart();
