//Read api
function buildPlot() {
    var base_url = "/api/v1.0/artistrating?"
    var limit = 10
    var band= 0  // 1 = band, 0 = individual
    const query1= `${base_url}limit=${limit}&is_band=${band}`

    var data = []

    
    // Read api and handle data promise
    d3.json(query1).then(artistData => {
    
        console.log(artistData);})
        
        var artistID= [];
        var score= [];

        artistData.forEach(artist => {
            artistID.push(artist["artist_id"]);
            score.push(artist["total_score"]);
        });
        console.log(artistID)

        var data = [{
            x: artistID,
            y: score,
            type: 'bar',
            text: artistID
        }]

        var layout = {
            title:'Top 10 Artists',
            xaxis: { title: "Artist"},
            yaxis: {title: "Rating"},
            hovermode:'closest'
        };
      
        Plotly.newPlot('artist_bar', data, layout);
        
    };
buildPlot();
