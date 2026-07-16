// ==========================================
// CareNest Smart System Engine v1.2
// Multi-Screen and Action Authentication Handlers
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Target Screens
    const splashScreen = document.getElementById("splash-screen");
    const loginScreen = document.getElementById("login-screen");
    
    // Auth Mode Toggles
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");
    
    // Form Instances
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    
    // Password togglers
    const togglePasswordButtons = document.querySelectorAll(".toggle-password-btn");

    // Toast Pop-up Notification
    const toast = document.getElementById("toast");

    // 1. Smooth Automatic Navigation Transition (Splash Screen -> Login Portal)
    // Runs the custom SVG Heartbeat ECG animation for exactly 3.8 seconds
    setTimeout(() => {
        splashScreen.classList.remove("active");
        
        // Let splash completely fade out prior to displaying the card
        setTimeout(() => {
            loginScreen.classList.add("active");
        }, 700); 
    }, 3800);

    // 2. Tab Navigation Layout (Switches Forms Smoothly)
    tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        
        loginForm.classList.add("active-form");
        loginForm.classList.remove("hidden-form");
        
        signupForm.classList.add("hidden-form");
        signupForm.classList.remove("active-form");
    });

    tabSignup.addEventListener("click", () => {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        
        signupForm.classList.add("active-form");
        signupForm.classList.remove("hidden-form");
        
        loginForm.classList.add("hidden-form");
        loginForm.classList.remove("active-form");
    });

    // 3. Dual-Field Password Mask Toggle (Show/Hide Text)
    togglePasswordButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const passwordInput = e.target.previousElementSibling;
            const isPassword = passwordInput.type === "password";
            
            passwordInput.type = isPassword ? "text" : "password";
            e.target.textContent = isPassword ? "Hide" : "Show";
            passwordInput.focus();
        });
    });

    // 4. Custom Application Toast Popup Notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove("hidden");
        // Trigger Layout Reflow
        toast.offsetHeight;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.classList.add("hidden");
            }, 400);
        }, 4000);
    }

    // 5. Simulated Form Submission Authentication
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = signupForm.querySelector(".submit-btn");
        const btnText = submitBtn.querySelector(".btn-text");
        const btnLoader = submitBtn.querySelector(".btn-loader");
        const nameInput = document.getElementById("signup-name").value;

        btnText.classList.add("hidden");
        btnLoader.classList.remove("hidden");
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast(`Registration Successful! Welcome to CareNest, ${nameInput}.`);
            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
            submitBtn.disabled = false;
            signupForm.reset();
            
            // Re-route user cleanly back to Login Tab
            tabLogin.click();
        }, 2000);
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector(".submit-btn");
        const btnText = submitBtn.querySelector(".btn-text");
        const btnLoader = submitBtn.querySelector(".btn-loader");

        btnText.classList.add("hidden");
        btnLoader.classList.remove("hidden");
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast("Login Successful! Preparing workspace dashboard...");
            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
            submitBtn.disabled = false;
            loginForm.reset();
        }, 2200);
    });

    // 6. Forgot Password Click trigger
    document.getElementById("forgot-password-trigger").addEventListener("click", (e) => {
        e.preventDefault();
        showToast("A reset code has been dispatched to your recovery email.");
    });
});
