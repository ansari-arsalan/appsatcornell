/* =========================================================
   APPS Site Script
   - Dark theme lock
   - Scroll-triggered animations
   - Counter animation for stats
   - Back to top button
   - Active nav highlighting
   - Team page roster rendering
   ========================================================= */


// ---- Light Theme ----
(function initTheme() {
  const root = document.documentElement;
  root.setAttribute("data-theme", "light");
  root.style.colorScheme = "light";
  try {
    localStorage.setItem("apps_theme", "light");
  } catch (err) {
    /* storage unavailable - theme attribute is enough */
  }
})();
 
/* Fallback light values for the most common token names.
   This block is PREPENDED to <head>, so if styles.css already
   defines its own :root[data-theme="light"] palette, that one
   wins. It only fills gaps for sites whose CSS was dark-only. */
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
   2. EXISTING BEHAVIOUR
   --------------------------------------------------------- */
 
// ---- Scroll-triggered reveal animations ----
function initScrollReveal() {
  const revealSelectors =
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children";
  const elements = document.querySelectorAll(revealSelectors);
  if (!elements.length) return;
  // Respect prefers-reduced-motion
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
 
const REMOVE_LEGACY_STATS = true;
 
function removeLegacyStats() {
  if (!REMOVE_LEGACY_STATS) return;
  const counters = document.querySelectorAll("[data-target]");
  if (!counters.length) return;
 
  const parents = new Set();
  counters.forEach((el) => {
    const item = el.closest('[class*="stat"]') || el;
    if (item.parentElement) parents.add(item.parentElement);
    item.remove();
  });
 
  parents.forEach((parent) => {
    if (parent.children.length) return;
    const wrapper = parent.closest('[class*="stat"]') || parent;
    const host = wrapper.parentElement;
    wrapper.remove();
    // If the whole stats band is now just a heading, drop it too.
    if (
      host &&
      /stat/i.test(host.className + " " + host.id) &&
      host.textContent.trim().length < 40
    ) {
      host.remove();
    }
  });
}
 
// ---- Back to top button ----
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  function toggle() {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
 
// ---- Header scroll shadow ----
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  function toggle() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
}
 
// ---- Active nav link highlighting on scroll ----
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");
  if (!sections.length || !navLinks.length) return;
  function update() {
    const scrollY = window.scrollY + 120;
    let currentId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === "#" + currentId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}
 
/* ---------------------------------------------------------
   3. PEOPLE DATA
   --------------------------------------------------------- */
 
// ---- Executive Board Data ----
const EXEC = [
  {
    name: "Andy Duryea",
    role: "Co-President",
    year: "Junior",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    bio: "Hobbies: fishing, skiing, listening to music, reading, exploring new places.",
    photo: "assets/headshots/DSC07293.JPG",
  },
  {
    name: "Mandy Wang",
    role: "Co-President",
    year: "Junior",
    college: "School of Industrial and Labor Relations",
    major: "ILR",
    bio: "Hobbies: learning how to play pool, paint, pottery, movies.",
    photo: "assets/headshots/mandy-wang.jpeg",
  },
  {
    name: "Eneanya Obioha",
    role: "Vice President of Operations & Strategy",
    year: "Junior",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    bio: "Hobbies: poker, guitar, chess, reading, and recently skiing.",
    photo: "assets/headshots/eneanya-obioha.jpeg",
  },
  {
    name: "Flora Kim",
    role: "Vice President of External Affairs",
    year: "Junior",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    bio: "Hobbies: skiing, singing/opera, hot yoga, art/painting.",
    photo: "assets/headshots/flora-kim.jpeg",
  },
  {
    name: "Samuel Lau",
    role: "Director of Finance",
    year: "Sophomore",
    college: "College of Arts and Science",
    major: "Economics & Sociology",
    bio: "Hobbies: iced coffee, Clairo, wandering around campus.",
    photo: "assets/headshots/samuel-lau.jpeg",
  },
  {
    name: "John Purcell",
    role: "Director of Communications",
    year: "Junior",
    college: "College of Arts and Sciences",
    major: "Government",
    bio: "Hobbies: concerts, baking, thrifting, playing piano.",
    photo: "assets/headshots/john-purcell.jpeg",
  },
  {
    name: "Elizabeth Chow",
    role: "Director of Membership & Recruitment",
    year: "Sophomore",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    bio: "Hobbies: gym, legos, grocery store runs, debrief.",
    photo: "assets/headshots/elizabeth-chow.jpeg",
  },
  {
    name: "Chi-Ray Hsu",
    role: "Director of New Member Education & DEI",
    year: "Sophomore",
    college: "College of Arts and Sciences",
    major: "Government",
    bio: "Hobbies: learning how to play pool, paint, pottery, movies.",
    photo: "assets/headshots/chi-ray-hsu.jpeg",
  },
  {
    name: "Jackson De Guzman",
    role: "Deputy Director of External Affairs",
    year: "Sophomore",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    bio: "Hobbies: listening to music, going on long walks, thrifting, eating hot pot.",
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
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/emily-cho-17eyc1779",
    photo: "assets/headshots/emily-cho.jpeg",
  },
  {
    name: "Annelie Chang",
    role: "Project Manager",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "linkedin.com/in/annelie-chang-511b78371",
    photo: "assets/headshots/annelie-chang.jpeg",
  },
  {
    name: "Charlie Rogers",
    role: "Policy Analyst",
    graduationYear: 2028,
    college: "College of Arts and Sciences",
    major: "Environment & Sustainability / Public Policy and Urban & Regional Studies",
    pronouns: "he/him",
    linkedin: "LinkedIn.com/in/crogers116",
    photo: "assets/headshots/charlie-rogers.jpeg",
  },
  {
    name: "Christopher J. Corona-Plancarte",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    pronouns: "he/him",
    photo: "assets/headshots/christopher-j-corona-plancarte.jpeg",
  },
  {
    name: "Ella Kim",
    role: "Project Manager",
    graduationYear: 2029,
    college: "College of Agriculture and Life Sciences",
    major: "Environment & Sustainability, Minor in International Relations",
    pronouns: "she/her",
    linkedin: "linkedin.com/in/ellakim7",
    photo: "assets/headshots/ella-kim.jpeg",
  },
  {
    name: "Emma Yu",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/emma-yu-020598335/",
    photo: "assets/headshots/emma-yu.jpeg",
  },
  {
    name: "Gabrielle Abraham",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Arts and Sciences",
    major: "Government, Minor in PAM",
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/gabrielle-abraham376",
    photo: "assets/headshots/gabrielle-abraham.jpeg",
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
    name: "Jackie Cho",
    role: "Policy Analyst",
    graduationYear: 2027,
    college: "School of Industrial and Labor Relations",
    major: "ILR / Art History",
    pronouns: "she/her",
    linkedin: "http://linkedin.com/in/jackie-cho57",
    photo: "assets/headshots/jackie-cho.jpeg",
  },
  {
    name: "Julia Ostroff",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Arts and Sciences",
    major: "Computer Science & Government",
    linkedin: "https://www.linkedin.com/in/julia-rachel-ostroff/",
    photo: "assets/headshots/julia-ostroff.jpeg",
  },
  {
    name: "Judy Li",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    linkedin: "https://www.linkedin.com/in/judy-li-8b5912345",
    photo: "assets/headshots/judy-li.jpeg",
  },
  {
    name: "Madeline Shukovsky",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "LinkedIn.com/in/madeline-shukovsky",
    photo: "assets/headshots/madeline-shukovsky.jpeg",
  },
  {
    name: "Marianna Wineinger",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy / Portuguese + Law and Society",
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/marianna-wineinger-92029b383",
    photo: "assets/headshots/marianna-wineinger.jpeg",
  },
  {
    name: "Marianne Custodio",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Arts and Sciences",
    major: "Economics & Public Policy",
    pronouns: "she/her",
    photo: "assets/headshots/marianne-custodio.jpeg",
  },
  {
    name: "Muntasir Ansary",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Agriculture and Life Sciences",
    major: "Biometry & Statistics",
    pronouns: "he/him",
    photo: "assets/headshots/muntasir-ansary.jpeg",
  },
  {
    name: "Shreyash Shrestha",
    role: "Policy Analyst",
    graduationYear: 2028,
    college: "School of Industrial and Labor Relations",
    major: "Industrial and Labor Relations",
    pronouns: "he/him",
    linkedin: "https://www.linkedin.com/in/shreyashshrestha/",
    photo: "assets/headshots/shreyash-shrestha.jpeg",
  },
  {
    name: "Sophia Kim",
    role: "Project Manager",
    graduationYear: 2029,
    college: "College of Engineering",
    major: "BME, Minor in Health Policy",
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/sophiayjkim/",
    photo: "assets/headshots/sophia-kim.jpeg",
  },
  {
    name: "Tami Omole",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Engineering",
    major: "Public Policy / Aerospace Engineering",
    pronouns: "she/they",
    linkedin: "http://linkedin.com/in/tami-omole-558a00282",
    photo: "assets/headshots/tami-omole.jpeg",
  },
];
 
const MOBILE_NAV_BREAKPOINT = 900;
const HEADSHOT_VERSION = "20260405-2";

 
/* ---------------------------------------------------------
   6. INTERVIEW DATA
   --------------------------------------------------------- */
 
const INTERVIEW_ROUNDS = [
  {
    round: "Round 1",
    name: "Resume Review",
  },
  {
    round: "Round 2",
    name: "Behavioral Interview",
  },
  {
    round: "Round 3",
    name: "Group Case Interview",
  },
];
 
/* ---------------------------------------------------------
   7. STAKEHOLDERS / PARTNERS
   Rendered on stakeholders.html.
 
   Logos: drop image files at the paths below (assets/logos/).
   If a file is missing or fails to load, the card falls back to a
   typeset wordmark, so the page never shows a broken image.
   --------------------------------------------------------- */
 
const STAKEHOLDERS = [
  {
    name: "LGBT Tech",
    legalName: "LGBT Technology Institute",
    url: "https://www.lgbttech.org/",
    focus: "Technology policy & digital equity",
    about:
      "LGBT Tech bridges the technology gap for LGBTQ+ individuals through partnerships with tech companies, non-profit groups, policy makers, scholars, and innovators. Its policy work spans data privacy, online safety, algorithmic bias, and digital inclusion.",
    engagement:
      "APPS provided research support for LGBT Tech's broader work on artificial intelligence and civil rights. Our analysis helped shape the development of the principles published in their 2026 Roadmap.",
    logo: "assets/logos/lgbt-tech.png",
  },
  {
    name: "Center for the Study of Social Policy",
    legalName: "CSSP",
    url: "https://cssp.org/",
    focus: "Family autonomy, economic & health justice",
    about:
      "CSSP is a national policy organization advancing just policies in family autonomy, economic justice, and health justice.",
    engagement:
      "APPS supported a rapid response study on how immigration enforcement is affecting families' health and access to care in California, and analyzed key care policy features for CSSP to consider in a national care agenda. The partnership is continuing into new initiatives.",
    logo: "assets/logos/cssp.png",
  },
  {
    name: "Institute for Policy Studies",
    legalName: "Charity Reform Initiative",
    url: "https://ips-dc.org/project/charity-reform-initiative/",
    focus: "Philanthropy & wealth inequality",
    about:
      "The Charity Reform Initiative at IPS is the only research program of its kind examining the relationship between philanthropy and wealth inequality.",
    engagement:
      "Over one semester, APPS compiled detailed research profiles on 15+ billionaires. IPS is using our data to inform their future reports.",
    logo: "assets/logos/ips.png",
  },
  {
    name: "Engine",
    legalName: "Engine Advocacy & Foundation",
    url: "https://www.engine.is/",
    focus: "Startup & technology policy",
    about:
      "Engine is a non-profit that gives startups a voice in technology policy, connecting founders with policymakers in Washington and in the states.",
    engagement:
      "APPS supported Engine's policy research on the regulatory environment facing early-stage technology companies.",
    logo: "assets/logos/engine.png",
  },
];
 
/* ---- Published work ---- */
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
 
const PUBLICATION_INDEX = {
  label: "All LGBT Tech research & reports",
  url: "https://www.lgbttech.org/research-and-reports",
};
 
/* ---- Member spotlights (from @appsatcornell) ---- */
const SPOTLIGHTS = [
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
  const years = {
    3: "Freshman",
    2: "Sophomore",
    1: "Junior",
    0: "Senior",
  };
  return years[diff] || `Class of ${graduationYear}`;
}
 
function getDisplayYear(member, now = new Date()) {
  if (member.year) return member.year;
  if (member.graduationYear) return getYearInCollege(member.graduationYear, now);
  return "";
}
 
function normalizeUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
 
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
 
function parseLocalDate(iso) {
  const parts = String(iso).split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}
 
function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
 
function formatEventDate(iso) {
  const date = parseLocalDate(iso);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
 
function getTimelineStatus(iso) {
  const date = parseLocalDate(iso).getTime();
  const today = startOfToday().getTime();
  if (date < today) return "past";
  if (date === today) return "today";
  return "upcoming";
}
 
/* ---------------------------------------------------------
   9. INJECTED SECTION STYLES
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
  max-width: 62ch;
  margin: 0 0 2.25rem;
}
.apps-note {
  font-size: 0.82rem;
  color: var(--apps-muted);
  border-left: 3px solid var(--apps-accent);
  padding: 0.35rem 0 0.35rem 0.8rem;
  margin: 0 0 1.75rem;
  background: var(--apps-accent-soft);
  border-radius: 0 6px 6px 0;
}
 
/* --- Timeline --- */
.apps-timeline { list-style: none; margin: 0; padding: 0; position: relative; }
.apps-timeline::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--apps-line);
}
.apps-timeline__item {
  position: relative;
  padding: 0 0 1.6rem 2.25rem;
}
.apps-timeline__item:last-child { padding-bottom: 0; }
.apps-timeline__dot {
  position: absolute;
  left: 0;
  top: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--apps-surface);
  border: 2px solid var(--apps-line);
  box-sizing: border-box;
}
.apps-timeline__item[data-status="past"] .apps-timeline__dot {
  background: var(--apps-line);
  border-color: var(--apps-line);
}
.apps-timeline__item[data-status="today"] .apps-timeline__dot {
  border-color: var(--apps-accent);
  background: var(--apps-accent);
  box-shadow: 0 0 0 4px var(--apps-accent-soft);
}
.apps-timeline__item[data-status="upcoming"] .apps-timeline__dot {
  border-color: var(--apps-accent);
}
.apps-timeline__item[data-status="past"] { opacity: 0.55; }
.apps-timeline__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 0.75rem;
  margin-bottom: 0.3rem;
}
.apps-timeline__date {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--apps-muted);
  min-width: 7.5rem;
}
.apps-timeline__title {
  font-size: 1.02rem;
  font-weight: 650;
  margin: 0;
  color: var(--apps-ink);
}
.apps-timeline__tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  background: var(--apps-tint);
  color: var(--apps-muted);
  border: 1px solid var(--apps-line);
}
.apps-timeline__item[data-tag="Deadline"] .apps-timeline__tag,
.apps-timeline__item[data-tag^="Round"] .apps-timeline__tag {
  background: var(--apps-accent-soft);
  color: var(--apps-accent);
  border-color: #f2d5d5;
}
.apps-timeline__detail {
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.6;
  color: var(--apps-muted);
  max-width: 68ch;
}
 
