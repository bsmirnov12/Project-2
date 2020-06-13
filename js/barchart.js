// Associated elements.
// Make it global, because they are frequently used
var artistChart = d3.select('#Artist_bar');
var artistWaiter = d3.select('#artist-waiter');
var artistCard = d3.selectAll('.artist-card');
artistCard.style('visibility', 'hidden');


// define button for form
function init() {
    
    // console.log(input)
    var data = [], artist_info = {};
    const query1 = `/api/v1.0/artistrating?limit=10&is_band=0`
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
            // console.log(data['artist_id'].map(artist_id => artist_info[artist_id]))

            var data2 = [{
                hovertemplate: `$Artist: %{y} <br>Rating: %{x}`,
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
                yaxis: {title: "Artist", tickangle: -45},
                hovermode:'closest',
                barmode: 'group',
                margin: 200
            };
          
            Plotly.newPlot('Artist_bar', data2, layout);

            // Rendering complete. Hide wait indicator, show the chart
            artistWaiter.style('visibility', 'hidden');
            artistChart.style('visibility', 'visible');
            artistCard.style('visibility', 'visible');
        });
    }

function handleInput() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
  
    // Select the input value from the form
    var button = d3.select("#artistInput").node().value;
    
    // Build the plot with the selected value
    renderBarchart(button);
  }


function renderBarchart(selected) {
    // Hide the chart and show "Rendering..." instead
    artistChart.style('visibility', 'hidden');
    artistWaiter.style('visibility', 'visible');
    
    // based on selected value change input for dynamic query
    if (selected== 'Artists'){
        input=0
    }
    else{
        input=1
    }
    // console.log(input)
    var data = [], artist_info = {};
    const query1 = `/api/v1.0/artistrating?limit=10&is_band=${input}`
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
            // console.log(data['artist_id'].map(artist_id => artist_info[artist_id]))

            var data2 = [{
                hovertemplate: `${selected}: %{y} <br>Rating: %{x}`,
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

            // Rendering complete. Hide wait indicator, show the chart
            artistWaiter.style('visibility', 'hidden');
            artistChart.style('visibility', 'visible');
            // artistCard.style('visibility', 'visible');
        });
    }

init();
d3.select("#artistInput").on("change", handleInput);
