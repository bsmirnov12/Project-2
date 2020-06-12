// Revise endpoint for filtering parameters

function buildPlot() {
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

    var data = []

    
    // Read api and handle data promise
    d3.json(query1).then(songData => {

        songData.forEach(song => {

            var trace = {
                // hovertemplate: hoverTemplate(),
                x: song['week'],
                y: song['score'],
                mode: 'lines',
                type:'scatter',
                line:{
                    width:1
                },
                opacity:0.5
            }

        data.push(trace);

        });
        // var myPlot = document.getElementById('line'),
        // define layout object
        layout = {
            hovermode: 'closest',
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
}

buildPlot();



// myPlot.on('plotly_hover', function(data){
//     var xv='',
//     yv='',
//     colors=[];

   
    
//     for (var i=0; i < data.id.length; i++){
//       pn = data[i].id[i];
//       tn = data[i].id[i];
      
//     };
  
//     var update = {'opacity':1};
//     Plotly.restyle('line', update, [tn]);
//   });
