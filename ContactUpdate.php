<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = getRequestInfo();
$contactId = $inData["contactId"];
$newName = $inData["newName"];
$newEmail = $inData["newEmail"];
$newPhone = $inData["newPhone"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET Name=?, Email=?, Phone=? WHERE ID=?");
    $stmt->bind_param("sssi", $newName, $newEmail, $newPhone, $contactId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithError(""); // Contact updated successfully
    } else {
        returnWithError("No matching contact found or unauthorized access.");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    if ($err === "") {
        $retValue = '{"result":"Contact updated successfully"}';
    } else {
        $retValue = '{"error":"' . $err . '"}';
    }
    sendResultInfoAsJson($retValue);
}
?>
