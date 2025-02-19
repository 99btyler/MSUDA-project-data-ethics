function init() {

    makeTable()

}

function makeTable() {

    d3.json("/api/v1.0/table").then(data => {

        $("#tornado-table").DataTable({
            destroy: true,
            data: data,
            columns: [
                { data: "year" },
                { data: "state" },
                { data: "num_of_fatalities" },
                { data: "num_of_injuries" },
                { data: "num_of_tornadoes" }
            ]
        })

    })

}

init()