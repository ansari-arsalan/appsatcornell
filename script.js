/* =========================================================
   APPS Site Script

   Contents
     1.  Theme (light)
     2.  Page cleanup (stats band, running text line, hero photo)
     3.  Core behaviour (reveal, back to top, header, nav)
     4.  People data (exec + members)
     5.  Services data
     6.  Stakeholders, published work, testimonials
     7.  Quick links
     8.  Helpers
     9.  Injected styles
     10. Renderers
     11. Boot

   All new sections inject their own markup AND their own styles.
   No changes to index.html or styles.css are required. If a section
   with a matching id already exists in the HTML, content renders
   inside it instead of being appended.

   Sections auto-append on the site root (index.html) only. Any other
   page can opt in with <body data-apps-sections="on"> or out with
   "off".

   stakeholders.html has been retired. Delete that file; its content
   now lives in the "Our Work" section on the main page, and any nav
   link pointing at it is removed automatically.
   ========================================================= */

/* ---------------------------------------------------------
   1. THEME
   --------------------------------------------------------- */

(function initTheme() {
  const root = document.documentElement;
  root.setAttribute("data-theme", "light");
  root.style.colorScheme = "light";
  try {
    localStorage.setItem("apps_theme", "light");
  } catch (err) {
    /* storage unavailable - the attribute is enough */
  }
})();

/* Fallback light values for common token names. PREPENDED to <head>,
   so a light palette already defined in styles.css wins. */
const LIGHT_TOKEN_FALLBACK = `
:root[data-theme="light"] {
  color-scheme: light;
  --bg: #ffffff;
  --bg-alt: #f5f7fa;
  --background: #ffffff;
  --surface: #ffffff;
  --surface-alt: #f5f7fa;
  --card: #ffffff;
  --card-bg: #ffffff;
  --panel: #ffffff;
  --text: #16202c;
  --text-primary: #16202c;
  --text-secondary: #5b6a7d;
  --text-muted: #5b6a7d;
  --muted: #5b6a7d;
  --heading: #0f1720;
  --border: #dfe5ec;
  --border-color: #dfe5ec;
  --line: #dfe5ec;
  --accent: #b31b1b;
  --accent-soft: #fdf0f0;
  --shadow: 0 1px 2px rgba(16, 24, 40, 0.05), 0 8px 24px rgba(16, 24, 40, 0.06);
}
`;

function injectLightTokens() {
  if (document.getElementById("appsLightTokens")) return;
  const style = document.createElement("style");
  style.id = "appsLightTokens";
  style.textContent = LIGHT_TOKEN_FALLBACK;
  document.head.insertBefore(style, document.head.firstChild);
}

/* ---------------------------------------------------------
   2. PAGE CLEANUP
   --------------------------------------------------------- */

const CLEANUP = {
  // Remove the entire stats section (the animated counters).
  removeStatsSection: true,
  // Remove the scrolling line of text running across the site.
  removeRunningText: true,
  // Replace the front page photo. Set to "" to leave it alone.
  heroPhoto: "assets/apps-group-photo.jpg",
  // The image being replaced, matched by filename anywhere in its src.
  // This is the reliable way to find it — no CSS selector guessing.
  // Leave "" to fall back to the HERO_PHOTO_SELECTORS list below.
  heroPhotoReplaces: "DSC07251.JPG",
  // Set true to also stop the front page photo from animating.
  stopHeroMotion: false,
  // Remove nav links pointing at the retired stakeholders page.
  removeStakeholdersLink: true,
};

/* Removes the whole stats band, not just the numbers. Walks up from
   any [data-target] counter to its enclosing <section> (or a wrapper
   whose class mentions "stat") and removes that. */
function removeStatsSection() {
  if (!CLEANUP.removeStatsSection) return;
  const counters = document.querySelectorAll("[data-target]");
  if (!counters.length) return;

  const doomed = new Set();
  counters.forEach((el) => {
    const section =
      el.closest("section") ||
      el.closest('[class*="stat"]') ||
      el.parentElement;
    if (section && section !== document.body) doomed.add(section);
  });
  doomed.forEach((el) => el.remove());
}

/* Removes a marquee / ticker: the line of words scrolling across the
   page. Covers the <marquee> tag and the usual class names. If yours
   survives, add its class to EXTRA below. */
const RUNNING_TEXT_SELECTORS = [
  "marquee",
  ".marquee",
  ".ticker",
  ".scroller",
  ".scrolling-text",
  ".scroll-text",
  ".text-scroll",
  ".running-text",
  ".news-ticker",
  ".banner-scroll",
  '[class*="marquee"]',
  '[class*="ticker"]',
  // EXTRA: add your own selector here, e.g. ".announcement-bar"
];

function removeRunningText() {
  if (!CLEANUP.removeRunningText) return;
  document.querySelectorAll(RUNNING_TEXT_SELECTORS.join(", ")).forEach((el) => {
    const section = el.closest("section");
    // Remove the wrapper section only if the ticker is basically all it holds.
    if (section && section.textContent.trim() === el.textContent.trim()) {
      section.remove();
    } else {
      el.remove();
    }
  });
}