/* --- Card grids --- */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  align-items: stretch;
}
.apps-grid--wide {
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
}
@media (max-width: 520px) {
  .apps-grid--wide { grid-template-columns: 1fr; }
}
.apps-card {
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: var(--apps-shadow);
}
.apps-card__title {
  margin: 0 0 0.45rem;
  font-size: 1rem;
  font-weight: 650;
  color: var(--apps-ink);
}
.apps-card__body {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--apps-muted);
}
.apps-subhead {
  font-size: 1.1rem;
  font-weight: 650;
  margin: 2.75rem 0 1rem;
  color: var(--apps-ink);
}
 
/* --- Coffee chat --- */
.apps-cc {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: 2rem;
  align-items: start;
}
@media (max-width: 860px) {
  .apps-cc { grid-template-columns: 1fr; }
}
.apps-steps { list-style: none; margin: 0; padding: 0; counter-reset: apps-step; }
.apps-steps li {
  counter-increment: apps-step;
  position: relative;
  padding-left: 2.5rem;
  margin-bottom: 1.35rem;
}
.apps-steps li::before {
  content: counter(apps-step);
  position: absolute;
  left: 0;
  top: -1px;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--apps-accent-soft);
  color: var(--apps-accent);
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.apps-steps strong { display: block; font-size: 0.98rem; margin-bottom: 0.2rem; }
.apps-steps span { font-size: 0.9rem; line-height: 1.6; color: var(--apps-muted); }
 
