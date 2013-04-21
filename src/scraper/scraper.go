package scraper

import (
    "regexp"
)

var bodyFinder, tipFinder, addressFinder *regexp.Regexp

func Init() {
    bodyFinder, _ = regexp.Compile(`<\s*body([^>]*)>`)
    tipFinder, _ = regexp.Compile(`tip\s*=\s*(.*)`)
    addressFinder, _ = regexp.Compile(`(1[abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789]{26,33})`)
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
