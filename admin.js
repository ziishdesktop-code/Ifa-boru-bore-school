// ==========================================
// IFA BORU BORE SCHOOL
// ADMIN DASHBOARD
// AUTHENTICATION + APPLICATION MANAGEMENT
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("====================================");
    console.log("ADMIN DASHBOARD LOADED");
    console.log("====================================");


    // ======================================
    // SUPABASE CHECK
    // ======================================

    if (!window.supabaseClient) {

        console.error(
            "❌ Supabase client is not available."
        );

        window.location.href = "admin-login.html";

        return;
    }

    console.log("✅ Supabase client is ready.");


    // ======================================
    // CHECK ADMIN SESSION
    // ======================================

    let sessionData;

    try {

        sessionData =
            await window.supabaseClient.auth.getSession();

    } catch (error) {

        console.error(
            "Session check failed:",
            error
        );

        window.location.href =
            "admin-login.html";

        return;
    }


    const {
        data,
        error: sessionError
    } = sessionData;


    if (sessionError) {

        console.error(
            "Session error:",
            sessionError
        );

        window.location.href =
            "admin-login.html";

        return;
    }


    // ======================================
    // USER NOT LOGGED IN
    // ======================================

    if (
        !data ||
        !data.session ||
        !data.session.user
    ) {

        console.warn(
            "No authenticated user."
        );

        window.location.href =
            "admin-login.html";

        return;
    }


    const user =
        data.session.user;


    console.log(
        "Authenticated user:",
        user.email
    );


    // ======================================
    // ADMIN EMAIL
    // ======================================
    //
    // CHANGE THIS TO YOUR REAL ADMIN EMAIL
    //

    const ADMIN_EMAIL =
        "ziishdesktop@gmail.com";


    // ======================================
    // CHECK ADMIN EMAIL
    // ======================================

    if (
        !user.email ||
        user.email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        console.warn(
            "❌ User is not authorized as admin."
        );


        await window.supabaseClient
            .auth
            .signOut();


        alert(
            "You do not have permission to access the Admin Dashboard."
        );


        window.location.href =
            "admin-login.html";

        return;
    }


    console.log(
        "✅ ADMIN ACCESS VERIFIED"
    );


    // ======================================
    // GET APPLICATION CONTAINER
    // ======================================

    const applicationsContainer =
        document.getElementById(
            "applicationsContainer"
        );


    if (!applicationsContainer) {

        console.warn(
            "applicationsContainer was not found."
        );

    }


    // ======================================
    // GET LOGOUT BUTTON
    // ======================================

    const logoutButton =
        document.getElementById(
            "adminLogoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutAdmin
        );

    }


    // ======================================
    // LOAD APPLICATIONS
    // ======================================

    await loadApplications();


    // ======================================
    // LOGOUT ADMIN
    // ======================================

    async function logoutAdmin() {

        if (logoutButton) {

            logoutButton.disabled = true;

            logoutButton.textContent =
                "Logging out...";
        }


        try {
            const {
                error
            } =
                await window.supabaseClient
                    .auth
                    .signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Could not log out. Please try again."
                );


                if (logoutButton) {

                    logoutButton.disabled =
                        false;

                    logoutButton.textContent =
                        "Logout";
                }

                return;
            }


            console.log(
                "✅ Admin logged out."
            );


            window.location.href =
                "admin-login.html";

        }

        catch (error) {

            console.error(
                "Unexpected logout error:",
                error
            );


            alert(
                "Something went wrong while logging out."
            );


            if (logoutButton) {

                logoutButton.disabled =
                    false;

                logoutButton.textContent =
                    "Logout";
            }

        }

    }


    // ======================================
    // LOAD APPLICATIONS
    // ======================================

    async function loadApplications() {

        console.log(
            "Loading student applications..."
        );


        if (!applicationsContainer) {

            return;
        }


        applicationsContainer.innerHTML =
            "<p>Loading applications...</p>";


        try {

            const {
                data: applications,
                error
            } =
                await window.supabaseClient
                    .from("student_applications")
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            // ==================================
            // DATABASE ERROR
            // ==================================

            if (error) {

                console.error(
                    "❌ Application loading failed."
                );

                console.error(
                    "Message:",
                    error.message
                );

                console.error(
                    "Details:",
                    error.details
                );

                console.error(
                    "Hint:",
                    error.hint
                );

                console.error(
                    "Code:",
                    error.code
                );


                applicationsContainer.innerHTML =
                    `<p>Could not load applications.</p>`;

                return;
            }


            // ==================================
            // NO APPLICATIONS
            // ==================================

            if (
                !applications ||
                applications.length === 0
            ) {

                console.log(
                    "No applications found."
                );


                applicationsContainer.innerHTML =
                    `<p>No student applications found.</p>`;

                return;
            }


            // ==================================
            // CLEAR CONTAINER
            // ==================================

            applicationsContainer.innerHTML =
                "";


    // ------------------------------------------
    // Display applications
    // ------------------------------------------

    applicationsContainer.innerHTML = "";

    applications.forEach(function (application) {

    // ------------------------------------------
    // Create application card
    // ------------------------------------------

    const card = document.createElement("div");

    card.className = "application-card";


    // ------------------------------------------
    // Student name
    // ------------------------------------------

    const title = document.createElement("h3");

    title.textContent =
        (application.first_name || "") + " " +
        (application.father_name || "") + " " +
        (application.grandfather_name || "");

    card.appendChild(title);


    // ------------------------------------------
    // Email
    // ------------------------------------------

    const emailText = document.createElement("p");

    const emailLabel = document.createElement("strong");

    emailLabel.textContent = "Email: ";

    emailText.appendChild(emailLabel);

    emailText.appendChild(
        document.createTextNode(
            application.email || "N/A"
        )
    );

    card.appendChild(emailText);


    // ------------------------------------------
    // Phone
    // ------------------------------------------

    const phoneText = document.createElement("p");

    const phoneLabel = document.createElement("strong");

    phoneLabel.textContent = "Phone: ";

    phoneText.appendChild(phoneLabel);

    phoneText.appendChild(
        document.createTextNode(
            application.student_phone || "N/A"
        )
    );

    card.appendChild(phoneText);


    // ------------------------------------------
    // Applying Grade
    // ------------------------------------------

    const gradeText = document.createElement("p");

    const gradeLabel = document.createElement("strong");

    gradeLabel.textContent = "Applying Grade: ";

    gradeText.appendChild(gradeLabel);

    gradeText.appendChild(
        document.createTextNode(
            application.applying_grade || "N/A"
        )
    );

    card.appendChild(gradeText);


    // ------------------------------------------
    // Previous School
    // ------------------------------------------

    const schoolText = document.createElement("p");

    const schoolLabel = document.createElement("strong");

    schoolLabel.textContent = "Previous School: ";

    schoolText.appendChild(schoolLabel);

    schoolText.appendChild(
        document.createTextNode(
            application.previous_school || "N/A"
        )
    );

    card.appendChild(schoolText);


    // ------------------------------------------
    // Application Status
    // ------------------------------------------

    const statusText = document.createElement("p");

    const statusLabel = document.createElement("strong");

    statusLabel.textContent = "Status: ";

    statusText.appendChild(statusLabel);

    statusText.appendChild(
        document.createTextNode(
            application.application_status || "N/A"
        )
    );

    card.appendChild(statusText);


    // ------------------------------------------
    // Submitted date
    // ------------------------------------------

    const submittedText = document.createElement("p");

    const submittedLabel = document.createElement("strong");

    submittedLabel.textContent = "Submitted: ";

    submittedText.appendChild(submittedLabel);

    submittedText.appendChild(
        document.createTextNode(
            formatDate(application.created_at)
        )
    );

    card.appendChild(submittedText);


    // ------------------------------------------
    // View Application button
    // ------------------------------------------

    const viewButton = document.createElement("button");

    viewButton.type = "button";

    viewButton.className = "view-application-button";

    viewButton.textContent = "View Application";

    // Store application ID safely
    viewButton.dataset.id = application.id;


    // Button click
    viewButton.addEventListener("click", function () {

        viewApplication(application.id);

    });


    card.appendChild(viewButton);


    // ------------------------------------------
    // Add card to page
    // ------------------------------------------

    applicationsContainer.appendChild(card);

});


console.log(
    "✅ Applications loaded:",
    applications.length
);


    // ======================================
    // VIEW APPLICATION
    // ======================================

    window.viewApplication =
        async function (applicationId) {

            console.log(
                "Opening application:",
                applicationId
            );


            if (!applicationId) {

                alert(
                    "Application ID is missing."
                );

                return;
            }


            try {

                const {
                    data: application,
                    error
                } =
                    await window.supabaseClient
                        .from("student_applications")
                        .select("*")
                        .eq(
                            "id",
                            applicationId
                        )
                        .single();


                if (error) {

                    console.error(
                        "Could not load application:",
                        error
                    );


                    alert(
                        "Could not load this application."
                    );

                    return;
                }


                if (!application) {

                    alert(
                        "Application was not found."
                    );

                    return;
                }


                showApplicationDetails(
                    application
                );

            }

            catch (error) {

                console.error(
                    "Unexpected application error:",
                    error
                );


                alert(
                    "Something went wrong."
                );

            }

        };


    // ======================================
    // SHOW APPLICATION DETAILS
    // ======================================

    function showApplicationDetails(
        application
    ) {

        const details =
            `
            APPLICATION DETAILS

            Name:
            ${application.first_name || ""}
            ${application.father_name || ""}
            ${application.grandfather_name || ""}

            Gender:
            ${application.gender || "N/A"}

            Date of Birth:
            ${application.date_of_birth || "N/A"}

            Email:
            ${application.email || "N/A"}

            Student Phone:
            ${application.student_phone || "N/A"}

            Parent Phone:
            ${application.parent_phone || "N/A"}

            Emergency Phone:
            ${application.emergency_phone || "N/A"}

            Nationality:
            ${application.nationality || "N/A"}

            Region:
            ${application.region || "N/A"}

            Zone:
            ${application.zone || "N/A"}

            Woreda:
            ${application.woreda || "N/A"}

            Kebele:
            ${application.kebele || "N/A"}

            Applying Grade:
            ${application.applying_grade || "N/A"}

            Previous School:
            ${application.previous_school || "N/A"}

            Previous School Address:
            ${application.previous_school_address || "N/A"}

            Year Completed:
            ${application.year_completed || "N/A"}

            Average Result:
            ${application.average_result ?? "N/A"}

            Application Status:
            ${application.application_status || "Pending"}
           Created:
            ${formatDate(application.created_at)}
            `;


        alert(details);

    }


    // ======================================
    // ESCAPE HTML
    // ======================================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
    }    // ======================================
    // FORMAT DATE
    // ======================================

    function formatDate(value) {

        if (!value) {

            return "N/A";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "N/A";
        }


        return date.toLocaleString();

    }
