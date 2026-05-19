<?php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// Name und Organisation aus DB holen
$stmt = $pdo->prepare("
    SELECT u.name, o.name AS organisation
    FROM users u
    LEFT JOIN organisation o ON u.orga_id = o.id
    WHERE u.id = :id
");
$stmt->execute([':id' => $_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "status"       => "success",
    "user_id"      => $_SESSION['user_id'],
    "email"        => $_SESSION['email'],
    "name"         => $user['name'],
    "organisation" => $user['organisation']
]);