.apps-email {
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  overflow: hidden;
  background: var(--apps-surface);
  box-shadow: var(--apps-shadow);
}
.apps-email__bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 0.9rem;
  background: var(--apps-tint);
  border-bottom: 1px solid var(--apps-line);
}
.apps-email__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--apps-line); }
.apps-email__label {
  margin-left: auto;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--apps-muted);
  font-weight: 700;
}
.apps-email__subject {
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--apps-line);
  font-size: 0.88rem;
  color: var(--apps-ink);
}
.apps-email__subject b { color: var(--apps-muted); font-weight: 700; margin-right: 0.4rem; }
.apps-email__body {
  margin: 0;
  padding: 1.1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.82rem;
  line-height: 1.75;
  color: var(--apps-ink);
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
}
.apps-email__ph {
  background: var(--apps-accent-soft);
  color: var(--apps-accent);
  border-radius: 4px;
  padding: 0.05rem 0.15rem;
  margin: 0 -0.05rem;
}
 
/* --- Tip lists --- */
.apps-tips { list-style: none; margin: 0; padding: 0; }
.apps-tips li {
  position: relative;
  padding-left: 1.6rem;
  margin-bottom: 0.75rem;
  font-size: 0.93rem;
  line-height: 1.6;
  color: var(--apps-muted);
}
.apps-tips li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--apps-accent);
}
.apps-tips--two { columns: 2; column-gap: 2.5rem; }
.apps-tips--two li { break-inside: avoid; }
@media (max-width: 720px) {
  .apps-tips--two { columns: 1; }
}
 
