<?php
require_once 'session_config.php';

$allowed_origins = [
    "http://localhost:3000"
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; 
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=climate_bind', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('SELECT first_name, last_name, email, phone, address FROM users');
    $stmt->execute();
    $userData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare('SELECT monthly_premium FROM premiums');
    $stmt->execute();
    $premiumData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $claim_amount = $_SESSION['claim_amount'] ?? null;

    if (!$claim_amount && isset($_SESSION['id'])) {
        $user_id = $_SESSION['id'];

        $stmt = $pdo->prepare('SELECT claims_id FROM users WHERE id = ?');
        $stmt->execute([$user_id]);
        $user_claims = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user_claims && $user_claims['claims_id']) {
            $stmt = $pdo->prepare('SELECT claim_amount FROM claims WHERE id = ?');
            $stmt->execute([$user_claims['claims_id']]);
            $claim_data = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($claim_data && isset($claim_data['claim_amount'])) {
                $claim_amount = $claim_data['claim_amount'];
                $_SESSION['claim_amount'] = $claim_amount;
            }
        }
    }
    $totalPremiumsCommitted = 0;
    foreach ($premiumData as $data) {
        $totalPremiumsCommitted += $data['monthly_premium'];
    }

    $response = [];
    foreach ($userData as $index => $user) {
        $premium = $premiumData[$index]['monthly_premium'];
        $premiumPercentage = ($premium / $totalPremiumsCommitted) * 100;
        $payout = round(($premiumPercentage * $claim_amount / 100), 2);
        $payout = ($payout < $premium) ? $payout : $premium;
        $userResponse = [
            'name' => $user['first_name'] . ' ' . $user['last_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'address' => $user['address'],
            'payout' => $payout,
        ];
        $stmt = $pdo->prepare('UPDATE users SET claims_payor_amount = ? WHERE email = ?');
        $stmt->execute([$payout, $user['email']]);
        $response[] = $userResponse;
    }

    $pdo->commit();
    echo json_encode($response);
} catch (PDOException $e) {
    if (isset($pdo)) {
        $pdo->rollBack();
    }
    echo 'Connection failed: ' . $e->getMessage();
} finally {
    $pdo = null;
}
?>