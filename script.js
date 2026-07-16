// ==========================================
// CareNest Smart System Engine v1.2
// Multi-Screen and Action Authentication Handlers
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Screen Elements
    const splashScreen = document.getElementById("splash-screen");
    const authScreen = document.getElementById("auth-screen");
    
    // Tab Elements
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");
    
    // Form Elements
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    
    // Password togglers
    const togglePasswordButtons = document.querySelectorAll(".toggle-password-btn");

    // Toast element for gorgeous notifications
    const toast = document.getElementById("toast");

    // 1. Smooth Transition from Splash Screen to Auth Panel
    // Custom ECG pulse runs for exactly 3.8 seconds
    setTimeout(() => {
        splashScreen.classList.remove("active");
        
        setTimeout(() => {
            authScreen.classList.add("active");
        }, 700); // Wait for splash screen CSS opacity fade
    }, 3800);

    // 2. Tab switcher between (Login <-> Register)
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

    // 3. Multi-field Password Visibility toggler
    togglePasswordButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            // Find password input adjacent to current toggle button
            const passwordInput = e.target.previousElementSibling;
            const isPassword = passwordInput.type === "password";
            
            passwordInput.type = isPassword ? "text" : "password";
            e.target.textContent = isPassword ? "Hide" : "Show";
            passwordInput.focus();
        });
    });

    // 4. Custom Elegant Toast Notifications
    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove("hidden");
        // Force Reflow
        toast.offsetHeight;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.classList.add("hidden");
            }, 400);
        }, 4000);
    }

    // 5. Mock Register authentication event
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
            showToast(`Registration Successful! Welcome to the Nest, ${nameInput}.`);
            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
            submitBtn.disabled = false;
            signupForm.reset();
            
            // Auto switch back to Login screen
            tabLogin.click();
        }, 2000);
    });

    // 6. Mock Login authentication event
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

    // 7. Simulated Forgot Password action
    document.getElementById("forgot-password-trigger").addEventListener("click", (e) => {
        e.preventDefault();
        showToast("A recovery link has been dispatched to your registered workspace email.");
    });
});
