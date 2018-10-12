import QtQuick 2.2
import Sailfish.Silica 1.0

import "../utils/Utils.js" as Utils

ListItem {
    id: ticketInfoItem
    property string search_id
    property string orig: ""
    property string airlineIata
    property string date_from: ""
    property string date_to: ""
    property string ticket_price: ""
    property string fly_duration: ""
    property int transfers_count: 0

    property variant proposal: ({})

//    property bool   direct: false

    property variant ticketInfo: ({})
    property variant currencyRatesInfo: ({})

    height: Theme.itemSizeSmall + orig_dest.height + datesColumn.height
    contentHeight:  Theme.itemSizeSmall + orig_dest.height + datesColumn.height
    width: parent.width

    function fromMinToHours(value) {
        var hours = Math.floor( value / 60);
        var minutes = value % 60;

        return hours + qsTr(" h ") + minutes + qsTr(" m")
    }

    QtObject {
        id: internal

        property string flyNumber: ""
        property string arrival_date: ""
        property string departure_date: ""

    }

    Component.onCompleted: {
        var flyNumbers = []
        var segment = proposal.segment[0]
        for (var id in segment.flight) {
            var t = segment.flight[id].operating_carrier + segment.flight[id].number
            flyNumbers.push(t)
        }
        internal.flyNumber = flyNumbers.filter(Utils.onlyUnique).join(" - ")
        internal.departure_date = Utils.fromUnixToLocalDateTime(segment.flight[0].local_departure_timestamp)
        internal.arrival_date = Utils.fromUnixToLocalDateTime(segment.flight[0].local_arrival_timestamp)
    }

    Label {
        id: orig_dest
        anchors.top: parent.top
        anchors.horizontalCenter: parent.horizontalCenter
        font.bold: true
        text: orig
        horizontalAlignment: Text.AlignHCenter
    }

    Image {
        id: logo
        anchors.left: parent.left
        anchors.leftMargin: Theme.paddingMedium
        anchors.top: orig_dest.bottom
//        height: Theme.iconSizeLarge
        width: Theme.iconSizeExtraLarge
        source: airlineIata?"http://pics.avs.io/264/87/"+ airlineIata +".png":""
        //source: iata?"http://ios.aviasales.ru/logos/xxhdpi/"+ iata +".png":""
        fillMode: Image.PreserveAspectFit
    }

    Text {
        anchors.left: logo.right
        anchors.leftMargin: Theme.horizontalPageMargin
        anchors.bottom: logo.bottom
        color: Theme.secondaryColor

        text: internal.flyNumber
    }

    Column {
        id: datesColumn
        width: parent.width - ticketPrice.width
        anchors.top: logo.bottom
        anchors.topMargin: Theme.paddingSmall
        spacing: Theme.paddingSmall
        DetailItem {
            leftMargin: Theme.paddingSmall
            label: qsTr("Departure date/time:")
            value: internal.departure_date//Utils.fromUnixToLocalDateTime(date_from)
        }
        DetailItem {
            visible: date_to?true:false
            leftMargin: Theme.paddingSmall
            label: qsTr("Arrival date/time:")
            value: internal.arrival_date//Utils.fromUnixToLocalDateTime(date_to)
        }
        DetailItem {
            leftMargin: Theme.paddingSmall
            label: qsTr("Travel duration:")
            value: fromMinToHours(fly_duration)
        }
        DetailItem {
            leftMargin: Theme.paddingSmall
            label: qsTr("Transfers:")
            value: transfers_count > 0?transfers_count:qsTr("Direct")
        }
    }

    Label {
        id: ticketPrice
        anchors.verticalCenter: datesColumn.verticalCenter
        anchors.right: parent.right
        anchors.rightMargin: Theme.paddingMedium
        font.bold: true
        color: Theme.highlightColor
        text: ticket_price
        font.pixelSize: Theme.fontSizeLarge
        horizontalAlignment: Text.AlignHCenter
    }
    Separator {
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
    }

    onClicked: {
        pageStack.push(Qt.resolvedUrl("../pages/TicketPage.qml"), {"ticket": ticketInfo, "_search_id": search_id, "currencyRates": currencyRatesInfo, "_currency": _currency})
    }
}
