<?php
/*******
 * load.php angepasst an eure neue Tabellenstruktur
 ******/

 //Web-App Gruppe muss noch gericht_id ergänzen -> @aarti & @kae

require_once("../system/config.php");

// 1. JSON-Daten empfangen
$inputJSON = file_get_contents('php://input'); 
$input = json_decode($inputJSON, true); 

if ($input) {
    // 2. Daten aus dem JSON holen
    // Wir nutzen die Namen, die wir gleich im Arduino-Code festlegen
    $deviceId  = $input["device_id"]; 
    $bewertung = $input["status"]; // Im Arduino-Code heißt es "status"

    // 3. In die Datenbank schreiben
    // Wir füllen 'device_id' und 'Bewertung'. 'id' und 'zeit' macht die DB von selbst.
    $sql = "INSERT INTO gericht_device_zeit (device_id, bewertung) VALUES (?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$deviceId, $bewertung]);

    echo "Daten gespeichert: Device $deviceId hat Bewertung $bewertung erhalten.";
} else {
    echo "Fehler: Keine Daten empfangen.";
}
?>