const URL_ROOT = document.currentScript.getAttribute("URL_ROOT");

var currentURL = window.location.href;
var parts = currentURL.split("/");
var localhostIndex = parts.indexOf("localhost");
var id = parts[localhostIndex + 2];

const mainSurvey = document.getElementById("mainSurvey");
const surveyContainer = document.getElementById("survey");
const start = document.getElementById("start");
const chatFooter = document.getElementById("footer");

function redirectToRoot() {
  window.location.href = URL_ROOT;
}

window.addEventListener("beforeunload", function (event) {
  redirectToRoot();
});

document.addEventListener("keydown", function (event) {
  if (
    (event.key === "F5" || (event.ctrlKey && event.key === "r")) &&
    !event.shiftKey
  ) {
    event.preventDefault();
    redirectToRoot();
  }
});

async function fetchSurveys() {
  try {
    const call = await fetch(URL_ROOT + "ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "survey",
        action: "getSurveys",
      }),
    });
    const response = await call.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return [];
  }
}

async function drawSurveys() {
  try {
    const surveyList = await fetchSurveys();
    const surveyContainer = document.getElementById("survey");

    if (surveyList.length > 0) {
      surveyList.forEach((survey) => {
        const surveyElement = document.createElement("div");
        surveyElement.classList.add(
          "cardSurvey",
          "rounded",
          "border-0",
          "text-reset",
          "mb-5"
        );
        surveyElement.innerHTML = `
        <div class="card-body border rounded">
        <div class="row gx-5 ">
            <div class="col-auto">
                <!-- Any content you want to include -->
            </div>
            <div class="col">
                <div class="d-flex align-items-center mb-3">
                    <h5 class="me-auto mb-0">${survey.surveyQuestion}</h5>
                    
                    <!-- Dynamic class based on survey status -->
                    <span class="text-white extra-small ms-2 ${
                      survey.surveyStatus === "unread"
                        ? "bg-success text-white"
                        : "bg-info text-white"
                    } p-3 rounded">
                        ${survey.surveyStatus === "unread" ? "unread" : "read"}
                    </span>
                </div>
            </div>
        </div>
    </div>`;

        surveyElement.addEventListener("click", function () {
          const mainSurvey = document.querySelector("#mainSurvey");
          const start = document.querySelector("#start");
          document.querySelectorAll(".cardSurvey").forEach((element) => {
            element.classList.remove("surveyActive");
          });
          surveyElement.classList.add("surveyActive");
          mainSurvey.classList.remove("d-none");
          start.classList.add("d-none");

          // Get the survey ID from the clicked survey element
          const surveyId = survey.surveyId;

          // Push the updated URL to the browser history
          window.history.pushState(null, null, "/surveyapp/" + surveyId + "/");
          drawSurveyData(surveyId);
        });
        surveyContainer.appendChild(surveyElement);
      });
    } else {
      surveyContainer.innerHTML = "<p>No surveys available.</p>";
    }
  } catch (error) {
    console.error("Error fetching surveys:", error);
  }
}

