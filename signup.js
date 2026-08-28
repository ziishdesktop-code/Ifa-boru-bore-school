// ==========================================
// IFA BORU BORE SCHOOL
// STUDENT SIGN UP
// SUPABASE AUTHENTICATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("STUDENT SIGN UP PAGE LOADED");
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
    // GET FORM ELEMENTS
    // ======================================

    const signupForm =
        document.getElementById("signupForm");

    const nameInput =
        document.getElementById("signupName");

    const emailInput =
        document.getElementById("signupEmail");

    const passwordInput =
        document.getElementById("signupPassword");

    const confirmPasswordInput =
        document.getElementById("signupConfirmPassword");

    const signupButton =
        document.getElementById("signupButton");


    // ======================================
    // CHECK ELEMENTS
    // ======================================

    if (!signupForm) {

        console.error(
            "❌ signupForm was not found."
        );

        return;
    }

    if (!nameInput) {

        console.error(
            "❌ signupName was not found."
        );

        return;
    }

    if (!emailInput) {

        console.error(
            "❌ signupEmail was not found."
        );

        return;
    }

    if (!passwordInput) {

        console.error(
            "❌ signupPassword was not found."
        );

        return;
    }

    if (!confirmPasswordInput) {

        console.error(
            "❌ signupConfirmPassword was not found."
        );

        return;
    }


    // ======================================
    // SIGN UP
    // ======================================

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log(
                "Student account creation started..."
            );


            // ==================================
            // GET VALUES
            // ==================================

            const fullName =
                nameInput.value.trim();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            // ==================================
            // VALIDATE NAME
            // ==================================

            if (!fullName) {

                showMessage(
                    "Please enter your full name."
                );

                nameInput.focus();

                return;
            }


            // ==================================
            // VALIDATE EMAIL
            // ==================================

            if (!email) {

                showMessage(
                    "Please enter your email address."
                );

                emailInput.focus();

                return;
            }


            // ==================================
            // VALIDATE PASSWORD
            // ==================================

            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters."
                );

                passwordInput.focus();

                return;
            }
            // ==================================
            // CONFIRM PASSWORD
            // ==================================

            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match."
                );

                confirmPasswordInput.focus();

                return;
            }


            // ==================================
            // DISABLE BUTTON
            // ==================================

            if (signupButton) {

                signupButton.disabled = true;

                signupButton.textContent =
                    "Creating Account...";
            }


            showMessage(
                "Creating your account..."
            );


            // ==================================
            // CREATE SUPABASE ACCOUNT
            // ==================================

            try {

                const {
                    data,
                    error
                } =
                    await window.supabaseClient
                        .auth
                        .signUp({

                            email: email,

                            password: password,

                            options: {

                                data: {

                                    full_name:
                                        fullName

                                }

                            }

                        });


                // ==================================
                // CHECK SUPABASE ERROR
                // ==================================

                if (error) {

                    console.error(
                        "❌ SUPABASE SIGN UP ERROR"
                    );

                    console.error(
                        "Message:",
                        error.message
                    );

                    console.error(
                        "Code:",
                        error.code
                    );

                    console.error(
                        "Full error:",
                        error
                    );


                    showMessage(
                        getSignupError(error)
                    );


                    resetButton();

                    return;
                }


                // ==================================
                // CHECK USER
                // ==================================

                if (
                    !data ||
                    !data.user
                ) {

                    console.error(
                        "Account was not created."
                    );


                    showMessage(
                        "Account could not be created. Please try again."
                    );


                    resetButton();

                    return;
                }


                console.log(
                    "===================================="
                );

                console.log(
                    "✅ STUDENT ACCOUNT CREATED"
                );

                console.log(
                    "User ID:",
                    data.user.id
                );

                console.log(
                    "Email:",
                    data.user.email
                );

                console.log(
                    "===================================="
                );


                // ==================================
                // EMAIL CONFIRMATION REQUIRED
                // ==================================

                if (
                    !data.session
                ) {

                    showMessage(
                        "Account created successfully! Please check your email and confirm your account before signing in."
                    );


                    signupForm.reset();

                    resetButton();

                    return;
                }
                // ==================================
                // ACCOUNT CREATED + LOGGED IN
                // ==================================

                showMessage(
                    "Account created successfully! Opening your dashboard..."
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "student-dashboard.html";

                    },
                    1000
                );

            }


            // ==================================
            // UNEXPECTED ERROR
            // ==================================

            catch (error) {

                console.error(
                    "❌ Unexpected signup error:",
                    error
                );


                showMessage(
                    "Something went wrong. Please try again."
                );


                resetButton();

            }

        }
    );


    // ======================================
    // SUPABASE ERROR MESSAGE
    // ======================================

    function getSignupError(error) {

        const message =
            (
                error.message ||
                ""
            ).toLowerCase();


        if (
            message.includes(
                "user already registered"
            )
        ) {

            return (
                "This email is already registered. Please sign in instead."
            );
        }


        if (
            message.includes(
                "password should be at least"
            )
        ) {

            return (
                "Your password is too short. Please use at least 6 characters."
            );
        }


        if (
            message.includes(
                "invalid email"
            )
        ) {

            return (
                "Please enter a valid email address."
            );
        }


        if (
            message.includes(
                "rate limit"
            )
        ) {

            return (
                "Too many requests. Please wait a moment and try again."
            );
        }


        return (
            error.message ||
            "Account creation failed. Please try again."
        );

    }


    // ======================================
    // SHOW MESSAGE
    // ======================================

    function showMessage(message) {

        let messageElement =
            document.getElementById(
                "signupMessage"
            );


        // ----------------------------------
        // Create message element if missing
        // ----------------------------------

        if (!messageElement) {

            messageElement =
                document.createElement("div");

            messageElement.id =
                "signupMessage";

            messageElement.className =
                "login-message";


            signupForm.appendChild(
                messageElement
            );
        }


        messageElement.textContent =
            message;

    }


    // ======================================
    // RESET BUTTON
    // ======================================

    function resetButton() {

        if (signupButton) {

            signupButton.disabled = false;

            signupButton.textContent =
                "Create Account";
        }

    }

});