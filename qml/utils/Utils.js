var token = "acdea79c1af35e38e0e4855acd0b467d"
var marker = "81618"
var host = "harbour-ticket"

var getMyIpUrl = "http://myip.dnsomatic.com/"

var _tmp = {}
var arr = []

var airportsInfo = {}

function performRequest(requestType, url, callback, params) {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200) {
//                console.log("Data", request.responseText)
                callback(request.responseText)
            } else {
                console.log("Error status", request.status, request.statusText)
                console.log("Error", request.getAllResponseHeaders())
                console.log("Error", request.responseText)
                callback("error")
            }
        }
    }
    request.open(requestType, url)
    if(requestType === "GET") {
        request.setRequestHeader('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/21.0')
//        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        request.setRequestHeader('Content-type', 'application/json')
//        Accept-Encoding: gzip, deflate, bzip2, compress
        request.setRequestHeader('Accept-Encoding', 'gzip, deflate, bzip2, compress, sdch')

    } else {
        request.setRequestHeader('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/21.0')
        request.setRequestHeader('Content-type', 'application/json')
    }
    console.log("send url", url)
    if (params) {
        var str = JSON.stringify(params)
        console.log("params", str)
        request.send(str)
    } else {
        request.send()
    }
}

function loadLocalFile(location, callback) {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            callback(request.responseText)
        }
    }
    request.open("GET", location)
    console.log("get file", location)
    request.send()
}

function fromUnixToLocalDateTime(unixFormat) {
    var date = new Date(unixFormat * 1000)
    return date.toLocaleString("en-US")
}

function fromUnixToShortFormat(unixFormat, locale) {
    var date  = new Date(unixFormat * 1000)
    var dateStr = date.toLocaleDateString(locale)
    var minutes = date.getMinutes()
    if (minutes < 10) {
        minutes = "0" + minutes
    }

    var timeStr = date.getHours() + ":" + minutes
    return dateStr + ", " + timeStr
}

function fromUnixToTimeDateFormat(unixFormat, locale) {
    var date  = new Date(unixFormat * 1000)
    var dateStr = date.toLocaleDateString(locale)
    var minutes = date.getMinutes()
    if (minutes < 10) {
        minutes = "0" + minutes
    }

    var timeStr = date.getHours() + ":" + minutes
    return timeStr + "\n" + dateStr
}

function getTime(date) {
    var result = date.getHours() + ":" + date.getMinutes() + " " + date.getTimezoneOffset()
    return result
}

function getFullDate(date) {
    var result = date.getFullYear() + "-"
    if (date.getMonth() < 9) {
        result += "0" + (date.getMonth() + 1) + "-"
    } else {
        result += (date.getMonth() + 1) + "-"
    }
    if (date.getDate() < 10) {
        result += "0" + date.getDate()
    } else {
        result += date.getDate()
    }
    return result
}

function getShortDate(date) {
    var result = date.getFullYear() + "-"
    if (date.getMonth() < 9) {
        result += "0" + (date.getMonth() + 1)
    } else {
        result += (date.getMonth() + 1)
    }
    return result
}

function fromMinToHours(value) {
    var hours = Math.floor( value / 60);
    var minutes = value % 60;

    return hours + qsTr(" h ") + minutes + qsTr(" m")
}

function sortDict(dict) {
    var sorted = []
    for(var key in dict) {
        sorted[sorted.length] = key
    }
    sorted.sort()
    var res = []
    for (var i in sorted) {
        if(typeof dict[sorted[i]] === "object") {
            var tmp = dict[sorted[i]]
            var tmpArr = sortDict(tmp)
            for (var j in tmpArr) {
                res[res.length] = tmpArr[j]
            }
        } else {
            res[res.length] = dict[sorted[i]]
        }
    }

    return res
}

function createMD5(data) {
    var result = sortDict(data)
    result.splice(0, 0, token)
    var str = result.join(":")
    console.log(str)
    var md5sum = Qt.md5(str)
    return md5sum
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
}

function bagageToString(value) {
    switch(typeof(value)) {
    case "boolean":
        return qsTr("luggage is not included in price")
    case "string":
        if("" === value) {
            return qsTr("No information about luggage")
        } else if("0PC" === value) {
            return qsTr("no luggage")
        } else if(value.indexOf("PC") !== -1) {
            var arr = value.split("PC")
            if(arr[1]) {
                return arr[0] + qsTr(" luggage(s)\n of ") + arr[1] + qsTr(" kg")
            }
            return arr[0] + qsTr(" luggage")
        }
        break
    case "number":
        return qsTr("luggage of ") + value + qsTr(" kg")
    default:
        return ""
    }
}
