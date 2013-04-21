package scraper

import (
    "regexp"
)

var bodyFinder, tipFinder, addressFinder *regexp.Regexp

func Init() {
    bodyFinder, _ = regexp.Compile(`<\s*body([^>]*)>`)
    tipFinder, _ = regexp.Compile(`tip=(.*)`)
    addressFinder, _ = regexp.Compile(`{.*bitcoin"\s*:\s*"([a-zA-Z0-9]+)"`)
}

func FindAddress(html []byte) []byte {
    bodyTags := bodyFinder.FindSubmatch(html)
    if len(bodyTags) < 2 {
        return nil
    }
    body := bodyTags[1]
    tipProperties := tipFinder.FindSubmatch(body)
    if len(tipProperties) < 2 {
        return nil
    }
    tip := tipProperties[1]
    addresses := addressFinder.FindSubmatch(tip)
    if len(addresses) < 2 {
        return nil
    }
    return addresses[1]
}
