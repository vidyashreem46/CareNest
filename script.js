/**
 * CareNest SaaS Enterprise Core - Application State & Architecture Controller
 * Optimized for Premium UX transitions, absolute data validation, and accessibility.
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- SEED LOCAL MOCK DATABASE FOR DUPLICATE REDUCTION VERIFICATION ---
    if (!localStorage.getItem("carenest_vault")) {
        localStorage.setItem("carenest_vault", JSON.stringify([
            { email: "demo@carenest.com", phone: "9876543210", password: "Password123!", name: "Demo User" }
        ]));
    }

    // --- APPLICATION VIEW STATE MANAGER CORE ---
    const viewportNode = document.getElementById("main-app-container");
    
    function setAppViewState(targetStateView) {
        viewportNode.setAttribute("data-view", targetStateView);
        // Dispatch structured accessibility focus management update
        const targetedPanel = document.getElementById(`view-${targetStateView.split('-')[0]}`);
        if (targetedPanel) {
            targetedPanel.setAttribute("tabindex", "-1");
            targetedPanel.focus();
        }
    }

    // --- STAGE 1: CINEMATIC STORY ONBOARDING MECHANICS ---
    const storyNodes = document.querySelectorAll(".story-node");
    const gateActionBlock = document.querySelector(".story-gate-action");
    const gateTriggerBtn = document.getElementById("btn-gate-start");
    
    let activeStoryStepIndex = 0;
    const storyFrameHoldDuration = 2400;

    function runStorySequenceLoop() {
        if (activeStoryStepIndex < storyNodes.length) {
            if (activeStoryStepIndex > 0) {
                storyNodes[activeStoryStepIndex - 1].classList.remove("active");
                storyNodes[activeStoryStepIndex - 1].classList.add("passed");
            }
            storyNodes[activeStoryStepIndex].classList.add("active");
            activeStoryStepIndex++;
            setTimeout(runStorySequenceLoop, storyFrameHoldDuration);
        } else {
            if (storyNodes.length > 0) {
                storyNodes[storyNodes.length - 1].classList.remove("active");
                storyNodes[storyNodes.length - 1].classList.add("passed");
            }
            setTimeout(() => {
                gateActionBlock.classList.add("active-gate");
            }, 300);
        }
    }
    // Launch story on initialize frame
    setTimeout(runStorySequenceLoop, 400);

    gateTriggerBtn.addEventListener("click", () => setAppViewState("welcome"));

    // --- STAGE 2: PATHWAY SELECTORS LINKAGES ---
    document.getElementById("btn-goto-signin").addEventListener("click", () => setAppViewState("signin"));
    document.getElementById("btn-goto-register").addEventListener("click", () => setAppViewState("register"));
    
    document.getElementById("btn-goto-guest").addEventListener("click", () => {
        configureSessionIdentityState(true, null);
        dispatchGlobalToastNotification("Initialized Read-Only Guest Exploration Session Mode.");
        setAppViewState("dashboard");
    });

    document.querySelectorAll(".btn-back-to-welcome").forEach(btn => {
        btn.addEventListener("click", () => setAppViewState("welcome"));
    });

    // --- USER SESSION PROFILE GLOBAL STATE MATRIX ---
    let isGuestActiveMode = true;
    let loggedInUserEntity = null;

    function configureSessionIdentityState(guestStatus, accountModel) {
        isGuestActiveMode = guestStatus;
        loggedInUserEntity = accountModel;
        const identityBadge = document.getElementById("dashboard-user-badge");
        
        if (isGuestActiveMode) {
            identityBadge.textContent = "Guest Session";
            identityBadge.style.background = "#E3F2FD";
            identityBadge.style.color = "#1565C0";
        } else {
            identityBadge.textContent = accountModel.name;
            identityBadge.style.background = "#E8F5E9";
            identityBadge.style.color = "#2E8B57";
        }
    }

    // --- UNIVERSAL UTILITY DATA SANITIZATION FUNCTION ---
    function cleanAndSanitizeInput(rawText) {
        let text = rawText.trim();
        // Prevent basic cross-site scripting script injection blocks
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // --- PREMIUM INTERACTIVE TOAST DISPATCH NODE NOTIFICATION ---
    const toastContainerNode = document.getElementById("carenest-toast-hub");
    let toastHaltTimeoutRef = null;

    function dispatchGlobalToastNotification(announcementText) {
        clearTimeout(toastHaltTimeoutRef);
        toastContainerNode.textContent = announcementText;
        toastContainerNode.classList.remove("hidden");
        // Trigger browser structural reflow force parameter
        toastContainerNode.offsetHeight;
        toastContainerNode.classList.add("active");

        toastHaltTimeoutRef = setTimeout(() => {
            toastContainerNode.classList.remove("active");
            setTimeout(() => toastContainerNode.classList.add("hidden"), 300);
        }, 4000);
    }

    // --- PASSWORD MASK INPUT ELEMENT VISIBILITY TOGGLERS ---
    document.querySelectorAll(".btn-mask-toggle").forEach(toggler => {
        toggler.addEventListener("click", (e) => {
            const associatedInput = document.getElementById(e.target.getAttribute("data-target"));
            if (associatedInput.type === "password") {
                associatedInput.type = "text";
                e.target.textContent = "Hide";
            } else {
                associatedInput.type = "password";
                e.target.textContent = "Show";
            }
        });
    });

    // --- INPUT TARGET ERROR STYLING REMOVAL LISTENERS LOOP ---
    document.querySelectorAll("form input, form select").forEach(element => {
        element.addEventListener("input", () => {
            const validationRow = element.closest(".form-group-row");
            if (validationRow) {
                validationRow.classList.remove("has-error");
                const targetErrorLabel = validationRow.querySelector(".field-error-message");
                if (targetErrorLabel) targetErrorLabel.textContent = "";
            }
        });
    });

    function flagInputFieldError(elementNode, dynamicErrorMessage) {
        const validationRow = elementNode.closest(".form-group-row");
        if (validationRow) {
            validationRow.classList.add("has-error");
            const targetErrorLabel = validationRow.querySelector(".field-error-message");
            if (targetErrorLabel) targetErrorLabel.textContent = dynamicErrorMessage;
        }
        return false;
    }

    // --- STAGE 3: CAPS LOCK MONITOR INTERFACE MECHANIC ---
    const siPasswordField = document.getElementById("si-password");
    const capsWarningBanner = document.getElementById("signin-caps-warning");

    siPasswordField.addEventListener("keyup", (event) => {
        if (event.getModifierState && event.getModifierState("CapsLock")) {
            capsWarningBanner.classList.remove("hidden");
        } else {
            capsWarningBanner.classList.add("hidden");
        }
    });

    // --- STAGE 4: PROXY AUTHENTICATION SIGN IN FORM CONTROL ---
    const targetLoginFormNode = document.getElementById("form-carenest-login");

    targetLoginFormNode.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const loginEmailOrUser = document.getElementById("si-email");
        const loginPassNode = document.getElementById("si-password");
        
        const userCleanInput = cleanAndSanitizeInput(loginEmailOrUser.value);
        const passCleanInput = cleanAndSanitizeInput(loginPassNode.value);
        
        let operationValidFlag = true;

        if (!userCleanInput) operationValidFlag = flagInputFieldError(loginEmailOrUser, "Please input your verified registration identifier address.");
        if (!passCleanInput) operationValidFlag = flagInputFieldError(loginPassNode, "Security system pass code entry signature required.");

        if (!operationValidFlag) return;

        // Display Loading Processing State Transitions Elements
        const primarySubmitBtn = targetLoginFormNode.querySelector("button[type='submit']");
        const submitLabelText = primarySubmitBtn.querySelector(".btn-label-text");
        const submitSpinnerNode = primarySubmitBtn.querySelector(".btn-spinner");

        submitLabelText.classList.add("hidden");
        submitSpinnerNode.classList.remove("hidden");
        primarySubmitBtn.disabled = true;

        setTimeout(() => {
            // Revert state indicators back
            submitLabelText.classList.remove("hidden");
            submitSpinnerNode.classList.add("hidden");
            primarySubmitBtn.disabled = false;

            const accountsArray = JSON.parse(localStorage.getItem("carenest_vault"));
            const pinpointedProfile = accountsArray.find(x => x.email.toLowerCase() === userCleanInput.toLowerCase() || x.phone === userCleanInput);

            if (pinpointedProfile && pinpointedProfile.password === passCleanInput) {
                configureSessionIdentityState(false, pinpointedProfile);
                dispatchGlobalToastNotification(`Welcome back, ${pinpointedProfile.name}. Framework initialized.`);
                targetLoginFormNode.reset();
                setAppViewState("dashboard");
            } else {
                dispatchGlobalToastNotification("Authentication mismatched signature credentials.");
                flagInputFieldError(loginPassNode, "Access denied. Credentials do not match our database records.");
            }
        }, 1200);
    });

    // --- STAGE 5: ADVANCED ACCOUNT REGISTRATION ANALYSIS FLOWS ---
    const regPasswordInput = document.getElementById("rg-password");
    const strengthIndicatorBar = document.getElementById("strength-bar");
    const strengthIndicatorLabel = document.getElementById("strength-label");

    regPasswordInput.addEventListener("input", () => {
        const value = regPasswordInput.value;
        if (!value) {
            strengthIndicatorBar.removeAttribute("data-strength");
            strengthIndicatorLabel.textContent = "Strength: None";
            return;
        }
        
        let validationPointsCount = 0;
        if (/[A-Z]/.test(value)) validationPointsCount++;
        if (/[a-z]/.test(value)) validationPointsCount++;
        if (/[0-9]/.test(value)) validationPointsCount++;
        if (/[^A-Za-z0-9]/.test(value)) validationPointsCount++;
        if (value.length >= 8) validationPointsCount++;

        if (validationPointsCount <= 2) {
            strengthIndicatorBar.setAttribute("data-strength", "weak");
            strengthIndicatorLabel.textContent = "Strength: Weak";
        } else if (validationPointsCount <= 4) {
            strengthIndicatorBar.setAttribute("data-strength", "medium");
            strengthIndicatorLabel.textContent = "Strength: Medium";
        } else {
            strengthIndicatorBar.setAttribute("data-strength", "strong");
            strengthIndicatorLabel.textContent = "Strength: Strong";
        }
    });

    const targetRegisterForm = document.getElementById("form-carenest-register");
    targetRegisterForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameNode = document.getElementById("rg-name");
        const phoneNode = document.getElementById("rg-phone");
        const emailNode = document.getElementById("rg-email");
        const genderNode = document.getElementById("rg-gender");
        const dobNode = document.getElementById("rg-dob");
        const addressNode = document.getElementById("rg-address");
        const passNode = document.getElementById("rg-password");
        const confirmNode = document.getElementById("rg-confirm");

        const cName = cleanAndSanitizeInput(nameNode.value);
        const cPhone = cleanAndSanitizeInput(phoneNode.value);
        const cEmail = cleanAndSanitizeInput(emailNode.value);
        const cGender = genderNode.value;
        const cDob = dobNode.value;
        const cAddress = cleanAndSanitizeInput(addressNode.value);
        const cPass = cleanAndSanitizeInput(passNode.value);
        const cConfirm = cleanAndSanitizeInput(confirmNode.value);

        let structuralPassingState = true;

        if (!cName) structuralPassingState = flagInputFieldError(nameNode, "Identity profile naming is mandatory.");
        
        // Strict 10 Digits Phone Validation Engine
        if (!/^\d{10}$/.test(cPhone)) {
            structuralPassingState = structuralPassingState = flagInputFieldError(phoneNode, "Phone contact matrix must contain exactly 10 digits.");
        }
        
        // Standard Comprehensive Email Format Regex Checks
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail)) {
            structuralPassingState = flagInputFieldError(emailNode, "Provide a standard operational email tracking address layout.");
        }
        
        if (!cGender) structuralPassingState = flagInputFieldError(genderNode, "Select a biological baseline parameter choice value.");
        if (!cDob) structuralPassingState = flagInputFieldError(dobNode, "Profile birth metrics date record specification is required.");
        if (!cAddress) structuralPassingState = flagInputFieldError(addressNode, "Physical residential shipping parameter coordinates location required.");

        // Advanced Password Complexity Matrix Enforcement Enforcement
        const structureCheckRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!structureCheckRegex.test(cPass)) {
            structuralPassingState = flagInputFieldError(passNode, "Requires ≥8 metrics combining casing scales, digits, and punctuation.");
        }

        if (cPass !== cConfirm) {
            structuralPassingState = flagInputFieldError(confirmNode, "Verification entry error. Cross confirm structural passwords signatures mismatch.");
        }

        if (!structuralPassingState) return;

        // Prevent Duplicate Database Accounts Verification Blocks
        const dynamicVaultArray = JSON.parse(localStorage.getItem("carenest_vault"));
        
        if (dynamicVaultArray.some(x => x.email.toLowerCase() === cEmail.toLowerCase())) {
            return flagInputFieldError(emailNode, "This standard email routing profile is already linked to another active account.");
        }
        if (dynamicVaultArray.some(x => x.phone === cPhone)) {
            return flagInputFieldError(phoneNode, "This structural hardware device communications telephone number is already active.");
        }

        // Write New Account Vector Model Records Data Elements
        const prospectiveAccountInstance = { email: cEmail, phone: cPhone, password: cPass, name: cName, gender: cGender, dob: cDob, address: cAddress };
        dynamicVaultArray.push(prospectiveAccountInstance);
        localStorage.setItem("carenest_vault", JSON.stringify(dynamicVaultArray));

        dispatchGlobalToastNotification("Profile registered successfully into CareNest directory!");
        targetRegisterForm.reset();
        strengthIndicatorBar.removeAttribute("data-strength");
        strengthIndicatorLabel.textContent = "Strength: None";
        
        // Auto Route back to Login Workspace state views
        setAppViewState("signin");
    });

    // --- STAGE 6: ACCOUNT RECOVERY WORKSPACE MULTI-STAGE LOGIC MATRIX ---
    document.getElementById("btn-trigger-forgot").addEventListener("click", () => {
        setAppViewState("forgot");
        renderForgotPipelineStepModule("email");
    });
    
    document.getElementById("btn-forgot-back-to-si").addEventListener("click", () => setAppViewState("signin"));

    const fgEmailInputNode = document.getElementById("fg-email");
    const fgOtpInputNode = document.getElementById("fg-otp");
    const fgNewPassInputNode = document.getElementById("fg-new-pass");
    const fgConfirmPassInputNode = document.getElementById("fg-confirm-pass");

    let trackingActiveRecoveryEmailStr = "";
    let systemGeneratedMockOtpToken = "";
    let remainingOtpAttemptsCounter = 3;
    let otpExpirationTimerCountdown = null;
    let resendTokenDelayTimerCountdown = null;

    function renderForgotPipelineStepModule(subModuleStepIdStr) {
        document.querySelectorAll(".forgot-step-module").forEach(mod => mod.classList.add("hidden"));
        document.getElementById(`forgot-step-${subModuleStepIdStr}`).classList.remove("hidden");
    }

    // Step A Handler: Dispatch Token Trigger Event
    document.getElementById("btn-forgot-send-otp").addEventListener("click", () => {
        const cleanRecovEmail = cleanAndSanitizeInput(fgEmailInputNode.value);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanRecovEmail)) {
            return flagInputFieldError(fgEmailInputNode, "Enter a valid account email coordinate layout.");
        }

        const dynamicVaultArray = JSON.parse(localStorage.getItem("carenest_vault"));
        const accountMatch = dynamicVaultArray.find(x => x.email.toLowerCase() === cleanRecovEmail.toLowerCase());

        if (!accountMatch) {
            return flagInputFieldError(fgEmailInputNode, "No registered infrastructure profile record links to this email.");
        }

        trackingActiveRecoveryEmailStr = cleanRecovEmail;
        systemGeneratedMockOtpToken = String(Math.floor(1000 + Math.random() * 9000));
        remainingOtpAttemptsCounter = 3;

        renderForgotPipelineStepModule("otp");
        
        // Show mock OTP to developer workspace screen for instant sandbox workflow inspection
        const hintDisplayBox = document.getElementById("mock-otp-display");
        hintDisplayBox.textContent = `[SANDBOX HINT] Security Token Dispatched Sequence: ${systemGeneratedMockOtpToken}`;

        dispatchGlobalToastNotification("Authorization OTP token sequence generated.");
        initializeRecoveryOtpCountdownTimers();
    });

    function initializeRecoveryOtpCountdownTimers() {
        clearInterval(otpExpirationTimerCountdown);
        clearInterval(resendTokenDelayTimerCountdown);

        let secondsRemainingBeforeExpiry = 300; // 5 Minutes
        const expirationTrackerLabelText = document.getElementById("otp-countdown-text");
        
        otpExpirationTimerCountdown = setInterval(() => {
            secondsRemainingBeforeExpiry--;
            let computedMinutes = String(Math.floor(secondsRemainingBeforeExpiry / 60)).padStart(2, '0');
            let computedSeconds = String(secondsRemainingBeforeExpiry % 60).padStart(2, '0');
            expirationTrackerLabelText.textContent = `Expires in: ${computedMinutes}:${computedSeconds}`;

            if (secondsRemainingBeforeExpiry <= 0) {
                clearInterval(otpExpirationTimerCountdown);
                systemGeneratedMockOtpToken = ""; // Void session keys
                dispatchGlobalToastNotification("Security authorization OTP key verification window expired.");
                setAppViewState("signin");
            }
        }, 1000);

        let delayDurationResendAllowance = 30; // 30 seconds
        const triggerResendActionBtn = document.getElementById("btn-forgot-resend-otp");
        triggerResendActionBtn.classList.remove("hidden");
        triggerResendActionBtn.disabled = true;

        resendTokenDelayTimerCountdown = setInterval(() => {
            delayDurationResendAllowance--;
            triggerResendActionBtn.textContent = `Resend Code (${delayDurationResendAllowance}s)`;
            
            if (delayDurationResendAllowance <= 0) {
                clearInterval(resendTokenDelayTimerCountdown);
                triggerResendActionBtn.textContent = "Resend Code";
                triggerResendActionBtn.disabled = false;
            }
        }, 1000);
    }

    // Secondary Resend Action Handler Binding
    document.getElementById("btn-forgot-resend-otp").addEventListener("click", () => {
        systemGeneratedMockOtpToken = String(Math.floor(1000 + Math.random() * 9000));
        remainingOtpAttemptsCounter = 3;
        document.getElementById("mock-otp-display").textContent = `[SANDBOX HINT] New Token: ${systemGeneratedMockOtpToken}`;
        dispatchGlobalToastNotification("Fresh token data sequence pushed.");
        initializeRecoveryOtpCountdownTimers();
    });

    // Step B Handler: Verify Token Sequences
    document.getElementById("btn-forgot-verify-otp").addEventListener("click", () => {
        const structuralInputOtp = cleanAndSanitizeInput(fgOtpInputNode.value);
        
        if (structuralInputOtp !== systemGeneratedMockOtpToken) {
            remainingOtpAttemptsCounter--;
            if (remainingOtpAttemptsCounter <= 0) {
                clearInterval(otpExpirationTimerCountdown);
                clearInterval(resendTokenDelayTimerCountdown);
                dispatchGlobalToastNotification("Security system maximum execution validation boundaries breached. Recovery terminated.");
                setAppViewState("signin");
            } else {
                flagInputFieldError(fgOtpInputNode, `Invalid verification signature. Remaining validation channels: ${remainingOtpAttemptsCounter}`);
            }
            return;
        }

        // Kill timing configurations cleanly
        clearInterval(otpExpirationTimerCountdown);
        clearInterval(resendTokenDelayTimerCountdown);
        renderForgotPipelineStepModule("reset");
        dispatchGlobalToastNotification("Identity authorization key match success. Upgrade password structural constraints.");
    });

    // Step C Handler: Process Password Overwrites Modification Parameters
    document.getElementById("btn-forgot-execute-reset").addEventListener("click", () => {
        const passVal = cleanAndSanitizeInput(fgNewPassInputNode.value);
        const confirmVal = cleanAndSanitizeInput(fgConfirmPassInputNode.value);
        
        const verificationPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!verificationPolicyRegex.test(passVal)) {
            return flagInputFieldError(fgNewPassInputNode, "Password structural integrity failure. Meet standard structural policy rules.");
        }
        if (passVal !== confirmVal) {
            return flagInputFieldError(fgConfirmPassInputNode, "Cross confirm parameters verification mismatch error data.");
        }

        const databaseWorkspaceCollection = JSON.parse(localStorage.getItem("carenest_vault"));
        const targetIndexElement = databaseWorkspaceCollection.findIndex(x => x.email.toLowerCase() === trackingActiveRecoveryEmailStr.toLowerCase());

        if (targetIndexElement !== -1) {
            databaseWorkspaceCollection[targetIndexElement].password = passVal;
            localStorage.setItem("carenest_vault", JSON.stringify(databaseWorkspaceCollection));
            dispatchGlobalToastNotification("Password mapping changes overwritten successfully!");
            
            // Clean dynamic parameters cache traces out
            fgEmailInputNode.value = "";
            fgOtpInputNode.value = "";
            fgNewPassInputNode.value = "";
            fgConfirmPassInputNode.value = "";
            
            setAppViewState("signin");
        }
    });

    // --- STAGE 7: INTERACTIVE FUNCTIONAL DASHBOARD INTERFACES & PROTECTION LAYERS ---
    
    // Controlled Framework Object Repositories Mock Dynamic Dataset Arrays Injection Mapping Engine
    const mockPlatformModuleContentData = {
        "find-doctors": "<h4>Operational Medical Directory Framework Nodes</h4><p>Locate specialists nearby using simulated proximity mapping. Our database includes 14 domestic family health system units, general practice pods, and diagnostic units inside your geographic region.</p>",
        "book-appointment": "<h4>Central Appointment Scheduling Module Sandbox</h4><p>Configure digital video diagnostics channels or face-to-face clinical tracking timeslots. Review availability timelines below to schedule verified clinical validation consultation blocks.</p>",
        "medicine-reminder": "<h4>Family Chronobiology Medical Dosage Framework</h4><p>Configure automated family prescription dosage tracking notifications loops. Your profile dashboard supports multi-tier pharmaceutical alarm alerts configured for structural medicine compliance tracking.</p>",
        "health-records": "<h4>E2EE Decentralized Electronic Diagnostics Health Records Container</h4><p>Access structured database lists containing blood panels, radiological mapping reports, and physical wellness metric history documents.</p>",
        "emergency-contacts": "<h4>Emergency Direct Pipeline System Interface</h4><p>Broadcast high-priority system alert beacons immediately containing structural network tracking parameters, cellular triangulation profiles, and primary contact warning routes.</p>"
    };

    const interceptorModalGateNode = document.getElementById("carenest-modal-gate");
    const operationalFeatureModalBox = document.getElementById("carenest-feature-modal");
    const injectedWorkspaceContainerPane = document.getElementById("f-modal-content-injection");

    // Dynamic Features Grid Delegation Action Click Iterators
    document.querySelectorAll(".secure-action").forEach(cardNode => {
        cardNode.addEventListener("click", () => {
            const systemTargetActionKey = cardNode.getAttribute("data-action");

            // 1. Intercept Access Requests mapping for Upcoming Future Roadmaps Modules
            if (systemTargetActionKey === "ai-assistant" || systemTargetActionKey === "family-tracker") {
                dispatchGlobalToastNotification("Module engineering roadmap active. Features deploy in the next platform release cycle.");
                return;
            }

            // 2. Intercept Operational Profiles Activities under Guest Mode States
            if (isGuestActiveMode) {
                interceptorModalGateNode.classList.remove("hidden");
                return;
            }

            // 3. Render Sandbox Functional Content Interfaces to authenticated profiles
            const matchingContentMarkupStr = mockPlatformModuleContentData[systemTargetActionKey] || "<p>Operational sandbox component layout environment running ready for configuration.</p>";
            injectedWorkspaceContainerPane.innerHTML = matchingContentMarkupStr;
            operationalFeatureModalBox.classList.remove("hidden");
        });
    });

    // Close Modal Interfaces Commands
    document.getElementById("btn-modal-dismiss").addEventListener("click", () => {
        interceptorModalGateNode.classList.add("hidden");
    });

    document.getElementById("btn-f-modal-dismiss").addEventListener("click", () => {
        operationalFeatureModalBox.classList.add("hidden");
        injectedWorkspaceContainerPane.innerHTML = "";
    });

    document.getElementById("btn-modal-auth-redirect").addEventListener("click", () => {
        interceptorModalGateNode.classList.add("hidden");
        setAppViewState("register");
    });

    // Session Log Out Command
    document.getElementById("btn-dashboard-logout").addEventListener("click", () => {
        configureSessionIdentityState(true, null);
        dispatchGlobalToastNotification("Terminated active system session profiling safely.");
        setAppViewState("welcome");
    });
});