/* --- Interview rounds --- */
.apps-round {
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  background: var(--apps-surface);
  box-shadow: var(--apps-shadow);
  margin-bottom: 1rem;
  overflow: hidden;
}
.apps-round__head {
  padding: 1.15rem 1.25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 0.9rem;
  border-bottom: 1px solid var(--apps-line);
  background: var(--apps-tint);
}
.apps-round__badge {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--apps-accent);
  background: var(--apps-accent-soft);
  border-radius: 999px;
  padding: 0.22rem 0.6rem;
}
.apps-round__name { margin: 0; font-size: 1.05rem; font-weight: 650; }
.apps-round__when { margin-left: auto; font-size: 0.82rem; color: var(--apps-muted); font-weight: 600; }
.apps-round__body { padding: 1.15rem 1.25rem 1.35rem; }
.apps-round__summary {
  margin: 0 0 1rem;
  font-size: 0.93rem;
  line-height: 1.65;
  color: var(--apps-muted);
  max-width: 72ch;
}
 
/* --- Logo wall --- */
.apps-logos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.apps-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 118px;
  padding: 1.25rem;
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.apps-logo:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow: var(--apps-shadow);
}
.apps-logo img {
  max-width: 100%;
  max-height: 68px;
  width: auto;
  height: auto;
  object-fit: contain;
}
.apps-logo__wordmark {
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--apps-ink);
}
.apps-logo__wordmark span {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--apps-accent);
}
 
