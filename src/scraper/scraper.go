package scraper

import (
    "regexp"
)

var addressFinder *regexp.Regexp

func Init() {
    addressFinder, _ = regexp.Compile("<body.*tip=(.*)>")
}

func FindAddress(html []byte) []byte {
    addresses := addressFinder.FindSubmatch(html)
    if len(addresses) < 2 {
        return nil
    }
    return addresses[1]
}
