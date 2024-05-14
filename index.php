<?php require_once 'config.php';
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1, shrink-to-fit=no, viewport-fit=cover">
    <meta name="color-scheme" content="light dark">
    <title>Messenger</title>
    <!-- Favicon -->
    <style type="text/css"></style>
    <link rel="shortcut icon" href="./files/favicon.png" type="image/x-icon">
    <!-- Font -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link class="css-lt" rel="stylesheet" href="<?= $urlRoot ?>template.bundle.css" media="(prefers-color-scheme: light)">
    <link class="css-dk" rel="stylesheet" href="<?= $urlRoot ?>template.dark.bundle.css" media="(prefers-color-scheme: dark)">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700" rel="stylesheet">
    <script>
        if (localStorage.getItem('color-scheme')) {
            let scheme = localStorage.getItem('color-scheme');

            const LTCSS = document.querySelectorAll('link[class=css-lt]');
            const DKCSS = document.querySelectorAll('link[class=css-dk]');

            [...LTCSS].forEach((link) => {
                link.media = (scheme === 'light') ? 'all' : 'not all';
            });

            [...DKCSS].forEach((link) => {
                link.media = (scheme === 'dark') ? 'all' : 'not all';
            });
        }
    </script>

</head>

<body>
    <!-- Layout -->
    <div class="layout overflow-hidden">
        <!-- Navigation -->
        <nav class="navigation d-flex flex-column text-center navbar navbar-light hide-scrollbar">
            <!-- Brand -->
            <a href="<?= $urlRoot ?>" title="Messenger" class="d-none d-xl-block mb-6">
                <svg version="1.1" width="46px" height="46px" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 46 46" enable-background="new 0 0 46 46" xml:space="preserve">
                    <polygon opacity="0.7" points="45,11 36,11 35.5,1 "></polygon>
                    <polygon points="35.5,1 25.4,14.1 39,21 "></polygon>
                    <polygon opacity="0.4" points="17,9.8 39,21 17,26 "></polygon>
                    <polygon opacity="0.7" points="2,12 17,26 17,9.8 "></polygon>
                    <polygon opacity="0.7" points="17,26 39,21 28,36 "></polygon>
                    <polygon points="28,36 4.5,44 17,26 "></polygon>
                    <polygon points="17,26 1,26 10.8,20.1 "></polygon>
                </svg>

            </a>

            <!-- Nav items -->
            <ul class="d-flex nav navbar-nav flex-row flex-xl-column flex-grow-1 justify-content-between justify-content-xl-center align-items-center w-100 py-4 py-lg-2 px-lg-3" role="tablist">
                <!-- Invisible item to center nav vertically -->
                <li class="nav-item d-none d-xl-block invisible flex-xl-grow-1">
                    <a class="nav-link py-0 py-lg-8" title="">
                        <div class="icon icon-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </a>
                </li>



                <!-- Switcher -->
                <li class="nav-item d-none d-xl-block">
                    <a class="switcher-btn nav-link py-0 py-lg-8" title="Themes">
                        <div class="switcher-icon switcher-icon-dark icon icon-xl d-none" data-theme-mode="dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </div>
                        <div class="switcher-icon switcher-icon-light icon icon-xl" data-theme-mode="light">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        </div>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Navigation -->

        <!-- Sidebar -->
        <aside class="sidebar bg-light">
            <div class="tab-content h-100" role="tablist">


                <!-- Chats -->
                <div class="tab-pane fade h-100 show active" id="tab-content-chats" role="tabpanel">
                    <div class="d-flex flex-column h-100 position-relative">
                        <div class="hide-scrollbar">

                            <div class="container py-8">
                                <!-- Title -->
                                <div class="mb-8">
                                    <h2 class="fw-bold m-0">Surveys</h2>
                                </div>


                                <!-- Chats -->
                                <div class="card-list userList">
                                    <!-- Card -->
                                    <div id="survey" class="card border-0 text-reset">
                                        <!-- Survey data will be dynamically added here -->
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </aside>
        <!-- Sidebar -->

        <!-- main start -->
        <main id="start" class="main">
            <div class="container h-100">
                <div class="d-flex flex-column h-100 justify-content-center text-center">
                    <div class="mb-6">
                        <span class="icon icon-xl text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </span>
                    </div>

                    <p class="text-muted">Pick a survey from your left menu</p>
                </div>

            </div>
        </main>

        <!-- Survey section -->
        <main id="mainSurvey" class="main is-visible d-none" data-dropzone-area="">
            <div class="container h-100">
                <div class="d-flex flex-column h-100 position-relative">
                    <!-- Chat: Header -->
                    <div class="chat-header border-bottom py-4 py-lg-7">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <div id="mainSurvey" class="d-flex align-items-center">
                                    <h5 class="text-truncate me-10" id="surveyTitle"></h5>
                                    <div class="dropdown me-10">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Change survey status
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <a class="dropdown-item" onclick="updateDropdownText('Read')">Read</a>
                                            <a class="dropdown-item" onclick="updateDropdownText('Unread')">Unread</a>
                                        </div>
                                        <input type="hidden" id="selectedStatus" name="selectedStatus" value="">
                                        <button type="submit" onclick="changeSurveyStatus()" class="btn btn-primary">Submit</button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                    <!-- Chat: Header -->
                    <!-- Chat: Content -->
                    <div class="chat-body hide-scrollbar flex-1 h-100">
                        <div class="chat-body-inner" style="padding-bottom: 87px">
                            <div class="py-6 py-lg-12" id="surveyContent">
                                <!-- Survey questions and answers will be dynamically added here -->
                            </div>
                        </div>

                    </div>
                    <!-- Chat: Content -->
                    <!-- Chat: Footer -->
                    <div id="footer" class="chat-footer pb-3 pb-lg-7 position-absolute bottom-0 start-0">
                        <div class="dz-preview bg-dark" id="dz-preview-row" data-horizontal-scroll="">
                        </div>

                        <!-- Chat: Form -->
                        <form id="responseForm" class="chat-form rounded-pill bg-dark" onsubmit="sendMessage(event, '<?= $surveyId ?>')">
                            <div class="row align-items-center gx-0">

                                <div class="col-auto ">
                                    <a href="#" class="btn btn-icon btn-link text-body rounded-circle dz-clickable" id="dz-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip">
                                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                        </svg>
                                    </a>
                                </div>
                                <div class="col">
                                    <div class="input-group">
                                        <input id="responseInput" type="text" class="form-control px-0 messageInput js-response-input" placeholder="Type your message..." rows="1" data-emoji-input="" data-autosize="true" style="overflow: hidden; overflow-wrap: break-word; resize: none; height: 47px;" />
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
                                    <button id="sendButton" class="btn btn-icon btn-primary rounded-circle ms-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                        <!-- Chat: Form -->
                    </div>
                    <!-- Chat: Footer -->
                </div>

            </div>
    </div>
    </main>

    <!-- Chat -->

    </div>
    <!-- Layout -->
    <script URL_ROOT="<?= $urlRoot ?>" src="<?= $urlRoot ?>script.js"></script>
    <script src="<?= $urlRoot ?>vendor.js"></script>
    <script src="<?= $urlRoot ?>template.js"></script>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

</body>