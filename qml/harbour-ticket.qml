import QtQuick 2.4
import Sailfish.Silica 1.0

import "pages"

ApplicationWindow
{
    id: app
    property string currentSearch: ""
    property variant airportsInfo: ({})

    property bool newSearchAllowed: false

    signal newSearch


    initialPage: Component { StartPage { } }
    cover: Qt.resolvedUrl("cover/CoverPage.qml")
    allowedOrientations: Orientation.Portrait
    _defaultPageOrientations: Orientation.Portrait
}

