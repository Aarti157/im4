<?php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $stmt = $pdo->prepare("
        SELECT 
            g.id,
            g.name,
            g.description,
            g.date,
            o.name AS organisation,
            COUNT(gdz.id) AS total_bewertungen,
            SUM(CASE WHEN gdz.bewertung = 2 THEN 1 ELSE 0 END) AS good,
            SUM(CASE WHEN gdz.bewertung = 1 THEN 1 ELSE 0 END) AS neutral,
            SUM(CASE WHEN gdz.bewertung = 0 THEN 1 ELSE 0 END) AS bad
        FROM gerichte g
        LEFT JOIN organisation o ON g.orga_id = o.id
        LEFT JOIN gericht_device_zeit gdz ON DATE(gdz.timestamp) = g.date
        GROUP BY g.id, g.name, g.description, g.date, o.name
        ORDER BY g.date DESC
    ");
    $stmt->execute();
    $gerichte = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $gerichte]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}