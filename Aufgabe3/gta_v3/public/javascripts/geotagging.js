/* Dieses Skript wird ausgeführt, wenn der Browser index.html lädt. */

// Befehle werden sequenziell abgearbeitet ...

/**
 * "console.log" schreibt auf die Konsole des Browsers
 * Das Konsolenfenster muss im Browser explizit geöffnet werden.
 */
console.log("The script is going to start...");

// Es folgen einige Deklarationen, die aber noch nicht ausgeführt werden ...

/**
 * GeoTagApp Locator Modul
 */
var gtaLocator = (function GtaLocator() {

    // Private Member

    /**
     * Funktion spricht Geolocation API an.
     * Bei Erfolg Callback 'onsuccess' mit Position.
     * Bei Fehler Callback 'onerror' mit Meldung.
     * Callback Funktionen als Parameter übergeben.
     */
    var tryLocate = function (onsuccess, onerror) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onsuccess, function (error) {
                var msg;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        msg = "An unknown error occurred.";
                        break;
                }
                onerror(msg);
            });
        } else {
            onerror("Geolocation is not supported by this browser.");
        }
    };

    // Auslesen Breitengrad aus der Position
    var getLatitude = function (position) {
        return position.coords.latitude;
    };

    // Auslesen Längengrad aus Position
    var getLongitude = function (position) {
        return position.coords.longitude;
    };

    // Hier Google Maps API Key eintragen
    var apiKey = "AIzaSyAr5HMx24WKonjEo00jqLObegGUkKCKRag";

    /**
     * Funktion erzeugt eine URL, die auf die Karte verweist.
     * Falls die Karte geladen werden soll, muss oben ein API Key angegeben
     * sein.
     *
     * lat, lon : aktuelle Koordinaten (hier zentriert die Karte)
     * tags : Array mit Geotag Objekten, das auch leer bleiben kann
     * zoom: Zoomfaktor der Karte
     */
    var getLocationMapSrc = function (lat, lon, tags, zoom) {
        zoom = typeof zoom !== 'undefined' ? zoom : 15;

        if (apiKey === "YOUR API KEY HERE") {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        var tagList = "";
        if (typeof tags !== 'undefined') tags.forEach(function (tag) {
            tagList += "&markers=%7Clabel:" + tag.name
                + "%7C" + tag.latitude + "," + tag.longitude;
        });

        var urlString = "http://maps.googleapis.com/maps/api/staticmap?center="
            + lat + "," + lon + "&markers=%7Clabel:you%7C" + lat + "," + lon
            + tagList + "&zoom=" + zoom + "&size=640x480&sensor=false&key=" + apiKey;

        console.log("Generated Maps Url: " + urlString);
        return urlString;
    };

    return { // Start öffentlicher Teil des Moduls ...

        //Public Member

        readme: "Dieses Objekt entält 'öffentliche' Teile des Moduls.",

        updateLocation: function(){
            tryLocate(function(position){
                // Eintragen der Latitude und Longitude Werte
                document.getElementById("input2").value = getLatitude(position);
                document.getElementById("input3").value = getLongitude(position);
                document.getElementById("dis_latitude").value = getLatitude(position);
                document.getElementById("dis_longitude").value = getLongitude(position);
                // ------ Pruefen der Eintragungen in hidden Feldern (auskommentieren !!!!) --------
                    //document.getElementById("filter-form_latitude").hidden = false; 
                    //document.getElementById("filter-form_longitude").hidden = false;
                // ------ Pruefen ENDE ----------
                // Aktualisieren der Map, indem src Attribut angepasst
                document.getElementById("result-img").src = getLocationMapSrc(getLatitude(position), getLongitude(position));
                // alert("Map Update Successful"); 
            }, 
            function(msg){
                alert(msg);
            });
        },
        aktualisiere: function(){

        }

    }; //... Ende öffentlicher Teil
})();

/**
 * $(document).ready wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */
$(document).ready(function () {
    // alert("Hello World"),
    // TODO Hier den Aufruf für updateLocation einfügen
    gtaLocator.updateLocation();
});