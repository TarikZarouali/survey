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
   if ($decodedParams->scope == 'users') {
      if (isset($decodedParams->action) && !empty($decodedParams->action)) {
         if ($decodedParams->action == 'getUsers') {
            $maxSurveysAmount = (int)$decodedParams->maxSurveysAmount ?? NULL;
            $stmt = 'SELECT u.userId, u.userUserName
            FROM users AS u
            RIGHT JOIN surveys AS s ON u.userId = s.surveyOwner
            GROUP BY u.userId 
            ORDER BY s.surveyCreateDate DESC';

            if (!empty($maxSurveysAmount)) {
               $stmt .= " LIMIT " . $maxSurveysAmount;
            }

            $stmt = $dbh->prepare($stmt);

            if ($stmt->execute()) {
               $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

               foreach ($users as &$user) {
                  $stmt = $dbh->prepare('SELECT s.surveyId
                                       FROM surveys s
                                       WHERE s.surveyOwner = :surveyOwner AND s.surveyStatus = :surveyStatus
                                       LIMIT 1;');

                  $unreadStatus = 'unread';

                  $stmt->bindParam(':surveyOwner', $user['userId']);
                  $stmt->bindParam(':surveyStatus', $unreadStatus);

                  if ($stmt->execute()) {
                     $unreadSurvey = $stmt->fetch(PDO::FETCH_ASSOC);

                     if (!empty($unreadSurvey)) {
                        $user['unread'] = TRUE;
                     } else {
                        $user['unread'] = FALSE;
                     }
                  } else {
                     $user['unread'] = FALSE;
                  }
               }

               $response['status'] = '200';
               $response['message'] = 'Max surveys fetched successfully';
               $response['data'] = $users;
            } else {
               $response['status'] = '500';
               $response['message'] = 'Max surveys could not be fetched';
            }
         }
      }
   } elseif ($decodedParams->scope == "countSurveys") {
      if ($decodedParams->action == "selectCountSurveys") {
         $stmt = 'SELECT COUNT(*) AS totalSurveys
                          FROM surveys
                          WHERE surveyStatus = "unread"';

         $query = $dbh->prepare($stmt);

         if ($query->execute()) {
            $response['status'] = '200';
            $response['message'] = 'Count of unread surveys fetched successfully';
            $response['data'] = $query->fetch(PDO::FETCH_ASSOC)['totalSurveys'];
         } else {
            $response['status'] = '500';
            $response['message'] = 'Count of unread surveys could not be fetched';
         }
      }
   } elseif ($decodedParams->scope == 'surveyData') {
      if ($decodedParams->action == 'getSurveyBySurveyOwner') {
         $stmt = $dbh->prepare('SELECT s.surveyId, s.surveyQuestion, s.surveyAnswer, s.surveyResponse, s.surveyOwner, s.surveyNumber, s.surveyStatus, u.userUserName
                               FROM surveys s 
                               INNER JOIN users u ON u.userId = s.surveyOwner 
                               WHERE s.surveyOwner = :surveyOwner
                               ORDER BY s.surveyNumber');

         $stmt->bindParam(':surveyOwner', $decodedParams->surveyOwner);

         if ($stmt->execute()) {
            $surveyData = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($surveyData) {
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
   } elseif ($decodedParams->scope == 'surveyStatusCheck') {
      if ($decodedParams->action == 'checkSurveyStatus') {
         $stmt = $dbh->prepare('
              SELECT s.surveyId, s.surveyQuestion, s.surveyAnswer, s.surveyResponse, s.surveyOwner, s.surveyNumber, s.surveyStatus, u.userUserName
              FROM surveys s
              INNER JOIN users u ON u.userId = s.surveyOwner
              WHERE s.surveyOwner = :surveyOwner AND s.surveyStatus = :surveyStatus
              ORDER BY s.surveyNumber
              LIMIT 1;
          ');
         $unreadStatus = 'unread';
         $stmt->bindParam(':surveyOwner', $decodedParams->surveyOwner);
         $stmt->bindParam(':surveyStatus', $unreadStatus);

         if ($stmt->execute()) {
            $surveyData = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($surveyData) {
               $response['status'] = '200';
               $response['message'] = 'Checked surveyStatus successfully';
               $response['data'] = $surveyData;
            } else {
               $response['status'] = '404';
               $response['message'] = 'No unread surveys found for the specified owner';
            }
         } else {
            $response['status'] = '500';
            $response['message'] = 'Survey status check could not be executed';
         }
      }
   } elseif ($decodedParams->scope == 'response') {
      if ($decodedParams->action == 'handleResponse') {
         $surveyId = $decodedParams->surveyId;
         $responseText = $decodedParams->response;

         $stmt = $dbh->prepare('UPDATE surveys SET surveyResponse = :surveyResponse WHERE surveyId = :surveyId');

         $stmt->bindParam(':surveyResponse', $responseText);
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
   } elseif ($decodedParams->scope == 'read') {
      if ($decodedParams->action == 'changeSurveyStatusToRead') {

         $surveyOwner = $decodedParams->surveyOwner;
         $stmt = $dbh->prepare('UPDATE surveys SET surveyStatus = "read" WHERE surveyOwner = :surveyOwner');

         $stmt->bindParam(':surveyOwner', $surveyOwner);
         $stmt->execute();

         $response['status'] = 200;
         $response['message'] = 'Status updated successfully to read';
         $response['surveyOwner'] = $surveyOwner;
      } else {

         $response['status'] = 404;
         $response['message'] = 'Status could not be updated to read';
      }
   } elseif ($decodedParams->scope == 'delete') {
      if ($decodedParams->action == 'deleteResponse') {
         $surveyId = $decodedParams->surveyId;

         $stmt = $dbh->prepare('UPDATE surveys SET surveyResponse = NULL WHERE surveyId = :surveyId');

         $stmt->bindParam(':surveyId', $surveyId);
         $stmt->execute();

         $response['status'] = 200;
         $response['message'] = 'Response updated successfully';
      } else {
         $response['status'] = 404;
         $response['message'] = 'Response could not be updated';
      }
   } elseif ($decodedParams->scope == 'edit') {
      if ($decodedParams->action == 'editResponse') {
         $surveyId = $decodedParams->surveyId;
         $responseText = $decodedParams->response;


         $stmt = $dbh->prepare('UPDATE surveys SET surveyResponse = :surveyResponse WHERE surveyId = :surveyId');

         $stmt->bindParam(':surveyId', $surveyId);
         $stmt->bindParam(':surveyResponse', $responseText);
         $stmt->execute();

         $response['status'] = 200;
         $response['message'] = 'Response updated successfully';
      } else {
         $response['status'] = 404;
         $response['message'] = 'Response could not be updated';
      }
   } else {
      $response['status'] = 404;
      $response['message'] = 'Invalid action or scope';
   }
} else {
   $response['status'] = 404;
   $response['message'] = 'action or scope is not set';
}



echo json_encode($response);
return;
