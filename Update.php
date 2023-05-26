<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$inData = getRequestInfo();

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Phone = ?, Email = ? WHERE ID = ? AND UserID = ?");
    $stmt->bind_param("sssss", $inData["name"], $inData["phone"], $inData["email"], $inData["id"], $inData["userId"]);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithSuccess();
    } else {
        returnWithError("Failed to update contact.");
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
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"success": false, "error": "' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess()
{
    $retValue = '{"success": true, "error": ""}';
    sendResultInfoAsJson($retValue);
}

?>
