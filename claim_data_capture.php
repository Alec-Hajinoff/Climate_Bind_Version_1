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
    $conn = new PDO("mysql:host=127.0.0.1;dbname=climate_bind", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$id = $_SESSION['id'] ?? null;
$damage_loss_cause = $_POST['damage_loss_cause'] ?? null;
$incident_time_date = $_POST['incident_time_date'] ?? null;
$local_authority_report = $_FILES['local_authority_report'] ?? null;
$damaged_items_list = $_POST['damaged_items_list'] ?? null;
$damaged_items_receipts = $_FILES['damaged_items_receipts'] ?? null;
$photographs = $_FILES['photographs'] ?? null;
$contractor_repair_estimates = $_FILES['contractor_repair_estimates'] ?? null;
$claim_amount = $_POST['claim_amount'] ?? null;
$bank_account_number_claim = $_POST['bank_account_number_claim'] ?? null;

if (!$id || !$damage_loss_cause || !$incident_time_date || !$local_authority_report || !$damaged_items_list || !$damaged_items_receipts || !$photographs || !$contractor_repair_estimates || !$claim_amount || !$bank_account_number_claim) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$_SESSION['claim_amount'] = $claim_amount;

$claim_submission_date = date('Y-m-d');

try {
    $conn->beginTransaction();

    $sql2 = "INSERT INTO claims (damage_loss_cause, incident_time_date, damaged_items_list, contractor_repair_estimates, claim_amount, bank_account_number_claim, claim_submission_date) VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt2 = $conn->prepare($sql2);
    if ($stmt2) {
        $contractor_repair_data = file_get_contents($contractor_repair_estimates['tmp_name']);

        $stmt2->bindParam(1, $damage_loss_cause);
        $stmt2->bindParam(2, $incident_time_date);
        $stmt2->bindParam(3, $damaged_items_list);
        $stmt2->bindParam(4, $contractor_repair_data, PDO::PARAM_LOB);
        $stmt2->bindParam(5, $claim_amount);
        $stmt2->bindParam(6, $bank_account_number_claim);
        $stmt2->bindParam(7, $claim_submission_date);
        $stmt2->execute();

        $last_claim_id = $conn->lastInsertId();

        $sql_update = "UPDATE users SET claims_id = ? WHERE id = ?";
        $stmt_update = $conn->prepare($sql_update);
        if ($stmt_update) {
            $stmt_update->bindParam(1, $last_claim_id);
            $stmt_update->bindParam(2, $id);
            $stmt_update->execute();
        } else {
            throw new Exception('Database error preparing statement');
        }

        $sql_update_all = "UPDATE users SET claims_payor_id = ? WHERE claims_payor_id IS NULL";
        $stmt_update_all = $conn->prepare($sql_update_all);
        if ($stmt_update_all) {
            $stmt_update_all->bindParam(1, $last_claim_id);
            $stmt_update_all->execute();
        } else {
            throw new Exception('Database error preparing statement');
        }
    } else {
        throw new Exception('Database error preparing statement');
    }

    $sql3 = "INSERT INTO claim_documents (local_authority_report, damaged_items_receipts, photographs) VALUES (?, ?, ?)";
    $stmt3 = $conn->prepare($sql3);
    if ($stmt3) {
        $local_authority_data = file_get_contents($local_authority_report['tmp_name']);
        $damaged_items_data = file_get_contents($damaged_items_receipts['tmp_name']);
        $photographs_data = file_get_contents($photographs['tmp_name']);

        $stmt3->bindParam(1, $local_authority_data, PDO::PARAM_LOB);
        $stmt3->bindParam(2, $damaged_items_data, PDO::PARAM_LOB);
        $stmt3->bindParam(3, $photographs_data, PDO::PARAM_LOB);
        $stmt3->execute();

        $last_claim_doc_id = $conn->lastInsertId();

        $sql_update_claim_doc = "UPDATE users SET claim_doc_id = ? WHERE id = ?";
        $stmt_update_claim_doc = $conn->prepare($sql_update_claim_doc);
        if ($stmt_update_claim_doc) {
            $stmt_update_claim_doc->bindParam(1, $last_claim_doc_id);
            $stmt_update_claim_doc->bindParam(2, $id);
            $stmt_update_claim_doc->execute();
        } else {
            throw new Exception('Database error preparing statement');
        }
    } else {
        throw new Exception('Database error preparing statement');
    }

    $conn->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    $conn = null;
}
?>