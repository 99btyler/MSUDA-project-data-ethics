fetch("api/test-content").then(response => response.json()).then(data => {

    // TODO: remove this test content
    test_message = "test-content\n"
    for (key in data[0]) {
        test_message += `${key}: ${data[0][key]}\n`
    }
    alert(test_message)

})