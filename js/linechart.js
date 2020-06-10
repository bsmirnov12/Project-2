 //Read api
 d3.json("/api/v1.0/evolution").then(songData => {
    

    console.log(songData);

    var data = [];
        songData.forEach(song => {
        trace = {
            x: song['week'],
            y: song['score'],
            mode: 'lines',
            line:{
                width:1
            }
        }
    data.push(trace);
});
    // define x values
    // Use the map method with the arrow function to return all the week information
    var weekArray = songData.map(songs =>  songs.week);
    console.log(weekArray);

    var weeksonChart = weekArray.map(song => song 
        
    );
    console.log(weeksonChart)
    
    // define y values
    var positionArray = songData.map(songs =>  songs.position);
    console.log(positionArray);

    var highestPosition =positionArray.map(song => song);

    // define song titles (interactive hover element)
    var titles = data.map(songs =>  songs.id); //still need actual song title form id
    // console.log(titles);


    // define layout object
    var layout = {
        showlegend: false,
        title: `Life cycle of a song on Top 100 Chart`,
        xaxis:{title: "Weeks on Chart",tickmode:"linear"},
        yaxis: {title: "Rank in Chart",tickmode:"linear"},
        
    };
      
Plotly.newPlot('line', data, layout);
});