/* Swaps the front page photo. Takes the first image found in the hero
   area. If your hero image sits somewhere unusual, add a selector. */
const HERO_PHOTO_SELECTORS = [
  ".hero img",
  "#hero img",
  ".hero-image img",
  ".hero-photo img",
  "header.hero img",
  "main > section:first-of-type img",
];

function swapHeroPhoto() {
  if (!CLEANUP.heroPhoto) return;

  let img = null;
  let matched = "";

  // 1. Match by filename. Most reliable: no CSS selector guessing.
  if (CLEANUP.heroPhotoReplaces) {
    const needle = CLEANUP.heroPhotoReplaces.toLowerCase();
    img =
      Array.from(document.images).find((el) =>
        (el.getAttribute("src") || "").toLowerCase().includes(needle)
      ) || null;
    if (img) matched = `filename "${CLEANUP.heroPhotoReplaces}"`;
  }

  // 2. Fall back to the selector list.
  if (!img) {
    for (const selector of HERO_PHOTO_SELECTORS) {
      img = document.querySelector(selector);
      if (img) {
        matched = selector;
        break;
      }
    }
  }

  // Case A: no image matched. The photo is somewhere this script does
  // not look, so nothing was swapped and the old photo is still there.
  if (!img) {
    const all = document.querySelectorAll("main img, header img, body img");
    console.warn(
      "[APPS] Hero photo NOT swapped: none of HERO_PHOTO_SELECTORS matched.\n" +
        "Images found on this page (add the right one to HERO_PHOTO_SELECTORS):"
    );
    all.forEach((el, i) => {
      console.warn(
        `  [${i}] src="${el.getAttribute("src")}"  class="${el.className}"  ` +
          `parent=<${el.parentElement ? el.parentElement.tagName.toLowerCase() : "?"} class="${
            el.parentElement ? el.parentElement.className : ""
          }">`
      );
    });
    return;
  }

  // Case B: an image matched. Keep the old src so we can put it back if
  // the new file is missing — a visible old photo beats a broken icon.
  const previousSrc = img.getAttribute("src");

  img.addEventListener(
    "error",
    () => {
      console.error(
        `[APPS] Hero photo failed to load: "${CLEANUP.heroPhoto}"\n` +
          `  Resolved to: ${new URL(CLEANUP.heroPhoto, window.location.href).href}\n` +
          "  The file is not at that path. Check that apps-group-photo.jpg is\n" +
          "  inside your assets/ folder, and that the name matches exactly\n" +
          "  (hosting is case-sensitive). Restoring the previous photo."
      );
      if (previousSrc) img.src = previousSrc;
    },
    { once: true }
  );

  img.addEventListener(
    "load",
    () => {
      if (img.getAttribute("src") === CLEANUP.heroPhoto) {
        console.log(`[APPS] Hero photo swapped via selector: ${matched}`);
      }
    },
    { once: true }
  );

  img.src = CLEANUP.heroPhoto;
  img.srcset = "";
  img.removeAttribute("sizes");
  img.alt = "Applied Public Policy Strategies members";

  if (CLEANUP.stopHeroMotion) {
    // The motion itself is defined in styles.css. This overrides it.
    img.style.animation = "none";
    img.style.transform = "none";
    img.style.transition = "none";
    const wrap = img.parentElement;
    if (wrap) {
      wrap.style.animation = "none";
      wrap.style.transform = "none";
    }
    [img, wrap].forEach((el) => {
      if (!el) return;
      ["reveal", "reveal-left", "reveal-right", "reveal-scale"].forEach((c) =>
        el.classList.remove(c)
      );
    });
  }
}

function removeStakeholdersLink() {
  if (!CLEANUP.removeStakeholdersLink) return;
  document
    .querySelectorAll('a[href*="stakeholders.html"]')
    .forEach((a) => a.remove());
}

/* ---------------------------------------------------------
   3. CORE BEHAVIOUR
   --------------------------------------------------------- */

function initScrollReveal() {
  const revealSelectors =
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children";
  const elements = document.querySelectorAll(revealSelectors);
  if (!elements.length) return;
  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  elements.forEach((el) => observer.observe(el));
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  function toggle() {
    btn.classList.toggle("visible", window.scrollY > 400);
  }
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  function toggle() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
}

function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");
  if (!sections.length || !navLinks.length) return;
  function update() {
    const scrollY = window.scrollY + 120;
    let currentId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + currentId
      );
    });
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

const MOBILE_NAV_BREAKPOINT = 900;

function initMobileNav() {
  const button = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!button || !nav) return;
  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );
  }
  setOpen(false);
  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_NAV_BREAKPOINT) setOpen(false);
  });
}

/* ---------------------------------------------------------
   4. PEOPLE DATA
   --------------------------------------------------------- */

const HEADSHOT_VERSION = "20260405-2";

