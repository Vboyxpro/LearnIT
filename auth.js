
// 1. Supabase inicializálása - JAVÍTOTT verzió
const SUPABASE_URL = "https://ozqgcyzyypehqjqxoole.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_33Mx64Pcghvu58Of9L78FQ_x96oStp1";

// FONTOS: A kis "s" és nagy "S" betűk különbsége oldja meg a hibát!
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// 2. DOM elemek kijelölése
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authTitle = document.getElementById('auth-title');
const authBtn = document.getElementById('auth-btn');
const messageBox = document.getElementById('message');

let isSignUpMode = true;

// 3. Váltás Regisztráció / Belépés között
document.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'auth-mode-link') {
        isSignUpMode = !isSignUpMode;
        const toggleAuthText = document.getElementById('toggle-auth');
        
        if (isSignUpMode) {
            authTitle.innerText = "Regisztráció";
            authBtn.innerText = "Fiók létrehozása";
            toggleAuthText.innerHTML = 'Már van fiókom? <span id="auth-mode-link">Belépés</span>';
        } else {
            authTitle.innerText = "Belépés";
            authBtn.innerText = "Bejelentkezés";
            toggleAuthText.innerHTML = 'Még nincs fiókom? <span id="auth-mode-link">Regisztráció</span>';
        }
    }
});

// 4. Form elküldése
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage("Folyamatban...", "");

    const email = emailInput.value;
    const password = passwordInput.value;

    if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) showMessage(error.message, "error");
        else showMessage("Sikeres regisztráció! Ellenőrizd az e-mailedet.", "success");
    } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) showMessage(error.message, "error");
        else {
            showMessage("Sikeres belépés! Átirányítás...", "success");
            localStorage.setItem('supabase_user_id', data.user.id);
            // Sikeres belépés után átirányítjuk a főmenüre
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
        }
    }
});

function showMessage(text, type) {
    messageBox.innerText = text;
    messageBox.className = `message ${type}`;
}
