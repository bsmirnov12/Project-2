var base_url = "/api/v1.0/evolution?" 

var years = [2020]
var above = 50
var below = 0
var more = 0
var less = 0
// const query1= `${base_url}years=${years}&above=${above}&below=${below}&more=${more}&less=${less}`
// const query2 ='/api/v1.0/songs?ids='
// var data = [], song_info = {};

var songEvolution = []
song_info = {};
const query1= `${base_url}years=${years}&above=${above}&below=${below}&more=${more}&less=${less}`
d3.json(query1)
    .then(response1 => {
        songEvolution = response1;
        var ids = songEvolution.map(song=>song['id']).join(',');
        let query2 = '/api/v1.0/songs?ids=' + ids;
        return d3.json(query2)
    })
    .then(response2 => {
        response2.forEach(song => { song_info[song.id] = song });
        // Draw chart with data. Use data['week_count'] for X-axis, data['song_id'] for Y-axis, or the other way around
        // Add tooltips with song_info, use song_info[song_id] to get the deatils
    });

console.log(song_info)
// d3.json(query1)
//     .then(response1 => {
//         var songEvolution = response1;
//         console.log(songEvolution);
//         var ids = songEvolution.map(song=>song['id']).join(',');
//         console.log(ids)

//         var query2 = '/api/v1.0/songs?ids=' + ids;
//         return query2})
//         .then(response2=> {
//             var songInfo = response2;
//             console.log(songInfo)})
            
    //     })
    //     songEvolution.forEach(song => {
    //         trace = {
                
    //             x: song['week'],
    //             y: song['score'],
    //             mode: 'lines',
    //             type:'scatter',
    //             line:{
    //                 width:1
    //             }
    //         }
    //     data.push(trace);
    //     });
    
    //     // define layout object
    //     var layout = {
    //         showlegend: true,
    //         title: `Life cycle of a song on Top 100 Chart (${years[0]}-${years[years.length-1]})`,
    //         xaxis:{
    //             title: "Weeks on Chart",
    //             showgrid: false,
    //             tickmode: 'linear',
    //             ticks: 'inside',
    //             tick0: 0,
    //             dtick: 10,
    //             ticklen: 7,
    //             tickwidth: 2
    //             },
    //         yaxis: {
    //             title: "Rank in Chart",
    //             showgrid: false,
    //             tickmode:"linear",
    //             ticks: 'outside',
    //             tick0: 25,
    //             dtick: 25,
    //             ticklen: 7,
    //             tickwidth: 2
    //         }
            
    //     };
        
    // })
    // .then(response2 => {
    //     var songInfo = response2
    //     console.log(songInfo)
    //     var names= songInfo.map(song => song["song_name"]);
    //     console.log(names);
    //     // Draw chart with data. Use data['week_count'] for X-axis, data['song_id'] for Y-axis, or the other way around
    //     // Add tooltips with song_info, use song_info[song_id] to get the deatils
    //     songEvolution.forEach(song => {

    //         // d3.json("/api/v1.0/songs?ids="+song['id']).then(songInfo=>{
    //         //     song_name= songInfo.map(song=> song['song_name'])
    //         //     console.log(song_name)
    //         //     return song_name})
            
    //         trace = {
                
                
    //             // use song['id'] for API call
    //             // d3.json("/api/v1.0/songs?ids="+song['id']).then(songInfo=>{
    //                 // song_name= songInfo.map(song=> song['song_name']
    //                 // return song_name)
           
    //             x: song['week'],
    //             y: song['score'],
    //             mode: 'lines',
    //             type:'scatter',
    //             line:{
    //                 width:1
    //             }
    //         }
    //     data.push(trace);
    //     });
        
    
    //     // define song titles (interactive hover element)
    //     var titles = songData.map(song =>  song.id); 
    //     //still need actual song title from id- access another endpoint 
    //     // /api/v1.0/songs?ids=<comma separated list of ids>
    
    //     d3.json("/api/v1.0/songs?ids=2").then(songInfo=>{
    //         console.log(songInfo)
    //         song_name= songInfo.map(song=> song['song_name'])
    //         console.log(song_name)
    //         return song_name
            
    //     });
    
    
    //     // define layout object
    //     var layout = {
    //         showlegend: true,
    //         title: `Life cycle of a song on Top 100 Chart (${years[0]}-${years[years.length-1]})`,
    //         xaxis:{
    //             title: "Weeks on Chart",
    //             showgrid: false,
    //             tickmode: 'linear',
    //             ticks: 'inside',
    //             tick0: 0,
    //             dtick: 10,
    //             ticklen: 7,
    //             tickwidth: 2
    //             },
    //         yaxis: {
    //             title: "Rank in Chart",
    //             showgrid: false,
    //             tickmode:"linear",
    //             ticks: 'outside',
    //             tick0: 25,
    //             dtick: 25,
    //             ticklen: 7,
    //             tickwidth: 2
    //         }
            
    //     };
          
    //     Plotly.newPlot('line', data, layout);
        
    // });