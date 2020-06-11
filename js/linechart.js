 //Read api
//  d3.json("/api/v1.0/evolution").then(songData => {

base_url = "/api/v1.0/evolution?"

// Revise endpoint for filtering parameters
// -------------------------------------
// base_endpoint='/api/v1.0/evolution?years=<comma separated list of years>&above=<int>&below=<int>&more=<int>&less=<int></int>'
// years - comma separeted list of years. Include only songs that were in Top 100 during specified years
// above - include only songs which position number was <=above (above=50 - top half of Top 100, #1 hits and below to #50)
// below - include only songs which position number was >=below (below=50 - bottom half of Top 100, from #50 to #100)
// more - include only songs which stayed in Top 100 >=more number of weeks
// less - include only songs which stayed in Top 100 <=less number of weeks
years = [2020]
above = 50
below = 0
more = 0
less = 0
query_url= `${base_url}years=${years}&above=${above}&below=${below}&more=${more}&less=${less}`
d3.json(query_url).then(songData => {
    console.log(songData);
    console.log(query_url);

    var data = [];

    songData.forEach(song => {
        trace = {
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
    var titles = data.map(songs =>  songs.id); //still need actual song title form id
    // console.log(titles);


    // define layout object
    var layout = {
        showlegend: false,
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