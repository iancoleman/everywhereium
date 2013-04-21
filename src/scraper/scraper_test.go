package scraper

import (
    "testing"
)

func Test_FindAddress(t *testing.T) {
    Init()
    for _, content  := range(empties) {
        result := FindAddress([]byte(content))
        if result != nil {
            t.Error("Expected nil, got " + string(result))
        }
    }
    for expected, content := range(goodies) {
        bresult := FindAddress([]byte(content))
        result := string(bresult)
        if result != expected {
            t.Error("Expected " + expected + ", got " + string(result))
        }
    }
}

var address1 = `1AAAA7v7622hc4WmjMM3yefYxrCQsXobBN`
var address2 = `1BBBBv4ekpJX3ohYWGEzMqzvf27VjBux35`
var address3 = `1CCCCv4ekpJX3ohYWGEzMqzvf27VjBux35`

var tipVal1 = `{"for":"me","destinations":[{"type":"bitcoin","address":"` + address1 + `"}]}`
var tipVal2 = `{"for":"me","destinations":[{"type":"bitcoin","address":"` + address2 + `"}]}`

var empties = []string{
`<body tip='{}'>`,
`<body><body tip='` + tipVal1 + `'>`,
`<body><div class='forum-post'><body tip='` + tipVal1 + `'></body>`,
`<body garbage='something'><div class='forum-post'><body tip='` + tipVal1 + `'></body>`,
`< body  garbage = ' something '  ><div class='forum-post'><body tip='` + tipVal1 + `'></body>`,
`lalalala`}

var goodies = map[string]string{
    address1: `<body tip='` + tipVal1 + `'></body>`,
    address2: `<body tip='` + tipVal2 + `'><div class='forum-post'><body tip='` + tipVal1 + `'></body>`,
    address3: `<    body     tip    =    '    ` + tipVal3 + `    '    ></body>`,
}
