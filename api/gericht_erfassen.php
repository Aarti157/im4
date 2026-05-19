<?php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name         = trim($_POST['name'] ?? '');
    $description  = trim($_POST['description'] ?? '');
    $vegan        = isset($_POST['vegan']) ? 1 : 0;
    $vegetarisch  = isset($_POST['vegetarisch']) ? 1 : 0;
    $pescetarisch = isset($_POST['pescetarisch']) ? 1 : 0;
    $glutenfrei   = isset($_POST['glutenfrei']) ? 1 : 0;
    $laktosefrei  = isset($_POST['laktosefrei']) ? 1 : 0;
    $zuckerfrei   = isset($_POST['zuckerfrei']) ? 1 : 0;
    $sojafrei     = isset($_POST['sojafrei']) ? 1 : 0;
    $user_id      = $_SESSION['user_id'];
    $orga_id      = $_SESSION['orga_id'];
    $datum        = trim($_POST['datum'] ?? '');

    if (empty($name) || empty($datum)) {
    echo json_encode(["status" => "error", "message" => "Name und Datum sind Pflichtfelder"]);
    exit;
}

    $stmt = $pdo->prepare("
        INSERT INTO gerichte (name, description, orga_id, user_id, vegan, vegetarisch, pescetarisch, glutenfrei, laktosefrei, zuckerfrei, sojafrei, date)
        VALUES (:name, :description, :orga_id, :user_id, :vegan, :vegetarisch, :pescetarisch, :glutenfrei, :laktosefrei, :zuckerfrei, :sojafrei, :datum)
    ");
    $stmt->execute([
        ':name'         => $name,
        ':description'  => $description,
        ':orga_id'      => $orga_id,
        ':user_id'      => $user_id,
        ':vegan'        => $vegan,
        ':vegetarisch'  => $vegetarisch,
        ':pescetarisch' => $pescetarisch,
        ':glutenfrei'   => $glutenfrei,
        ':laktosefrei'  => $laktosefrei,
        ':zuckerfrei'   => $zuckerfrei,
        ':sojafrei'     => $sojafrei,
        ':datum'        => $datum
    ]);

    $newId = $pdo->lastInsertId();
    echo json_encode(["status" => "success", "gericht_id" => $newId]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}