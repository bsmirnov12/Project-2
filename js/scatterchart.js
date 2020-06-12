// Y: highest position
// X: weeks in chart


 //Read api
 d3.json("/api/v1.0/scatter").then(songData => {
    

    console.log(songData);
    var highestPosition= ;
    var weeksInChart= ;

    var trace = {
        x: highestPosition,
        y: weeksInChart
        type: 'scatter'
    };

    var data = [trace]

      
    Plotly.newPlot('scatter', data);
    });