const EXEC = [
  {
    name: "Andy Duryea",
    role: "Co-President",
    year: "Junior",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/DSC07293.JPG",
  },
  {
    name: "Mandy Wang",
    role: "Co-President",
    year: "Junior",
    college: "School of Industrial and Labor Relations",
    major: "ILR",
    photo: "assets/headshots/mandy-wang.jpeg",
  },
  {
    name: "Eneanya Obioha",
    role: "Vice President of Operations & Strategy",
    year: "Junior",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/eneanya-obioha.jpeg",
  },
  {
    name: "Flora Kim",
    role: "Vice President of External Affairs",
    year: "Junior",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/flora-kim.jpeg",
  },
  {
    name: "Samuel Lau",
    role: "Director of Finance",
    year: "Sophomore",
    college: "College of Arts and Sciences",
    major: "Economics & Sociology",
    photo: "assets/headshots/samuel-lau.jpeg",
  },
  {
    name: "John Purcell",
    role: "Director of Communications",
    year: "Junior",
    college: "College of Arts and Sciences",
    major: "Government",
    photo: "assets/headshots/john-purcell.jpeg",
  },
  {
    name: "Elizabeth Chow",
    role: "Director of Membership & Recruitment",
    year: "Sophomore",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/elizabeth-chow.jpeg",
  },
  {
    name: "Chi-Ray Hsu",
    role: "Director of New Member Education & DEI",
    year: "Sophomore",
    college: "College of Arts and Sciences",
    major: "Government",
    photo: "assets/headshots/chi-ray-hsu.jpeg",
  },
  {
    name: "Jackson De Guzman",
    role: "Deputy Director of External Affairs",
    year: "Sophomore",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/jackson-de-guzman.jpeg",
  },
];

const MEMBERS = [
  {
    name: "Emily Cho",
    role: "Project Manager",
    graduationYear: 2028,
    college: "College of Arts and Sciences",
    major: "Government",
    photo: "assets/headshots/emily-cho.jpeg",
  },
  {
    name: "Annelie Chang",
    role: "Project Manager",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/annelie-chang.jpeg",
  },
   {
    name: "Ella Kim",
    role: "Project Manager",
    graduationYear: 2029,
    college: "College of Agriculture and Life Sciences",
    major: "Environment & Sustainability, Minor in International Relations",
    photo: "assets/headshots/ella-kim.jpeg",
  },
   {
    name: "Sophia Kim",
    role: "Project Manager",
    graduationYear: 2029,
    college: "College of Engineering",
    major: "BME, Minor in Health Policy",
    photo: "assets/headshots/sophia-kim.jpeg",
  },
{
    name: "Gargi Singh",
    role: "Project Manager",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy, Minors in Business and Law & Society",
    photo: "assets/headshots/gargi-singh.jpeg",
  },
  {
    name: "Charlie Rogers",
    role: "Policy Analyst",
    graduationYear: 2028,
    college: "College of Arts and Sciences",
    major: "Environment & Sustainability / Public Policy and Urban & Regional Studies",
    photo: "assets/headshots/charlie-rogers.jpeg",
  },
  {
    name: "Christopher J. Corona-Plancarte",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/christopher-j-corona-plancarte.jpeg",
  },
  {
    name: "Emma Yu",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/emma-yu.jpeg",
  },
  {
    name: "Gabrielle Abraham",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Arts and Sciences",
    major: "Government, Minor in PAM",
    photo: "assets/headshots/gabrielle-abraham.jpeg",
  },
  {
    name: "Jackie Cho",
    role: "Policy Analyst",
    graduationYear: 2027,
    college: "School of Industrial and Labor Relations",
    major: "ILR / Art History",
    photo: "assets/headshots/jackie-cho.jpeg",
  },
  {
    name: "Julia Ostroff",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Arts and Sciences",
    major: "Computer Science & Government",
    photo: "assets/headshots/julia-ostroff.jpeg",
  },
  {
    name: "Judy Li",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/judy-li.jpeg",
  },
  {
    name: "Madeline Shukovsky",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/madeline-shukovsky.jpeg",
  },
  {
    name: "Marianna Wineinger",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy / Portuguese + Law and Society",
    photo: "assets/headshots/marianna-wineinger.jpeg",
  },
  {
    name: "Marianne Custodio",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Arts and Sciences",
    major: "Economics & Public Policy",
    photo: "assets/headshots/marianne-custodio.jpeg",
  },
  {
    name: "Muntasir Ansary",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Agriculture and Life Sciences",
    major: "Biometry & Statistics",
    photo: "assets/headshots/muntasir-ansary.jpeg",
  },
  {
    name: "Shreyash Shrestha",
    role: "Policy Analyst",
    graduationYear: 2028,
    college: "School of Industrial and Labor Relations",
    major: "Industrial and Labor Relations",
    photo: "assets/headshots/shreyash-shrestha.jpeg",
  },
  {
    name: "Tami Omole",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Engineering",
    major: "Public Policy / Aerospace Engineering",
    photo: "assets/headshots/tami-omole.jpeg",
  },
];

