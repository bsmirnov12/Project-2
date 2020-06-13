// Y: highest position
// X: weeks in chart

// Visibility control
let scatterChart = d3.select('#scatter');
scatterChart.style('visibility', 'hidden');

 //Read api
 d3.json("/api/v1.0/scatter").then(songData => {
    // console.log(songData);

    var highestPosition= []
    var weeksInChart= [];
    var songId=[];
    songData.forEach(song => {
        songId.push(song["song_id"])
        weeksInChart.push(song["week_count"])
        highestPosition.push(song["top_position"]);
    });
       
    let data = [{
        x: weeksInChart,
        y: highestPosition,
        meta: songId.map(function(id) {return {song_id: id, name: "", performer: ""}}),
        hovertemplate: 'Song: %{meta.name}<br>By: %{meta.performer}<br>Top Position: %{y}<br>Weeks in Top 100: %{x}',
        type: 'scatter',
        marker: {
            color: 'lightblue'},
        mode: 'markers'
    }];

    let layout = {
        title:'Weeks on chart vs. Highest Ranking',
        xaxis: {
            title: "Weeks in chart"
        },
        yaxis: {
            title: "Highest position in Top 100",
            tickmode:"array",
            tickvals: [1, 25, 50, 75, 100],
            autorange: 'reversed',
            zeroline: false
        },
        hovermode:'closest'
    };
  
    return Plotly.newPlot('scatter', data, layout);
   
}).then(function() {
    // Rendering complete. Hide wait indicator, show the chart
    var scatterWaiter = d3.select('#scatter-waiter');
    scatterWaiter.style('display', 'none');
    scatterChart.style('visibility', 'visible');

    // For some reasons D3 selection doesn't bind event handler with Plotly element
    // Need to use standard DOM Element to register event handler
    let elem = document.getElementById('scatter');
    elem.on('plotly_hover', event => {
        // console.log(event);
        let point = event.points[0];

        if (!point.meta.name.length) {
            d3.json(`/api/v1.0/song/${point.meta.song_id}`).then(response => {
                // console.log(response);
                point.meta.name = response.song_name;
                point.meta.performer = response.performed_by;
            });
        }
    });
});
