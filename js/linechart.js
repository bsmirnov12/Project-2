// Associated elements.
// Make it global, because they are frequently used
var lineChart = d3.select('#line');
var lineWaiter = d3.select('#line-waiter');
var lineCard = d3.selectAll('.line-card');
lineCard.style('visibility', 'hidden');

// Revise endpoint for filtering parameters

function renderLineChart(year) {
    // Hide the chart and show "Rendering..." instead
    lineChart.style('visibility', 'hidden');
    lineWaiter.style('visibility', 'visible');

    var base_url = "/api/v1.0/evolution"
    // -------------------------------------
    // base_endpoint='/api/v1.0/evolution?years=<comma separated list of years>&above=<int>&below=<int>&more=<int>&less=<int></int>'
    // years - comma separeted list of years. Include only songs that were in Top 100 during specified years
    // above - include only songs which position number was <=above (above=50 - top half of Top 100, #1 hits and below to #50)
    // below - include only songs which position number was >=below (below=50 - bottom half of Top 100, from #50 to #100)
    // more - include only songs which stayed in Top 100 >=more number of weeks
    // less - include only songs which stayed in Top 100 <=less number of weeks
    
    // var above = 50
    // var below = 0
    // var more = 0
    // var less = 0
    // const query1= `${base_url}years=${years}&above=${above}&below=${below}&more=${more}&less=${less}`
    var query1= `${base_url}?years=${year}`

    var data = []
    
    // Read api and handle data promise
    d3.json(query1).then(songData => {

        let maxWeeks = d3.max(songData, d => d['week'].length);
        let coloriser = chroma.scale(['navy', 'yellow']).mode('hsl').domain([1, maxWeeks]);

        songData.forEach(song => {
            let color = coloriser(song['week'].length).css();

            let trace = {
                hovertemplate: '%{meta.name}<br>By: %{meta.performer}<br>Week: %{x}<br>Position: %{y}',
                x: song['week'],
                y: song['position'],
                meta: {
                    id: song['id'],
                    name: song['name'],
                    performer: song['performer']
                },
                mode: 'lines',
                type:'scatter',
                line:{
                    width:1,
                    color: color
                },
                opacity:0.5
            }

            data.push(trace);
        });

        // define layout object
        var  layout = {
            hovermode: 'closest',
            showlegend: false,
            title: `Life cycle of a song on Top 100 Chart for year ${year}`,
            xaxis:{
                title: "Weeks on Chart",
                showgrid: false,
                tickmode: 'linear',
                ticks: 'outside',
                position: 0.05,
                tick0: 0,
                dtick: 10,
                ticklen: 7,
                tickwidth: 2,
                showline: true
                },
            yaxis: {
                title: "Position in Chart",
                showgrid: false,
                tickmode:"array",
                tickvals: [1, 25, 50, 75, 100],
                autorange: 'reversed',
                zeroline: false,
                // tickmode:"linear",
                // tick0: 25,
                // dtick: 25,
                ticks: 'outside',
                ticklen: 7,
                tickwidth: 2
            }
            
        };
        
        Plotly.react('line', data, layout);

        // Rendering complete. Hide wait indicator, show the chart
        lineWaiter.style('visibility', 'hidden');
        lineChart.style('visibility', 'visible');
        lineCard.style('visibility', 'visible');
    });
}

function initLineChart() {
    // Initializing the Select element and the Line Chart
    d3.json('/api/v1.0/lastweeks').then(lastWeeks => {
        // Initialize select with options
        var years = lastWeeks.map(d => d['year']).reverse();
        var formSelect = d3.select('#years');
        formSelect
            .selectAll('option')
            .data(years)
            .join('option')
            .attr('value', d => d)
            .text(d => d)
        formSelect.property('value', years[0]);

        // Set event handler
        formSelect.on('change', function() { console.log(this.value); renderLineChart(this.value) });

        // Create start chart
        renderLineChart(years[0]);
    });
}

initLineChart();

// var LinePlot = d3.select('#line');

// LinePlot.on('plotly_hover', function(data){
//     var update = {'opacity':1};
//     Plotly.restyle('line', update, [tn]);
//   });