/* --- Partner detail cards --- */
.apps-partner {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  padding: 1.4rem;
  box-shadow: var(--apps-shadow);
}
.apps-partner__focus {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--apps-accent);
}
.apps-partner__name { margin: 0; font-size: 1.08rem; font-weight: 650; line-height: 1.3; }
.apps-partner__legal { margin: 0; font-size: 0.8rem; color: var(--apps-muted); font-weight: 600; }
.apps-partner__about { margin: 0; font-size: 0.92rem; line-height: 1.6; color: var(--apps-muted); }
.apps-partner__work {
  margin: 0.35rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--apps-line);
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--apps-ink);
}
.apps-partner__work b {
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--apps-muted);
  margin-bottom: 0.3rem;
}
.apps-partner__link {
  margin-top: auto;
  padding-top: 0.9rem;
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--apps-accent);
  text-decoration: none;
}
.apps-partner__link:hover { text-decoration: underline; }
 
/* --- Publications --- */
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
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.apps-pub:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(16, 24, 40, 0.05), 0 16px 36px rgba(16, 24, 40, 0.09);
}
.apps-pub__meta {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--apps-accent);
  margin-bottom: 0.4rem;
}
.apps-pub__title { margin: 0 0 0.25rem; font-size: 1.05rem; font-weight: 650; line-height: 1.35; }
.apps-pub__sub { margin: 0 0 0.7rem; font-size: 0.9rem; color: var(--apps-muted); }
.apps-pub__credit {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--apps-muted);
  border-left: 2px solid var(--apps-line);
  padding-left: 0.8rem;
}
.apps-pub__cta {
  display: inline-block;
  margin-top: 0.8rem;
  font-size: 0.83rem;
  font-weight: 700;
  color: var(--apps-accent);
}
.apps-pub-index {
  display: inline-block;
  font-size: 0.88rem;
  font-weight: 650;
  color: var(--apps-accent);
  text-decoration: none;
}
.apps-pub-index:hover { text-decoration: underline; }
 