/* ---------------------------------------------------------
   5. SERVICES
   --------------------------------------------------------- */

const SERVICES_INTRO =
  "APPS is a government consulting club that partners with stakeholders to push policy, develop media and press outreach, and conduct research.";

const SERVICES = [
  {
    title: "Policy",
    body: "We work directly with stakeholders to advance their policy objectives, including stakeholder mapping, legislative analysis, and actionable recommendations.",
  },
  {
    title: "Media and Press Outreach",
    body: "Op-eds through ghost writing, co-authoring, and authoring. Talking points, press kits, and messaging frameworks. Narrative framing, message testing, and civic education initiatives.",
  },
  {
    title: "Research",
    body: "Data analysis and policy research, delivered as briefs, reports, and supporting materials that stakeholders use in their published work.",
  },
];

const STAKEHOLDER_TYPES = [
  "Nonprofit, policy, social justice, and advocacy organizations",
   "Government agencies",
  "Think tanks",
  "Private organizations and companies",
  "Publications",
];

const POLICY_AREAS = [
  "Economic & Workforce Development Policy",
  "Technology Policy",
  "Health & Social Justice Policy",
  "Education Policy",
  "Environmental Policy",
  "Housing & Infrastructure Policy",
];

/* ---------------------------------------------------------
   6. STAKEHOLDERS, PUBLISHED WORK, TESTIMONIALS

   Logos: place files at assets/logos/. A missing file falls back to
   a typeset wordmark, so nothing breaks.
   --------------------------------------------------------- */

const STAKEHOLDERS = [
  {
    name: "LGBT Tech",
    legalName: "LGBT Technology Institute",
    url: "https://www.lgbttech.org/",
    area: "Technology Policy",
    engagement:
      "Research support for LGBT Tech's work on artificial intelligence and civil rights. Our analysis contributed to the principles published in their 2026 Roadmap.",
    logo: "assets/logos/lgbt-tech.png",
  },
  {
    name: "Center for the Study of Social Policy",
    legalName: "CSSP",
    url: "https://cssp.org/",
    area: "Health & Social Justice Policy",
    engagement:
      "A rapid response study on family health and access to care in California, and analysis of care policy features for a national care agenda. The partnership is ongoing.",
    logo: "assets/logos/cssp.png",
  },
  {
    name: "Institute for Policy Studies",
    legalName: "Charity Reform Initiative",
    url: "https://ips-dc.org/project/charity-reform-initiative/",
    area: "Economic Policy",
    engagement:
      "Research profiles on 15+ billionaires compiled over one semester. IPS is using the data in future reports.",
    logo: "assets/logos/ips.png",
  },
  {
    name: "Engine",
    legalName: "Engine Advocacy & Foundation",
    url: "https://www.engine.is/",
    area: "Technology Policy",
    engagement:
      "Policy research on the regulatory environment facing early-stage technology companies.",
    logo: "assets/logos/engine.png",
  },
];

const PUBLICATIONS = [
  {
    title: "Roadmap: Civil Rights Governance for Artificial Intelligence",
    subtitle:
      "Principles to Protect Safety, Privacy, Access, and Equal Opportunity",
    publisher: "LGBT Tech",
    year: "2026",
    url: "https://www.lgbttech.org/_files/ugd/a3b7e3_6139fcb21ee741c2bace28c19d832556.pdf",
    credit:
      "LGBT Tech acknowledges the APPS team at Cornell for research support and contributions to their work on artificial intelligence and civil rights.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Our team worked with the Institute of Policy Studies under their Charity Reform team—the only one of its kind that researches the relationship between philanthropy and wealth inequality. We were able to provide detailed information on 15+ billionaires this semester—a testament to everyone's hard work and dedication! Moving forward, IPS will be using our data to inform their future reports.",
    name: "Emily Cho ’28",
    role: "Project Manager",
    partner: "Institute for Policy Studies",
    photo: "assets/headshots/emily-cho.jpeg",
  },
  {
    quote:
      "Our team partnered with the Center for the Study of Social Policy (CSSP), an organization advancing just policies in family autonomy, economic, and health justice. We supported a rapid response study on how immigration enforcement is affecting families' health and access to care in California, and analyzed key care policy features CSSP should consider for a national care agenda. We're excited to continue this partnership to work on new initiatives for next semester!",
    name: "Flora Kim ’28",
    role: "Project Manager",
    partner: "Center for the Study of Social Policy",
    photo: "assets/headshots/flora-kim.jpeg",
  },
];

/* ---------------------------------------------------------
   7. QUICK LINKS
   --------------------------------------------------------- */

const QUICK_LINKS = [
  {
    label: "Coffee Chat Sign-Up",
    description:
      "Request a conversation with a current member. No prior policy experience is required.",
    url: "https://forms.gle/g5RmVdpGE8hxAd428",
    cta: "Open the form",
    primary: true,
  },
  {
    label: "APPS Linktree",
    description:
      "Application, info sessions, event sign-ups, and the resource guide.",
    url: "https://linktr.ee/appsatcornell",
    cta: "See all links",
  },
  {
    label: "@appsatcornell",
    description:
      "Recruitment announcements, project updates, and event reminders.",
    url: "https://www.instagram.com/appsatcornell/",
    cta: "Follow on Instagram",
  },
];

