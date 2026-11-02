/* =========================================================
   Bakerz Bite — Login / Sign up page logic (login.html)
   FRONT-END DEMO: accounts are saved only in this browser
   (localStorage). A real site needs a server + database.
   ========================================================= */
(() => {
  "use strict";
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const store = {
    get(k, f) { try { const v = localStorage.getItem(k); return v === null ? f : v; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } }
  };

  /* ---------- theme toggle (same setting as the main site) ---------- */
  const root = document.documentElement, themeBtn = $("#themeToggle");
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    $("use", themeBtn).setAttribute("href", t === "dark" ? "#i-sun" : "#i-moon");
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    const m = $('meta[name="theme-color"]'); if (m) m.content = t === "dark" ? "#1b120e" : "#fbf6ee";
  }
  applyTheme(root.getAttribute("data-theme") || "dark");
  themeBtn.addEventListener("click", () => {
    const n = root.getAttribute("data-theme") === "dark" ? "light" : "dark"; applyTheme(n); store.set("bb_theme", n);
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- storage helpers ---------- */
  const USERS_KEY = "bb_users", SESSION_KEY = "bb_session";
  const loginForm = $("#loginForm"), signupForm = $("#signupForm");
  const tabLogin = $("#tabLogin"), tabSignup = $("#tabSignup");
  const readUsers = () => { try { return JSON.parse(store.get(USERS_KEY, "{}")) || {}; } catch { return {}; } };
  const saveUsers = u => store.set(USERS_KEY, JSON.stringify(u));
  const newSalt = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  async function hashPw(pw, salt) {
    const data = salt + ":" + pw;
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 5381; for (const ch of data) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;   // simple fallback
    return "x" + h.toString(16);
  }
  function getSession() {
    try { return sessionStorage.getItem(SESSION_KEY) || store.get(SESSION_KEY, ""); } catch { return store.get(SESSION_KEY, ""); }
  }
  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }
  function setSession(email, remember) {
    clearSession();
    if (remember) store.set(SESSION_KEY, email); else { try { sessionStorage.setItem(SESSION_KEY, email); } catch { /* ignore */ } }
  }

  /* ---------- validation helpers ---------- */
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  function setErr(id, msg) {
    const input = document.getElementById(id), out = document.getElementById(id + "Err");
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (out) out.textContent = msg || "";
    return !msg;
  }
  function clearForm(form) {
    $$("input", form).forEach(i => i.removeAttribute("aria-invalid"));
    $$(".err", form).forEach(e => { e.textContent = ""; });
    $$(".auth-msg", form).forEach(m => { m.textContent = ""; m.className = "auth-msg"; });
  }
  const setMsg = (el, text, type) => { el.textContent = text; el.className = "auth-msg " + (type || ""); };

  /* ---------- tabs ---------- */
  function showTab(which, focus) {
    const login = which !== "signup";
    loginForm.hidden = !login; signupForm.hidden = login;
    tabLogin.classList.toggle("active", login); tabSignup.classList.toggle("active", !login);
    tabLogin.setAttribute("aria-selected", login); tabSignup.setAttribute("aria-selected", !login);
    $("#authTitle").textContent = login ? "Welcome back" : "Create your account";
    $("#authSub").textContent = login ? "Log in to your Bakerz Bite account." : "Join us — it only takes a minute.";
    document.title = (login ? "Login" : "Sign Up") + " | Bakerz Bite";
    clearForm(loginForm); clearForm(signupForm);
    try { history.replaceState(null, "", login ? location.pathname : "#signup"); } catch { /* file:// */ }
    if (focus && !getSession()) { const f = $("input", login ? loginForm : signupForm); if (f) f.focus({ preventScroll: true }); }
  }
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-auth]"); if (t) { e.preventDefault(); showTab(t.dataset.auth, true); }
  });

  /* ---------- signed-in / signed-out view ---------- */
  function renderUser() {
    const email = getSession(), user = email ? readUsers()[email] : null;
    $("#authGuest").hidden = !!user; $("#authUser").hidden = !user;
    if (!user) return;
    $("#userName").textContent = user.name.split(" ")[0];
    $("#userEmail").textContent = email;
    $("#userAvatar").textContent = user.name.trim().charAt(0).toUpperCase() || "B";
    $("#userSince").textContent = new Date(user.created).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  }

  /* ---------- show / hide password ---------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-toggle-pw]"); if (!b) return;
    const input = document.getElementById(b.dataset.togglePw), show = input.type === "password";
    input.type = show ? "text" : "password";
    b.setAttribute("aria-pressed", show); b.setAttribute("aria-label", show ? "Hide password" : "Show password");
    $("use", b).setAttribute("href", show ? "#i-eye-off" : "#i-eye");
  });

  /* ---------- password strength ---------- */
  const strengthEl = $(".strength", signupForm), strengthLabel = $("#strengthLabel");
  const STRENGTH_TEXT = ["Use 8+ characters with letters & numbers", "Weak", "Fair", "Good", "Strong"];
  function pwScore(pw) {
    let sc = 0;
    if (pw.length >= 8) sc++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) sc++;
    if (/\d/.test(pw)) sc++;
    if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) sc++;
    return pw ? Math.max(sc, 1) : 0;
  }
  $("#signupPassword").addEventListener("input", e => {
    const sc = pwScore(e.target.value); strengthEl.dataset.score = sc; strengthLabel.textContent = STRENGTH_TEXT[sc];
  });

  /* ---------- log in ---------- */
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("#loginEmail").value.trim().toLowerCase(), pw = $("#loginPassword").value, msg = $("#loginMsg");
    setMsg(msg, "");
    const okE = setErr("loginEmail", !email ? "Please enter your email." : (emailOk(email) ? "" : "Enter a valid email address."));
    const okP = setErr("loginPassword", pw ? "" : "Please enter your password.");
    if (!okE || !okP) return;
    const user = readUsers()[email];
    const good = user && (await hashPw(pw, user.salt)) === user.hash;
    if (!good) { setMsg(msg, "Incorrect email or password. New here? Create an account.", "error"); return; }
    setSession(email, $("#rememberMe").checked);
    loginForm.reset(); clearForm(loginForm); renderUser();
  });

  $("#forgotBtn").addEventListener("click", () => {
    const email = $("#loginEmail").value.trim().toLowerCase(), msg = $("#loginMsg");
    setMsg(msg, "");
    if (!setErr("loginEmail", emailOk(email) ? "" : "Enter your email above first.")) { $("#loginEmail").focus(); return; }
    setMsg(msg, "If this email is registered, a reset link would be sent. (Demo mode — connect a server to send real emails.)", "ok");
  });

  /* ---------- sign up ---------- */
  signupForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = $("#signupName").value.trim().replace(/\s+/g, " "), phone = $("#signupPhone").value.trim();
    const email = $("#signupEmail").value.trim().toLowerCase(), pw = $("#signupPassword").value, conf = $("#signupConfirm").value;
    const agree = $("#agreeTerms").checked, msg = $("#signupMsg"), users = readUsers();
    setMsg(msg, "");
    const checks = [
      setErr("signupName", name.length < 2 ? "Please enter your full name." : ""),
      setErr("signupPhone", phone && !/^\+?[\d\s-]{7,18}$/.test(phone) ? "Enter a valid phone number." : ""),
      setErr("signupEmail", !email ? "Please enter your email." : !emailOk(email) ? "Enter a valid email address." : users[email] ? "This email is already registered — please log in." : ""),
      setErr("signupPassword", pw.length < 8 ? "Use at least 8 characters." : !(/[A-Za-z]/.test(pw) && /\d/.test(pw)) ? "Include both letters and numbers." : ""),
      setErr("signupConfirm", !conf ? "Please confirm your password." : conf !== pw ? "Passwords do not match." : ""),
      setErr("agreeTerms", agree ? "" : "Please accept the terms to continue.")
    ];
    if (checks.includes(false)) { const bad = $('[aria-invalid="true"]', signupForm); if (bad) bad.focus(); return; }
    const salt = newSalt();
    users[email] = { name, phone, salt, hash: await hashPw(pw, salt), created: Date.now() };
    saveUsers(users); setSession(email, true);
    signupForm.reset(); strengthEl.dataset.score = 0; strengthLabel.textContent = STRENGTH_TEXT[0];
    clearForm(signupForm); renderUser();
  });
  signupForm.addEventListener("input", e => { if (e.target.id && e.target.getAttribute("aria-invalid") === "true") setErr(e.target.id, ""); });
  signupForm.addEventListener("change", e => { if (e.target.id && e.target.getAttribute("aria-invalid") === "true") setErr(e.target.id, ""); });
  loginForm.addEventListener("input", e => { if (e.target.id) setErr(e.target.id, ""); });

  /* ---------- log out ---------- */
  $("#logoutBtn").addEventListener("click", () => { clearSession(); renderUser(); showTab("login", true); });

  addEventListener("hashchange", () => showTab(location.hash === "#signup" ? "signup" : "login", false));

  /* ---------- start ---------- */
  renderUser();
  showTab(location.hash === "#signup" ? "signup" : "login", false);
})();
