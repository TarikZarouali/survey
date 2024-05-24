<?php


$user = 'root';
$pass = '';

try {
    $dbh = new PDO('mysql:host=localhost;dbname=survey', $user, $pass);
} catch (PDOException $e) {
    if ($e->getCode() == 1452) {
        // Foreign key violation
        $response['status'] = 500;
        $response['message'] = 'Error: Invalid user in messageOwner';
    } else {
        // Other PDO exceptions
        $response['status'] = 500;
        $response['message'] = 'Error during database operation';
    }
    echo json_encode($response);
    exit;
}

$urlRoot = 'https://' . ($_SERVER['HTTP_HOST'] ?? '') . '/survey/';

$surveyId = $_GET['surveyId'] ?? NULL;