/* ---------------------------------------------------------
   8. HELPERS
   --------------------------------------------------------- */

function initialsFromName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function getAcademicYearEnd(now = new Date()) {
  return now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
}

function getYearInCollege(graduationYear, now = new Date()) {
  const diff = Number(graduationYear) - getAcademicYearEnd(now);
  return (
    { 3: "Freshman", 2: "Sophomore", 1: "Junior", 0: "Senior" }[diff] ||
    `Class of ${graduationYear}`
  );
}

function getDisplayYear(member, now = new Date()) {
  if (member.year) return member.year;
  if (member.graduationYear) return getYearInCollege(member.graduationYear, now);
  return "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------------------------------------------------------
   9. INJECTED STYLES
   --------------------------------------------------------- */

const APPS_SECTION_STYLES = `
.apps-block {
  --apps-ink: #16202c;
  --apps-muted: #5b6a7d;
  --apps-line: #e2e8f0;
  --apps-surface: #ffffff;
  --apps-tint: #f6f8fb;
  --apps-accent: #b31b1b;
  --apps-accent-soft: #fdf1f1;
  --apps-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 10px 28px rgba(16, 24, 40, 0.06);
  background: var(--apps-surface);
  color: var(--apps-ink);
  padding: clamp(3rem, 7vw, 5.5rem) 1.25rem;
  font-family: inherit;
}
.apps-block--tint { background: var(--apps-tint); }
.apps-block__inner { max-width: 1120px; margin: 0 auto; }
.apps-eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--apps-accent);
  margin: 0 0 0.75rem;
}
.apps-h2 {
  font-size: clamp(1.6rem, 3.4vw, 2.3rem);
  line-height: 1.15;
  margin: 0 0 0.75rem;
  color: var(--apps-ink);
  letter-spacing: -0.02em;
}
.apps-lede {
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--apps-muted);
  max-width: 66ch;
  margin: 0 0 2.25rem;
}
.apps-subhead {
  font-size: 1.1rem;
  font-weight: 650;
  margin: 2.75rem 0 1rem;
  color: var(--apps-ink);
}
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  align-items: stretch;
}
.apps-card {
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  padding: 1.4rem;
  box-shadow: var(--apps-shadow);
}
.apps-card__title { margin: 0 0 0.5rem; font-size: 1.02rem; font-weight: 650; }
.apps-card__body { margin: 0; font-size: 0.93rem; line-height: 1.65; color: var(--apps-muted); }

/* Plain lists */
.apps-list { list-style: none; margin: 0; padding: 0; }
.apps-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.6rem;
  font-size: 0.93rem;
  line-height: 1.6;
  color: var(--apps-muted);
}
.apps-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--apps-accent);
}
.apps-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem 2.5rem; }

/* Quick links */
.apps-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.apps-link {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--apps-line);
  background: var(--apps-surface);
  box-shadow: var(--apps-shadow);
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.apps-link:hover {
  transform: translateY(-3px);
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(16, 24, 40, 0.05), 0 16px 36px rgba(16, 24, 40, 0.09);
}
.apps-link--primary { border-color: var(--apps-accent); background: var(--apps-accent-soft); }
.apps-link__label { margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--apps-ink); }
.apps-link__desc { margin: 0; font-size: 0.92rem; line-height: 1.6; color: var(--apps-muted); }
.apps-link__cta { margin-top: auto; padding-top: 0.85rem; font-size: 0.85rem; font-weight: 700; color: var(--apps-accent); }

/* Logo wall */
.apps-logos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
  margin-bottom: 2.25rem;
}
.apps-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 112px;
  padding: 1.25rem;
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
.apps-logo:hover { transform: translateY(-2px); border-color: #cbd5e1; }
.apps-logo img { max-width: 100%; max-height: 64px; width: auto; height: auto; object-fit: contain; }
.apps-logo__wordmark { text-align: center; font-weight: 700; font-size: 0.92rem; line-height: 1.3; color: var(--apps-ink); }
.apps-logo__wordmark span {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--apps-accent);
}

/* Engagement rows */
.apps-engagement {
  display: grid;
  grid-template-columns: minmax(200px, 260px) minmax(0, 1fr);
  gap: 1rem 1.75rem;
  padding: 1.15rem 0;
  border-top: 1px solid var(--apps-line);
}
.apps-engagement:last-of-type { border-bottom: 1px solid var(--apps-line); }
@media (max-width: 700px) { .apps-engagement { grid-template-columns: 1fr; gap: 0.35rem; } }
.apps-engagement__org { margin: 0; font-size: 0.98rem; font-weight: 650; }
.apps-engagement__area {
  margin: 0.2rem 0 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--apps-accent);
}
.apps-engagement__body { margin: 0; font-size: 0.93rem; line-height: 1.65; color: var(--apps-muted); }

/* Publications */
.apps-pub {
  display: block;
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-left: 4px solid var(--apps-accent);
  border-radius: 12px;
  padding: 1.3rem 1.4rem;
  margin-bottom: 0.9rem;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--apps-shadow);
}
.apps-pub:hover { box-shadow: 0 2px 4px rgba(16, 24, 40, 0.05), 0 16px 36px rgba(16, 24, 40, 0.09); }
.apps-pub__meta {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--apps-accent);
  margin-bottom: 0.4rem;
}
.apps-pub__title { margin: 0 0 0.25rem; font-size: 1.02rem; font-weight: 650; line-height: 1.35; }
.apps-pub__sub { margin: 0 0 0.7rem; font-size: 0.9rem; color: var(--apps-muted); }
.apps-pub__credit {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--apps-muted);
  border-left: 2px solid var(--apps-line);
  padding-left: 0.8rem;
}
.apps-pub__cta { display: inline-block; margin-top: 0.8rem; font-size: 0.83rem; font-weight: 700; color: var(--apps-accent); }

/* Testimonials */
.apps-quote {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 1.4rem;
  align-items: start;
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--apps-shadow);
}
@media (max-width: 640px) { .apps-quote { grid-template-columns: 1fr; gap: 1rem; } }
.apps-quote__avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--apps-tint);
  border: 1px solid var(--apps-line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--apps-muted);
}
.apps-quote__avatar img { width: 100%; height: 100%; object-fit: cover; }
.apps-quote__text {
  margin: 0 0 1rem;
  font-size: 0.96rem;
  line-height: 1.7;
  color: var(--apps-ink);
  max-width: 74ch;
}
.apps-quote__name { margin: 0; font-size: 0.93rem; font-weight: 700; }
.apps-quote__role { margin: 0; font-size: 0.82rem; color: var(--apps-muted); }
.apps-quote__partner {
  margin: 0.3rem 0 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--apps-accent);
}
`;

function injectSectionStyles() {
  if (document.getElementById("appsSectionStyles")) return;
  const style = document.createElement("style");
  style.id = "appsSectionStyles";
  style.textContent = APPS_SECTION_STYLES;
  document.head.appendChild(style);
}

/* ---------------------------------------------------------
   10. RENDERERS
   --------------------------------------------------------- */

function shouldAutoInject() {
  const flag = document.body.dataset.appsSections;
  if (flag === "on") return true;
  if (flag === "off") return false;
  const page = window.location.pathname.split("/").pop().toLowerCase();
  return page === "" || page === "index.html";
}

function getSectionHost(id, options = {}) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.classList.add("apps-block");
    if (options.tint) existing.classList.add("apps-block--tint");
    return existing;
  }
  if (!shouldAutoInject()) return null;

  const section = document.createElement("section");
  section.id = id;
  section.className = "apps-block";
  if (options.tint) section.classList.add("apps-block--tint");
  section.dataset.appsInjected = "true";

  const main = document.querySelector("main") || document.body;
  const footer = main.querySelector("footer") || document.querySelector("footer");
  if (footer && footer.parentNode === main) {
    main.insertBefore(section, footer);
  } else {
    main.appendChild(section);
  }
  return section;
}

