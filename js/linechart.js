// Revise endpoint for filtering parameters
var base_url = "/api/v1.0/evolution?"
// -------------------------------------
// base_endpoint='/api/v1.0/evolution?years=<comma separated list of years>&above=<int>&below=<int>&more=<int>&less=<int></int>'
// years - comma separeted list of years. Include only songs that were in Top 100 during specified years
// above - include only songs which position number was <=above (above=50 - top half of Top 100, #1 hits and below to #50)
// below - include only songs which position number was >=below (below=50 - bottom half of Top 100, from #50 to #100)
// more - include only songs which stayed in Top 100 >=more number of weeks
// less - include only songs which stayed in Top 100 <=less number of weeks
var years = [2020]
var above = 50
var below = 0
var more = 0
var less = 0
const query1= `${base_url}years=${years}&above=${above}&below=${below}&more=${more}&less=${less}`

var data = [], song_info = {};

var data = [];
song_info = {};


d3.json(query1)
    .then(response1 => {
        songEvolution = response1;
        var ids = songEvolution.map(song=>song['id']).join(',');

        
        let query2 = '/api/v1.0/songs?ids=' + ids;
        return d3.json(query2)
    })
    .then(response2 => {
        response2.forEach(song => { song_info[song.id] = song });
        console.log(song_info)

        // Draw chart with data. Use data['week_count'] for X-axis, data['song_id'] for Y-axis, or the other way around
        // Add tooltips with song_info, use song_info[song_id] to get the deatils
    });

console.log(song_info)



// Read api and handle data promise
d3.json(query1).then(songData => {
    console.log(songData);
    console.log(query1);

    var data = [];

    songData.forEach(song => {

        // d3.json("/api/v1.0/songs?ids="+song['id']).then(songInfo=>{
        //     song_name= songInfo.map(song=> song['song_name'])
        //     console.log(song_name)
        //     return song_name})
        
        var trace = {
            name: song_info[song]['song_name'],
            
            
            // use song['id'] for API call
            // d3.json("/api/v1.0/songs?ids="+song['id']).then(songInfo=>{
                // song_name= songInfo.map(song=> song['song_name']
                // return song_name)
       
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
    var titles = songData.map(song =>  song.id); 
    //still need actual song title from id- access another endpoint 
    // /api/v1.0/songs?ids=<comma separated list of ids>

    d3.json("/api/v1.0/songs?ids=2").then(songInfo=>{
        console.log(songInfo)
        var song_name= songInfo.map(song=> song['song_name'])
        console.log(song_name)
        return song_name
        
    });


    // define layout object
    var layout = {
        showlegend: true,
        title: `Life cycle of a song on Top 100 Chart (${years[0]}-${years[years.length-1]})`,
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