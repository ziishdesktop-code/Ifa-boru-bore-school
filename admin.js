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

        } catch (error) {

            console.error(
                "❌ Unexpected error while loading applications:",
                error
            );

            applicationsContainer.innerHTML =
                "<p>Something went wrong while loading applications.</p>";
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
// SHOW FULL APPLICATION DETAILS
// ======================================

async function showApplicationDetails(application) {

    console.log(
        "Showing full application details:",
        application.id
    );

    // --------------------------------------
    // CREATE SECURE DOCUMENT LINKS
    // --------------------------------------

    const documents = [
        {
            name: "📄 Student Transcript",
            path: application.transcript_url
        },
        {
            name: "🪪 Student ID - Front",
            path: application.student_id_front_url
        },
        {
            name: "🪪 Student ID - Back",
            path: application.student_id_back_url
        },
        {
            name: "🪪 Parent ID - Front",
            path: application.parent_id_front_url
        },
        {
            name: "🪪 Parent ID - Back",
            path: application.parent_id_back_url
        },
        {
            name: "💳 Payment Receipt",
            path: application.payment_receipt_url
        }
    ];

    const documentLinks = [];

    for (const document of documents) {

    // --------------------------------------
    // DOCUMEN NOT UPLOADED 
    // --------------------------------------   
    
    if (!document.path) {

    documentLinks.push(
        <div class="document-item">
            <span>${escapeHTML(document.name)}</span>
            <span>❌ Not uploaded</span>
        </div>
    );

    continue;
}
        
        // --------------------------------------
        // CREATE SIGNED URL
        // --------------------------------------

        try {

            const {
                data,
                error
            } = await window.supabaseClient
                .storage
                .from("student-documents")
                .createSignedUrl(
                    document.path,
                    3600
                );

            // --------------------------------------
            // SIGNED URL FAILED
            // --------------------------------------

            if (error  !data  !data.signedUrl) {

                console.error(
                    "Could not create document link:",
                    document.name,
                    error
                );

                documentLinks.push(
                    <div class="document-item">
                        <span>${escapeHTML(document.name)}</span>
                        <span>⚠️ Cannot open</span>
                    </div>
                );

                continue;
            }

            // --------------------------------------
            // DOCUMENT LINK CREATED
            // --------------------------------------

            documentLinks.push(
                <div class="document-item">

                    <span>
                        ${escapeHTML(document.name)}
                    </span>

                    <a
                        href="${escapeHTML(data.signedUrl)}"
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
                    <span>${escapeHTML(document.name)}</span>
                    <span>⚠️ Error</span>
                </div>
            );
        }
    }

    // --------------------------------------
    // CREATE DETAILS MODAL
    // --------------------------------------

    const modal = document.createElement("div");

    modal.className = "application-modal";

    modal.innerHTML = `
        <div class="application-details-box">
[9/2/2026 5:02 AM] Jùn Hǔ: <div class="application-details-header">

                <h2>
                    Student Application Details
                </h2>

                <button
                    type="button"
                    class="close-application-modal"
                >
                    ✕
                </button>

            </div>


            <!-- PERSONAL INFORMATION -->

            <div class="details-section">

                <h3>👤 Personal Information</h3>

                <div class="details-grid">

                    <div class="detail-item">
                        <strong>First Name:</strong>
                        <span>
                            ${escapeHTML(application.first_name || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Father Name:</strong>
                        <span>
                            ${escapeHTML(application.father_name || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Grandfather Name:</strong>
                        <span>
                            ${escapeHTML(application.grandfather_name || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Gender:</strong>
                        <span>
                            ${escapeHTML(application.gender || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Date of Birth:</strong>
                        <span>
                            ${escapeHTML(application.date_of_birth || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Email:</strong>
                        <span>
                            ${escapeHTML(application.email || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Student Phone:</strong>
                        <span>
                            ${escapeHTML(application.student_phone || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Parent Phone:</strong>
                        <span>
                            ${escapeHTML(application.parent_phone || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Emergency Phone:</strong>
                        <span>
                            ${escapeHTML(application.emergency_phone || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Nationality:</strong>
                        <span>
                            ${escapeHTML(application.nationality || "N/A")}
                        </span>
                    </div>

                </div>

            </div>


            <!-- ADDRESS -->

            <div class="details-section">

                <h3>📍 Address Information</h3>

                <div class="details-grid">

                    <div class="detail-item">
                        <strong>Region:</strong>
                        <span>
                            ${escapeHTML(application.region || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Zone:</strong>
                        <span>
                            ${escapeHTML(application.zone || "N/A")}
                        </span>
                    </div>
                    <div class="detail-item">
                        <strong>Woreda:</strong>
                        <span>
                            ${escapeHTML(application.woreda || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Kebele:</strong>
                        <span>
                            ${escapeHTML(application.kebele || "N/A")}
                        </span>
                    </div>

                </div>

            </div>


            <!-- EDUCATION -->

            <div class="details-section">

                <h3>🎓 Education Information</h3>

                <div class="details-grid">

                    <div class="detail-item">
                        <strong>Applying Grade:</strong>
                        <span>
                            ${escapeHTML(application.applying_grade || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Previous School:</strong>
                        <span>
                            ${escapeHTML(application.previous_school || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>School Address:</strong>
                        <span>
                            ${escapeHTML(application.previous_school_address || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Year Completed:</strong>
                        <span>
                            ${escapeHTML(application.year_completed || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Average Result:</strong>
                        <span>
                            ${escapeHTML(application.average_result || "N/A")}
                        </span>
                    </div>

                </div>

            </div>


            <!-- APPLICATION STATUS -->

            <div class="details-section">

                <h3>📋 Application Status</h3>

                <div class="details-grid">

                    <div class="detail-item">
                        <strong>Status:</strong>
                        <span>
                            ${escapeHTML(application.application_status || "Pending")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Application ID:</strong>
                        <span>
                            ${escapeHTML(application.id || "N/A")}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Submitted:</strong>
                        <span>
                            ${formatDate(application.created_at)}
                        </span>
                    </div>

                </div>

            </div>


            <!-- DOCUMENTS -->

            <div class="details-section">

                <h3>📂 Submitted Documents</h3>

                <div class="documents-list">

                    ${documentLinks.join("")}

                </div>

            </div>


            <!-- CLOSE BUTTON -->

            <div class="application-details-footer">

                <button
                    type="button"
                    class="close-application-modal"
                >
                    Close
                </button>

            </div>

        </div>
    `;

    // --------------------------------------
    // ADD MODAL TO PAGE
    // --------------------------------------

    document.body.appendChild(modal);

    // --------------------------------------
    // CLOSE MODAL
    // --------------------------------------
        const closeButtons =
        modal.querySelectorAll(
            ".close-application-modal"
        );

    closeButtons.forEach(button => {

        button.addEventListener("click", () => {

            modal.remove();

        });

    });

    // --------------------------------------
    // CLOSE WHEN CLICKING OUTSIDE
    // --------------------------------------

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {

            modal.remove();

        }

    });

}


    // --------------------------------------
    // CREATE DETAILS PANEL
    // --------------------------------------

    const oldModal =
        document.getElementById(
            "applicationDetailsModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");

    modal.id =
        "applicationDetailsModal";

    modal.className =
        "application-details-modal";


    modal.innerHTML = 

        <div class="application-details-box">

            <button
                type="button"
                id="closeApplicationDetails"
                class="close-application-button"
            >
                ✕
            </button>


            <h2>
                📋 Student Application Details
            </h2>


            <!-- ==============================
                 STUDENT INFORMATION
            =============================== -->
                <div class="details-section">

                <h3>👤 Student Information</h3>

                <p>
                    <strong>Full Name:</strong><br>
                    ${escapeHTML(
                        (application.first_name || "") +
                        " " +
                        (application.father_name || "") +
                        " " +
                        (application.grandfather_name || "")
                    )}
                </p>

                <p>
                    <strong>Gender:</strong>
                    ${escapeHTML(
                        application.gender || "N/A"
                    )}
                </p>

                <p>
                    <strong>Date of Birth:</strong>
                    ${escapeHTML(
                        application.date_of_birth || "N/A"
                    )}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHTML(
                        application.email || "N/A"
                    )}
                </p>

                <p>
                    <strong>Student Phone:</strong>
                    ${escapeHTML(
                        application.student_phone || "N/A"
                    )}
                </p>

                <p>
                    <strong>Parent Phone:</strong>
                    ${escapeHTML(
                        application.parent_phone || "N/A"
                    )}
                </p>

                <p>
                    <strong>Emergency Phone:</strong>
                    ${escapeHTML(
                        application.emergency_phone || "N/A"
                    )}
                </p>

                <p>
                    <strong>Nationality:</strong>
                    ${escapeHTML(
                        application.nationality || "N/A"
                    )}
                </p>

            </div>


            <!-- ==============================
                 ADDRESS
            =============================== -->

            <div class="details-section">

                <h3>📍 Address</h3>

                <p>
                    <strong>Region:</strong>
                    ${escapeHTML(
                        application.region || "N/A"
                    )}
                </p>

                <p>
                    <strong>Zone:</strong>
                    ${escapeHTML(
                        application.zone || "N/A"
                    )}
                </p>

                <p>
                    <strong>Woreda:</strong>
                    ${escapeHTML(
                        application.woreda || "N/A"
                    )}
                </p>

                <p>
                    <strong>Kebele:</strong>
                    ${escapeHTML(
                        application.kebele || "N/A"
                    )}
                </p>

            </div>


            <!-- ==============================
                 EDUCATION
            =============================== -->

            <div class="details-section">

                <h3>🎓 Education</h3>

                <p>
                    <strong>Applying Grade:</strong>
                    ${escapeHTML(
                        application.applying_grade || "N/A"
                    )}
                </p>

                <p>
                    <strong>Previous School:</strong>
                    ${escapeHTML(
                        application.previous_school || "N/A"
                    )}
                </p>

                <p>
                    <strong>Previous School Address:</strong>
                    ${escapeHTML(
                        application.previous_school_address || "N/A"
                    )}
                </p>

                <p>
                    <strong>Year Completed:</strong>
                    ${escapeHTML(
                        application.year_completed ?? "N/A"
                    )}
                </p>
                  <p>
                    <strong>Average Result:</strong>
                    ${escapeHTML(
                        application.average_result ?? "N/A"
                    )}
                </p>

            </div>


            <!-- ==============================
                 APPLICATION STATUS
            =============================== -->

            <div class="details-section">

                <h3>📌 Application Status</h3>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(
                        application.application_status ||
                        "Pending"
                    )}
                </p>

                <p>
                    <strong>Submitted:</strong>
                    ${escapeHTML(
                        formatDate(
                            application.created_at
                        )
                    )}
                </p>

            </div>


            <!-- ==============================
                 DOCUMENTS
            =============================== -->

            <div class="details-section">

                <h3>📂 Submitted Documents</h3>

                <div class="documents-list">

                    ${documentLinks.join("")}

                </div>

            </div>


            <!-- ==============================
                 CLOSE BUTTON
            =============================== -->

            <button
                type="button"
                id="closeApplicationDetailsBottom"
                class="close-application-button-bottom"
            >
                Close
            </button>

        </div>

    ;


    document.body.appendChild(modal);


    // --------------------------------------
    // CLOSE MODAL
    // --------------------------------------

    const closeButton =
        document.getElementById(
            "closeApplicationDetails"
        );

    const closeBottomButton =
        document.getElementById(
            "closeApplicationDetailsBottom"
        );


    function closeModal() {

        const modalToRemove =
            document.getElementById(
                "applicationDetailsModal"
            );

        if (modalToRemove) {
            modalToRemove.remove();
        }
    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );
    }


    if (closeBottomButton) {

        closeBottomButton.addEventListener(
            "click",
            closeModal
        );
    }


    // --------------------------------------
    // CLOSE WHEN CLICKING OUTSIDE
    // --------------------------------------

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {
                closeModal();
            }

        }
    );

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
            .replace(/'/g, "&#039;");
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
});
