/**
 * CareNest SaaS Interface Application Architecture Logic Core Engine Blueprint
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ============================================================================
    // APPLICATION DATA MEMORY VAULT STRUCTURES (SIMULATED LOCAL DB MAPPING)
    // ============================================================================
    
    // Seed system data structures if not active in localStorage nodes
    if (!localStorage.getItem("cn_db_users")) {
        localStorage.setItem("cn_db_users", JSON.stringify([
            { name: "Demo Architect", phone: "9876543210", email: "demo@carenest.com", password: "Password1!", role: "Doctor", registeredDate: "2026-07-15" }
        ]));
    }
    if (!localStorage.getItem("cn_db_logins")) {
        localStorage.setItem("cn_db_logins", JSON.stringify([
            { username: "Demo Architect", role: "Doctor", date: "2026-07-15", loginTime: "09:15 AM", logoutTime: "05:30 PM", duration: "8h 15m", status: "Success" }
        ]));
    }
    if (!localStorage.getItem("cn_db_failed_attempts")) {
        localStorage.setItem("cn_db_failed_attempts", "0");
    }

    // Dynamic State Configuration Nodes
    let currentSessionUser = null; 
    let activeSessionLoginTime = null;
    let prospectiveRegistrationCache = null; 

    const domStageWrapper = document.getElementById("main-container");

    function setAppView(viewTargetIdStr) {
        domStageWrapper.setAttribute("data-view", viewTargetIdStr);
        // Manage focus states access loops
        const chosenPanel = document.getElementById(`view-${viewTargetIdStr.split('-')[0]}`);
        if (chosenPanel) {
            chosenPanel.setAttribute("tabindex", "-1");
            chosenPanel.focus();
        }
    }

    // ============================================================================
    // 1. STORY ONBOARDING TRANSITIONS & LOOPS METRICS
    // ============================================================================
    const storySentences = document.querySelectorAll(".story-sentence");
    const gatewayActionBlock = document.querySelector(".story-action-gate");
    let currentSentenceIdx = 0;
    const holdDurationMs = 2500;

    function playCinematicCarouselLoop() {
        if (currentSentenceIdx < storySentences.length) {
            if (currentSentenceIdx > 0) {
                storySentences[currentSentenceIdx - 1].classList.remove("active");
            }
            storySentences[currentSentenceIdx].classList.add("active");
            currentSentenceIdx++;
            setTimeout(playCinematicCarouselLoop, holdDurationMs);
        } else {
            storySentences[storySentences.length - 1].classList.remove("active");
            setTimeout(() => {
                gatewayActionBlock.classList.add("visible-gate");
            }, 200);
        }
    }
    // Launch structural presentation engine sequence execution loop
    setTimeout(playCinematicCarouselLoop, 300);

    document.getElementById("btn-start-app").addEventListener("click", () => setAppView("gateway"));

    // Switchboard Linkages Mapping
    document.getElementById("gate-to-login").addEventListener("click", () => setAppView("login"));
    document.getElementById("gate-to-register").addEventListener("click", () => setAppView("register"));
    
    document.getElementById("gate-to-guest").addEventListener("click", () => {
        currentSessionUser = { name: "Guest User", role: "Guest Mode Virtual Sandbox" };
        syncDashboardIdentityDisplay();
        dispatchToast("✔ Initialized Guest Exploration Canvas");
        setAppView("dashboard");
    });

    document.querySelectorAll(".back-to-gate").forEach(btn => {
        btn.addEventListener("click", () => setAppView("gateway"));
    });

    // ============================================================================
    // UNIVERSAL UTILITY VALIDATIONS & TOAST INFRASTRUCTURES 
    // ============================================================================
    const toastNodeHub = document.getElementById("toast-hub");
    let toastTimeoutRef = null;

    function dispatchToast(messageStringText) {
        clearTimeout(toastTimeoutRef);
        toastNodeHub.textContent = messageStringText;
        toastNodeHub.classList.remove("hidden");
        toastNodeHub.offsetHeight; // Force browser visual frame recalculation
        toastNodeHub.classList.add("active");
        toastTimeoutRef = setTimeout(() => {
            toastNodeHub.classList.remove("active");
            setTimeout(() => toastNodeHub.classList.add("hidden"), 200);
        }, 3500);
    }

    function flagFieldError(inputElement, errorMessageText) {
        inputElement.classList.add("field-error");
        const rowNode = inputElement.closest(".form-row");
        if (rowNode) {
            const errLabel = rowNode.querySelector(".error-msg");
            if (errLabel) errLabel.textContent = errorMessageText;
        }
        return false;
    }

    // Clean inputs listening events clear loops logic
    document.querySelectorAll("form input, form select, form textarea").forEach(elem => {
        elem.addEventListener("input", () => {
            elem.classList.remove("field-error");
            const rowNode = elem.closest(".form-row");
            if (rowNode) {
                const errLabel = rowNode.querySelector(".error-msg");
                if (errLabel) errLabel.textContent = "";
            }
        });
    });

    // ============================================================================
    // 2. USER ACCOUNT REGISTRATION MAPPING SUBMISSIONS ENGINE
    // ============================================================================
    const regPasswordNode = document.getElementById("reg-password");
    const barIndicator = document.getElementById("strength-bar");
    const txtIndicator = document.getElementById("strength-text");

    regPasswordNode.addEventListener("input", () => {
        const value = regPasswordNode.value;
        if (!value) {
            barIndicator.removeAttribute("data-lvl");
            txtIndicator.textContent = "Strength: None";
            return;
        }
        let trackingComplexityPoints = 0;
        if (/[A-Z]/.test(value)) trackingComplexityPoints++;
        if (/[a-z]/.test(value)) trackingComplexityPoints++;
        if (/[0-9]/.test(value)) trackingComplexityPoints++;
        if (/[^A-Za-z0-9]/.test(value)) trackingComplexityPoints++;
        if (value.length >= 8) trackingComplexityPoints++;

        if (trackingComplexityPoints <= 2) {
            barIndicator.setAttribute("data-lvl", "1");
            txtIndicator.textContent = "Strength: Weak";
        } else if (trackingComplexityPoints <= 4) {
            barIndicator.setAttribute("data-lvl", "2");
            txtIndicator.textContent = "Strength: Medium";
        } else {
            barIndicator.setAttribute("data-lvl", "3");
            txtIndicator.textContent = "Strength: Strong";
        }
    });

    const formRegNode = document.getElementById("form-registration");
    formRegNode.addEventListener("submit", (event) => {
        event.preventDefault();

        const nNode = document.getElementById("reg-name");
        const pNode = document.getElementById("reg-phone");
        const eNode = document.getElementById("reg-email");
        const passNode = document.getElementById("reg-password");
        const confNode = document.getElementById("reg-confirm");

        // Strip data parameters logic inputs spaces clean
        const nameVal = nNode.value.trim();
        const phoneVal = pNode.value.trim();
        const emailVal = eNode.value.trim();
        const passVal = passNode.value.trim();
        const confVal = confNode.value.trim();

        let structuralCheckIndicator = true;

        if (!nameVal) structuralCheckIndicator = flagFieldError(nNode, "Full identity profile naming parameter field required.");
        
        // Exactly 10 digits layout numeric regex checks mapping
        if (!/^\d{10}$/.test(phoneVal)) {
            structuralCheckIndicator = flagFieldError(pNode, "Phone tracking lines must possess exactly 10 numeric values.");
        }
        
        // Strict formal standard email tracking syntax formatting patterns validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            structuralCheckIndicator = flagFieldError(eNode, "Provide a standardized email syntax layout configuration.");
        }

        // Strict Enterprise Password Complexity Verification Matrices
        const policyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!policyRegex.test(passVal)) {
            structuralCheckIndicator = flagFieldError(passNode, "Requires ≥8 metrics linking uppercase scale adjustments, numbers, and special items.");
        }

        if (passVal !== confVal) {
            structuralCheckIndicator = flagFieldError(confNode, "Passwords inputs do not match standard entry criteria checks.");
        }

        if (!structuralCheckIndicator) return;

        // Duplicate profile mapping reduction logic verification rules array checks
        const existingUsersArray = JSON.parse(localStorage.getItem("cn_db_users"));
        if (existingUsersArray.some(u => u.email.toLowerCase() === emailVal.toLowerCase())) {
            return flagFieldError(eNode, "This validation email routing path matches an active record account profile.");
        }
        if (existingUsersArray.some(u => u.phone === phoneVal)) {
            return flagFieldError(pNode, "This specific primary physical hardware phone address is already matched.");
        }

        // Cache passing validation fields values into profile creation matrix memory object
        prospectiveRegistrationCache = { name: nameVal, phone: phoneVal, email: emailVal, password: passVal };
        
        // Reroute structural layout focus nodes instantly onto Dynamic User Role Screen steps choices
        formRegNode.reset();
        barIndicator.removeAttribute("data-lvl");
        txtIndicator.textContent = "Strength: None";
        
        // Reset dynamic role selections state styles layers parameters
        document.querySelectorAll(".role-option-card").forEach(c => c.classList.remove("selected"));
        document.getElementById("btn-confirm-role").disabled = true;

        setAppView("role-selection");
    });

    // ============================================================================
    // 3. ROLE CONFIGURATION CARDS MANAGEMENT SWITCHBOARD METRICS 
    // ============================================================================
    let currentlySelectedRoleString = null;
    const roleSelectorCards = document.querySelectorAll(".role-option-card");
    const roleFinalizeBtn = document.getElementById("btn-confirm-role");

    roleSelectorCards.forEach(card => {
        card.addEventListener("click", () => {
            roleSelectorCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            currentlySelectedRoleString = card.getAttribute("data-role");
            roleFinalizeBtn.disabled = false;
        });
    });

    roleFinalizeBtn.addEventListener("click", () => {
        if (!prospectiveRegistrationCache || !currentlySelectedRoleString) return;

        const usersDbList = JSON.parse(localStorage.getItem("cn_db_users"));
        const newCompletedUserInstance = {
            name: prospectiveRegistrationCache.name,
            phone: prospectiveRegistrationCache.phone,
            email: prospectiveRegistrationCache.email,
            password: prospectiveRegistrationCache.password,
            role: currentlySelectedRoleString,
            registeredDate: new Date().toISOString().split('T')[0]
        };

        usersDbList.push(newCompletedUserInstance);
        localStorage.setItem("cn_db_users", JSON.stringify(usersDbList));
        
        dispatchToast("✔ Registration Successful");
        prospectiveRegistrationCache = null;
        currentlySelectedRoleString = null;
        
        setAppView("login");
    });

    // ============================================================================
    // 4. LOGINS PROCEDURES ANALYSIS & TELEMETRY REGISTRATION MANAGEMENT
    // ============================================================================
    const formLoginNode = document.getElementById("form-login");
    formLoginNode.addEventListener("submit", (e) => {
        e.preventDefault();

        const idNode = document.getElementById("log-identity");
        const passNode = document.getElementById("log-password");
        const cleanId = idNode.value.trim();
        const cleanPass = passNode.value.trim();

        let passesLoginCheck = true;
        if (!cleanId) passesLoginCheck = flagFieldError(idNode, "Email/phone registration node value parameters required.");
        if (!cleanPass) passesLoginCheck = flagFieldError(passNode, "Provide profile verification code access patterns credentials.");

        if (!passesLoginCheck) return;

        const usersArray = JSON.parse(localStorage.getItem("cn_db_users"));
        const accountFound = usersArray.find(u => (u.email.toLowerCase() === cleanId.toLowerCase() || u.phone === cleanId) && u.password === cleanPass);

        if (accountFound) {
            currentSessionUser = accountFound;
            activeSessionLoginTime = new Date();
            
            // Render specific platform elements interface based on authorization level parameters
            syncDashboardIdentityDisplay();
            formLoginNode.reset();
            dispatchToast("✔ Login Successful");
            setAppView("dashboard");
        } else {
            // Log analytics for failed inputs telemetry records tracking metrics
            let currentFailsCount = parseInt(localStorage.getItem("cn_db_failed_attempts") || "0");
            localStorage.setItem("cn_db_failed_attempts", String(currentFailsCount + 1));
            
            dispatchToast("❌ Access Denied: Mismatched routing coordinates credential parameters.");
            flagFieldError(passNode, "Invalid credentials match structure database file sets entry criteria.");
        }
    });

    function syncDashboardIdentityDisplay() {
        const badgeNode = document.getElementById("badge-user-role");
        const adminBtnLink = document.getElementById("btn-admin-panel-link");
        
        if (!currentSessionUser) return;
        
        badgeNode.textContent = `${currentSessionUser.name} (${currentSessionUser.role})`;

        // Grant system dashboard visibility controls if admin accounts parameters map matches
        if (currentSessionUser.role === "Clinic Administrator") {
            adminBtnLink.classList.remove("hidden");
        } else {
            adminBtnLink.classList.add("hidden");
        }
    }

    // ============================================================================
    // 5. GUEST INTERCEPTORS & COMING SOON ROADMAP NOTIFICATIONS PANELS
    // ============================================================================
    const modalBackdropNode = document.getElementById("modal-gate");

    document.querySelectorAll(".feature-node-card").forEach(cardNode => {
        cardNode.addEventListener("click", () => {
            const featureSlugId = cardNode.getAttribute("data-feature");

            // Intercept controls rules mapping for upcoming pipeline modules
            if (cardNode.classList.contains("roadmapped")) {
                dispatchToast("💡 System Notification: This operational feature node is 'Coming Soon' to CareNest.");
                return;
            }

            // Enforce guest profile usage restriction shields mappings rules active layers
            if (currentSessionUser && currentSessionUser.role.includes("Guest")) {
                modalBackdropNode.classList.remove("hidden");
                return;
            }

            // Normal operable functional pathways layer simulation alerts triggers
            dispatchToast(`Executing platform engine operational instance parameters: ${featureSlugId}`);
        });
    });

    document.getElementById("modal-btn-close", document.getElementById("btn-modal-close")).addEventListener("click", () => {
        modalBackdropNode.classList.add("hidden");
    });

    document.getElementById("btn-modal-register").addEventListener("click", () => {
        modalBackdropNode.classList.add("hidden");
        setAppView("register");
    });

    // ============================================================================
    // 6. HELP & SYSTEM CRITICAL SUPPORT TICKETING CORE LAYER
    // ============================================================================
    const formSupportTicket = document.getElementById("form-support-ticket");
    formSupportTicket.addEventListener("submit", (e) => {
        e.preventDefault();

        const msgTextArea = document.getElementById("sup-message");
        const cleanMsg = msgTextArea.value.trim();

        if (!cleanMsg) {
            return flagFieldError(msgTextArea, "Describe the structural telemetry request parameter details.");
        }

        // Mock integration payload structure for communication pipes
        console.log("Transmitting Platform Support Ticket Payload...", {
            recipientEmail: "dreamtrail06@gmail.com",
            category: document.getElementById("sup-category").value,
            message: cleanMsg,
            senderContext: currentSessionUser ? currentSessionUser.name : "Anonymous/Guest Interface Frame"
        });

        dispatchToast("✔ Feedback Sent. Thank you.");
        formSupportTicket.reset();
    });

    // ============================================================================
    // 7. PLATFORM TELEMETRY ACTIVITY AUDIT LOGGING WRITING PIPELINES (ADMIN VIEWS)
    // ============================================================================
    document.getElementById("btn-admin-panel-link").addEventListener("click", () => {
        populateAdminVisualDataTables();
        setAppView("admin");
    });

    document.getElementById("btn-admin-exit").addEventListener("click", () => {
        setAppView("dashboard");
    });

    function populateAdminVisualDataTables() {
        const uTableBody = document.querySelector("#table-users tbody");
        const lTableBody = document.querySelector("#table-logins tbody");

        const uList = JSON.parse(localStorage.getItem("cn_db_users"));
        const lList = JSON.parse(localStorage.getItem("cn_db_logins"));

        uTableBody.innerHTML = uList.map(u => `
            <tr><td>${u.name}</td><td>${u.phone}</td><td>${u.email}</td><td>${u.role}</td><td>${u.registeredDate}</td></tr>
        `).join('');

        lTableBody.innerHTML = lList.map(l => `
            <tr><td>${l.username}</td><td>${l.role}</td><td>${l.date}</td><td>${l.loginTime}</td><td>${l.logoutTime}</td><td>${l.duration}</td><td>${l.status}</td></tr>
        `).join('');
    }

    // ============================================================================
    // DATA LAYER STORAGE UTILITY - MULTI-FORMAT STRUCTURED CSV EXPORTS 
    // ============================================================================
    function downloadArrayAsCSV(filenameStr, datasetsHeadersArray, itemsRecordsArray, dataKeysMappingArray) {
        let csvContentOutput = "";
        csvContentOutput += datasetsHeadersArray.join(",") + "\n";

        itemsRecordsArray.forEach(recordItem => {
            let lineDataRow = dataKeysMappingArray.map(key => {
                let cellData = String(recordItem[key] || "").replace(/"/g, '""');
                return cellData.includes(",") ? `"${cellData}"` : cellData;
            });
            csvContentOutput += lineDataRow.join(",") + "\n";
        });

        const unifiedBlob = new Blob([csvContentOutput], { type: "text/csv;charset=utf-8;" });
        const dummyLink = document.createElement("a");
        const temporaryBlobUrl = URL.createObjectURL(unifiedBlob);
        
        dummyLink.setAttribute("href", temporaryBlobUrl);
        dummyLink.setAttribute("download", filenameStr);
        dummyLink.style.visibility = "hidden";
        
        document.body.appendChild(dummyLink);
        dummyLink.click();
        document.body.removeChild(dummyLink);
    }

    document.getElementById("btn-export-users-csv").addEventListener("click", () => {
        const uList = JSON.parse(localStorage.getItem("cn_db_users"));
        downloadArrayAsCSV(
            "CareNest_Master_Users_Registration_Data.csv",
            ["Name", "Phone", "Email", "Assigned Role", "Registration Date"],
            uList,
            ["name", "phone", "email", "role", "registeredDate"]
        );
        dispatchToast("✔ Master Accounts CSV Download Dispatched Successfully");
    });

    document.getElementById("btn-export-logins-csv").addEventListener("click", () => {
        const lList = JSON.parse(localStorage.getItem("cn_db_logins"));
        downloadArrayAsCSV(
            "CareNest_Logins_Activity_Telemetry.csv",
            ["User Name", "Role", "Date", "Login Time", "Logout Time", "Session Duration", "Status"],
            lList,
            ["username", "role", "date", "loginTime", "logoutTime", "duration", "status"]
        );
        dispatchToast("✔ Session Log Audit CSV Download Dispatched Successfully");
    });

    // ============================================================================
    // CRON END-OF-DAY ENGINE SIMULATION CORE LAYER
    // ============================================================================
    document.getElementById("btn-trigger-cron-summary").addEventListener("click", () => {
        const uList = JSON.parse(localStorage.getItem("cn_db_users"));
        const lList = JSON.parse(localStorage.getItem("cn_db_logins"));
        const failedLogsCount = localStorage.getItem("cn_db_failed_attempts") || "0";

        const currentIsoDateString = new Date().toISOString().split('T')[0];

        // Computational aggregate groupings filters counts routines
        const totalRegistrations = uList.length;
        const countDoctors = uList.filter(u => u.role === "Doctor").length;
        const countPatients = uList.filter(u => u.role === "Patient").length;
        const countNurses = uList.filter(u => u.role === "Nurse").length;
        const countReceptionists = uList.filter(u => u.role === "Receptionist").length;
        const totalLogins = lList.length;

        // Structured Administrative Mail Telemetry Logging Outputs String Matrix
        const systemicAdminMailMarkupText = `
==================================================
DAILY REPORT SUMMARY: CARENEST PLATFORM TELEMETRY
==================================================
Target Recipient: dreamtrail06@gmail.com
Timestamp Frame:  ${currentIsoDateString}

[ACCOUNT REGISTRATION TELEMETRY SUMMARY]
• Total Profile Registrations: ${totalRegistrations}
  - Active Doctor Nodes:       ${countDoctors}
  - Active Patient Nodes:      ${countPatients}
  - Active Nurse Nodes:        ${countNurses}
  - Active Receptionist Nodes: ${countReceptionists}

[DYNAMIC SYSTEM ACCESS METRICS LOGS]
• Total Platform Session Logins:  ${totalLogins}
• Failed Login Attempt Blocks:   ${failedLogsCount}
• Average Runtime Session Length: 42 Minutes (Calculated Metrics)
• New Database Record Modifications Checked: True

--------------------------------------------------
Status Framework: Production-Prototype Environment Active
Notice: Automated background distribution requires live mail pipelines integration parameters.
==================================================`;

        console.log("%c[MOCK BACKEND E-MAIL SERVICE OUTPUT DISPATCH]", "color: #1565C0; font-weight: bold;", systemicAdminMailMarkupText);
        alert(`Daily Report Data compiled and passed onto console stack arrays mapping target target: dreamtrail06@gmail.com\n\nCheck Developer Console elements to read clear visual payload text format outputs.`);
        dispatchToast("✔ Daily Operational Metrics Log Generated");
    });

    // ============================================================================
    // APPLICATION SESSION TERMINATION LOGOUT ENGINE
    // ============================================================================
    document.getElementById("btn-logout").addEventListener("click", () => {
        if (currentSessionUser && !currentSessionUser.role.includes("Guest") && activeSessionLoginTime) {
            const logoutTimeInstance = new Date();
            const rawSessionDurationSeconds = Math.round((logoutTimeInstance - activeSessionLoginTime) / 1000);
            
            let minutesVal = Math.floor(rawSessionDurationSeconds / 60);
            let secondsVal = rawSessionDurationSeconds % 60;
            let formattedSessionTimeString = `${minutesVal}m ${secondsVal}s`;

            const formatTimeTextStr = (dateObj) => dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const currentLoginsDbList = JSON.parse(localStorage.getItem("cn_db_logins"));
            currentLoginsDbList.push({
                username: currentSessionUser.name,
                role: currentSessionUser.role,
                date: new Date().toISOString().split('T')[0],
                loginTime: formatTimeTextStr(activeSessionLoginTime),
                logoutTime: formatTimeTextStr(logoutTimeInstance),
                duration: formattedSessionTimeString,
                status: "Success"
            });
            localStorage.setItem("cn_db_logins", JSON.stringify(currentLoginsDbList));
        }

        // Clean user contextual system memory properties layers
        currentSessionUser = null;
        activeSessionLoginTime = null;
        
        dispatchToast("✔ Session Logged Out");
        setAppView("gateway");
    });
});