/* --- Spotlights --- */
.apps-spotlight {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 1.4rem;
  align-items: start;
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--apps-shadow);
}
@media (max-width: 640px) {
  .apps-spotlight { grid-template-columns: 1fr; gap: 1rem; }
}
.apps-spotlight__avatar {
  width: 96px;
  height: 96px;
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
.apps-spotlight__avatar img { width: 100%; height: 100%; object-fit: cover; }
.apps-spotlight__quote {
  margin: 0 0 1rem;
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--apps-ink);
  max-width: 74ch;
}
.apps-spotlight__quote::before {
  content: "\\201C";
  color: var(--apps-accent);
  font-size: 2.4rem;
  line-height: 0;
  vertical-align: -0.35rem;
  margin-right: 0.15rem;
}
.apps-spotlight__name { margin: 0; font-size: 0.95rem; font-weight: 700; }
.apps-spotlight__role { margin: 0; font-size: 0.83rem; color: var(--apps-muted); }
.apps-spotlight__partner {
  margin: 0.3rem 0 0;
  font-size: 0.7rem;
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
   10. EXISTING RENDERERS
   --------------------------------------------------------- */
 
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
    const isOpen = button.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
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
 
function initFaqAccordion() {
  const items = Array.from(document.querySelectorAll(".faq-accordion details"));
  if (!items.length) return;
  const first = items.find((item) => item.open) || items[0];
  if (first && !first.open) first.open = true;
  const firstSummary = first ? first.querySelector("summary") : null;
  if (firstSummary) firstSummary.focus({ preventScroll: true });
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
      const id = item.dataset.faq || "";
      window.dispatchEvent(
        new CustomEvent("faq:toggle", { detail: { id, open: item.open } })
      );
    });
  });
}
 
/* ---------------------------------------------------------
   11. SECTION MOUNTING
   --------------------------------------------------------- */
 
/* Should the recruitment sections auto-append on this page?
   Default: only on the site root. Override per page with
   <body data-apps-sections="on"> or "off". */
function shouldAutoInject() {
  const flag = document.body.dataset.appsSections;
  if (flag === "on") return true;
  if (flag === "off") return false;
  const page = window.location.pathname.split("/").pop().toLowerCase();
  return page === "" || page === "index.html";
}
 
/* Returns the <section> to render into. If the page already has an
   element with this id, we use it. Otherwise we create a section and
   append it to the end of <main> (or <body>), before the footer —
   but only on pages where auto-injection is allowed. */
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
 
function sectionShell(section, { eyebrow, heading, lede, note }) {
  const inner = document.createElement("div");
  inner.className = "apps-block__inner reveal";
  let html = "";
  if (eyebrow) html += `<p class="apps-eyebrow">${escapeHtml(eyebrow)}</p>`;
  if (heading) html += `<h2 class="apps-h2">${escapeHtml(heading)}</h2>`;
  if (lede) html += `<p class="apps-lede">${escapeHtml(lede)}</p>`;
  if (note) html += `<p class="apps-note">${escapeHtml(note)}</p>`;
  inner.innerHTML = html;
  section.appendChild(inner);
  return inner;
}
 
function tipList(tips, extraClass = "") {
  const ul = document.createElement("ul");
  ul.className = `apps-tips ${extraClass}`.trim();
  ul.innerHTML = tips.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  return ul;
}
 
/* ---------------------------------------------------------
   12. NEW SECTION RENDERERS
   --------------------------------------------------------- */
 
function renderRecruitment() {
  if (!RECRUITMENT_TIMELINE.length) return;
  const section = getSectionHost("recruitment");
  if (!section) return;
  const inner = sectionShell(section, {
    eyebrow: `${RECRUITMENT_CYCLE} Recruitment`,
    heading: "Timeline & what to expect",
    lede:
      "Everything below is open to anyone considering APPS. You do not need to attend every event, but coming to at least one makes the application a lot easier to write.",
  });
 
  const list = document.createElement("ol");
  list.className = "apps-timeline";
  list.innerHTML = RECRUITMENT_TIMELINE.map((item) => {
    const status = getTimelineStatus(item.date);
    return `
      <li class="apps-timeline__item" data-status="${status}" data-tag="${escapeHtml(
      item.tag || ""
    )}">
        <span class="apps-timeline__dot" aria-hidden="true"></span>
        <div class="apps-timeline__head">
          <span class="apps-timeline__date">${escapeHtml(
            formatEventDate(item.date)
          )}</span>
          <h3 class="apps-timeline__title">${escapeHtml(item.title)}</h3>
          ${
            item.tag
              ? `<span class="apps-timeline__tag">${escapeHtml(item.tag)}</span>`
              : ""
          }
        </div>
        <p class="apps-timeline__detail">${escapeHtml(item.detail || "")}</p>
      </li>`;
  }).join("");
  inner.appendChild(list);
 
  const subhead = document.createElement("h3");
  subhead.className = "apps-subhead";
  subhead.textContent = "What to expect";
  inner.appendChild(subhead);
 
  const grid = document.createElement("div");
  grid.className = "apps-grid";
  grid.innerHTML = RECRUITMENT_EXPECTATIONS.map(
    (item) => `
      <article class="apps-card">
        <h4 class="apps-card__title">${escapeHtml(item.title)}</h4>
        <p class="apps-card__body">${escapeHtml(item.body)}</p>
      </article>`
  ).join("");
  inner.appendChild(grid);
}
 
