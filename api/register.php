<?php
// register.php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $name    = trim($_POST['name'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $rollen_id = $_POST['rollen_id'] ?? null;
    $orga_id   = $_POST['orga_id'] ?? null;

    if (!$email || !$password || !$name) {
        echo json_encode(["status" => "error", "message" => "Name, email and password are required"]);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "Email is already in use"]);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert the new user
    $insert = $pdo->prepare("INSERT INTO users (email, name, password, rollen_id, orga_id) VALUES (:email, :name, :pass, :rollen_id, :orga_id)");
    $insert->execute([
        ':email' => $email,
        ':name' => $name,
        ':pass'  => $hashedPassword,
        ':rollen_id' => $rollen_id,
        ':orga_id'   => $orga_id
    ]);

    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
