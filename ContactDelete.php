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

print($contactId);
print("hi");

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID=?");
    $stmt->bind_param("i", $contactId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->close();
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
        $stmt->bind_param("i", $contactId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithError(""); // Contact deleted successfully
        } else {
            returnWithError("No matching contact found or unauthorized access. (Affected Rows: " . $stmt->affected_rows . ")");
        }
    } else {
        returnWithError("No matching contact found or unauthorized access. (Contact ID: " . $contactId . ")");
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
        $retValue = '{"result":"Contact deleted successfully"}';
    } else {
        $retValue = '{"error":"' . $err . '"}';
    }
    sendResultInfoAsJson($retValue);
}
