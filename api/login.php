<?php
// login.php
ini_set('session.cookie_httponly', 1);
// ini_set('session.cookie_secure', 1); // if using HTTPS
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Email and password are required"]);
        exit;
    }

    // Check user in DB
    $stmt = $pdo->prepare("SELECT id, password, orga_id, rollen_id FROM users WHERE email = :email");   // ← neu: orga_id und rollen_id mit abfragen
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC); //assoziatives Array, Wertepaar mit Schlüssel id und gehashtes pw

    // Verify password
    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email']   = $email;
        $_SESSION['orga_id'] = $user['orga_id'];    // ← neu
        $_SESSION['rollen_id'] = $user['rollen_id'];  // ← neu

        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