function sectionShell(section, { eyebrow, heading, lede }) {
  const inner = document.createElement("div");
  inner.className = "apps-block__inner reveal";
  let html = "";
  if (eyebrow) html += `<p class="apps-eyebrow">${escapeHtml(eyebrow)}</p>`;
  if (heading) html += `<h2 class="apps-h2">${escapeHtml(heading)}</h2>`;
  if (lede) html += `<p class="apps-lede">${escapeHtml(lede)}</p>`;
  inner.innerHTML = html;
  section.appendChild(inner);
  return inner;
}

function bulletList(items) {
  const ul = document.createElement("ul");
  ul.className = "apps-list";
  ul.innerHTML = items.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  return ul;
}

/* ---- Team rosters ---- */
function createMemberCard(member, index) {
  const card = document.createElement("article");
  card.className = "member-card";
  card.style.animationDelay = `${index * 0.04}s`;

  const avatar = document.createElement("div");
  avatar.className = "member-avatar";
  function showInitialsFallback() {
    avatar.innerHTML = "";
    const span = document.createElement("span");
    span.textContent = initialsFromName(member.name);
    avatar.appendChild(span);
  }
  if (member.photo) {
    const img = document.createElement("img");
    img.src = `${member.photo}?v=${HEADSHOT_VERSION}`;
    img.alt = `${member.name} headshot`;
    img.loading = "eager";
    img.decoding = "async";
    img.addEventListener("error", showInitialsFallback, { once: true });
    avatar.appendChild(img);
  } else {
    showInitialsFallback();
  }

  const meta = document.createElement("div");
  meta.className = "member-meta";
  const name = document.createElement("h3");
  name.className = "member-name";
  name.textContent = member.name;
  const role = document.createElement("p");
  role.className = "member-role";
  role.textContent = member.role;
  const year = document.createElement("p");
  year.className = "member-detail";
  year.textContent = getDisplayYear(member);
  const college = document.createElement("p");
  college.className = "member-detail";
  college.textContent = member.college || "";
  const major = document.createElement("p");
  major.className = "member-detail";
  major.textContent = member.major;

  meta.appendChild(name);
  meta.appendChild(role);
  if (year.textContent) meta.appendChild(year);
  if (college.textContent) meta.appendChild(college);
  meta.appendChild(major);
  card.appendChild(avatar);
  card.appendChild(meta);
  return card;
}

