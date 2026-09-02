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

        window.location.href =
            "admin-login.html";

        return;
    }

    console.log(
        "✅ Supabase client is ready."
    );


    // ======================================
    // CHECK ADMIN SESSION
    // ======================================

    let sessionData;

    try {

        sessionData =
            await window.supabaseClient
                .auth
                .getSession();

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
    // GET PAGE ELEMENTS
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

            logoutButton.disabled =
                true;

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


        } catch (error) {

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
                    .from(
                        "student_applications"
                    )
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
                    "<p>Could not load applications.</p>";

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
                    "<p>No student applications found.</p>";

                return;
            }


            // ==================================
            // CLEAR CONTAINER
            // ==================================

            applicationsContainer.innerHTML =
                "";


            // ==================================
            // DISPLAY APPLICATIONS
            // ==================================

            applications.forEach(
                function (application) {

                    // --------------------------
                    // APPLICATION CARD
                    // --------------------------

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "application-card";
                        // --------------------------
                    // STUDENT NAME
                    // --------------------------

                    const title =
                        document.createElement(
                            "h3"
                        );


                    title.textContent = [
                        application.first_name,
                        application.father_name,
                        application.grandfather_name
                    ]
                        .filter(Boolean)
                        .join(" ") ||
                        "Unnamed Student";


                    card.appendChild(
                        title
                    );


                    // --------------------------
                    // EMAIL
                    // --------------------------

                    const emailText =
                        document.createElement(
                            "p"
                        );


                    const emailLabel =
                        document.createElement(
                            "strong"
                        );


                    emailLabel.textContent =
                        "Email: ";


                    emailText.appendChild(
                        emailLabel
                    );


                    emailText.appendChild(
                        document.createTextNode(
                            application.email ||
                            "N/A"
                        )
                    );


                    card.appendChild(
                        emailText
                    );


                    // --------------------------
                    // PHONE
                    // --------------------------

                    const phoneText =
                        document.createElement(
                            "p"
                        );


                    const phoneLabel =
                        document.createElement(
                            "strong"
                        );


                    phoneLabel.textContent =
                        "Phone: ";


                    phoneText.appendChild(
                        phoneLabel
                    );


                    phoneText.appendChild(
                        document.createTextNode(
                            application.student_phone ||
                            "N/A"
                        )
                    );


                    card.appendChild(
                        phoneText
                    );


                    // --------------------------
                    // APPLYING GRADE
                    // --------------------------

                    const gradeText =
                        document.createElement(
                            "p"
                        );


                    const gradeLabel =
                        document.createElement(
                            "strong"
                        );


                    gradeLabel.textContent =
                        "Applying Grade: ";


                    gradeText.appendChild(
                        gradeLabel
                    );


                    gradeText.appendChild(
                        document.createTextNode(
                            application.applying_grade ||
                            "N/A"
                        )
                    );


                    card.appendChild(
                        gradeText
                    );


                    // --------------------------
                    // PREVIOUS SCHOOL
                    // --------------------------

                    const schoolText =
                        document.createElement(
                            "p"
                        );


                    const schoolLabel =
                        document.createElement(
                            "strong"
                        );


                    schoolLabel.textContent =
                        "Previous School: ";
                        schoolText.appendChild(
                        schoolLabel
                    );


                    schoolText.appendChild(
                        document.createTextNode(
                            application.previous_school ||
                            "N/A"
                        )
                    );


                    card.appendChild(
                        schoolText
                    );


                    // --------------------------
                    // APPLICATION STATUS
                    // --------------------------

                    const statusText =
                        document.createElement(
                            "p"
                        );


                    const statusLabel =
                        document.createElement(
                            "strong"
                        );


                    statusLabel.textContent =
                        "Status: ";


                    statusText.appendChild(
                        statusLabel
                    );


                    statusText.appendChild(
                        document.createTextNode(
                            application.application_status ||
                            "Pending"
                        )
                    );


                    card.appendChild(
                        statusText
                    );


                    // --------------------------
                    // SUBMITTED DATE
                    // --------------------------

                    const submittedText =
                        document.createElement(
                            "p"
                        );


                    const submittedLabel =
                        document.createElement(
                            "strong"
                        );


                    submittedLabel.textContent =
                        "Submitted: ";


                    submittedText.appendChild(
                        submittedLabel
                    );


                    submittedText.appendChild(
                        document.createTextNode(
                            formatDate(
                                application.created_at
                            )
                        )
                    );


                    card.appendChild(
                        submittedText
                    );


                    // --------------------------
                    // VIEW APPLICATION BUTTON
                    // --------------------------

                    const viewButton =
                        document.createElement(
                            "button"
                        );


                    viewButton.type =
                        "button";


                    viewButton.className =
                        "view-application-button";


                    viewButton.textContent =
                        "View Application";


                    viewButton.dataset.id =
                        application.id || "";


                    viewButton.addEventListener(
                        "click",
                        function () {

                            viewApplication(
                                application.id
                            );

                        }
                    );


                    card.appendChild(
                        viewButton
                    );


                    // --------------------------
                    // ADD CARD
                    // --------------------------

                    applicationsContainer.appendChild(
                        card
                    );

                }
            );


            console.log(
                "✅ Applications loaded:",
                applications.length
            );


        } catch (error) {

            console.error(
                "Unexpected application loading error:",
                error
            );


            if (applicationsContainer) {applicationsContainer.innerHTML =
                    "<p>Something went wrong while loading applications.</p>";
            }
        }
    }


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
                        .from(
                            "student_applications"
                        )
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


                await showApplicationDetails(
                    application
                );


            } catch (error) {

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
    // SHOW FULL APPLICATION DETAILS
    // ======================================

    async function showApplicationDetails(
        application
    ) {

        console.log(
            "Showing full application details:",
            application.id
        );


        // --------------------------------------
        // DOCUMENT LIST
        // --------------------------------------

        const documents = [

            {
                name:
                    "📄 Student Transcript",

                path:
                    application.transcript_url
            },

            {
                name:
                    "🪪 Student ID - Front",

                path:
                    application.student_id_front_url
            },

            {
                name:
                    "🪪 Student ID - Back",

                path:
                    application.student_id_back_url
            },

            {
                name:
                    "🪪 Parent ID - Front",

                path:
                    application.parent_id_front_url
            },

            {
                name:
                    "🪪 Parent ID - Back",

                path:
                    application.parent_id_back_url
            },

            {
                name:
                    "💳 Payment Receipt",

                path:
                    application.payment_receipt_url
            }

        ];


        const documentLinks = [];


        // --------------------------------------
        // CREATE SECURE DOCUMENT LINKS
        // --------------------------------------

        for (
            const document of documents
        ) {

            // ----------------------------------
            // NOT UPLOADED
            // ----------------------------------

            if (!document.path) {

                documentLinks.push(`

                    <div class="document-item">
                    <span>
                            ${escapeHTML(
                                document.name
                            )}
                        </span>

                        <span>
                            ❌ Not uploaded
                        </span>

                    </div>

                );

                continue;
            }


            // ----------------------------------
            // CREATE SIGNED URL
            // ----------------------------------

            try {

                const {
                    data,
                    error
                } =
                    await window.supabaseClient
                        .storage
                        .from(
                            "student-documents"
                        )
                        .createSignedUrl(
                            document.path,
                            3600
                        );


                // ----------------------------------
                // SIGNED URL ERROR
                // ----------------------------------

                if (
                    error ||
                    !data ||
                    !data.signedUrl
                ) {

                    console.error(
                        "Could not create document link:",
                        document.name,
                        error
                    );


                    documentLinks.push(

                        <div class="document-item">

                            <span>
                                ${escapeHTML(
                                    document.name
                                )}
                            </span>

                            <span>
                                ⚠️ Cannot open
                            </span>

                        </div>

                    );


                    continue;
                }


                // ----------------------------------
                // DOCUMENT AVAILABLE
                // ----------------------------------

                documentLinks.push(

                    <div class="document-item">

                        <span>
                            ${escapeHTML(
                                document.name
                            )}
                        </span>

                        <a
                            href="${escapeHTML(
                                data.signedUrl
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="document-button"
                        >
                            View Document
                        </a>

                    </div>

                );


            } catch (error) {

                console.error(
                    "Document link error:",
                    document.name,
                    error
                );


                documentLinks.push(

                    <div class="document-item">

                        <span>
                            ${escapeHTML(
                                document.name
                            )}
                        </span>

                        <span>
                            ⚠️ Error
                        </span>

                    </div>

                );
            }
        }


        // ======================================
        // REMOVE OLD MODAL
        // ======================================

        const oldModal =
            document.querySelector(
                ".application-modal"
            );


        if (oldModal) {

            oldModal.remove();
        }


        // ======================================
        // CREATE MODAL
        // ======================================

        const modal =
            document.createElement(
                "div"
            );


        modal.className =
            "application-modal";


        modal.innerHTML =
        <div class="application-details-box">


                <!-- HEADER -->

                <div class="application-details-header">

                    <h2>
                        Student Application Details
                    </h2>

                    <button
                        type="button"
                        class="close-application-modal"
                        aria-label="Close"
                    >
                        ✕
                    </button>

                </div>


                <!-- PERSONAL INFORMATION -->

                <div class="details-section">

                    <h3>
                        👤 Personal Information
                    </h3>


                    <div class="details-grid">


                        <div class="detail-item">

                            <strong>
                                First Name:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.first_name ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Father Name:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.father_name ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Grandfather Name:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.grandfather_name ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Gender:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.gender ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Date of Birth:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.date_of_birth ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Email:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.email ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Student Phone:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.student_phone ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">
                        <strong>
                                Parent Phone:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.parent_phone ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Emergency Phone:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.emergency_phone ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Nationality:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.nationality ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                    </div>

                </div>


                <!-- ADDRESS INFORMATION -->

                <div class="details-section">

                    <h3>
                        📍 Address Information
                    </h3>


                    <div class="details-grid">


                        <div class="detail-item">

                            <strong>
                                Region:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.region ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Zone:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.zone ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Woreda:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.woreda ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Kebele:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.kebele ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                    </div>

                </div>


                <!-- EDUCATION INFORMATION -->

                <div class="details-section">

                    <h3>
                        🎓 Education Information
                    </h3>


                    <div class="details-grid">


                        <div class="detail-item">

                            <strong>
                                Applying Grade:
                            </strong>
                            <span>
                                ${escapeHTML(
                                    application.applying_grade ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Previous School:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.previous_school ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                School Address:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.previous_school_address ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Year Completed:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.year_completed ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Average Result:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.average_result ??
                                    "N/A"
                                )}
                            </span>

                        </div>


                    </div>

                </div>


                <!-- APPLICATION STATUS -->

                <div class="details-section">

                    <h3>
                        📋 Application Status
                    </h3>


                    <div class="details-grid">


                        <div class="detail-item">

                            <strong>
                                Status:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.application_status ||
                                    "Pending"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Application ID:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    application.id ||
                                    "N/A"
                                )}
                            </span>

                        </div>


                        <div class="detail-item">

                            <strong>
                                Submitted:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    formatDate(
                                        application.created_at
                                    )
                                )}
                            </span>

                        </div>


                    </div>

                </div>


                <!-- SUBMITTED DOCUMENTS -->

                <div class="details-section">
                <h3>
                        📂 Submitted Documents
                    </h3>


                    <div class="documents-list">

                        ${documentLinks.join("")}

                    </div>

                </div>


                <!-- FOOTER -->

                <div class="application-details-footer">

                    <button
                        type="button"
                        class="close-application-modal"
                    >
                        Close
                    </button>

                </div>


            </div>

        `);


        // ======================================
        // ADD MODAL TO PAGE
        // ======================================

        document.body.appendChild(
            modal
        );


        // ======================================
        // CLOSE BUTTONS
        // ======================================

        const closeButtons =
            modal.querySelectorAll(
                ".close-application-modal"
            );


        closeButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        modal.remove();

                    }
                );

            }
        );


        // ======================================
        // CLOSE OUTSIDE MODAL
        // ======================================

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    modal.remove();
                }

            }
        );


        // ======================================
        // CLOSE WITH ESC KEY
        // ======================================

        function closeWithEscape(
            event
        ) {

            if (
                event.key === "Escape"
            ) {

                modal.remove();

                document.removeEventListener(
                    "keydown",
                    closeWithEscape
                );
            }
        }


        document.addEventListener(
            "keydown",
            closeWithEscape
        );

    }


    // ======================================
    // ESCAPE HTML
    // ======================================

    function escapeHTML(value) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );
    }


    // ======================================
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

});
