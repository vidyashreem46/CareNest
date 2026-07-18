// ============================================================================
// CareNest SaaS Enterprise - Full Application Mechanics State Controller Engine
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Core Application Viewport State Switching Nodes
    const appViewport = document.querySelector(".app-viewport");
    const gateTrigger = document.getElementById("gate-trigger");
    const actionGateBlock = document.querySelector(".action-gate");
    const narrativeFrames = document.querySelectorAll(".narrative-frame");
    const globalToastNode = document.getElementById("carenest-global-toast");

    // Welcome Screen Structural Action Targets
    const cardSignIn = document.getElementById("card-action-signin");
    const cardRegister = document.getElementById("card-action-register");
    const cardGuest = document.getElementById("card-action-guest");
    const backToPortalButtons = document.querySelectorAll(".back-to-portal-btn");
    const guestExitToPortal = document.getElementById("guest-exit-to-portal");

    // Form Identity Handles
    const loginForm = document.getElementById("carenest-login-form");
    const registerForm = document.getElementById("carenest-register-form");
    const sandboxFeatureCards = document.querySelectorAll(".dashboard-feature-card.functional-node");

    let currentFrameIndex = 0;
    const frameIntervalDuration = 2800; // Optimal speed for readable fades

    // ============================================================================
    // STAGE 1: Cinematic Onboarding Presentation Narrative Sequencer
    // ============================================================================
    function advanceNarrativePipeline() {
        if (currentFrameIndex < narrativeFrames.length) {
            if (currentFrameIndex > 0) {
                narrativeFrames[currentFrameIndex - 1].classList.remove("active-frame");
                narrativeFrames[currentFrameIndex - 1].classList.add("exit-frame");
            }
            narrativeFrames[currentFrameIndex].classList.add("active-frame");
            currentFrameIndex++;
            setTimeout(advanceNarrativePipeline, frameIntervalDuration);
        } else {
            if (narrativeFrames.length > 0) {
                narrativeFrames[narrativeFrames.length - 1].classList.remove("active-frame");
                narrativeFrames[narrativeFrames.length - 1].classList.add("exit-frame");
            }
            setTimeout(() => {
                actionGateBlock.classList.add("visible-gate");
            }, 200);
        }
    }
    setTimeout(advanceNarrativePipeline, 400);

    // Dynamic State Changes Controls
    gateTrigger.addEventListener("click", () => {
        appViewport.setAttribute("data-state", "welcome");
    });

    // ============================================================================
    // STAGE 2: Multi-Option Greeting Welcome Gateway Interaction Mechanics
    // ============================================================================
    cardSignIn.addEventListener("click", () => appViewport.setAttribute("data-state", "signin"));
    cardRegister.addEventListener("click", () => appViewport.setAttribute("data-state", "register"));
    
    cardGuest.addEventListener("click", () => {
        triggerGlobalNotificationComponent("Initializing Sandbox Demo Account Workspace...");
        setTimeout(() => {
            appViewport.setAttribute("data-state", "dashboard-guest");
        }, 800);
    });

    // Back Buttons Mapping
    backToPortalButtons.forEach(btn => {
        btn.addEventListener("click", () => appViewport.setAttribute("data-state", "welcome"));
    });

    guestExitToPortal.addEventListener("click", () => {
        appViewport.setAttribute("data-state", "welcome");
    });

    // ============================================================================
    // STAGE 3: Unified Forms Processing & Error Verification Engines
    // ============================================================================
    
    // Password Mask Toggling Functional Rules
    document.querySelectorAll(".toggle-password-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const fieldInput = e.target.previousElementSibling;
            const isMasked = fieldInput.getAttribute("type") === "password";
            fieldInput.setAttribute("type", isMasked ? "text" : "password");
            e.target.textContent = isMasked ? "Hide" : "Show";
        });
    });

    function flagInputNodeError(input, alertMsg) {
        const formRowElement = input.closest(".form-row");
        if (formRowElement) {
            formRowElement.classList.add("invalid-node");
            const feedbackText = formRowElement.querySelector(".validation-feedback-node");
            if (feedbackText) feedbackText.textContent = alertMsg;
        }
        return false;
    }

    function removeInputNodeError(input) {
        const formRowElement = input.closest(".form-row");
        if (formRowElement) {
            formRowElement.classList.remove("invalid-node");
            const feedbackText = formRowElement.querySelector(".validation-feedback-node");
            if (feedbackText) feedbackText.textContent = "";
        }
    }

    // Attachment validation listeners clear loops
    document.querySelectorAll(".form-row input, .form-row select").forEach(node => {
        node.addEventListener("input", () => removeInputNodeError(node));
    });

    // 1. Sign In Submissions Pipeline Control
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userNode = document.getElementById("input-username");
        const passNode = document.getElementById("input-password");
        let passesVerification = true;

        if (!userNode.value.trim()) passesVerification = flagInputNodeError(userNode, "Account ID entry credential is required.");
        if (!passNode.value.trim()) passesVerification = flagInputNodeError(passNode, "Security pass code signature required.");

        if (!passesVerification) return;

        executeSubmitSpinnerAnimation(loginForm, true);
        setTimeout(() => {
            executeSubmitSpinnerAnimation(loginForm, false);
            triggerGlobalNotificationComponent("Sign In successful! Accessing Production Nodes...");
            loginForm.reset();
        }, 1500);
    });

    // 2. Full Account Registration Processing Engine
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const regName = document.getElementById("reg-name");
        const regPhone = document.getElementById("reg-phone");
        const regEmail = document.getElementById("reg-email");
        const regGender = document.getElementById("reg-gender");
        const regDob = document.getElementById("reg-dob");
        const regAddress = document.getElementById("reg-address");
        const regPass = document.getElementById("reg-password");
        const regConfirmPass = document.getElementById("reg-confirm-password");

        let passesVerification = true;

        if (!regName.value.trim()) passesVerification = flagInputNodeError(regName, "Full biological identity reference is required.");
        if (!regPhone.value.trim()) passesVerification = flagInputNodeError(regPhone, "Contact tracking digits required.");
        if (!regEmail.value.trim()) passesVerification = flagInputNodeError(regEmail, "Communications address route record required.");
        if (!regGender.value) passesVerification = flagInputNodeError(regGender, "Demographic reference identification required.");
        if (!regDob.value) passesVerification = flagInputNodeError(regDob, "Birth metric registry record required.");
        if (!regAddress.value.trim()) passesVerification = flagInputNodeError(regAddress, "Residential location mapping record required.");
        
        if (!regPass.value.trim() || regPass.value.length < 8) {
            passesVerification = flagInputNodeError(regPass, "Password strength target requires minimum 8 characters.");
        }
        if (regPass.value !== regConfirmPass.value) {
            passesVerification = flagInputNodeError(regConfirmPass, "Security signature match conflict detected.");
        }

        if (!passesVerification) return;

        executeSubmitSpinnerAnimation(registerForm, true);
        setTimeout(() => {
            executeSubmitSpinnerAnimation(registerForm, false);
            triggerGlobalNotificationComponent(`Registration verified! Welcome to CareNest, ${regName.value}.`);
            setTimeout(() => {
                appViewport.setAttribute("data-state", "welcome");
                registerForm.reset();
            }, 1000);
        }, 2000);
    });

    // ============================================================================
    // STAGE 4: Sandbox Sandbox Ecosystem Dashboard Click Actions Feedbacks
    // ============================================================================
    sandboxFeatureCards.forEach(card => {
        card.addEventListener("click", () => {
            const title = card.querySelector("h5").textContent;
            triggerGlobalNotificationComponent(`Sandbox Event: Initializing module telemetry tracking for "${title}"...`);
        });
    });

    // Helper Utility Component Animations Engines
    function executeSubmitSpinnerAnimation(formTarget, activatingState) {
        const primaryActionButton = formTarget.querySelector(".auth-submit-btn");
        const normalTextSpan = primaryActionButton.querySelector(".submit-btn-text");
        const structuralSpinnerNode = primaryActionButton.querySelector(".submit-btn-spinner-node");

        if (activatingState) {
            normalTextSpan.classLists.add("hidden");
            structuralSpinnerNode.classList.remove("hidden");
            structuralSpinnerNode.classList.add("btn-loader");
            primaryActionButton.style.pointerEvents = "none";
        } else {
            normalTextSpan.classList.remove("hidden");
            structuralSpinnerNode.classList.add("hidden");
            structuralSpinnerNode.classList.remove("btn-loader");
            primaryActionButton.style.pointerEvents = "auto";
        }
    }

    function triggerGlobalNotificationComponent(messageString) {
        globalToastNode.textContent = messageString;
        globalToastNode.classList.remove("hidden");
        globalToastNode.offsetHeight; // Reflow browser matrix layer synchronization trigger
        globalToastNode.classList.add("toast-active");

        setTimeout(() => {
            globalToastNode.classList.remove("toast-active");
            setTimeout(() => { globalToastNode.classList.add("hidden"); }, 300);
        }, 3500);
    }
});
