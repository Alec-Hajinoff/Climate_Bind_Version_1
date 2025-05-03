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

$servername = "127.0.0.1";
$username = "root";
$passwordServer = "";
$dbname = "climate_bind";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$id = $_SESSION['id'] ?? null;
$last_name = $_POST['last_name'] ?? null;
$date_of_birth = $_POST['date_of_birth'] ?? null;
$passport_copy = $_FILES['passport_copy'] ?? null;
$phone = $_POST['phone'] ?? null;
$national_insurance = $_POST['national_insurance'] ?? null;
$address = $_POST['address'] ?? null;
$images = $_FILES['images'] ?? null;
$ownership_proof = $_FILES['ownership_proof'] ?? null;
$date_of_construction = $_POST['date_of_construction'] ?? null;
$square_footage = $_POST['square_footage'] ?? null;
$type_home = $_POST['type_home'] ?? null;
$building_materials = $_POST['building_materials'] ?? null;
$number_levels = $_POST['number_levels'] ?? null;
$roof_type = $_POST['roof_type'] ?? null;
$heating_systems = $_POST['heating_systems'] ?? null;
$safety_features = $_POST['safety_features'] ?? null;
$home_renovations = $_POST['home_renovations'] ?? null;
$mortgage_lender = $_POST['mortgage_lender'] ?? null;
$current_previous_insurance = $_POST['current_previous_insurance'] ?? null;
$list_previous_disasters = $_POST['list_previous_disasters'] ?? null;
$monthly_premium = $_POST['monthly_premium'] ?? null;
$bank_account_number = $_POST['bank_account_number'] ?? null;

if (!$id || !$last_name || !$date_of_birth || !$passport_copy || !$phone || !$national_insurance || !$address || !$images || !$ownership_proof || !$date_of_construction || !$square_footage || !$type_home || !$building_materials || !$number_levels || !$roof_type || !$heating_systems || !$safety_features || !$home_renovations || !$mortgage_lender || !$current_previous_insurance || !$list_previous_disasters || !$monthly_premium || !$bank_account_number) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $conn->beginTransaction();

    $sql = "UPDATE users SET last_name = ?, date_of_birth = ?, passport_copy = ?, phone = ?, national_insurance = ?, address = ?, profile_complete = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare users update statement');
    }

    $profile_complete = 1;
    $passport_copy_data = file_get_contents($passport_copy['tmp_name']);
    $stmt->bindParam(1, $last_name);
    $stmt->bindParam(2, $date_of_birth);
    $stmt->bindParam(3, $passport_copy_data, PDO::PARAM_LOB);
    $stmt->bindParam(4, $phone);
    $stmt->bindParam(5, $national_insurance);
    $stmt->bindParam(6, $address);
    $stmt->bindParam(7, $profile_complete);
    $stmt->bindParam(8, $id);
    $stmt->execute();

    $sql1 = "INSERT INTO properties (images, ownership_proof, date_of_construction, square_footage, type_home, building_materials, number_levels, roof_type, heating_systems, safety_features, home_renovations, mortgage_lender, current_previous_insurance, list_previous_disasters) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt1 = $conn->prepare($sql1);
    if (!$stmt1) {
        throw new Exception('Failed to prepare properties insert statement');
    }

    $images_data = file_get_contents($images['tmp_name']);
    $ownership_proof_data = file_get_contents($ownership_proof['tmp_name']);
    $stmt1->bindParam(1, $images_data, PDO::PARAM_LOB);
    $stmt1->bindParam(2, $ownership_proof_data, PDO::PARAM_LOB);
    $stmt1->bindParam(3, $date_of_construction);
    $stmt1->bindParam(4, $square_footage);
    $stmt1->bindParam(5, $type_home);
    $stmt1->bindParam(6, $building_materials);
    $stmt1->bindParam(7, $number_levels);
    $stmt1->bindParam(8, $roof_type);
    $stmt1->bindParam(9, $heating_systems);
    $stmt1->bindParam(10, $safety_features);
    $stmt1->bindParam(11, $home_renovations);
    $stmt1->bindParam(12, $mortgage_lender);
    $stmt1->bindParam(13, $current_previous_insurance);
    $stmt1->bindParam(14, $list_previous_disasters);
    $stmt1->execute();

    $property_id = $conn->lastInsertId();

    $sql2 = "UPDATE users SET property_id = ? WHERE id = ?";
    $stmt2 = $conn->prepare($sql2);
    if (!$stmt2) {
        throw new Exception('Failed to prepare property_id update statement');
    }
    $stmt2->bindParam(1, $property_id);
    $stmt2->bindParam(2, $id);
    $stmt2->execute();

    $sql3 = "INSERT INTO premiums (monthly_premium, bank_account_number) VALUES (?, ?)";
    $stmt3 = $conn->prepare($sql3);
    if (!$stmt3) {
        throw new Exception('Failed to prepare premiums insert statement');
    }
    $stmt3->bindParam(1, $monthly_premium);
    $stmt3->bindParam(2, $bank_account_number);
    $stmt3->execute();

    $premiums_id = $conn->lastInsertId();

    $sql4 = "UPDATE users SET premiums_id = ? WHERE id = ?";
    $stmt4 = $conn->prepare($sql4);
    if (!$stmt4) {
        throw new Exception('Failed to prepare premiums_id update statement');
    }
    $stmt4->bindParam(1, $premiums_id);
    $stmt4->bindParam(2, $id);
    $stmt4->execute();

    $conn->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'message' => 'Transaction failed: ' . $e->getMessage()]);
} finally {
    $conn = null;
}
?>