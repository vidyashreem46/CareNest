/* ==============================================================
   CareNest — Application Script
   No inline JS, no inline CSS — everything lives here.
   ============================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------
     Element references
  ------------------------------------------------------------ */
  const body           = document.body;

  const introStage      = document.getElementById("intro");
  const authStage       = document.getElementById("auth");
  const comingSoonStage = document.getElementById("coming-soon");

  const brandLogo      = document.getElementById("brand-logo");
  const revealWord      = document.getElementById("reveal-word");
  const revealKn        = document.getElementById("reveal-kn");
  const introLine       = document.getElementById("intro-line");
  const getStartedBtn   = document.getElementById("get-started-btn");

  const tabSignIn       = document.getElementById("tab-signin");
  const tabSignUp       = document.getElementById("tab-signup");
  const tabIndicator    = document.getElementById("tab-indicator");
  const signInForm      = document.getElementById("signin-form");
  const signUpForm      = document.getElementById("signup-form");

  const forgotPasswordBtn = document.getElementById("forgot-password");
  const guestBtn        = document.getElementById("guest-btn");
  const backHomeBtn      = document.getElementById("back-home-btn");
  const socialButtons   = document.querySelectorAll(".social-btn");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     Stage switching helper
  ------------------------------------------------------------ */
  function showStage(stageEl, bodyClass){
    [introStage, authStage, comingSoonStage].forEach(section => {
      section.classList.remove("stage--active", "stage--enter");
    });

    body.classList.remove("body--auth", "body--coming-soon");
    if (bodyClass) body.classList.add(bodyClass);

    stageEl.classList.add("stage--active");
    // trigger enter animation on next frame
    requestAnimationFrame(() => stageEl.classList.add("stage--enter"));
  }

  /* ------------------------------------------------------------
     Stage 1 — Intro reveal sequence
  ------------------------------------------------------------ */
  const sentences = [
    "Every family deserves better healthcare.",
    "Technology that cares as much as you do.",
    "Built for families. Designed for care."
  ];

  function runIntroSequence(){
    if (prefersReducedMotion){
      revealWord.classList.add("reveal--shown");
      revealKn.classList.add("reveal--shown");
      introLine.textContent = sentences[sentences.length - 1];
      introLine.classList.add("intro-line--shown");
      getStartedBtn.classList.add("reveal--shown");
      brandLogo.classList.add("nest-wrap--floating");
      return;
    }

    const timers = [];

    timers.push(setTimeout(() => revealWord.classList.add("reveal--shown"), 600));
    timers.push(setTimeout(() => revealKn.classList.add("reveal--shown"), 1200));
    timers.push(setTimeout(() => brandLogo.classList.add("nest-wrap--floating"), 1200));

    let cursor = 2400;
    const holdTime = 1500;
    const fadeTime = 600;

    sentences.forEach((sentence) => {
      const showAt = cursor;
      const hideAt = showAt + fadeTime + holdTime;

      timers.push(setTimeout(() => {
        introLine.textContent = sentence;
        introLine.classList.add("intro-line--shown");
      }, showAt));

      timers.push(setTimeout(() => {
        introLine.classList.remove("intro-line--shown");
      }, hideAt));

      cursor = hideAt + fadeTime;
    });

    timers.push(setTimeout(() => {
      getStartedBtn.classList.add("reveal--shown");
    }, cursor + 200));
  }

  runIntroSequence();

  /* ------------------------------------------------------------
     Intro → Auth (logo docks into nav position, card slides up)
  ------------------------------------------------------------ */
  getStartedBtn.addEventListener("click", () => {
    brandLogo.classList.remove("nest-wrap--floating");
    brandLogo.classList.add("logo--dock");

    const dockDelay = prefersReducedMotion ? 0 : 550;

    setTimeout(() => {
      showStage(authStage, "body--auth");
      brandLogo.classList.remove("logo--dock");
    }, dockDelay);
  });

  /* ------------------------------------------------------------
     Auth tabs — Sign In / Sign Up with sliding indicator
  ------------------------------------------------------------ */
  function positionIndicator(tabEl){
    tabIndicator.style.width = `${tabEl.offsetWidth}px`;
    tabIndicator.style.left  = `${tabEl.offsetLeft}px`;
  }

  function activateTab(name){
    const isSignIn = name === "signin";

    tabSignIn.classList.toggle("tab-btn--active", isSignIn);
    tabSignUp.classList.toggle("tab-btn--active", !isSignIn);
    tabSignIn.setAttribute("aria-selected", String(isSignIn));
    tabSignUp.setAttribute("aria-selected", String(!isSignIn));

    signInForm.classList.toggle("auth-form--active", isSignIn);
    signUpForm.classList.toggle("auth-form--active", !isSignIn);

    positionIndicator(isSignIn ? tabSignIn : tabSignUp);
  }

  tabSignIn.addEventListener("click", () => activateTab("signin"));
  tabSignUp.addEventListener("click", () => activateTab("signup"));

  // position indicator once layout is ready and on resize
  window.addEventListener("load", () => positionIndicator(tabSignIn));
  window.addEventListener("resize", () => {
    const active = tabSignIn.classList.contains("tab-btn--active") ? tabSignIn : tabSignUp;
    positionIndicator(active);
  });

  /* ------------------------------------------------------------
     Auth → Coming Soon
  ------------------------------------------------------------ */
  function goToComingSoon(){
    showStage(comingSoonStage, "body--coming-soon");
  }

  signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    goToComingSoon();
  });

  signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    goToComingSoon();
  });

  guestBtn.addEventListener("click", goToComingSoon);

  socialButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const provider = btn.dataset.provider;
      window.alert(`${provider} sign-in will be available in a future update.`);
    });
  });

  forgotPasswordBtn.addEventListener("click", () => {
    window.alert("Password recovery is coming soon. Please contact your clinic administrator for now.");
  });

  /* ------------------------------------------------------------
     Coming Soon → back to Intro
  ------------------------------------------------------------ */
  backHomeBtn.addEventListener("click", () => {
    showStage(introStage, null);
  });

});
