// Y: highest position
// X: weeks in chart

 //Read api
 d3.json("/api/v1.0/scatter").then(songData => {
    // console.log(songData);

    // Visibility control
    let scatterChart = d3.select('#scatter');
    scatterChart.style('visibility', 'hidden');

    var highestPosition= []
    var weeksInChart= [];
    var songId=[];
    songData.forEach(song => {
        songId.push(song["song_id"])
        weeksInChart.push(song["week_count"])
        highestPosition.push(song["top_position"]);
    });
       
    var myPlot = document.getElementById('scatter'),
        hoverInfo = document.getElementById('hoverinfo'),
        data = [{
            x: weeksInChart,
            y: highestPosition,
            type: 'scatter',
            marker: {
                color: 'lightblue'},
            mode: 'markers'}];
        layout = {
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
            hovermode:'closest'};
  
    Plotly.newPlot('scatter', data, layout);

    // Rendering complete. Hide wait indicator, show the chart
    var scatterWaiter = d3.select('#scatter-waiter');
    scatterWaiter.style('display', 'none');
    scatterChart.style('visibility', 'visible');
    
//     myPlot.on('plotly_hover', function(data){
//         var infotext = data.points.map(function(d){
//             var some=d3.json(`/api/v1.0/song/${d.data.text}`).then(info => {return info["name"]; });
//             return some
//         });\
//         hoverInfo.innerHTML = infotext.join('<br/>');
//     })
//     .on('plotly_unhover', function(data){
//         hoverInfo.innerHTML = '';
//     });
});
