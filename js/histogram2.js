// by Song score

//Read api
d3.json("/api/v1.0/tophist").then(songData => {
    

    console.log(songData);

    var trace = {
        histfunc: 'count',
        x: songData,
        xbins: {'end': 100, 'size':10, 'start': 1},
        ybins: {'end': 800, 'size':100, 'start': 0},
        type: 'histogram',
        marker: {
            color: 'lightblue'}
    };

    var layout = {
        title: "Distribution of Songs by their Top Rank in Top 100",
        bargap: 0.01,
        xaxis: {
            title: "Highest Position of Songs",
            ticks: 'outside'
        },
        yaxis: {
            title: "Number of Songs with Similar Top Ranks",
            ticks: 'outside'
        }
    };

    var data = [trace]

      
    Plotly.newPlot('histogram2', data, layout);
    });