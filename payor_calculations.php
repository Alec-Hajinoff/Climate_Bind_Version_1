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

    $response = [];
    $user_id = $_SESSION['id'] ?? null;

    if ($user_id) {
        $stmt = $pdo->prepare('SELECT claims_payor_id, claims_payor_amount FROM users WHERE id = ?');
        $stmt->execute([$user_id]);
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($userData && isset($userData['claims_payor_id'])) {
            $claims_payor_id = $userData['claims_payor_id'];
            $claims_payor_amount = $userData['claims_payor_amount'] ?? 0;

            $stmt = $pdo->prepare('SELECT address, first_name, last_name, email, phone, claim_doc_id, property_id FROM users WHERE claims_id = ?');
            $stmt->execute([$claims_payor_id]);
            $matchingUser = $stmt->fetch(PDO::FETCH_ASSOC);

            $stmt = $pdo->prepare('SELECT
                incident_time_date,
                claim_submission_date,
                damage_loss_cause,
                damaged_items_list,
                contractor_repair_estimates,
                bank_account_number_claim
                FROM claims
                WHERE id = ?');
            $stmt->execute([$claims_payor_id]);
            $claimData = $stmt->fetch(PDO::FETCH_ASSOC);

            $claimDocuments = null;
            if ($matchingUser && isset($matchingUser['claim_doc_id'])) {
                $claim_doc_id = $matchingUser['claim_doc_id'];
                $stmt = $pdo->prepare('SELECT local_authority_report, photographs, damaged_items_receipts FROM claim_documents WHERE id = ?');
                $stmt->execute([$claim_doc_id]);
                $claimDocuments = $stmt->fetch(PDO::FETCH_ASSOC);
            }

            $propertyData = null;
            if ($matchingUser && isset($matchingUser['property_id'])) {
                $property_id = $matchingUser['property_id'];
                $stmt = $pdo->prepare('SELECT
                    images,
                    ownership_proof,
                    date_of_construction,
                    square_footage,
                    type_home,
                    building_materials,
                    number_levels,
                    roof_type,
                    heating_systems,
                    safety_features,
                    home_renovations,
                    mortgage_lender,
                    current_previous_insurance,
                    list_previous_disasters
                    FROM properties
                    WHERE id = ?');
                $stmt->execute([$property_id]);
                $propertyData = $stmt->fetch(PDO::FETCH_ASSOC);
            }

            if (
                $matchingUser &&
                isset($matchingUser['address']) &&
                isset($matchingUser['first_name']) &&
                isset($matchingUser['last_name']) &&
                isset($matchingUser['email']) &&
                isset($matchingUser['phone']) &&
                $claimData
            ) {
                $response = [
                    'status' => 'success',
                    'message' => 'Matching user and claim information found',
                    'address' => $matchingUser['address'],
                    'full_name' => $matchingUser['first_name'] . ' ' . $matchingUser['last_name'],
                    'email' => $matchingUser['email'],
                    'phone' => $matchingUser['phone'],
                    'claims_payor_amount' => $claims_payor_amount,

                    'claim_data' => [
                        'incident_date' => $claimData['incident_time_date'] ?? 'N/A',
                        'submission_date' => $claimData['claim_submission_date'] ?? 'N/A',
                        'damage_cause' => $claimData['damage_loss_cause'] ?? 'N/A',
                        'damaged_items' => $claimData['damaged_items_list'] ?? 'N/A',
                        'bank_account' => $claimData['bank_account_number_claim'] ?? 'N/A',
                        'contractor_repair_estimates' => base64_encode($claimData['contractor_repair_estimates']),
                    ],

                    'claim_documents' => $claimDocuments ? [
                        'local_authority_report' => base64_encode($claimDocuments['local_authority_report']),
                        'photographs' => base64_encode($claimDocuments['photographs']),
                        'damaged_items_receipts' => base64_encode($claimDocuments['damaged_items_receipts'])
                    ] : null,

                    'property_data' => $propertyData ? [
                        'images' => base64_encode($propertyData['images']),
                        'ownership_proof' => base64_encode($propertyData['ownership_proof']),
                        'date_of_construction' => $propertyData['date_of_construction'] ?? 'N/A',
                        'square_footage' => $propertyData['square_footage'] ?? 'N/A',
                        'type_home' => $propertyData['type_home'] ?? 'N/A',
                        'building_materials' => $propertyData['building_materials'] ?? 'N/A',
                        'number_levels' => $propertyData['number_levels'] ?? 'N/A',
                        'roof_type' => $propertyData['roof_type'] ?? 'N/A',
                        'heating_systems' => $propertyData['heating_systems'] ?? 'N/A',
                        'safety_features' => $propertyData['safety_features'] ?? 'N/A',
                        'home_renovations' => $propertyData['home_renovations'] ?? 'N/A',
                        'mortgage_lender' => $propertyData['mortgage_lender'] ?? 'N/A',
                        'current_previous_insurance' => $propertyData['current_previous_insurance'] ?? 'N/A',
                        'list_previous_disasters' => $propertyData['list_previous_disasters'] ?? 'N/A'
                    ] : null
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => 'User or claim information is incomplete or missing'
                ];
            }
        } else {
            $response = [
                'status' => 'error',
                'message' => 'No claims_payor_id found for the current user'
            ];
        }
    } else {
        $response = [
            'status' => 'error',
            'message' => 'User not logged in or session expired'
        ];
    }

    $pdo->commit();

    header('Content-Type: application/json');
    echo json_encode($response);
} catch (PDOException $e) {

    if (isset($pdo)) {
        $pdo->rollBack();
    }
    $errorResponse = [
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ];
    header('Content-Type: application/json');
    echo json_encode($errorResponse);
} finally {

    $pdo = null;
}
?>