function renderExec() {
  const grid = document.getElementById("execGrid");
  if (!grid) return;
  grid.innerHTML = "";
  EXEC.forEach((m, i) => grid.appendChild(createMemberCard(m, i)));
}

function renderMembers() {
  const grid = document.getElementById("memberGrid");
  if (!grid) return;
  grid.innerHTML = "";
  MEMBERS.forEach((m, i) => grid.appendChild(createMemberCard(m, i)));
}

/* ---- Services ---- */
function renderServices() {
  const section = getSectionHost("services");
  if (!section) return;
  const inner = sectionShell(section, {
    eyebrow: "Services",
    heading: "What we do",
    lede: SERVICES_INTRO,
  });

  const grid = document.createElement("div");
  grid.className = "apps-grid";
  grid.innerHTML = SERVICES.map(
    (s) => `
      <article class="apps-card">
        <h3 class="apps-card__title">${escapeHtml(s.title)}</h3>
        <p class="apps-card__body">${escapeHtml(s.body)}</p>
      </article>`
  ).join("");
  inner.appendChild(grid);

  const cols = document.createElement("div");
  cols.className = "apps-cols";

  const left = document.createElement("div");
  const leftHead = document.createElement("h3");
  leftHead.className = "apps-subhead";
  leftHead.textContent = "Stakeholders we work with";
  left.appendChild(leftHead);
  left.appendChild(bulletList(STAKEHOLDER_TYPES));

  const right = document.createElement("div");
  const rightHead = document.createElement("h3");
  rightHead.className = "apps-subhead";
  rightHead.textContent = "Policy areas";
  right.appendChild(rightHead);
  right.appendChild(bulletList(POLICY_AREAS));

  cols.appendChild(left);
  cols.appendChild(right);
  inner.appendChild(cols);
}

