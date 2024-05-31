const URL_ROOT = document.currentScript.getAttribute("URL_ROOT");

var currentURL = window.location.href;
var parts = currentURL.split("/");
var localhostIndex = parts.indexOf("localhost");
var id = parts[localhostIndex + 3];

const mainSurvey = document.getElementById("mainSurvey");
const surveyContainer = document.getElementById("survey");
const start = document.getElementById("start");
const none = document.getElementById("none");
const chatFooter = document.getElementById("footer");
const chatHeader = document.querySelector("js-header");
const deleteButton = document.querySelector("js-delete");
const editButton = document.querySelector("js-edit");
const surveysTabLink = document.getElementById("js-surveysTabLink");
const settingsTabLink = document.getElementById("js-settingsTabLink");
const surveysTab = document.querySelector(".js-surveysTab");
const settingsTab = document.querySelector(".js-settingsTab");

async function loadPage() {
  const userId = id;

  mainSurvey.classList.remove("d-none");
  start.classList.add("d-none");
  
  console.log(userId);
  drawSurveyData(userId);
}

surveysTabLink.addEventListener("click", async () => {
  window.history.pushState(null, null, "/survey/" + "read/");
});

settingsTabLink.addEventListener("click", async () => {
  window.history.pushState(null, null, "/survey/" + "settings/");
  mainSurvey.classList.add("d-none");
  start.classList.add("d-none");
});

function redirectToRoot() {
  window.location.href = URL_ROOT;
}

window.addEventListener("beforeunload", function (event) {
  redirectToRoot();
});

async function saveMaxSurveysAmount() {
  try {
    const surveyAmount = document.getElementById("js-surveyAmount").value;
    localStorage.setItem("maxSurveys", surveyAmount);
    redirectToRoot();
  } catch (error) {
    console.error("Error saving maxSurveys amount:", error);
  }
}

async function loadMaxSurveysAmount() {
  var amount = localStorage.getItem("maxSurveys");
  if (amount !== null) {
    document.getElementById("js-surveyAmount").value = amount;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  loadMaxSurveysAmount,
  localStorage.setItem("color-scheme", "light")
);

async function fetchUsers() {
  var maxSurveysAmount = localStorage.getItem("maxSurveys");
  try {
    const call = await fetch(URL_ROOT + "ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "users",
        action: "getUsers",
        maxSurveysAmount: maxSurveysAmount,
      }),
    });
    const response = await call.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return [];
  }
}

async function countSurveys() {
  try {
    const call = await fetch(URL_ROOT + "ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "countSurveys",
        action: "selectCountSurveys",
      }),
    });

    const response = await call.json();
    if (response.status === "200") {
      const count = response.data;

      const surveysTabLink = document.querySelector("#js-surveysTabLink");

      console.log(surveysTabLink);
      // Update the count badge
      const countBadge = document.querySelector("#js-surveysCountBadge");

      if (count > 0) {
        countBadge.innerText = count;
        countBadge.style.display = "block";
      } else {
        surveysTabLink.classList.remove("active");
        countBadge.style.display = "none";
      }
    } else {
      console.error("Error fetching surveys:", response.message);
    }
  } catch (error) {
    console.error("Error fetching surveys:", error);
  }
}

