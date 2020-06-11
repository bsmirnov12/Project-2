// by song weeks (distribution of length in chart)

 //Read api
 d3.json("/api/v1.0/weekshist").then(songData => {
    

    console.log(songData);

    var trace = {
        x: songData,
        type: 'histogram'
    };

    var data = [trace]

      
    Plotly.newPlot('histogram1', data);
    });