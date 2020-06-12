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
   
    var data = [{
        x: highestPosition,
        y: weeksInChart,
        type: 'scatter',
        text:songId,
        mode: 'markers'
    }]
    
    var layout = {
        title:'Weeks on chart vs. Highest Ranking',
        xaxis: { title: "Weeks in chart"},
        yaxis: {title: "Highest Ranking"},
        hovermode:'closest'
    };
  
    Plotly.newPlot('scatter', data, layout);
    });

    // myPlot.on('plotly_hover', function(data) {
        
    //     // (d3.json(`api/v1.0/song/${data.text}`).then(info =>{
    //     //     return info["song_name"];}))

    //     hoverInfo.innerHTML = "hello";
    // })
    //  .on('plotly_unhover', function(data){
    //     hoverInfo.innerHTML = '';
    // });