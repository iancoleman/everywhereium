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
            t.Error(string(result), expected)
        }
    }
}

var empties = []string{
`<body tip='{}'>`,
`lalalala`}

var goodies = map[string]string{
    `a`: `<body tip='{a}'>`,
    `b`: `<body tip='{b}'>`,
}