function renderCoffeeChats() {
  const section = getSectionHost("coffee-chats", { tint: true });
  if (!section) return;
  const inner = sectionShell(section, {
    eyebrow: "Coffee Chats",
    heading: "Talk to a member first",
    lede:
      "A coffee chat is a low-stakes, half-hour conversation with a current member. It is not evaluated, it is not an interview, and it is the fastest way to find out what APPS is actually like.",
  });
 
  const layout = document.createElement("div");
  layout.className = "apps-cc";
 
  const steps = document.createElement("ol");
  steps.className = "apps-steps";
  steps.innerHTML = COFFEE_CHAT_STEPS.map(
    (step) => `
      <li>
        <strong>${escapeHtml(step.title)}</strong>
        <span>${escapeHtml(step.body)}</span>
      </li>`
  ).join("");
 
  const emailBody = escapeHtml(COFFEE_CHAT_EMAIL.body).replace(
    /\[([^\]]+)\]/g,
    '<span class="apps-email__ph">[$1]</span>'
  );
  const email = document.createElement("div");
  email.className = "apps-email";
  email.innerHTML = `
    <div class="apps-email__bar" aria-hidden="true">
      <span class="apps-email__dot"></span>
      <span class="apps-email__dot"></span>
      <span class="apps-email__dot"></span>
      <span class="apps-email__label">The email you'll get</span>
    </div>
    <div class="apps-email__subject"><b>Subject</b>${escapeHtml(
      COFFEE_CHAT_EMAIL.subject
    )}</div>
    <pre class="apps-email__body">${emailBody}</pre>`;
 
  layout.appendChild(steps);
  layout.appendChild(email);
  inner.appendChild(layout);
 
  const subhead = document.createElement("h3");
  subhead.className = "apps-subhead";
  subhead.textContent = "Getting the most out of a coffee chat";
  inner.appendChild(subhead);
  inner.appendChild(tipList(COFFEE_CHAT_TIPS, "apps-tips--two"));
}
 
function renderInterviewTips() {
  const section = getSectionHost("interview-tips");
  if (!section) return;
  const inner = sectionShell(section, {
    eyebrow: "Interviews",
    heading: "How to prepare for each round",
    lede:
      "We would rather interview people who know what is coming. Here is what each round looks like and what we are actually listening for.",
  });
 
  INTERVIEW_ROUNDS.forEach((round) => {
    const card = document.createElement("article");
    card.className = "apps-round";
    card.innerHTML = `
      <div class="apps-round__head">
        <span class="apps-round__badge">${escapeHtml(round.round)}</span>
        <h3 class="apps-round__name">${escapeHtml(round.name)}</h3>
        <span class="apps-round__when">${escapeHtml(round.when)}</span>
      </div>
      <div class="apps-round__body">
        <p class="apps-round__summary">${escapeHtml(round.summary)}</p>
      </div>`;
    card.querySelector(".apps-round__body").appendChild(tipList(round.tips));
    inner.appendChild(card);
  });
}
 
/* ---- Stakeholders: logo wall ---- */
function renderStakeholderLogos() {
  const host = document.getElementById("stakeholderLogos");
  if (!host || !STAKEHOLDERS.length) return;
  host.className = "apps-logos";
  host.innerHTML = "";
 
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
    host.appendChild(link);
  });
}
 
/* ---- Stakeholders: detail cards ---- */
function renderStakeholderCards() {
  const host = document.getElementById("stakeholderGrid");
  if (!host || !STAKEHOLDERS.length) return;
  host.className = "apps-grid apps-grid--wide";
  host.innerHTML = STAKEHOLDERS.map(
    (org) => `
      <article class="apps-partner">
        <span class="apps-partner__focus">${escapeHtml(org.focus || "")}</span>
        <h3 class="apps-partner__name">${escapeHtml(org.name)}</h3>
        ${
          org.legalName
            ? `<p class="apps-partner__legal">${escapeHtml(org.legalName)}</p>`
            : ""
        }
        <p class="apps-partner__about">${escapeHtml(org.about || "")}</p>
        ${
          org.engagement
            ? `<p class="apps-partner__work"><b>What APPS did</b>${escapeHtml(
                org.engagement
              )}</p>`
            : ""
        }
        <a class="apps-partner__link" href="${escapeHtml(
          org.url
        )}" target="_blank" rel="noopener noreferrer">Visit ${escapeHtml(
      org.name
    )} &rarr;</a>
      </article>`
  ).join("");
}
 
