// Y: highest position
// X: weeks in chart


 //Read api
 d3.json("/api/v1.0/scatter").then(songData => {
    console.log(songData);

    var highestPosition= []
    var weeksInChart= [];
    songData.forEach(song => {
        weeksInChart.push(song["week_count"])
        highestPosition.push(song["top_position"]);
    });
    

    var trace = {
        x: highestPosition,
        y: weeksInChart,
        type: 'scatter',
        mode: 'markers'
    };

    var layout = {
        
        title:'Weeks on chart vs. Highest Ranking',
        xaxis: { title: "Weeks in chart"},
        yaxis: {title: "Highest Ranking"}
      };

    var data = [trace]

      
    Plotly.newPlot('scatter', data, layout);
    });