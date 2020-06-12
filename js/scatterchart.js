// Y: highest position
// X: weeks in chart


 //Read api
 d3.json("/api/v1.0/scatter").then(songData => {
    console.log(songData);

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
            text:songId,
            mode: 'markers'}];
        layout = {
            title:'Weeks on chart vs. Highest Ranking',
            xaxis: { title: "Weeks in chart"},
            yaxis: {title: "Highest Ranking"},
            hovermode:'closest'};
  
    Plotly.newPlot('scatter', data, layout);
    
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
// });
