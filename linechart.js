 //Read samples.json
 d3.json("data/name_of_file.json").then (data =>{
    console.log(data)

    // define x values
    weeksonChart = data.weeks;

    // define y values --depending on data structure- need to get max value?
    highestPosition = data.max;

    // define trace object for line chart
    var trace = {
        x: weeksonChart,
        y: highestPosition,
        type: 'line'
      };
    
    // define data array
    var data = [trace];

    // define layout object
    var layout = {
        title: `Life cycle of a song on Top 100 Chart`,
        xaxis:{title: "Weeks on Chart",tickmode:"linear"},
        yaxis: {title: "Rank in Chart",tickmode:"linear"},
        
    };
      
Plotly.newPlot('line', data, layout);})