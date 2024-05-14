<?php
include 'config.php';

header('Content-Type: application/json');
$decodedParams = json_decode(file_get_contents('php://input'));
$response = [
   'status' => 404,
   'message' => 'Unknown error occurred!'
];
$response = [
   'status' => 200,
   'message' => 'success'
];

$response = array();
if (isset($decodedParams->scope) && !empty($decodedParams->scope)) {

   if ($decodedParams->scope == 'survey') {
      if (isset($decodedParams->action) && !empty($decodedParams->action)) {
         if ($decodedParams->action == 'getSurveys') {
            $query = $dbh->prepare('SELECT s.surveyId, s.surveyQuestion, s.surveyAnswer, s.surveyResponse, s.surveyOwner, s.surveyStatus
                                    FROM surveys s
                                    INNER JOIN users u ON s.surveyOwner = u.userId
                                    ORDER BY s.surveyCreateDate DESC;
                                    ');
            if ($query->execute()) {
               $response['status'] = '200';
               $response['message'] = 'Surveys fetched successfully';
               $response['data'] = $query->fetchAll(PDO::FETCH_ASSOC);
            } else {
               $response['status'] = '500';
               $response['message'] = 'Surveys could not be fetched';
            }
         }
      }
   } elseif ($decodedParams->scope == 'surveyData') {
      if ($decodedParams->action == 'getSurveyById') {

         $stmt = $dbh->prepare('SELECT s.surveyId, s.surveyQuestion, s.surveyAnswer, s.surveyResponse, s.surveyOwner, u.userUserName
                          FROM surveys s 
                          INNER JOIN users u ON u.userId = s.surveyOwner 
                          WHERE s.surveyId = :surveyId;
                          ');

         $stmt->bindParam(':surveyId', $decodedParams->surveyId);

         if ($stmt->execute()) {
            $surveyData = $stmt->fetch(PDO::FETCH_ASSOC);

            if (isset($surveyData) && !empty($surveyData)) {
               $response['status'] = '200';
               $response['message'] = 'Survey by id fetched successfully';
               $response['data'] = $surveyData;
            } else {
               $response['status'] = '404';
               $response['message'] = 'Survey with the provided ID not found';
            }
         } else {
            $response['status'] = '500';
            $response['message'] = 'Survey by id could not be fetched';
         }
      }
   } elseif ($decodedParams->scope == 'response') {
      if ($decodedParams->action == 'handleResponse') {
         $responseInputValue = $decodedParams->responseInputValue;
         $surveyId = $decodedParams->surveyId;
         $stmt = $dbh->prepare('UPDATE surveys SET surveyResponse = :surveyResponse WHERE surveyId = :surveyId');

         $stmt->bindParam(':surveyResponse', $responseInputValue);
         $stmt->bindParam(':surveyId', $surveyId);
         $stmt->execute();

         $response['status'] = 200;
         $response['message'] = 'Response updated successfully';
      } else {
         $response['status'] = 404;
         $response['message'] = 'Response could not be updated';
      }
   } elseif ($decodedParams->scope == 'surveyStatus') {
      if ($decodedParams->action == 'changeSurveyStatus') {
         $surveyStatusValue = $decodedParams->surveyStatusValue;
         $surveyId = $decodedParams->surveyId;
         $stmt = $dbh->prepare('UPDATE surveys SET surveyStatus = :surveyStatus WHERE surveyId = :surveyId');

         $stmt->bindParam(':surveyStatus', $surveyStatusValue);
         $stmt->bindParam(':surveyId', $surveyId);
         $stmt->execute();
       
         $response['status'] = 200;
         $response['message'] = 'Status updated successfully';
      } else {
         $response['status'] = 404;
         $response['message'] = 'Status could not be updated';
      }
   } else {
      $response['status'] = '500';
      $response['message'] = 'Invalid action';
   }
}



echo json_encode($response);
return;
