 //Read api
 d3.json("/api/v1.0/evolution").then(songData => {
    

    console.log(songData);

    var data = [];

    songData.forEach(song => {
        trace = {
            x: song['week'],
            y: song['score'],
            mode: 'lines',
            type:'scatter',
            line:{
                width:1
            }
        }
    data.push(trace);
    });
    

    // define song titles (interactive hover element)
    var titles = data.map(songs =>  songs.id); //still need actual song title form id
    // console.log(titles);


    // define layout object
    var layout = {
        showlegend: false,
        title: `Life cycle of a song on Top 100 Chart`,
        xaxis:{
            title: "Weeks on Chart",
            showgrid: false,
            tickmode: 'linear',
            ticks: 'inside',
            tick0: 0,
            dtick: 10,
            ticklen: 7,
            tickwidth: 2
            },
        yaxis: {
            title: "Rank in Chart",
            showgrid: false,
            tickmode:"linear",
            ticks: 'outside',
            tick0: 25,
            dtick: 25,
            ticklen: 7,
            tickwidth: 2
        }
        
    };
      
    Plotly.newPlot('line', data, layout);
    });