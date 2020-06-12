//Read api

    // var base_url = "/api/v1.0/artistrating?"
    // var limit = 10
    // var band= 0  // 1 = band, 0 = individual
    // const query1= `${base_url}limit=${limit}&is_band=${band}`

    // var data = []

    
    // // Read api and handle data promise
    // d3.json(query1).then(artistData => {

    //     var labels=[]
    //     var artistID= artistData["artist_id"];
    //     var score= artistData["total_score"];

    //     console.log(artistID)
    //     // artist_name = artistID.map(artist => artist.toString()  
    //         // );  //for now- later change artist name to actual name
    //     // labels.push(artist_name) 

    //     var artist_name = artistID.map(d => "C " + d);
    //     var score_label = score.map(d=> "Score: " +d)
    //     console.log(artist_name)
        

    //     var data = [{
    //         x: artist_name,
    //         y: score,
    //         type: 'bar',
    //         text: score_label
    //     }]

    //     var layout = {
    //         title:'Top 10 Artists',
    //         xaxis: { title: "Artist"},
    //         yaxis: {title: "Rating"},
    //         marker: {
    //             color: 'lightblue'},
    //         hovermode:'closest',
    //         barmode: 'group'
    //     };
      
    //     Plotly.newPlot('Artist_bar', data, layout);
    // })    
 
    var data = [], artist_info = {};
    const query1 = '/api/v1.0/artistrating?limit=10'
    d3.json(query1)
        .then(response1 => {
            data = response1;
            let ids = response1['artist_id'].join(',');
            let query2 = '/api/v1.0/artists?ids=' + ids;
            
            return d3.json(query2)
            
        })
        .then(response2 => {
            response2.forEach(artist => { artist_info[artist.id] = artist });
            // Draw chart with data. Use data['total_score'] for X-axis, data['artist_id'] for Y-axis, or the other way around
            // Add tooltips with artist_info, use artist_info[artist_id] to get the deatils
            console.log(data['artist_id'].map(artist_id => artist_info[artist_id]))

            var data2 = [{
                hovertemplate: `Artist: %{y} <br> Rating: %{x}`,
                x: data['total_score'].reverse(),
                y: data['artist_id'].map(artist_id => artist_info[artist_id]['name']).reverse(),
                type: 'bar',
                marker: {
                    color: 'lightblue'},
                orientation: 'h'
            }]
            var layout = {
                title:'Top 10 Artists',
                xaxis: { title: "Rating"},
                yaxis: {title: "Artist",tickangle: -45},
                hovermode:'closest',
                barmode: 'group'
            };
          
            Plotly.newPlot('Artist_bar', data2, layout);
        });