// ============================================================================
// CareNest SaaS Enterprise Core Application System Engine Layout Mechanics
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Core Engine Structural DOM Traversal Target Mapping Cache
    const appViewport = document.querySelector(".app-viewport");
    const gateTrigger = document.getElementById("gate-trigger");
    const narrativeFrames = document.querySelectorAll(".narrative-frame");
    const actionGateBlock = document.querySelector(".action-gate");
    
    // Interactive Authentication Input Sub-Node Maps
    const authForm = document.getElementById("carenest-core-auth-form");
    const inputUsername = document.getElementById("input-username");
    const inputPassword = document.getElementById("input-password");
    const toggleMaskAction = document.getElementById("password-visibility-toggle");
    const submitActionBtn = document.getElementById("auth-submit-action");
    const guestAccessTrigger = document.getElementById("guest-access-trigger");
    const rollbackDevTrigger = document.getElementById("rollback-dev-trigger");
    
    // Application System Global Component Anchors
    const toastNotificationNode = document.getElementById("carenest-global-toast");

    // Runtime Engine Structural Flow Timing Configuration States
    let currentFrameIndex = 0;
    const narrativePresentationIntervalTime = 2500; 

    // ============================================================================
    // STAGE 1: Automated Narrative Animation Sequence Lifecycle Orchestrator
    // ============================================================================
    
    function initializeNarrativeSequenceTimeline() {
        if (currentFrameIndex < narrativeFrames.length) {
            // Check for processing operational cycles on frame pointers
            if (currentFrameIndex > 0) {
                narrativeFrames[currentFrameIndex - 1].classList.remove("active-frame");
                narrativeFrames[currentFrameIndex - 1].classList.add("exit-frame");
            }
            
            narrativeFrames[currentFrameIndex].classList.add("active-frame");
            currentFrameIndex++;
            
            // Loop evaluation steps until maximum limit thresholds reached
            setTimeout(initializeNarrativeSequenceTimeline, narrativePresentationIntervalTime);
        } else {
            // Gracefully terminate the textual frame rotation stack
            if (narrativeFrames.length > 0) {
                narrativeFrames[narrativeFrames.length - 1].classList.remove("active-frame");
                narrativeFrames[narrativeFrames.length - 1].classList.add("exit-frame");
            }
            
            // Render call to action interface element visible
            setTimeout(() => {
                actionGateBlock.classList.add("visible-gate");
            }, 300);
        }
    }

    // Execute sequence mapping pipeline exactly after a 500ms startup threshold latency delay
    setTimeout(initializeNarrativeSequenceTimeline, 500);

    // ============================================================================
    // STAGE 2: Interactive Interface State Machine Transition Maps
    // ============================================================================
    
    gateTrigger.addEventListener("click", () => {
        // Execute modern state routing variable shifts triggering hardware acceleration curves
        appViewport.setAttribute("data-state", "auth");
    });

    // ============================================================================
    // STAGE 3: Form Validations & Operational UI Feedback Flows
    // ============================================================================
    
    // Form Input Mask Security State Controller
    toggleMaskAction.addEventListener("click", () => {
        const activeMaskStateType = inputPassword.getAttribute("type") === "password";
        inputPassword.setAttribute("type", activeMaskStateType ? "text" : "password");
        toggleMaskAction.textContent = activeMaskStateType ? "Hide" : "Show";
    });

    // Integrated Toast Event System Dispatch Interface Component
    function dispatchToastAlertNotification(notificationStringMessage) {
        toastNotificationNode.textContent = notificationStringMessage;
        toastNotificationNode.classList.remove("hidden");
        
        // Force rendering architecture calculation layout invalidation to cycle animations
        toastNotificationNode.offsetHeight;
        toastNotificationNode.classList.add("toast-active");

        setTimeout(() => {
            toastNotificationNode.classList.remove("toast-active");
            setTimeout(() => {
                toastNotificationNode.classList.add("hidden");
            }, 300);
        }, 4000);
    }

    // High Fidelity Clear Validation Mechanics Node Reset Function
    function clearFieldValidationInvalidationStatus(targetInputNodeFrame) {
        const targetedParentRowNodeContainer = targetInputNodeFrame.closest(".form-row");
        if (targetedParentRowNodeContainer) {
            targetedParentRowNodeContainer.classList.remove("invalid-node");
            const feedbackTextNode = targetedParentRowNodeContainer.querySelector(".validation-feedback-node");
            if (feedbackTextNode) feedbackTextNode.textContent = "";
        }
    }

    // Structural Form Field Validity Evaluation Check Block Rule
    function executeFormFieldValidityInspection(targetInputNodeFrame, validationFailureAlertString) {
        const targetedParentRowNodeContainer = targetInputNodeFrame.closest(".form-row");
        if (!targetInputNodeFrame.value.trim()) {
            if (targetedParentRowNodeContainer) {
                targetedParentRowNodeContainer.classList.add("invalid-node");
                const feedbackTextNode = targetedParentRowNodeContainer.querySelector(".validation-feedback-node");
                if (feedbackTextNode) feedbackTextNode.textContent = validationFailureAlertString;
            }
            return false;
        }
        clearFieldValidationInvalidationStatus(targetInputNodeFrame);
        return true;
    }

    // Real-Time Interactivity Form Field Typing Focus Events Listeners 
    inputUsername.addEventListener("input", () => clearFieldValidationInvalidationStatus(inputUsername));
    inputPassword.addEventListener("input", () => clearFieldValidationInvalidationStatus(inputPassword));

    // Form Submission Integration Authentication Verification Router
    authForm.addEventListener("submit", (submitEventCapturedToken) => {
        submitEventCapturedToken.preventDefault();
        
        // Form field analytical checkpoint sequence loops
        const usernameVerificationPassStatus = executeFormFieldValidityInspection(inputUsername, "Username or registered email address string is required.");
        const passwordVerificationPassStatus = executeFormFieldValidityInspection(inputPassword, "Account verification security access hash password string is required.");

        if (!usernameVerificationPassStatus || !passwordVerificationPassStatus) {
            dispatchToastAlertNotification("Please resolve validation errors before continuing.");
            return;
        }

        // Toggle interactive states across processing run loops
        const interfaceLabelButtonTextNode = submitActionBtn.querySelector(".submit-btn-text");
        const interfaceSpinnerLoadingNode = submitActionBtn.querySelector(".submit-btn-spinner-node");

        interfaceLabelButtonTextNode.classList.add("hidden");
        interfaceSpinnerLoadingNode.classList.remove("hidden");
        interfaceSpinnerLoadingNode.classList.add("btn-loader");
        submitActionBtn.disabled = true;

        // Mock enterprise API payload network operational dispatch delay
        setTimeout(() => {
            // Restore structural interface execution capabilities
            interfaceLabelButtonTextNode.classList.remove("hidden");
            interfaceSpinnerLoadingNode.classList.add("hidden");
            interfaceSpinnerLoadingNode.classList.remove("btn-loader");
            submitActionBtn.disabled = false;
            
            dispatchToastAlertNotification("Authentication verified. Loading secure workspace environment...");
            
            // Advance system workflow state parameters cleanly directly into phase 2 component layout paths
            setTimeout(() => {
                appViewport.setAttribute("data-state", "placeholder");
                authForm.reset();
                toggleMaskAction.textContent = "Show";
                inputPassword.setAttribute("type", "password");
            }, 1000);

        }, 2000);
    });

    // Secondary Ecosystem Access Interface Routing Channels
    guestAccessTrigger.addEventListener("click", () => {
        dispatchToastAlertNotification("Initializing sandbox configuration access privileges...");
        setTimeout(() => {
            appViewport.setAttribute("data-state", "placeholder");
        }, 800);
    });

    // Interface Fallback Recovery Operational Route Methods Map 
    rollbackDevTrigger.addEventListener("click", () => {
        appViewport.setAttribute("data-state", "auth");
    });
});