async function fetchSurveyData() {
  const pathnameParts = window.location.pathname.split("/");
  const surveyId = pathnameParts[pathnameParts.length - 2];

  try {
    const response = await fetch(URL_ROOT + "ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "surveyData",
        action: "getSurveyById",
        surveyId: surveyId,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching survey data:", error);
    return null;
  }
}

const surveyBodyElement = document.querySelector(".chat-body-inner");

async function drawSurveyData(surveyId) {
  try {
    const surveyData = await fetchSurveyData(surveyId);
    // Update survey title
    const surveyTitleElement = document.querySelector(
      "#mainSurvey .text-truncate"
    );

    var survey = surveyData.data;

    surveyTitleElement.textContent = survey.userUserName;

    // Clear previous questions and answers
    surveyBodyElement.innerHTML = "";

    const questionText = survey.surveyQuestion;

    // Create question element
    const questionElement = document.createElement("div");
    questionElement.classList.add("message");

    // Populate question text
    questionElement.innerHTML = `
          <div class="message-inner">
              <div class="message-body">
                  <div class="message-content">
                      <div class="message-text">
                          <p><strong>Question:</strong> ${questionText}</p>
                      </div>
                  </div>
              </div>
          </div>`;

    // Append question to survey body
    surveyBodyElement.appendChild(questionElement);

    const answerText = survey.surveyAnswer;

    // Create answer element
    const answerElement = document.createElement("div");
    answerElement.classList.add("message");

    // Populate answer text
    answerElement.innerHTML = `
            <div class="message-inner">
                <div class="message-body">
                    <div class="message-content">
                        <div class="message-text">
                            <p><strong>Answer:</strong> ${answerText}</p>
                        </div>
                    </div>
                </div>
            </div>`;

    // Append answer to survey body
    surveyBodyElement.appendChild(answerElement);

    var responseInput = document.getElementById("responseForm");

    chatFooter.appendChild(responseInput);

    const responseText = survey.surveyResponse;

    if (responseText) {
      const responseElement = document.createElement("div");
      responseElement.classList.add("message", "message-out");

      responseElement.innerHTML = `
            <div class="message-inner">
                <div class="message-body">
                    <div class="message-content">
                        <div class="message-text">
                            <p>${responseText}</p>
                        </div>
                    </div>
                </div>
            </div>`;
      surveyBodyElement.appendChild(responseElement);
      responseInput.classList.add("d-none");
    } else {
      responseInput.classList.remove("d-none");
    }
  } catch (error) {
    console.error("Error drawing survey:", error);
  }
}

async function sendMessage(event) {
  event.preventDefault(); // Prevents the default form submission behavior

  // Find the response input element
  var responseInput = document.querySelector(".js-response-input");

  var responseForm = document.getElementById('responseForm');

  // Check if response input exists and if it's not empty
  if (responseInput && responseInput.value.trim() !== "") {
    var responseInputValue = responseInput.value.trim();
    const pathnameParts = window.location.pathname.split("/");

    const surveyId = pathnameParts[pathnameParts.length - 2];

    try {
      // Make a POST request to the server
      const call = await fetch(URL_ROOT + "ajax.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope: "response",
          action: "handleResponse",
          responseInputValue: responseInputValue,
          surveyId: surveyId,
        }),
      });

      // Parse the JSON response from the server
      const response = await call.json();

      // Check if the response status is 200 (OK)
      if (response.status === 200) {
        // Fetch survey data after successful response
        const surveyData = await fetchSurveyData(surveyId);
        var survey = surveyData.data;

        if (survey && survey.surveyResponse) {
          const responseText = survey.surveyResponse;

          // Check if responseText exists
          if (responseText) {
            const responseElement = document.createElement("div");
            responseElement.classList.add("message", "message-out");
            responseElement.innerHTML = `
              <div class="message-inner">
                  <div class="message-body">
                      <div class="message-content">
                          <div class="message-text">
                              <p>${responseText}</p>
                          </div>
                      </div>
                  </div>
              </div>`;
            surveyBodyElement.appendChild(responseElement);
            responseInput.value = ""; 
            responseForm.classList.add("d-none"); 
          }
        } else {
          console.error("Error: Survey data or survey response is missing.");
        }
      } else {
        console.error("Error: Status code is not 200.");
      }
    } catch (error) {
      console.error("Error sending response:", error);
    }
  } else {
    console.error("Error: Response input is empty.");
  }
}

async function changeSurveyStatus() {
  var selectedStatus = document.getElementById("selectedStatus").value;

  const url = window.location.href;
  const parts = url.split("/");
  const surveyId = parts[4];

  try {
    const call = await fetch(URL_ROOT + "ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "surveyStatus",
        action: "changeSurveyStatus",
        surveyStatusValue: selectedStatus,
        surveyId: surveyId,
      }),
    });

    const response = await call.json();

    if (response.status === 200) {
      redirectToRoot();
    } else {
      console.error("Status could not be updated");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function updateDropdownText(text) {
  document.getElementById("dropdownMenuButton").innerHTML =
    text + ' <span class="caret"></span>';
  document.getElementById("selectedStatus").value = text;
}

drawSurveys();
