const URL_ROOT = document.currentScript.getAttribute("URL_ROOT");

var currentURL = window.location.href;
var parts = currentURL.split("/");
var localhostIndex = parts.indexOf("localhost");
var id = parts[localhostIndex + 2];

const mainSurvey = document.getElementById("mainSurvey");
const surveyContainer = document.getElementById("survey");
const start = document.getElementById("start");
const chatFooter = document.getElementById("footer");
const chatHeader = document.querySelector("js-header");
const deleteButton = document.querySelector("js-delete-button");

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

async function changeSurveyStatus() {
  var selectedStatus = document.getElementById("selectedStatus").value;

  const url = window.location.href;
  const parts = url.split("/");
  const surveyNumber = parts[4];

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
        surveyNumber: surveyNumber,
      }),
    });

    const response = await call.json();

    if (response.status === 200) {
      redirectToRoot();
    } else {
      console.error("Status could not be updated:");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function changeSurveyStatusToRead(surveyNumber) {
  const url = window.location.href;
  const parts = url.split("/");
  try {
    const call = await fetch(URL_ROOT + "ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "read",
        action: "changeSurveyStatusToRead",
        surveyNumber: surveyNumber,
      }),
    });

    const response = await call.json();

    if (response.status === 200) {
    } else {
      console.error("Could not change to read on click");
    }
  } catch (error) {
    console.error("Error:", error.message);
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
                                  <h5 class="me-auto mb-0">${
                                    survey.userUserName
                                  }</h5>
                                  <p class="truncate">${survey.surveyNumber}</p>
                                  
                                  <!-- Dynamic class based on survey status -->
                                  <span class="text-white extra-small ms-2 survey-status ${
                                    survey.surveyStatus === "unread"
                                      ? "bg-success text-white"
                                      : "bg-info text-white"
                                  } p-3 rounded">
                                      ${survey.surveyStatus}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>`;

        surveyElement.addEventListener("click", async function (event) {
          document.querySelectorAll(".cardSurvey").forEach((element) => {
            element.classList.remove("surveyActive");
          });
          surveyElement.classList.add("surveyActive");
          mainSurvey.classList.remove("d-none");
          start.classList.add("d-none");

          // Get the survey ID from the clicked survey element
          const surveyNumber = survey.surveyNumber;

          // Await the changeSurveyStatusToRead function
          await changeSurveyStatusToRead(surveyNumber);

          const statusElement = surveyElement.querySelector(".survey-status");
          survey.surveyStatus = "read"; 
          statusElement.textContent = survey.surveyStatus;
          console.log(statusElement);
          statusElement.classList.remove("bg-success");
          statusElement.classList.add("bg-info");

          // Push the updated URL to the browser history
          window.history.pushState(
            null,
            null,
            "/surveyapp/" + surveyNumber + "/"
          );
          drawSurveyData(surveyNumber);
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

async function fetchSurveyData(surveyNumber) {
  try {
    const response = await fetch(URL_ROOT + "ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "surveyData",
        action: "getSurveyBySurveyNumber",
        surveyNumber: surveyNumber,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching survey data");
  }
}
const surveyBodyElement = document.querySelector(".chat-body-inner");

async function drawSurveyData(surveyNumber) {
  try {
    const surveyData = await fetchSurveyData(surveyNumber);
    const surveys = surveyData.data;

    // Clear previous surveys
    surveyBodyElement.innerHTML = "";

    for (let i = 0; i < surveys.length; i++) {
      const survey = surveys[i];

      // Update survey title
      const surveyTitleElement = document.querySelector(
        "#mainSurvey .text-truncate"
      );
      surveyTitleElement.textContent = survey.surveyNumber;

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
            <p><strong>Q:</strong> ${questionText}</p>
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
            <p><strong>A:</strong> ${answerText}</p>
          </div>
        </div>
      </div>
    </div>`;

      // Append answer to survey body
      surveyBodyElement.appendChild(answerElement);

      const responseText = survey.surveyResponse;

      // Check if there's a response
      if (responseText) {
        const responseElement = document.createElement("div");
        responseElement.classList.add("message", "message-out");

        // Populate response text
        responseElement.innerHTML = `
      <div class="message-inner">
        <div class="message-body">
          <div class="message-content">
            <div class="message-text">
              <p><strong>R:</strong> ${responseText}</p>
            </div>
          </div>
        </div>
      </div>`;
        surveyBodyElement.appendChild(responseElement);
      } else {
        const responseForm = document.createElement("form");
        responseForm.classList.add(
          "chat-form",
          "rounded-pill",
          "bg-dark",
          "m-5",
          "js-responseform"
        );
        responseForm.innerHTML = ` 
      <div class="row align-items-center gx-0">
        <div class="col-auto">
            <a href="#" class="btn btn-icon btn-link text-body rounded-circle dz-clickable" id="dz-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
            </a>
        </div>
        <div class="col">
            <div class="input-group">
                <input id="responseInput" type="text" class="form-control px-0 messageInput js-response-input" placeholder="Type your response..." rows="1" data-emoji-input="" data-autosize="true" style="overflow: hidden; overflow-wrap: break-word; resize: none; height: 47px;" />
                <a id="emojiButton" class="input-group-text text-body pe-0">
                    <span class="icon icon-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-smile">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                    </span>
                </a>
            </div>
        </div>
        <div class="col-auto">
            <button id="responseSubmit" class="btn btn-icon btn-primary rounded-circle ms-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
      </div>`;

        responseForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          const responseInput =
            responseForm.querySelector(".js-response-input");
          const responseText = responseInput.value.trim();

          if (responseText === "") {
            return;
          }

          const surveyId = survey.surveyId;

          // Submit response to the server
          const submitResponse = await fetch(URL_ROOT + "ajax.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              scope: "response",
              action: "handleResponse",
              surveyId: surveyId,
              response: responseText,
            }),
          });

          if (submitResponse.ok) {
            // Add the response to the survey body
            const responseElement = document.createElement("div");
            responseElement.classList.add("message", "message-out");

            responseElement.innerHTML = `
              <div class="message-inner">
                <div class="message-body">
                  <div class="message-content">
                    <div class="message-text">
                      <p><strong>R:</strong> ${responseText}</p>
                    </div>
                  </div>
                </div>
              </div>`;

            event.target.insertAdjacentElement("beforebegin", responseElement);

            responseInput.value = "";

            responseForm.classList.add("d-none");
          } else {
            console.error("Error submitting response:", submitResponse.status);
          }
        });
        // Append the response form to the survey body
        surveyBodyElement.appendChild(responseForm);
      }
    }
  } catch (error) {
    console.error("Error drawing survey data:", error);
  }
}

window.addEventListener("popstate", function (event) {
  const currentURL = window.location.href;
  const parts = currentURL.split("/");
  const localhostIndex = parts.indexOf("localhost");
  const surveyNumber = parts[localhostIndex + 2];
  drawSurveyData(surveyNumber);
});

function updateDropdownText(text) {
  document.getElementById("dropdownMenuButton").innerHTML =
    text + ' <span class="caret"></span>';
  document.getElementById("selectedStatus").value = text;
}

drawSurveys();
