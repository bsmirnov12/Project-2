// by Song score

//Read api
d3.json("/api/v1.0/tophist").then(songData => {
    
    // Visibility control
    let scoresHistogram = d3.select('#histogram2');
    scoresHistogram.style('visibility', 'hidden');

    // console.log(songData);

    var data = [{
        histfunc: 'count',
        x: songData,
        xbins: {'end': 100, 'size':10, 'start': 1},
        ybins: {'end': 800, 'size':100, 'start': 0},
        type: 'histogram',
        marker: {
            color: 'lightblue'}
    }];

    var layout = {
        title: "Distribution of Songs by their Top Rank in Top 100",
        bargap: 0.01,
        xaxis: {
            title: "Highest Position of a Song in Top 100",
            ticks: 'outside',
            tickvals: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            autorange: 'reversed'
        },
        yaxis: {
            title: "Number of Songs with Similar Top Ranks",
            ticks: 'outside'
        }
    };
      
    Plotly.newPlot('histogram2', data, layout);

    // Rendering complete. Hide wait indicator, show the chart
    var scoresWaiter = d3.select('#scores-waiter');
    scoresWaiter.style('display', 'none');
    scoresHistogram.style('visibility', 'visible');
});