async function changeSelectedSurveysStatus(status) {
  // Get all checkboxes
  const checkboxes = document.querySelectorAll(".js-surveyCheckbox:checked");

  // Iterate through checked checkboxes
  for (const checkbox of checkboxes) {
    const surveyId = checkbox.dataset.surveyId;

    try {
      const response = await fetch(URL_ROOT + "ajax.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope: "surveyStatus",
          action: "changeSurveyStatus",
          surveyStatusValue: status,
          surveyId: surveyId,
        }),
      });

      const result = await response.json();

      if (result.status === 200) {
        redirectToRoot();
      } else {
        console.error(`Status for survey ${surveyId} could not be updated`);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

async function changeSurveyStatusToRead(surveyOwner) {
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
        surveyOwner: surveyOwner,
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

async function drawUsers() {
  try {
    const userList = await fetchUsers();
    const surveyContainer = document.getElementById("survey");

    if (userList.length > 0) {
      userList.forEach(async (user) => {
        const surveyElement = document.createElement("div");
        surveyElement.classList.add(
          "cardSurvey",
          "rounded",
          "border-0",
          "text-reset",
          "mb-5"
        );

        // Check survey status dynamically
        const status = user.unread ? "unread" : "read";

        surveyElement.innerHTML = `
          <div class="card-body border rounded">
              <div class="row gx-5 ">
                  <div class="col-auto">
                      <!-- Any content you want to include -->
                  </div>
                  <div class="col">
                      <div class="d-flex align-items-center mb-3">
                          <h5 class="me-auto mb-0">${user.userUserName}</h5>
                          <!-- Dynamic class based on survey status -->
                          <span class="text-white extra-small ms-2 survey-status ${
                            status === "unread" ? "bg-success" : "bg-info"
                          } text-white p-3 rounded">
                              ${status}
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

          // Get the user ID from the clicked survey element
          const userId = user.userId;

          await changeSurveyStatusToRead(userId);

          const statusElement = surveyElement.querySelector(".survey-status");
          statusElement.textContent = "read";
          statusElement.classList.remove("bg-success");
          statusElement.classList.add("bg-info");

          // Push the updated URL to the browser history
          window.history.pushState(null, null, `/survey/read/${userId}`);
          drawSurveyData(userId);
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

async function fetchSurveyData(surveyOwner) {
  try {
    const response = await fetch(URL_ROOT + "ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "surveyData",
        action: "getSurveyBySurveyOwner",
        surveyOwner: surveyOwner,
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

async function drawSurveyData(surveyOwner) {
  try {
    const surveyData = await fetchSurveyData(surveyOwner);
    const surveys = surveyData.data;

    // Clear previous surveys
    surveyBodyElement.innerHTML = "";

    let currentSurveyNumber = null;

    for (let i = 0; i < surveys.length; i++) {
      const survey = surveys[i];

      // Check if survey number has changed
      if (survey.surveyNumber !== currentSurveyNumber) {
        // If it has, create a new container for the new survey number
        currentSurveyNumber = survey.surveyNumber;

        // Create section for surveys with the same number
        const surveyNumberContainer = document.createElement("div");
        surveyNumberContainer.classList.add("survey-number-container");
        surveyNumberContainer.style.border = "2px solid #D3D3D3";
        surveyNumberContainer.style.marginBottom = "20px";
        surveyNumberContainer.style.padding = "20px";
        surveyNumberContainer.style.borderRadius = "5px";

        // Add survey number to the section
        const surveyNumberElement = document.createElement("div");
        surveyNumberElement.classList.add("survey-number");
        surveyNumberElement.textContent = `Survey ${currentSurveyNumber}`;
        surveyNumberContainer.appendChild(surveyNumberElement);

        // Append the container to the survey body
        surveyBodyElement.appendChild(surveyNumberContainer);
      }

      // Create survey container
      const surveyContainer = document.createElement("div");
      surveyContainer.classList.add("survey-container");

      const checkboxElement = document.createElement("input");
      checkboxElement.type = "checkbox";
      checkboxElement.classList.add("js-surveyCheckbox");
      checkboxElement.dataset.surveyId = survey.surveyId;
      surveyContainer.appendChild(checkboxElement);

      // Update survey title
      const surveyTitleElement = document.querySelector(
        "#mainSurvey .text-truncate"
      );
      surveyTitleElement.textContent = survey.userUserName;

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

      // Append question to survey container
      surveyContainer.appendChild(questionElement);

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

      // Append answer to survey container
      surveyContainer.appendChild(answerElement);

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
                <div class="message-action">
                  <div class="dropdown">
                      <a class="icon text-muted" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                      </a>
                      <ul class="dropdown-menu">
                          <li>
                              <button class="dropdown-item d-flex align-items-center js-edit" onclick="editResponse(event, '${survey.surveyId}')">
                                  <span class="me-auto">Edit</span>
                                  <div class="icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                  </div>
                               </button>
                          </li>
                          <li>
                              <hr class="dropdown-divider">
                          </li>
                          <li>
                              <button class="dropdown-item d-flex align-items-center text-danger js-delete" onclick="deleteResponse(event, '${survey.surveyId}')">
                                  <span class="me-auto">Delete</span>
                                  <div class="icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                  </div>
                              </button>
                          </li>
                      </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
        surveyContainer.appendChild(responseElement);
      }

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
        <div class="col">
          <div class="input-group">
            <input id="responseInput" type="text" class="form-control px-0 messageInput js-response-input" placeholder="Type your response..." rows="1" data-emoji-input="" data-autosize="true" style="overflow: hidden; overflow-wrap: break-word; resize: none; height: 47px;" />
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

      if (responseText) {
        responseForm.classList.add("d-none");
      }

      responseForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const responseInput = responseForm.querySelector(".js-response-input");
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
          // Add the response to the survey container
          const responseElement = document.createElement("div");
          responseElement.classList.add("message", "message-out");

          responseElement.innerHTML = `
         <div class="message-inner">
        <div class="message-body">
          <div class="message-content">
            <div class="message-text">
              <p><strong>R:</strong> ${responseText}</p>
            </div>
            <div class="message-action">
              <div class="dropdown">
                  <a class="icon text-muted" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </a>
                  <ul class="dropdown-menu">
                      <li>
                          <button class="dropdown-item d-flex align-items-center js-edit" onclick="editResponse(event, '${survey.surveyId}')">
                              <span class="me-auto">Edit</span>
                              <div class="icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                              </div>
                           </button>
                      </li>
                      <li>
                          <hr class="dropdown-divider">
                      </li>
                      <li>
                          <button class="dropdown-item d-flex align-items-center text-danger js-delete" onclick="deleteResponse(event, '${survey.surveyId}')">
                              <span class="me-auto">Delete</span>
                              <div class="icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                              </div>
                          </button>
                      </li>
                  </ul>
              </div>
            </div>
          </div>
        </div>
      </div>`;

          surveyContainer.appendChild(responseElement);
          responseInput.value = "";
          responseForm.classList.add("d-none");
        } else {
          console.error("Error submitting response:", submitResponse.status);
        }
      });

      // Append the response form to the survey container
      surveyContainer.appendChild(responseForm);

      // Append the survey container to the survey body
      const surveyNumberContainer = surveyBodyElement.lastChild;
      surveyNumberContainer.appendChild(surveyContainer);
    }
  } catch (error) {
    console.error("Error drawing survey data:", error);
  }
}

async function deleteResponse(event, surveyId) {
  try {
    // Create the modal HTML
    const modalHTML = `
      <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Delete Response Confirmation</h5>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete this response?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary">Delete</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>`;

    // Append modal HTML to the document body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Get the modal element
    const modal = document.querySelector(".modal");

    // Get the delete button in the modal
    const deleteButton = modal.querySelector(".btn-primary");

    // Add event listener to cancel button to hide the modal
    const cancelButton = modal.querySelector(".btn-secondary");
    cancelButton.addEventListener("click", async () => {
      $(modal).modal("hide");
    });

    // Add a click event listener to the delete button
    deleteButton.addEventListener("click", async () => {
      try {
        // Close the modal
        $(modal).modal("hide");

        // Send delete request to the server
        const response = await fetch(URL_ROOT + "ajax.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scope: "delete",
            action: "deleteResponse",
            surveyId: surveyId,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          const surveyContainer = event.target.closest(".survey-container");
          console.log(surveyContainer);
          // Find the response element and remove it
          const responseElement = surveyContainer.querySelector(
            ".message.message-out"
          );
          console.log(surveyContainer);
          if (responseElement) {
            console.log(1);
            responseElement.remove();
          }

          // Show the response form again if no response is found
          const responseForm =
            surveyContainer.querySelector(".js-responseform");
          console.log(responseForm);
          if (
            !surveyContainer.querySelector(".message.message-out") &&
            responseForm
          ) {
            console.log(2);
            responseForm.classList.remove("d-none");
          }
        }
      } catch (error) {
        console.error("Error deleting response:", error.message);
      }
    });

    // Show the modal
    $(modal).modal("show");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editResponse(event, surveyId) {
  try {
    const surveyContainer = event.target.closest(".survey-container");

    const responseTextElement = surveyContainer.querySelector(
      ".message.message-out .message-text p"
    );

    if (!responseTextElement) {
      throw new Error("Response text element not found");
    }

    const responseText = responseTextElement.textContent.trim();

    // Extract the response text without "R: " for editing
    const responseTextWithoutPrefix = responseText.replace(/^R:\s*/, "");

    // Create the modal HTML
    const modalHTML = `
      <div class="modal fade js-editModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit response</h5>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="js-message-text" class="col-form-label">Message:</label>
                  <textarea class="form-control" id="js-message-text">${responseTextWithoutPrefix}</textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="js-cancel-button" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" id="send-message">Send message</button>
            </div>
          </div>
        </div>
      </div>`;

    // Append modal HTML to the document body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Get the modal element
    const modal = document.querySelector(".js-editModal");

    // Show the modal
    $(modal).modal("show");

    document
      .getElementById("js-cancel-button")
      .addEventListener("click", async () => {
        $(modal).modal("hide");
      });

    // Add a click event listener to the send message button
    document
      .getElementById("send-message")
      .addEventListener("click", async () => {
        try {
          const updatedText = document
            .getElementById("js-message-text")
            .value.trim();

          // Construct the updated text with "R: " prefix

          // Update the response text in the surveyContainer
          responseTextElement.textContent = updatedText;

          const response = await fetch(URL_ROOT + "ajax.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              scope: "edit",
              action: "editResponse",
              surveyId: surveyId,
              response: updatedText,
            }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          } else {
            // Close the modal
            $(modal).modal("hide");

            responseTextElement.textContent = "R: " + updatedText;
          }
        } catch (error) {
          console.error("Error updating response:", error.message);
        }
      });

    // Remove the modal from the DOM after it is closed
    $(modal).on("hidden.bs.modal", function () {
      modal.remove();
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

window.addEventListener("popstate", function () {
  const currentURL = window.location.href;
  const parts = currentURL.split("/");
  const localhostIndex = parts.indexOf("localhost");
  const surveyOwner = parts[localhostIndex + 2];
  drawSurveyData(surveyOwner);
});

function updateDropdownText(text) {
  document.getElementById("dropdownMenuButton").innerHTML =
    text + ' <span class="caret"></span>';
  document.getElementById("selectedStatus").value = text;
}

loadPage();
drawUsers();
countSurveys();
