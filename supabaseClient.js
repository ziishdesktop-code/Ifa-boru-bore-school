// ==========================================
// IFA BORU BORE SCHOOL
// SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL =
    "https://tuixskfnetshvyuxruso.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_lt1apcpfAyblOu56kUPUSA_UzoDz2hf";


// ==========================================
// CHECK SUPABASE LIBRARY
// ==========================================

if (!window.supabase) {

    console.error(
        "❌ Supabase library was not loaded."
    );

} else {

    // Create Supabase client
    const supabaseClient=
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

    // Make client available to ALL website scripts
    window.supabaseClient = supabaseClient;

    console.log(
        "✅ Supabase client loaded successfully!"
    );
}