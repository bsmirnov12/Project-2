// by song weeks (distribution of length in chart)

 //Read api
 d3.json("/api/v1.0/weekshist").then(songData => {
    

    console.log(songData);
    var ending_value = Math.max(songData);
    console.log(ending_value);

    var trace = {
        histfunc: 'count',
        x: songData,
        xbins: {'end':ending_value, 'size':5, 'start': 1},
        type: 'histogram',
        marker: {
            color: 'lightblue'}
    };

    var layout = {
        title: "Distribution of Songs by Weeks they were in Top 100",
        bargap: 0.01,
        xaxis: {
            title: "Number of Weeks in Top 100",
            ticks: 'outside'
        },
        yaxis: {
            title: "Number of Songs with Similar Length of Stay",
            ticks: 'outside'
        }
    };

    var data = [trace]

      
    Plotly.newPlot('histogram1', data, layout);
    });