/* ---- Published work ---- */
function renderPublications() {
  const host = document.getElementById("publicationList");
  if (!host || !PUBLICATIONS.length) return;
  host.innerHTML =
    PUBLICATIONS.map(
      (pub) => `
      <a class="apps-pub" href="${escapeHtml(
        pub.url
      )}" target="_blank" rel="noopener noreferrer">
        <div class="apps-pub__meta">${escapeHtml(pub.publisher || "")}${
        pub.year ? " &middot; " + escapeHtml(pub.year) : ""
      }</div>
        <h3 class="apps-pub__title">${escapeHtml(pub.title)}</h3>
        ${
          pub.subtitle
            ? `<p class="apps-pub__sub">${escapeHtml(pub.subtitle)}</p>`
            : ""
        }
        ${
          pub.credit
            ? `<p class="apps-pub__credit">${escapeHtml(pub.credit)}</p>`
            : ""
        }
        <span class="apps-pub__cta">Read the report (PDF) &rarr;</span>
      </a>`
    ).join("") +
    (PUBLICATION_INDEX
      ? `<a class="apps-pub-index" href="${escapeHtml(
          PUBLICATION_INDEX.url
        )}" target="_blank" rel="noopener noreferrer">${escapeHtml(
          PUBLICATION_INDEX.label
        )} &rarr;</a>`
      : "");
}
 
/* ---- Member spotlights ---- */
function renderSpotlights() {
  const host = document.getElementById("spotlightList");
  if (!host || !SPOTLIGHTS.length) return;
  host.innerHTML = "";
 
  SPOTLIGHTS.forEach((item) => {
    const card = document.createElement("article");
    card.className = "apps-spotlight";
 
    const avatar = document.createElement("div");
    avatar.className = "apps-spotlight__avatar";
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
      <blockquote class="apps-spotlight__quote">${escapeHtml(
        item.quote
      )}</blockquote>
      <p class="apps-spotlight__name">${escapeHtml(item.name)}</p>
      <p class="apps-spotlight__role">${escapeHtml(item.role || "")}</p>
      ${
        item.partner
          ? `<p class="apps-spotlight__partner">${escapeHtml(item.partner)}</p>`
          : ""
      }`;
 
    card.appendChild(avatar);
    card.appendChild(body);
    host.appendChild(card);
  });
}
 
/* Adds nav links for any sections this script created, so the new
   content is reachable from the header on single-page layouts.
   Also adds a Stakeholders link pointing at the partner page. */
function addNavLinks() {
  const nav = document.getElementById("siteNav") || document.querySelector(".nav");
  if (!nav) return;
 
  const links = [
    { id: "recruitment", label: "Recruitment" },
    { id: "coffee-chats", label: "Coffee Chats" },
    { id: "interview-tips", label: "Interviews" },
  ];
  links.forEach(({ id, label }) => {
    const section = document.getElementById(id);
    if (!section || section.dataset.appsInjected !== "true") return;
    if (nav.querySelector(`a[href="#${id}"]`)) return;
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = label;
    nav.appendChild(a);
  });
 
  const onPartnerPage = !!document.getElementById("stakeholderGrid");
  if (!onPartnerPage && !nav.querySelector('a[href*="stakeholders.html"]')) {
    const a = document.createElement("a");
    a.href = STAKEHOLDERS_PAGE;
    a.textContent = "Stakeholders";
    nav.appendChild(a);
  }
}
 
const STAKEHOLDERS_PAGE = "stakeholders.html";
 
/* ---------------------------------------------------------
   13. BOOT
   --------------------------------------------------------- */
 
document.addEventListener("DOMContentLoaded", () => {
  injectLightTokens();
  injectSectionStyles();
 
  removeLegacyStats();
 
  initMobileNav();
  renderExec();
  renderMembers();
 
  // Stakeholders page content (no-ops on pages without these ids).
  renderStakeholderLogos();
  renderStakeholderCards();
  renderPublications();
  renderSpotlights();
 
  // New sections must mount before scroll-reveal and nav wiring.
  renderRecruitment();
  renderCoffeeChats();
  renderInterviewTips();
  addNavLinks();
 
  initScrollReveal();
  initBackToTop();
  initHeaderScroll();
  initActiveNav();
  initFaqAccordion();
});
 
