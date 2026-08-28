// ==========================================
// IFA BORU BORE SCHOOL
// STUDENT LOGIN
// SUPABASE AUTHENTICATION
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("====================================");
    console.log("STUDENT LOGIN PAGE LOADED");
    console.log("====================================");


    // ======================================
    // CHECK SUPABASE
    // ======================================

    if (!window.supabaseClient) {

        console.error(
            "❌ Supabase client was not found."
        );

        showMessage(
            "Connection error. Please try again later."
        );

        return;
    }

    console.log("✅ Supabase client is ready.");


    // ======================================
    // GET LOGIN FORM
    // ======================================

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");


    if (!loginForm) {

        console.error(
            "❌ loginForm was not found."
        );

        return;
    }


    if (!emailInput || !passwordInput) {

        console.error(
            "❌ Login input fields were not found."
        );

        return;
    }


    // ======================================
    // CHECK EXISTING SESSION
    // ======================================

    try {

        const {
            data,
            error
        } =
            await window.supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Session check error:",
                error
            );

            return;
        }


        if (
            data &&
            data.session
        ) {

            console.log(
                "✅ Student is already logged in."
            );

            window.location.href =
                "student-dashboard.html";

            return;
        }

    }

    catch (error) {

        console.error(
            "Unexpected session error:",
            error
        );

    }


    // ======================================
    // LOGIN
    // ======================================

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "Student login started..."
            );


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            // ==================================
            // VALIDATION
            // ==================================

            if (!email) {

                showMessage(
                    "Please enter your email address."
                );

                emailInput.focus();

                return;
            }


            if (!password) {

                showMessage(
                    "Please enter your password."
                );

                passwordInput.focus();

                return;
            }


            // ==================================
            // GET BUTTON
            // ==================================

            const loginButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );


            if (loginButton) {

                loginButton.disabled =
                    true;

                loginButton.textContent =
                    "Logging in...";
            }


            showMessage(
                "Signing in..."
            );


            // ==================================
            // SUPABASE LOGIN
            // ==================================

            try {
               const {
                    data,
                    error
                } =
                    await window.supabaseClient
                        .auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                // ==================================
                // CHECK ERROR
                // ==================================

                if (error) {

                    console.error(
                        "❌ Student login failed:",
                        error
                    );

                    showMessage(
                        getLoginError(error)
                    );


                    if (loginButton) {

                        loginButton.disabled =
                            false;

                        loginButton.textContent =
                            "Login";
                    }

                    return;
                }


                // ==================================
                // CHECK SESSION
                // ==================================

                if (
                    !data ||
                    !data.session
                ) {

                    console.error(
                        "No login session returned."
                    );

                    showMessage(
                        "Login could not be completed. Please try again."
                    );


                    if (loginButton) {

                        loginButton.disabled =
                            false;

                        loginButton.textContent =
                            "Login";
                    }

                    return;
                }


                // ==================================
                // LOGIN SUCCESS
                // ==================================

                console.log(
                    "===================================="
                );

                console.log(
                    "✅ STUDENT LOGIN SUCCESSFUL"
                );

                console.log(
                    "Student:",
                    data.user.email
                );

                console.log(
                    "User ID:",
                    data.user.id
                );

                console.log(
                    "===================================="
                );


                showMessage(
                    "Login successful! Opening your dashboard..."
                );


                // ==================================
                // REDIRECT
                // ==================================

                setTimeout(
                    function () {

                        window.location.href =
                            "student-dashboard.html";

                    },
                    700
                );

            }

            catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );


                showMessage(
                    "Something went wrong. Please try again."
                );


                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "Login";
                }

            }

        }
    );


    // ======================================
    // LOGIN ERROR
    // ======================================

    function getLoginError(error) {

        const message =
            (
                error.message ||
                ""
            ).toLowerCase();


        if (
            message.includes(
                "invalid login credentials"
            )
        ) {

            return "Incorrect email or password.";
        }


        if (
            message.includes(
                "email not confirmed"
            )
        ) {
             return (
                "Please confirm your email address before logging in."
            );
        }


        if (
            message.includes(
                "too many requests"
            )
        ) {

            return (
                "Too many login attempts. Please wait and try again."
            );
        }


        return (
            error.message ||
            "Login failed. Please try again."
        );

    }


    // ======================================
    // SHOW MESSAGE
    // ======================================

    function showMessage(message) {

        let messageElement =
            document.getElementById(
                "loginMessage"
            );


        // ----------------------------------
        // Create message element if missing
        // ----------------------------------

        if (!messageElement) {

            messageElement =
                document.createElement("p");

            messageElement.id =
                "loginMessage";

            messageElement.className =
                "login-message";


            loginForm.appendChild(
                messageElement
            );
        }


        messageElement.textContent =
            message;

    }

});