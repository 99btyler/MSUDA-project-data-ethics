let table = d3.select("#tornado_table");
let tbody = table.select("tbody");

// Make Table Interactive
let dt_table;

// Event Listener
d3.select("#filter-btn").on("click", function () {
    doWork();
});

// On Page Load
doWork();

// Helper Function
function doWork() {
    d3.json("/api/v1.0/table").then(function (data) {
        // Get user input values for filtering
        const yearInput = d3.select("#year").property("value");
        const monthInput = d3.select("#month").property("value");
        const dayInput = d3.select("#day").property("value");
        const stateInput = d3.select("#state").property("value");
        const magnitudeInput = d3.select("#tornado-magnitude").property("value");
        
        // Filter data based on inputs
        let filteredData = data;

        if (yearInput) {
            filteredData = filteredData.filter(row => row.year == yearInput);
        }
        if (monthInput) {
            filteredData = filteredData.filter(row => row.month === monthInput);
        }
        if (dayInput) {
            filteredData = filteredData.filter(row => row.day == dayInput);
        }
        if (stateInput) {
            filteredData = filteredData.filter(row => row.state.toLowerCase().includes(stateInput.toLowerCase()));
        }
        if (magnitudeInput) {
            filteredData = filteredData.filter(row => row.tornado_magnitude === magnitudeInput);
        }

        // Update the table and plots using filtered data
        makeTable(filteredData);  // Call makeTable with filtered data
        updateVisualizations(filteredData);
    });
}

function updateVisualizations(filteredData) {
    Promise.all([
        d3.json("/api/v1.0/bar_data1"),
        d3.json("/api/v1.0/bar_data2"),
        d3.json("/api/v1.0/bar_data3"),
        d3.json("/api/v1.0/pie_chart")
    ]).then(function ([barData1, barData2, barData3, pieData]) {
        // Update each plot
        makeBarChart1(barData1);
        makeBarChart2(barData2);
        makeBarChart3(barData3);
        makePieChart(pieData);
    }).catch(function (error) {
        console.error("Error fetching chart data:", error);
    });
}

function makeTable(data) {
    // Clear Table
    tbody.html("");
    if (dt_table) {
        dt_table.clear().destroy();
    }
    
    // Create Table
    for (let i = 0; i < data.length; i++) {
        let row = data[i];

        // Create Table Row
        let table_row = tbody.append("tr");

        // Append Cells
        table_row.append("td").text(row.year);
        table_row.append("td").text(row.tornado_magnitude);
        table_row.append("td").text(row.start_latitude);
        table_row.append("td").text(row.start_longitude);
        table_row.append("td").text(row.state);
        // Other columns can also be appended here
    }
    
    // Initialize DataTable again with new data
    dt_table = new DataTable('#tornado_table', {
        order: [[0, 'desc']] // Sort by year descending by default
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
          text: 'Tornado Counts'
        }
      },
      height: 600
    }

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot('plot1', traces, layout);
  }

  function makeBarChart2(data) {
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
      y: data.map(row => row.state),
      x: data.map(row => row.tornado_count),
      type: 'bar',
      orientation: 'h',
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
        labels: data.map(row => row['tornado_magnitude']),  
        values: data.map(row => row['Magnitude Count']),    
        type: 'pie',
        hole: 0.3
    };

    let layout = {
        title: 'Tornado Magnitude Distribution in US 1950-2021',
        height: 600
    };

    // Render the plot to the div tag with id "pie-chart"
    Plotly.newPlot('pie-chart', [trace], layout);
}
  

