/* ===== Monk Food — site scripts ===== */

/* 1. Google Sheets endpoint.
   Paste the Web App URL you get after deploying google-apps-script.gs
   (see README.md → "Connect the contact form to Google Sheets").      */
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzb_svMuDVd-1z-L2hgqQTHvqf2vNF8wgXbwtbJraWYA07Tg4UAWKO-_Nh0jETDcW-NqQ/exec";

/* 2. Mobile nav toggle */
document.addEventListener("click", function (e) {
  var btn = e.target.closest(".menu-btn");
  if (btn) {
    var links = document.querySelector(".nav-links");
    if (links) links.classList.toggle("open");
  }
});

/* 3. Contact form → Google Sheets */
document.addEventListener("submit", function (e) {
  var form = e.target.closest("#contactForm");
  if (!form) return;
  e.preventDefault();

  var ok = form.querySelector(".form-success");
  var err = form.querySelector(".form-error");
  var submitBtn = form.querySelector('button[type="submit"]');
  if (ok) ok.style.display = "none";
  if (err) err.style.display = "none";

  var data = new FormData(form);
  data.append("submittedAt", new Date().toISOString());
  data.append("source", "monkfood-website");

  // If the endpoint hasn't been configured yet, just show success (demo mode).
  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.indexOf("PASTE_YOUR") === 0) {
    if (ok) {
      ok.style.display = "block";
      ok.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    form.reset();
    return;
  }

  var original = submitBtn ? submitBtn.textContent : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
  }

  fetch(SHEETS_ENDPOINT, { method: "POST", body: data })
    .then(function (res) {
      return res.json().catch(function () {
        return { result: res.ok ? "success" : "error" };
      });
    })
    .then(function (out) {
      if (out && out.result === "success") {
        if (ok) {
          ok.style.display = "block";
          ok.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
      } else {
        throw new Error("Bad response");
      }
    })
    .catch(function () {
      if (err) err.style.display = "block";
    })
    .finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    });
});

/* 4. Scroll reveal (progressive — only hides content if JS runs) */
(function () {
  var targets = document.querySelectorAll(
    ".card, .quote, .plan, .split, .cta-band, .faq-item, .page-hero .container, .hero-copy, .hero-art"
  );
  if (!("IntersectionObserver" in window) || !targets.length) return;

  targets.forEach(function (el) {
    el.classList.add("reveal");
  });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(function (el) {
    io.observe(el);
  });
})();

/* 5. Sticky mobile action bar (Call / Contact) — shown only on phones via CSS.
   Skipped on the admin app page. */
(function () {
  if (document.body.classList.contains("admin-body")) return;
  if (document.querySelector(".mobile-bar")) return;
  var inBlog = location.pathname.indexOf("/blog/") > -1;
  var contactHref = (inBlog ? "../" : "") + "contact";
  var bar = document.createElement("div");
  bar.className = "mobile-bar";
  bar.innerHTML =
    '<a class="call" href="tel:07767935049">📞 Call</a>' +
    '<a class="sales" href="' + contactHref + '">Contact Sales</a>';
  document.body.appendChild(bar);
  document.body.classList.add("has-mobile-bar");
})();

/* 6. GDPR consent notice — essential/no-tracking; remembers dismissal. */
(function () {
  if (document.body.classList.contains("admin-body")) return;
  try { if (localStorage.getItem("mf_consent") === "1") return; } catch (e) {}
  var inBlog = location.pathname.indexOf("/blog/") > -1;
  var privacyHref = (inBlog ? "../" : "") + "privacy";
  var box = document.createElement("div");
  box.className = "consent";
  box.innerHTML =
    '<p>We use only essential storage — no advertising or tracking cookies. Web fonts are served by Google Fonts. See our <a href="' +
    privacyHref + '">Privacy Policy</a>.</p>' +
    '<div class="row"><button class="btn btn-primary" id="consentOk">Got it</button>' +
    '<a class="btn btn-ghost" href="' + privacyHref + '">Learn more</a></div>';
  document.body.appendChild(box);
  var ok = document.getElementById("consentOk");
  if (ok) ok.addEventListener("click", function () {
    try { localStorage.setItem("mf_consent", "1"); } catch (e) {}
    box.remove();
  });
})();
