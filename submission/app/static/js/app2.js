// Event Listener for Filter Button
d3.select("#filter-btn").on("click", function () {
    handleDataUpdate();  // Call the helper function to filter and update charts
});

// On Page Load, fetch and display the charts

window.onload = function() {
    handleDataUpdate();  // Initialize data on page load
};

// Helper function to fetch, filter, and update charts

function handleDataUpdate() {
    const yearInput = d3.select("#year").property("value");

    // Fetch data for all charts in parallel
    Promise.all([
        d3.json("/api/v1.0/scatter_data"),
        d3.json("/api/v1.0/time_series"),
        d3.json("/api/v1.0/pie_chart")
    ]).then(([scatterData, timeSeriesData, pieChartData]) => {

        // Update all charts
        updateScatterChart(scatterData);
        updateTimeSeriesChart(timeSeriesData, yearInput);
        updateTimeSeriesHistogram(timeSeriesData, yearInput);
        updatePieChart(pieChartData);
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
}

// Scatter Chart Update Function
function updateScatterChart(scatterData) {
    const tornadoMagnitudes = scatterData.map(row => row.tornado_magnitude);
    const avgTornadoLengths = scatterData.map(row => row["Average Tornado Length"]);
    const avgTornadoWidths = scatterData.map(row => row["Average Tornado Width"]);

    const trace1 = {
        x: tornadoMagnitudes,
        y: avgTornadoLengths,
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: avgTornadoLengths,
            size: avgTornadoWidths.map(w => w / 8),
            colorscale: 'Viridis',
            //showscale: true,
            opacity: 0.9
        },
        hoverinfo: 'text',
        text: avgTornadoWidths.map(width => `Average Width: ${width}`),
        hovertemplate: '%{text}',
        name: 'Average Tornado Width'
    };

    const regressionData = computeRegression(tornadoMagnitudes, avgTornadoLengths);

    const trace2 = {
        x: tornadoMagnitudes,
        y: regressionData,
        mode: 'lines',
        type: 'scatter',
        line: { color: 'red', width: 1 },
        hoverinfo: 'none',
        name: 'Regression Line'
    };

    const layout = {
        title: {
            text: 'Tornado Magnitude vs Length and Width with Regression Line',
            font: {size: 22, weight: 'bold'}
        },
        width: 800,
        height: 600,
        xaxis: {
            title: 'Tornado Magnitude',
            range: [-1, Math.max(...tornadoMagnitudes) + 1],
            zeroline: true,
            zerolinecolor: 'black',
            zerolinewidth: 2,
            position: -1
        },
        yaxis: {
            title: 'Tornado Length',
            range: [-1, Math.max(...avgTornadoLengths) + 10],
            zeroline: true,
            zerolinecolor: 'black',
            zerolinewidth: 2,
            position: 0
        },
        showlegend: true,
        hovermode: 'closest',
        dragmode: 'zoom',
    };

    Plotly.newPlot('chart', [trace1, trace2], layout);
}

// Regression Calculation Function
function computeRegression(x, y) {
    const n = x.length;
    let xSum = 0, ySum = 0, xySum = 0, x2Sum = 0;

    for (let i = 0; i < n; i++) {
        xSum += x[i];
        ySum += y[i];
        xySum += x[i] * y[i];
        x2Sum += x[i] * x[i];
    }

    const m = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
    const b = (ySum - m * xSum) / n;

    return x.map(xVal => m * xVal + b);
}

// Filter Data by Year Function
function filterDataByYear(data, year) {
    const yearInt = parseInt(year);
    if (isNaN(yearInt)) return [];  // Invalid year, return empty array

    return data.filter(row => {
        const dateStr = row.date.split(' ')[0];  // Extract date part (YYYY-MM-DD)
        const dateObj = new Date(dateStr);
        return dateObj.getFullYear() === yearInt;
    });
}

// Time Series Chart Update Function
function updateTimeSeriesChart(timeSeriesData, year) {
    const filteredData = year ? filterDataByYear(timeSeriesData, year) : timeSeriesData;

    if (!filteredData.length) return;

    const months = Array.from({ length: 12 }, (_, i) => new Date(2025, i));
    const magnitudes = [...new Set(filteredData.map(d => d.tornado_magnitude))];
    
    const traces = magnitudes.map(magnitude => {
        const filteredDataByMagnitude = filteredData.filter(d => d.tornado_magnitude === magnitude);
        const tornadoCountsByMonth = Array(12).fill(0);

        filteredDataByMagnitude.forEach(d => {
            const month = new Date(d.date).getMonth();
            tornadoCountsByMonth[month] += d.tornado_count;
        });

        return {
            type: "scatter",
            mode: "lines+markers",  // This enables both lines and markers (small circles)
            name: `Magnitude ${magnitude}`,
            x: months,
            y: tornadoCountsByMonth,
            line: { width: 2 },
            marker: {
                size: 10,  // Size of the markers (small circles)
                opacity: 1.0,  // Make the markers slightly transparent
                symbol: 'circle'  // Use circular markers
            }
        };
    });

    const layout = {
        title: {
            text:  `Tornado Counts by Magnitude (Monthly) for filtered years`,
            font: {size: 22, weight: 'bold' } 
        }, 

        xaxis: {
            title: 'Month',
            showgrid: true,
            tickvals: months,
            ticktext: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yaxis: { 
            title: 'Number of Tornadoes',
            showgrid: true,
            linewidth : 1,
            showline: true
        },
        hovermode: 'closest',
        width: 750,
        height: 600,
    };

    Plotly.newPlot('time-series', traces, layout);
}

// Time Series Histogram Update Function
function updateTimeSeriesHistogram(timeSeriesData, yearInputNumber) {
    const filteredData = yearInputNumber ? filterDataByYear(timeSeriesData, yearInputNumber) : timeSeriesData;

    if (!filteredData.length) return;

    const monthlyCounts = Array(12).fill(0);
    filteredData.forEach(d => {
        const month = new Date(d.date).getMonth();
        monthlyCounts[month] += 1;
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const trace = {
        type: "bar",
        name: `Tornado Counts - ${yearInputNumber}`,
        x: months,
        y: monthlyCounts,
        opacity: 0.7,
        marker: { color: 'rgba(248, 6, 6, 0.79)' }
    };

    const layout = {
        title: {
            text: `Tornado Counts by Month for filtered years`,
            font: {size: 22, weight: 'bold' }  
        },
        xaxis: { 
            title: 'Month',
        },
        yaxis: { 
            title: {
                text: 'Tornado Count Frequency',
            },
            showline: true
        },
        hovermode: 'closest',
        width: 800,
        height: 600,
    };

    Plotly.newPlot('histogram', [trace], layout);
}

// Pie Chart Update Function
function updatePieChart(pieChartData) {
    const magnitudes = pieChartData.map(item => item.tornado_magnitude);
    const avgFatalities = pieChartData.map(item => parseFloat(item["Average Fatalities"].toFixed(2)));

    const trace = {
        labels: magnitudes,
        values: avgFatalities,
        type: 'pie',
        hole: 0.4,
        textinfo: 'percent',
        hoverinfo: 'label+value',
        marker: {
            colorscale: 'RdYlBu',
            color: avgFatalities,
            showscale: true
        }
    };

    const layout = {
        title: {
            text: 'Average Fatalities by Tornado Magnitude',
            font: {size: 22, weight: 'bold'}
        },
        showlegend: true,
        width: 600,
        height: 600,
    };

    Plotly.newPlot('pie-chart', [trace], layout);
}