/* ---- Our work: logos, engagements, publications, testimonials ---- */
function renderWork() {
  const section = getSectionHost("work", { tint: true });
  if (!section) return;
  const inner = sectionShell(section, {
    eyebrow: "Our Work",
    heading: "Stakeholders and published work",
    lede:
      "Each project team is scoped with a stakeholder and ends in a deliverable. Some of that research appears in published policy work.",
  });

  // Logo wall
  const logos = document.createElement("div");
  logos.className = "apps-logos";
  STAKEHOLDERS.forEach((org) => {
    const link = document.createElement("a");
    link.className = "apps-logo";
    link.href = org.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${org.name} (opens in a new tab)`);

    function showWordmark() {
      link.innerHTML = "";
      const mark = document.createElement("div");
      mark.className = "apps-logo__wordmark";
      mark.textContent = org.name;
      if (org.legalName) {
        const sub = document.createElement("span");
        sub.textContent = org.legalName;
        mark.appendChild(sub);
      }
      link.appendChild(mark);
    }

    if (org.logo) {
      const img = document.createElement("img");
      img.src = org.logo;
      img.alt = `${org.name} logo`;
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", showWordmark, { once: true });
      link.appendChild(img);
    } else {
      showWordmark();
    }
    logos.appendChild(link);
  });
  inner.appendChild(logos);

  // Engagement rows
  const engagements = document.createElement("div");
  engagements.innerHTML = STAKEHOLDERS.map(
    (org) => `
      <div class="apps-engagement">
        <div>
          <p class="apps-engagement__org">${escapeHtml(org.name)}</p>
          <p class="apps-engagement__area">${escapeHtml(org.area || "")}</p>
        </div>
        <p class="apps-engagement__body">${escapeHtml(org.engagement || "")}</p>
      </div>`
  ).join("");
  inner.appendChild(engagements);

  // Publications
  if (PUBLICATIONS.length) {
    const head = document.createElement("h3");
    head.className = "apps-subhead";
    head.textContent = "Published work";
    inner.appendChild(head);

    const list = document.createElement("div");
    list.innerHTML = PUBLICATIONS.map(
      (pub) => `
        <a class="apps-pub" href="${escapeHtml(
          pub.url
        )}" target="_blank" rel="noopener noreferrer">
          <div class="apps-pub__meta">${escapeHtml(pub.publisher || "")}${
        pub.year ? " &middot; " + escapeHtml(pub.year) : ""
      }</div>
          <h4 class="apps-pub__title">${escapeHtml(pub.title)}</h4>
          ${pub.subtitle ? `<p class="apps-pub__sub">${escapeHtml(pub.subtitle)}</p>` : ""}
          ${pub.credit ? `<p class="apps-pub__credit">${escapeHtml(pub.credit)}</p>` : ""}
          <span class="apps-pub__cta">Read the report (PDF) &rarr;</span>
        </a>`
    ).join("");
    inner.appendChild(list);
  }

  // Testimonials
  if (TESTIMONIALS.length) {
    const head = document.createElement("h3");
    head.className = "apps-subhead";
    head.textContent = "From our project managers";
    inner.appendChild(head);

    TESTIMONIALS.forEach((item) => {
      const card = document.createElement("article");
      card.className = "apps-quote";

      const avatar = document.createElement("div");
      avatar.className = "apps-quote__avatar";
      function showInitials() {
        avatar.innerHTML = "";
        avatar.textContent = initialsFromName(item.name);
      }
      if (item.photo) {
        const img = document.createElement("img");
        img.src = `${item.photo}?v=${HEADSHOT_VERSION}`;
        img.alt = `${item.name} headshot`;
        img.loading = "lazy";
        img.decoding = "async";
        img.addEventListener("error", showInitials, { once: true });
        avatar.appendChild(img);
      } else {
        showInitials();
      }

      const body = document.createElement("div");
      body.innerHTML = `
        <blockquote class="apps-quote__text">${escapeHtml(item.quote)}</blockquote>
        <p class="apps-quote__name">${escapeHtml(item.name)}</p>
        <p class="apps-quote__role">${escapeHtml(item.role || "")}</p>
        ${item.partner ? `<p class="apps-quote__partner">${escapeHtml(item.partner)}</p>` : ""}`;

      card.appendChild(avatar);
      card.appendChild(body);
      inner.appendChild(card);
    });
  }
}

/* ---- Get involved ---- */
function renderQuickLinks() {
  if (!QUICK_LINKS.length) return;
  const section = getSectionHost("get-involved");
  if (!section) return;
  const inner = sectionShell(section, {
    eyebrow: "Get Involved",
    heading: "Start here",
    lede:
      "A coffee chat with a current member is the most direct way to learn about APPS. All other resources are on our Linktree.",
  });

  const grid = document.createElement("div");
  grid.className = "apps-links";
  grid.innerHTML = QUICK_LINKS.map(
    (link) => `
      <a class="apps-link${link.primary ? " apps-link--primary" : ""}"
         href="${escapeHtml(link.url)}"
         target="_blank" rel="noopener noreferrer">
        <p class="apps-link__label">${escapeHtml(link.label)}</p>
        <p class="apps-link__desc">${escapeHtml(link.description || "")}</p>
        <span class="apps-link__cta">${escapeHtml(link.cta || "Open")} &rarr;</span>
      </a>`
  ).join("");
  inner.appendChild(grid);
}

/* ---- Nav ----
   "Get Involved" is placed immediately to the right of the Team link.
   Services and Our Work go before Team if they are not already there. */
function addNavLinks() {
  const nav = document.getElementById("siteNav") || document.querySelector(".nav");
  if (!nav) return;

  function findTeamLink() {
    return Array.from(nav.querySelectorAll("a")).find((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      return href.includes("team") || a.textContent.trim().toLowerCase() === "team";
    });
  }

  function makeLink(id, label) {
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = label;
    return a;
  }

  const teamLink = findTeamLink();

  // Services and Our Work: insert before Team, in order.
  [
    { id: "services", label: "Services" },
    { id: "work", label: "Our Work" },
  ].forEach(({ id, label }) => {
    const section = document.getElementById(id);
    if (!section || section.dataset.appsInjected !== "true") return;
    if (nav.querySelector(`a[href="#${id}"]`)) return;
    const link = makeLink(id, label);
    if (teamLink) {
      nav.insertBefore(link, teamLink);
    } else {
      nav.appendChild(link);
    }
  });

  // Get Involved: immediately after Team.
  const involved = document.getElementById("get-involved");
  if (involved && !nav.querySelector('a[href="#get-involved"]')) {
    const link = makeLink("get-involved", "Get Involved");
    if (teamLink && teamLink.nextSibling) {
      nav.insertBefore(link, teamLink.nextSibling);
    } else if (teamLink) {
      nav.appendChild(link);
    } else {
      nav.appendChild(link);
    }
  }
}

/* ---------------------------------------------------------
   11. BOOT
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  injectLightTokens();
  injectSectionStyles();

  // Cleanup first, so nothing below re-measures removed markup.
  removeStatsSection();
  removeRunningText();
  removeStakeholdersLink();
  swapHeroPhoto();

  initMobileNav();
  renderExec();
  renderMembers();

  // Sections mount before scroll-reveal and nav wiring.
  renderServices();
  renderWork();
  renderQuickLinks();
  addNavLinks();

  initScrollReveal();
  initBackToTop();
  initHeaderScroll();
  initActiveNav();
});
