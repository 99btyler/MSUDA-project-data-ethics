// Use D3 to select the table

// Use D3 to create a bootstrap striped table
// https://getbootstrap.com/docs/5.3/content/tables/#striped-rows

// Use D3 to select the table body

// BONUS: Dynamic table
// Loop through an array of grades and build the entire table body from scratch

// Get the capsules endpoint
const url = "https://api.spacexdata.com/v4/launchpads";

// Use D3 to select the table
let table = d3.select("#tornado_table");
let tbody = table.select("tbody");

// Make Table Interactive
let dt_table = new DataTable('#tornado_table');

// Event Listener
d3.select("#filter-btn").on("click", function () {
  doWork();
});

// On Page Load
doWork();

// Helper Functions
function doWork() {
  // Fetch the JSON data and console log it
    d3.json("/api/v1.0/bar_data1").then(function (data) {

    // Make Plot
        makeBarChart1(data);

    });

    d3.json("/api/v1.0/bar_data2").then(function (data) {

        // Make Plot
        makeBarChart2(data);
    
    });

    d3.json("/api/v1.0/bar_data3").then(function (data) {

        // Make Plot
        makeBarChart3(data);
        
    });

    d3.json("/api/v1.0/pie_chart").then(function (data) {

        // Make Plot
        makePieChart(data);
            
    });

    d3.json("/api/v1.0/table").then(function (data) {

        // Make Table
        makeTable(data);
    })

    d3.json("/api/v1.0/map_data").then(function (data) {

        // Make Table
         makeMapData(data);
    })
}


function makeTable(data) {
  // Clear Table
  tbody.html("");
  dt_table.clear().destroy();

  // Create Table
  for (let i = 0; i < data.length; i++) {
    let row =data[i];

    // Create Table Row
    let table_row = tbody.append("tr");

    // Append Cells
    table_row.append("td").text(row.year);
    table_row.append("td").text(row.tornado_magnitude);
    table_row.append("td").text(row.start_latitude);
    table_row.append("td").text(row.start_longitude);
    table_row.append("td").text(row.state);
    // table_row.append("td").text(row.latitude);
    // table_row.append("td").text(row.longitude);
    // table_row.append("td").text(row.description);
  }

  // Make Table Interactive (again)
  dt_table = new DataTable('#tornado_table', {
    order: [[0, 'desc']] // Sort by column 5 desc
  });
}


function makeBarChart1(data) {

  // Create Trace
  let trace = {
    x: data.map(row => row.month),
    y: data.map(row => row.tornado_count),
    type: 'bar',
    marker: {
      color: 'firebrick'
    } 
  }

  // Data trace array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: {
      text: `Months of Peak Tornado Occurrence`
    },
    xaxis: {
      title: {
        text: 'Months'
      }
    },
    yaxis: {
      title: {
        text: 'Tornado Count'
      }
    },
    height: 600
  }

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot('plot1', traces, layout);
}

function makeBarChart2(data) {

    // Create Trace
    let trace = {
      x: data.map(row => row.year),
      y: data.map(row => row.Total_Fatalities),
      type: 'bar',
      marker: {
        color: 'blue'
      } 
    }
  
    // Data trace array
    let traces = [trace];
  
    // Apply a title to the layout
    let layout = {
      title: {
        text: `Tornado Fatalities by Year`
      },
      xaxis: {
        title: {
          text: 'Year'
        }
      },
      yaxis: {
        title: {
          text: 'Deaths'
        }
      },
      height: 600
    }
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot('plot2', traces, layout);
  }

  function makeBarChart3(data) {

    // Create Trace
    let trace = {
      x: data.map(row => row.state),
      y: data.map(row => row.tornado_count),
      type: 'bar',
      marker: {
        color: 'green'
      } 
    }
  
    // Data trace array
    let traces = [trace];
  
    // Apply a title to the layout
    let layout = {
      title: {
        text: `Top 20 States with the Most Tornadoes`
      },
      xaxis: {
        title: {
          text: 'State'
        }
      },
      yaxis: {
        title: {
          text: 'Tornado Count'
        }
      },
      height: 600
    }
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot('plot3', traces, layout);
  }

  function makePieChart(data) {
    // Create Trace for Pie Chart
    let trace = {
        labels: data.map(row => row.tornado_count),  
        values: data.map(row => row.month),    
        type: 'pie'
    };

    let layout = {
        title: 'Tornado Distribution by Month in Texas (2021)',
        height: 600
    };

    // Render the plot to the div tag with id "pie-chart"
    Plotly.newPlot('pie-chart', [trace], layout);
}
  

