<?php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// Montag und Sonntag der aktuellen Woche berechnen
$montag  = date('Y-m-d', strtotime('monday this week'));
$freitag = date('Y-m-d', strtotime('friday this week'));

$stmt = $pdo->prepare("
    SELECT date, name, description
    FROM gerichte
    WHERE orga_id = :orga_id
    AND date BETWEEN :montag AND :freitag
    ORDER BY date ASC
");
$stmt->execute([
    ':orga_id' => $_SESSION['orga_id'],
    ':montag'  => $montag,
    ':freitag' => $freitag
]);
$gerichte = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["status" => "success", "data" => $gerichte, "montag" => $montag, "freitag" => $freitag]);