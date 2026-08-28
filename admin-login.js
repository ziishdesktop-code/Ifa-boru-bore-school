// ==========================================
// IFA BORU BORE SCHOOL
// ADMIN LOGIN
// SUPABASE AUTHENTICATION
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    async function () {


        console.log(
            "===================================="
        );

        console.log(
            "ADMIN LOGIN PAGE LOADED"
        );

        console.log(
            "===================================="
        );


        // ======================================
        // CHECK SUPABASE
        // ======================================

        if (!window.supabaseClient) {

            console.error(
                "❌ Supabase client was not found."
            );

            showMessage(
                "Supabase connection is not available.",
                "error"
            );

            return;
        }


        console.log(
            "✅ Supabase client is ready."
        );


        // ======================================
        // GET LOGIN FORM
        // ======================================

        const loginForm =
            document.getElementById(
                "adminLoginForm"
            );


        const loginButton =
            document.getElementById(
                "adminLoginButton"
            );


        const emailInput =
            document.getElementById(
                "adminEmail"
            );


        const passwordInput =
            document.getElementById(
                "adminPassword"
            );


        const rememberCheckbox =
            document.getElementById(
                "rememberAdmin"
            );


        // ======================================
        // CHECK FORM
        // ======================================

        if (!loginForm) {

            console.error(
                "❌ Admin login form was not found."
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
                    "✅ Existing admin session found."
                );

                window.location.href =
                    "admin.html";

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
        // LOGIN FORM SUBMIT
        // ======================================

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                console.log(
                    "Admin login started..."
                );


                // ----------------------------------
                // GET VALUES
                // ----------------------------------

                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput.value;


                // ----------------------------------
                // VALIDATION
                // ----------------------------------

                if (!email) {

                    showMessage(
                        "Please enter your email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;
                }


                if (!password) {
               showMessage(
                        "Please enter your password.",
                        "error"
                    );

                    passwordInput.focus();

                    return;
                }


                // ----------------------------------
                // DISABLE BUTTON
                // ----------------------------------

                loginButton.disabled =
                    true;


                loginButton.textContent =
                    "Signing in...";


                showMessage(
                    "Signing in...",
                    "loading"
                );


                try {


                    // ==================================
                    // SUPABASE LOGIN
                    // ==================================

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
                    // LOGIN ERROR
                    // ==================================

                    if (error) {

                        console.error(
                            "❌ Admin login failed:",
                            error
                        );


                        showMessage(
                            getLoginErrorMessage(
                                error
                            ),
                            "error"
                        );


                        loginButton.disabled =
                            false;


                        loginButton.textContent =
                            "Login";


                        return;
                    }


                    // ==================================
                    // CHECK SESSION
                    // ==================================

                    if (
                        !data ||
                        !data.session ||
                        !data.user
                    ) {

                        console.error(
                            "Login succeeded but no session was returned."
                        );


                        showMessage(
                            "Login could not be completed. Please try again.",
                            "error"
                        );


                        loginButton.disabled =
                            false;


                        loginButton.textContent =
                            "Login";


                        return;
                    }


                    // ==================================
                    // LOGIN SUCCESS
                    // ==================================

                    console.log(
                        "===================================="
                    );

                    console.log(
                        "✅ ADMIN LOGIN SUCCESSFUL"
                    );

                    console.log(
                        "Admin:",
                        data.user.email
                    );

                    console.log(
                        "User ID:",
                        data.user.id
                    );

                    console.log(
                        "===================================="
                    );


                    // ----------------------------------
                    // REMEMBER LOGIN
                    // ----------------------------------

                    if (
                        rememberCheckbox &&
                        rememberCheckbox.checked
                    ) {

                        localStorage.setItem(
                            "rememberAdmin",
                            "true"
                        );
                        }

                    else {

                        localStorage.removeItem(
                            "rememberAdmin"
                        );

                    }


                    showMessage(
                        "Login successful! Opening dashboard...",
                        "success"
                    );


                    // ==================================
                    // GO TO ADMIN DASHBOARD
                    // ==================================

                    setTimeout(
                        function () {

                            window.location.href =
                                "admin.html";

                        },
                        700
                    );

                }


                catch (error) {

                    console.error(
                        "❌ Unexpected login error:",
                        error
                    );


                    showMessage(
                        "An unexpected error occurred. Please try again.",
                        "error"
                    );


                    loginButton.disabled =
                        false;


                    loginButton.textContent =
                        "Login";

                }

            }
        );


        // ======================================
        // LOGIN ERROR MESSAGE
        // ======================================

        function getLoginErrorMessage(
            error
        ) {

            if (!error) {

                return "Login failed.";
            }


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

                return (
                    "Incorrect email or password."
                );

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
                    "Too many login attempts. Please wait a moment and try again."
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

        function showMessage(
            message,
            type
        ) {

            const messageElement =
                document.getElementById(
                    "loginMessage"
                );


            if (!messageElement) {

                return;
            }


            messageElement.textContent =
                message;


            messageElement.className =
                "login-message " +
                (
                    type ||
                    ""
                );

        }


    }
);