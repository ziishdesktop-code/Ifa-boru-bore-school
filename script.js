// ==========================================
// IFA BORU BORE SCHOOL WEBSITE
// Main JavaScript
// ==========================================

console.log("Welcome to Ifa Boru Bore School");

// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener("load", function () {
    console.log("Website loaded successfully.");
});


// ==========================================
// FOOTER YEAR
// ==========================================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ==========================================
// LEARN MORE BUTTON
// ==========================================

function learnMore() {
    window.location.href = "About.html";
}


// ==========================================
// AI ASSISTANT
// ==========================================

function askAI() {

    const questionElement = document.getElementById("userQuestion");
    const answerElement = document.getElementById("aiAnswer");

    if (!questionElement || !answerElement) {
        return;
    }

    const question = questionElement.value.toLowerCase().trim();

    if (question === "") {

        answerElement.innerHTML =
            "Please type your question first. 😊";

        return;
    }


    // --------------------------------------
    // GREETING
    // --------------------------------------

    if (
        question.includes("hello") ||
        question.includes("hi") ||
        question.includes("hey")
    ) {

        answerElement.innerHTML =
            "Hello! 👋 Welcome to Ifa Boru Bore School AI Assistant. How can I help you today?";

        return;
    }


    // --------------------------------------
    // REGISTRATION
    // --------------------------------------

    if (
        question.includes("register") ||
        question.includes("registration") ||
        question.includes("apply") ||
        question.includes("application")
    ) {

        answerElement.innerHTML =
            "You can apply online through our Registration page. Complete the student information and upload the required documents and payment receipt.";

        return;
    }


    // --------------------------------------
    // DOCUMENTS
    // --------------------------------------

    if (
        question.includes("document") ||
        question.includes("documents") ||
        question.includes("requirement") ||
        question.includes("requirements")
    ) {

        answerElement.innerHTML =
            "Required documents may include your transcript or Ministry result, student ID, parent ID, payment receipt, and other documents requested by the school.";

        return;
    }


    // --------------------------------------
    // PAYMENT
    // --------------------------------------

    if (
        question.includes("payment") ||
        question.includes("fee") ||
        question.includes("pay")
    ) {

        answerElement.innerHTML =
            "After making the required payment, upload a clear picture or PDF of your payment receipt in the registration form.";

        return;
    }


    // --------------------------------------
    // GRADES
    // --------------------------------------

    if (
        question.includes("grade 9") ||
        question.includes("grade 10") ||
        question.includes("grade 11") ||
        question.includes("grade 12")
    ) {

        answerElement.innerHTML =
            "Ifa Boru Bore School provides education for Grades 9, 10, 11 and 12.";

        return;
    }


    // --------------------------------------
    // MATHEMATICS
    // --------------------------------------

    if (
        question.includes("math") ||
        question.includes("mathematics")
    ) {

        answerElement.innerHTML =
            "Mathematics learning materials, notes and exercises for Grades 9–12 will be available through the Digital Library.";

        return;
    }
    // --------------------------------------
    // PHYSICS
    // --------------------------------------

    if (question.includes("physics")) {

        answerElement.innerHTML =
            "Physics learning materials, notes and exercises for Grades 9–12 will be available in the Digital Library.";

        return;
    }


    // --------------------------------------
    // CHEMISTRY
    // --------------------------------------

    if (question.includes("chemistry")) {

        answerElement.innerHTML =
            "Chemistry notes, exercises and learning resources for Grades 9–12 will be available in the Digital Library.";

        return;
    }


    // --------------------------------------
    // BIOLOGY
    // --------------------------------------

    if (question.includes("biology")) {

        answerElement.innerHTML =
            "Biology learning materials and exercises for Grades 9–12 will be available in the Digital Library.";

        return;
    }


    // --------------------------------------
    // ENGLISH
    // --------------------------------------

    if (question.includes("english")) {

        answerElement.innerHTML =
            "English resources will include grammar, reading, writing, speaking and vocabulary practice.";

        return;
    }


    // --------------------------------------
    // ENTRANCE EXAM
    // --------------------------------------

    if (
        question.includes("entrance") ||
        question.includes("exam") ||
        question.includes("past paper")
    ) {

        answerElement.innerHTML =
            "Entrance examination resources from Ethiopian Calendar years 2014–2018 will be available in the Digital Library.";

        return;
    }


    // --------------------------------------
    // TEACHERS
    // --------------------------------------

    if (
        question.includes("teacher") ||
        question.includes("teachers")
    ) {

        answerElement.innerHTML =
            "Our teachers are dedicated to helping students learn, improve and succeed.";

        return;
    }


    // --------------------------------------
    // LIBRARY
    // --------------------------------------

    if (
        question.includes("library") ||
        question.includes("book") ||
        question.includes("books")
    ) {

        answerElement.innerHTML =
            "The Digital Library will provide books, notes, exercises, past examinations and other learning resources.";

        return;
    }


    // --------------------------------------
    // CONTACT
    // --------------------------------------

    if (
        question.includes("contact") ||
        question.includes("phone") ||
        question.includes("email")
    ) {

        answerElement.innerHTML =
            "Please visit the Contact page for the school's official contact information.";

        return;
    }


    // --------------------------------------
    // LOCATION
    // --------------------------------------

    if (
        question.includes("location") ||
        question.includes("where") ||
        question.includes("address")
    ) {

        answerElement.innerHTML =
            "Please visit the Contact page to see the school's location and address.";

        return;
    }


    // --------------------------------------
    // THANK YOU
    // --------------------------------------

    if (
        question.includes("thank") ||
        question.includes("thanks")
    ) {

        answerElement.innerHTML =
            "You're welcome! 😊 I'm always happy to help.";

        return;
    }


    // --------------------------------------
    // UNKNOWN QUESTION
    // --------------------------------------

    answerElement.innerHTML =
        "I'm still learning. 🤖 Please ask me about registration, documents, payment, Grades 9–12, subjects, entrance exams, teachers, library, location or contact information.";
}


// ==========================================
// DARK MODE
// ========================================

const darkModeBtn = document.getElementById("darkModeBtn");

if (darkModeBtn) {

    darkModeBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

    });
}


// ==========================================
// AUTOMATIC HERO SLIDER
// ==========================================

const hero = document.getElementById("hero");

if (hero) {

    const images = [
        "images/hero1.jpg",
        "images/hero2.jpg",
        "images/hero3.jpg",
        "images/hero4.jpg"
    ];

    let current = 0;

    // First image
    hero.style.backgroundImage =
        linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${images[current]}");


    // Change image every 3 seconds
    setInterval(function () {

        current++;

        if (current >= images.length) {
            current = 0;
        }

        hero.style.backgroundImage =
            linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${images[current]}");

    }, 4000);
}


// ==========================================
// STUDENT LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const emailElement =
            document.getElementById("loginEmail");

        const passwordElement =
            document.getElementById("loginPassword");


        if (!emailElement || !passwordElement) {
            return;
        }


        const email =
            emailElement.value.trim();

        const password =
            passwordElement.value;


        // DEMO LOGIN
        if (
            email === "student@example.com" &&
            password === "student123"
        ) {

            localStorage.setItem(
                "studentLoggedIn",
                "true"
            );

            localStorage.setItem(
                "studentEmail",
                email
            );

            window.location.href =
                "student-dashboard.html";

        } else {

            alert(
                "Incorrect email or password."
            );

        }

    });
}


// ==========================================
// END OF MAIN SCRIPT
// ==========================================

console.log("Main script loaded successfully.");