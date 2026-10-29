// 1. Supabase inicializálása a te adataiddal
const SUPABASE_URL = "https://ozqgcyzyypehqjqxoole.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_33Mx64Pcghvu58Of9L78FQ_x96oStp1";

// A helyi fájl miatt ez a sor most már hibátlanul le fog futni!
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
// 4. Form elküldése - JAVÍTOTT, BIZTONSÁGOS VERZIÓ
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage("Folyamatban...", "");

    const email = emailInput.value;
    const password = passwordInput.value;

    if (isSignUpMode) {
        // REGISZTRÁCIÓ
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        if (error || (data && data.error)) {
            const errorMsg = error ? error.message : data.error.message;
            showMessage(errorMsg, "error");
        } else {
            showMessage("Sikeres regisztráció! Ellenőrizd az e-mailedet.", "success");
        }
    } else {
        // BELÉPÉS
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        
        // Szigorú ellenőrzés: ha hiba van a válaszban, MEGÁLLUNK!
        if (error || (data && data.error)) {
            const errorMsg = error ? error.message : (data.error.message || "Hibás e-mail vagy jelszó!");
            showMessage(errorMsg, "error");
            console.error("Belépési hiba:", errorMsg);
            return; // Megállítjuk a kódot, nem engedjük tovább a dashboardra!
        }

        // Ha idáig eljut a kód, a belépés 100%, hogy SIKERES volt
        showMessage("Sikeres belépés! Átirányítás...", "success");
        
        // Biztonságosan kinyerjük a valódi User ID-t
        const actualUserId = data.user ? data.user.id : (data.id || null);
        
        if (actualUserId) {
            localStorage.setItem('supabase_user_id', actualUserId);
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
        } else {
            showMessage("Adatbázis hiba: Nem található felhasználói azonosító.", "error");
        }
    }
});


function showMessage(text, type) {
    messageBox.innerText = text;
    messageBox.className = `message ${type}`;
}
