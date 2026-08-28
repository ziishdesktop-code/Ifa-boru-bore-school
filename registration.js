// ==========================================
// IFA BORU BORE SCHOOL
// STUDENT REGISTRATION SYSTEM
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Registration system loaded.");

    // ==========================================
    // GET REGISTRATION FORM
    // ==========================================

    const registrationForm =
        document.getElementById("registrationForm");

    if (!registrationForm) {
        console.warn("Registration form was not found.");
        return;
    }


    // ==========================================
    // CHECK SUPABASE CONNECTION
    // ==========================================

    if (!window.supabaseClient) {

    console.error(
        "❌ Supabase client was not found. Check supabaseClient.js."
    );

    return;
        }

      console.log("Supabase client is ready.");


    // ==========================================
    // REGISTRATION SUBMIT
    // ==========================================

    registrationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log("Registration process started.");


            // ======================================
            // SUBMIT BUTTON
            // ======================================

            const submitButton =
                registrationForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.dataset.originalText =
                    submitButton.innerText;

                submitButton.innerText =
                    "Submitting...";
            }


            try {

                // ======================================
                // 1. STUDENT INFORMATION
                // ======================================

                const firstName =
                    document.getElementById("firstName")?.value.trim();

                const fatherName =
                    document.getElementById("fatherName")?.value.trim();

                const grandfatherName =
                    document.getElementById("grandfatherName")?.value.trim();

                const gender =
                    document.getElementById("gender")?.value;

                const dateOfBirth =
                    document.getElementById("dateOfBirth")?.value;

                const email =
                    document.getElementById("email")?.value.trim();

                const studentPhone =
                    document.getElementById("studentPhone")?.value.trim();

                const parentPhone =
                    document.getElementById("parentPhone")?.value.trim();

                const emergencyPhone =
                    document.getElementById("emergencyPhone")?.value.trim();

                const nationality =
                    document.getElementById("nationality")?.value.trim();

                const region =
                    document.getElementById("region")?.value.trim();

                const zone =
                    document.getElementById("zone")?.value.trim();

                const woreda =
                    document.getElementById("woreda")?.value.trim();

                const kebele =
                    document.getElementById("kebele")?.value.trim();


                // ======================================
                // 2. ACADEMIC INFORMATION
                // ======================================

                const applyingGrade =
                    document.getElementById("applyingGrade")?.value;

                const previousSchool =
                    document.getElementById("previousSchool")?.value.trim();

                const previousSchoolAddress =
                    document.getElementById(
                        "previousSchoolAddress"
                    )?.value.trim();
                const yearCompleted =
                    document.getElementById("yearCompleted")?.value;

                const averageResult =
                    document.getElementById("averageResult")?.value;


                // ======================================
                // 3. CHECK REQUIRED INFORMATION
                // ======================================

                if (
                    !firstName ||
                    !fatherName ||
                    !grandfatherName ||
                    !gender ||
                    !dateOfBirth ||
                    !email ||
                    !studentPhone ||
                    !parentPhone ||
                    !emergencyPhone ||
                    !nationality ||
                    !region ||
                    !zone ||
                    !woreda ||
                    !kebele ||
                    !applyingGrade ||
                    !previousSchool ||
                    !yearCompleted
                ) {

                    alert(
                        "Please complete all required student information."
                    );

                    resetButton();
                    return;
                }


                // ======================================
                // 4. CHECK AVERAGE RESULT
                // ======================================

                if (averageResult !== "") {

                    const average =
                        Number(averageResult);

                    if (
                        Number.isNaN(average) ||
                        average < 0 ||
                        average > 100
                    ) {

                        alert(
                            "Average result must be between 0 and 100."
                        );

                        resetButton();
                        return;
                    }
                }


                // ======================================
                // 5. GET DOCUMENT FILES
                // ======================================

                const transcript =
                    document.getElementById(
                        "transcript"
                    )?.files[0];

                const studentIdFront =
                    document.getElementById(
                        "studentIdFront"
                    )?.files[0];

                const studentIdBack =
                    document.getElementById(
                        "studentIdBack"
                    )?.files[0];

                const parentIdFront =
                    document.getElementById(
                        "parentIdFront"
                    )?.files[0];

                const parentIdBack =
                    document.getElementById(
                        "parentIdBack"
                    )?.files[0];

                const paymentReceipt =
                    document.getElementById(
                        "paymentReceipt"
                    )?.files[0];


                // ======================================
                // 6. CHECK DOCUMENTS
                // ======================================

                if (
                    !transcript ||
                    !studentIdFront ||
                    !studentIdBack ||
                    !parentIdFront ||
                    !parentIdBack ||
                    !paymentReceipt
                ) {

                    alert(
                        "Please upload all six required documents."
                    );

                    resetButton();
                    return;
                }


               // ======================================
                // 7. CHECK FILE SIZE
                // ======================================

                const maximumFileSize = 10 * 1024 * 1024; // 10 MB

                const filesToCheck = [
                    transcript,
                    studentIdFront,
                    studentIdBack,
                    parentIdFront,
                    parentIdBack,
                    paymentReceipt
                ];

                for (let i = 0; i < filesToCheck.length; i++) {

                    const file = filesToCheck[i];

                    if (file && file.size > maximumFileSize) {

                        alert(
                            "The file " + file.name + " is larger than 10 MB."
                        );

                        resetButton();
                        return;
                    }
                }

                // ======================================
                // 8. CREATE APPLICATION DATA
                // ======================================

                console.log(
                    "Preparing student application..."
                );

                const applicationData = {

                    first_name: firstName,

                    father_name: fatherName,

                    grandfather_name: grandfatherName,

                    gender: gender,

                    date_of_birth: dateOfBirth,

                    email: email,

                    student_phone: studentPhone,

                    parent_phone: parentPhone,

                    emergency_phone: emergencyPhone,

                    nationality: nationality,

                    region: region,

                    zone: zone,

                    woreda: woreda,

                    kebele: kebele,

                    applying_grade: applyingGrade,

                    previous_school: previousSchool,

                    previous_school_address:
                        previousSchoolAddress || null,

                    year_completed:
                        yearCompleted !== ""
                            ? Number(yearCompleted)
                            : null,

                    average_result:
                        averageResult !== ""
                            ? Number(averageResult)
                            : null,

                    application_status:
                        "pending"
                };


                console.log(
                    "Application data prepared:",
                    applicationData
                );


            // ======================================
            // 9. INSERT INTO SUPABASE
            // ======================================

            console.log("====================================");
            console.log("SAVING APPLICATION TO SUPABASE");
            console.log("====================================");

            // Create a unique UUID for this application
            const applicationId = crypto.randomUUID();

            // Add the UUID to the application data
            applicationData.id = applicationId;

            console.log(
                "Table:",
                "student_applications"
            );

            console.log(
                "Application ID:",
                applicationId
            );

            console.log(
                "Application data:",
                applicationData
            );


            // ======================================
            // INSERT APPLICATION
            // ======================================

            const {
                data,
                error
            } = await supabaseClient
                .from("student_applications")
                .insert([applicationData]);


            if (error) {

                console.error(
                    "===================================="
                );

                console.error(
                    "SUPABASE INSERT FAILED"
                );

                console.error(
                    "===================================="
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

                console.error(
                    "Full error:",
                    error
                );

                throw new Error(
                    "Supabase error " +
                    (error.code || "") +
                    ": " +
                    error.message
                );
            }


            console.log(
                "===================================="
            );

            console.log(
                "✅ APPLICATION SAVED SUCCESSFULLY"
            );

            console.log(
                "Application ID:",
                applicationId
            );

            console.log(
                "===================================="
            );


            // ======================================
            // 10. PREPARE DOCUMENTS
            // ======================================

            const documents = [
                {
                    file: transcript,
                    column: "transcript_url",
                    name: "transcript"
                },
                {
                    file: studentIdFront,
                    column: "student_id_front_url",
                    name: "student-id-front"
                },
                {
                    file: studentIdBack,
                    column: "student_id_back_url",
                    name: "student-id-back"
                },
                {
                    file: parentIdFront,
                    column: "parent_id_front_url",
                    name: "parent-id-front"
                },
                {
                    file: parentIdBack,
                    column: "parent_id_back_url",
                    name: "parent-id-back"
                },
                {
                    file: paymentReceipt,
                    column: "payment_receipt_url",
                    name: "payment-receipt"
                }
            ];

            const uploadedPaths = {};


                // ======================================
                // 11. UPLOAD DOCUMENTS
                // ======================================

                console.log("Starting document uploads...");

                for (const document of documents) {

                    console.log("Uploading:", document.name);

                    const fileExtension =
                        document.file.name
                            .split(".")
                            .pop()
                            .toLowerCase();

                    const filePath =
                        applicationId +
                        "/" +
                        document.name +
                        "-" +
                        Date.now() +
                        "." +
                        fileExtension;


                    const uploadResult =
                        await supabaseClient
                            .storage
                            .from("student-documents")
                            .upload(
                                filePath,
                                document.file,
                                {
                                    cacheControl: "3600",
                                    upsert: false
                                }
                            );


                    if (uploadResult.error) {

                        console.error(
                            "Document upload error:",
                            uploadResult.error
                        );

                        throw uploadResult.error;
                    }


                    uploadedPaths[document.column] =
                        filePath;


                    console.log(
                        "Uploaded successfully:",
                        document.name
                    );
                }


                // ======================================
                // 12. SAVE FILE PATHS
                // ======================================

                console.log(
                    "Saving document paths..."
                );


                const {
                    error: updateError
                } = await supabaseClient
                    .from("student_applications")
                    .update({

                        transcript_url:
                            uploadedPaths.transcript_url,

                        student_id_front_url:
                            uploadedPaths.student_id_front_url,

                        student_id_back_url:
                            uploadedPaths.student_id_back_url,

                        parent_id_front_url:
                            uploadedPaths.parent_id_front_url,

                        parent_id_back_url:
                            uploadedPaths.parent_id_back_url,

                        payment_receipt_url:
                            uploadedPaths.payment_receipt_url

                    })
                    .eq(
                        "id",
                        applicationId
                    );


                if (updateError) {

                    console.error(
                        "Document path update error:",
                        updateError
                    );

                    throw updateError;
                }
                // ======================================
                // 13. SUCCESS
                // ======================================

                console.log(
                    "Registration completed successfully!"
                );


                alert(
                    "Registration completed successfully! 🎉\n\n" +
                    "Your application has been submitted to " +
                    "Ifa Boru Bore School."
                );


                registrationForm.reset();


            } catch (error) {

                console.error(
                    "REGISTRATION ERROR:",
                    error
                );


                alert(
                    "Registration could not be completed.\n\n" +
                    "Please try again or contact the school."
                );

            } finally {

                resetButton();
            }


            // ======================================
            // RESET BUTTON
            // ======================================

            function resetButton() {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerText =
                        submitButton.dataset.originalText ||
                        "Register";
                }
            }

        }
    );

});