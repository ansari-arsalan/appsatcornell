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
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
 
// ---- Animated counter for stats ----
function initCounters() {
  const counters = document.querySelectorAll("[data-target]");
  if (!counters.length) return;
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = 1600;
    const startTime = performance.now();
    function easeOutQuint(t) {
      return 1 - Math.pow(1 - t, 5);
    }
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOutQuint(progress) * target);
      el.textContent = current + "+";
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
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
   4. RECRUITMENT DATA  (edit these arrays each cycle)
   --------------------------------------------------------- */
 
const RECRUITMENT_CYCLE = "Fall 2026";
 
/* Public-facing dates only. Internal to-dos (Instagram posts,
   takeovers, big/little features) are intentionally left out. */
const RECRUITMENT_TIMELINE = [
  {
    date: "2026-08-24",
    title: "Coffee chat form opens",
    detail:
      "First day of classes. Submit the form and a current member will email you to set up a time.",
    tag: "Open",
  },
  {
    date: "2026-09-03",
    title: "Tabling - Day 1",
    detail: "Come find us on campus and ask us anything, no sign-up needed.",
    tag: "Meet us",
  },
  {
    date: "2026-09-04",
    title: "Tabling - Day 2",
    detail: "Second day of tabling. Recruitment timeline handouts available.",
    tag: "Meet us",
  },
  {
    date: "2026-09-05",
    title: "Clubfest",
    detail: "Stop by the APPS table to meet exec and current analysts.",
    tag: "Meet us",
  },
  {
    date: "2026-09-07",
    title: "Labor Day - no APPS events",
    detail: "Enjoy the long weekend. Recruitment picks back up Tuesday.",
    tag: "Break",
  },
  {
    date: "2026-09-08",
    title: "Application opens",
    detail: "The written application goes live. Give yourself time to draft it.",
    tag: "Apply",
  },
  {
    date: "2026-09-11",
    title: "Intro to the Policy Space + Resume Review",
    detail:
      "A walkthrough of policy career paths, with members reviewing resumes on the spot. Bring a printed copy.",
    tag: "Workshop",
  },
  {
    date: "2026-09-14",
    title: "Casing Workshop",
    detail:
      "How we structure a policy case, walked through end to end. The single most useful prep for Round 3.",
    tag: "Workshop",
  },
  {
    date: "2026-09-15",
    title: "Tabling - Day 3 + First Info Session",
    detail:
      "Full overview of APPS, our project model, and the application, with Q&A.",
    tag: "Info session",
  },
  {
    date: "2026-09-17",
    title: "Apps w/ APPS: Speed Dating with Members",
    detail:
      "Appetizers and rotating conversations with current members, followed by the second info session.",
    tag: "Social",
  },
  {
    date: "2026-09-18",
    title: "Recruitment office hours + APPLICATION CLOSES",
    detail:
      "Last chance to ask questions before you submit. Applications close at the end of the day.",
    tag: "Deadline",
  },
  {
    date: "2026-09-18",
    title: "Round 1 - Resume Review",
    detail: "We review every submitted application and resume.",
    tag: "Round 1",
  },
  {
    date: "2026-09-19",
    title: "Round 2 - Behavioral Interview",
    detail:
      "A conversational interview about your interests, your experience, and why APPS.",
    tag: "Round 2",
  },
  {
    date: "2026-09-20",
    title: "Round 3 - Casing Interview",
    detail:
      "A short policy case worked through with two members. Structure over answers.",
    tag: "Round 3",
  },
];
 
const RECRUITMENT_EXPECTATIONS = [
  {
    title: "No policy background required",
    body: "We recruit across every college. Analysts have come from ILR, Engineering, CALS, A&S, and Brooks. Curiosity matters more than coursework.",
  },
  {
    title: "Three rounds, one weekend",
    body: "Resume review, a behavioral interview, and a casing interview all happen between September 18 and 20. Plan your weekend accordingly.",
  },
  {
    title: "Come to at least one event",
    body: "A coffee chat, info session, or workshop is the easiest way to figure out whether APPS is right for you, and it makes your application stronger.",
  },
  {
    title: "Prep is provided",
    body: "The resume review and casing workshop exist so that nobody has to interview cold. Everything you need to know for Round 3 is taught on September 14.",
  },
  {
    title: "Expect a real time commitment",
    body: "New members join a project team and work with a real client through the semester, plus weekly general body meetings.",
  },
  {
    title: "We answer every question",
    body: "Office hours on September 18 are open to anyone, including people who have not started the application yet.",
  },
];
 
/* ---------------------------------------------------------
   5. COFFEE CHAT DATA
   --------------------------------------------------------- */
 
const COFFEE_CHAT_STEPS = [
  {
    title: "Submit the coffee chat form",
    body: "The form opens on the first day of classes and stays open through recruitment. Tell us the policy areas you care about.",
  },
  {
    title: "A member emails you",
    body: "We match you with someone who shares your interests. Expect an email like the one shown here within a few days.",
  },
  {
    title: "Pick a time and a format",
    body: "Reply with the slot that works and whether you would rather meet in person or over Zoom. Either is completely fine.",
  },
  {
    title: "Chat for about 30 minutes",
    body: "It is a conversation, not an evaluation. Coffee is on us.",
  },
];
 
const COFFEE_CHAT_EMAIL = {
  subject: "APPS Coffee Chat",
  body: [
    "Hello [your name],",
    "",
    "Thank you for your interest in Applied Public Policy Strategies at Cornell (APPS)! I saw your coffee chat request and wanted to reach out to you because of our shared interest in [your policy interests].",
    "",
    "Please let me know which of the times listed below works best for you, as well as whether you would prefer to meet in person or virtually:",
    "",
    "  - Friday (9/4): 11:30AM - 1PM, 3PM - 5PM",
    "  - [two to three more time slots]",
    "",
    "If you have any questions, please let me know! I look forward to connecting!",
    "",
    "Best regards,",
    "[APPS member]",
  ].join("\n"),
};
 
const COFFEE_CHAT_TIPS = [
  "Reply within a day or two, even if it is just to say which times work. Members are juggling their own schedules.",
  "Name two or three policy areas you actually care about rather than saying you are open to anything. It gives the conversation somewhere to go.",
  "Bring two or three real questions. What a project semester looks like week to week, how teams are staffed, and what surprised them about APPS are all fair game.",
  "Ask about the work, not just the club. What did their team actually deliver to the client?",
  "It is fine to say you are still figuring out whether policy is for you. Most of us were.",
  "Send a short thank-you note afterward. One or two sentences is plenty.",
  "Chat with more than one member if you can. Different project teams have very different experiences.",
];
 
/* ---------------------------------------------------------
   6. INTERVIEW DATA
   --------------------------------------------------------- */
 
const INTERVIEW_ROUNDS = [
  {
    round: "Round 1",
    name: "Resume Review",
    when: "September 18",
    summary:
      "We read your application and resume together. This round is about clarity and fit, not prestige.",
    tips: [
      "Keep it to one page and lead with what you did, not what the organization was.",
      "Quantify where you honestly can. Numbers make a bullet legible in ten seconds.",
      "Show the through-line. If your resume looks scattered, use the application to explain the thread.",
      "Bring it to the September 11 resume review session and have a member mark it up before you submit.",
      "Proofread twice. Then have someone else proofread it.",
    ],
  },
  {
    round: "Round 2",
    name: "Behavioral Interview",
    when: "September 19",
    summary:
      "A conversation with two members about your interests, how you work on a team, and why APPS specifically.",
    tips: [
      "Have a real answer to 'why APPS' that is not 'consulting experience.' Name a policy area or a project that drew you in.",
      "Prepare two or three stories you can adapt: a team conflict, something you led, something that did not work.",
      "Use structure. Situation, what you did, what happened. Keep answers to about two minutes.",
      "Be specific about your own contribution. 'We' hides you.",
      "Ask us something at the end. It is the easiest signal that you are actually interested.",
      "Nerves are normal and are not scored. Take the pause you need.",
    ],
  },
  {
    round: "Round 3",
    name: "Casing Interview",
    when: "September 20",
    summary:
      "A short policy case worked through out loud with two members. We are watching how you think, not whether you land the right answer.",
    tips: [
      "Go to the September 14 casing workshop. Everything tested here is taught there.",
      "Restate the prompt and confirm the goal before you start solving. It costs fifteen seconds and prevents most wrong turns.",
      "Lay out your structure before diving in. Three clear buckets beat ten scattered ideas.",
      "Think out loud. Silence is the only way to lose points for reasoning we cannot see.",
      "Name your assumptions and say when you are unsure. That reads as rigor, not weakness.",
      "Consider who is affected and who pays. Stakeholders and tradeoffs are what make it a policy case.",
      "Land the plane. Give a recommendation and one sentence on why, even if you ran short on time.",
    ],
  },
];
 
/* ---------------------------------------------------------
   7. PAST PROJECTS  (PLACEHOLDER DATA - replace with real ones)
   --------------------------------------------------------- */
 
const PROJECTS_ARE_PLACEHOLDER = true; // set to false once real projects are in
 
const PAST_PROJECTS = [
  {
    title: "Housing Affordability in Tompkins County",
    client: "Regional housing nonprofit",
    area: "Housing",
    term: "Spring 2026",
    summary:
      "Mapped where zoning constraints bind hardest on new multifamily supply and modeled the unit impact of three reform options.",
    deliverable: "Zoning reform memo and briefing deck for the county board",
  },
  {
    title: "Municipal Decarbonization Roadmap",
    client: "City sustainability office",
    area: "Climate & Energy",
    term: "Spring 2026",
    summary:
      "Benchmarked building electrification programs across five comparable cities and costed a phased retrofit incentive.",
    deliverable: "Implementation roadmap with a five-year cost model",
  },
  {
    title: "Childcare Access for Student Parents",
    client: "Statewide advocacy coalition",
    area: "Family & Labor",
    term: "Fall 2025",
    summary:
      "Surveyed subsidy eligibility gaps and quantified the enrollment effect of extending coverage to part-time students.",
    deliverable: "Legislative brief and testimony support materials",
  },
  {
    title: "Transit Equity and Route Redesign",
    client: "Regional transit authority",
    area: "Transportation",
    term: "Fall 2025",
    summary:
      "Analyzed ridership and travel-time data to identify underserved corridors and evaluated two service restructuring scenarios.",
    deliverable: "Route recommendation report with equity impact analysis",
  },
  {
    title: "Small Business Recovery Grants",
    client: "Local economic development agency",
    area: "Economic Development",
    term: "Spring 2025",
    summary:
      "Evaluated uptake of a pandemic-era grant program and diagnosed why eligible minority-owned businesses applied at lower rates.",
    deliverable: "Program evaluation and outreach redesign proposal",
  },
  {
    title: "Rural Broadband Adoption",
    client: "Digital equity initiative",
    area: "Technology Policy",
    term: "Spring 2025",
    summary:
      "Separated availability gaps from affordability gaps across rural census tracts and priced a device-plus-subsidy pilot.",
    deliverable: "Adoption strategy memo and pilot design",
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
 
/* --- Projects --- */
.apps-project {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  background: var(--apps-surface);
  border: 1px solid var(--apps-line);
  border-radius: 14px;
  padding: 1.35rem;
  box-shadow: var(--apps-shadow);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.apps-project:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 4px rgba(16, 24, 40, 0.05), 0 16px 36px rgba(16, 24, 40, 0.09);
}
.apps-project__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.apps-project__area {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--apps-accent);
}
.apps-project__term { font-size: 0.75rem; color: var(--apps-muted); font-weight: 600; }
.apps-project__title { margin: 0; font-size: 1.05rem; font-weight: 650; line-height: 1.3; }
.apps-project__client { margin: 0; font-size: 0.83rem; color: var(--apps-muted); font-weight: 600; }
.apps-project__summary { margin: 0; font-size: 0.92rem; line-height: 1.6; color: var(--apps-muted); }
.apps-project__deliverable {
  margin: 0.35rem 0 0;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--apps-line);
  font-size: 0.83rem;
  color: var(--apps-ink);
}
.apps-project__deliverable b {
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--apps-muted);
  margin-bottom: 0.2rem;
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
 
/* Returns the <section> to render into. If the page already has an
   element with this id, we use it. Otherwise we create a section and
   append it to the end of <main> (or <body>), before the footer. */
function getSectionHost(id, options = {}) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.classList.add("apps-block");
    if (options.tint) existing.classList.add("apps-block--tint");
    return existing;
  }
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
 
function renderProjects() {
  if (!PAST_PROJECTS.length) return;
  const section = getSectionHost("projects", { tint: true });
  const inner = sectionShell(section, {
    eyebrow: "Our Work",
    heading: "Past projects",
    lede:
      "Every semester, project teams work with a real client and deliver real analysis. This is the work new members join.",
    note: PROJECTS_ARE_PLACEHOLDER
      ? "Placeholder content: replace the PAST_PROJECTS array in script.js with real client work, then set PROJECTS_ARE_PLACEHOLDER to false to remove this banner."
      : "",
  });
 
  const grid = document.createElement("div");
  grid.className = "apps-grid";
  grid.innerHTML = PAST_PROJECTS.map(
    (project) => `
      <article class="apps-project">
        <div class="apps-project__top">
          <span class="apps-project__area">${escapeHtml(project.area || "")}</span>
          <span class="apps-project__term">${escapeHtml(project.term || "")}</span>
        </div>
        <h3 class="apps-project__title">${escapeHtml(project.title)}</h3>
        <p class="apps-project__client">${escapeHtml(project.client || "")}</p>
        <p class="apps-project__summary">${escapeHtml(project.summary || "")}</p>
        ${
          project.deliverable
            ? `<p class="apps-project__deliverable"><b>Deliverable</b>${escapeHtml(
                project.deliverable
              )}</p>`
            : ""
        }
      </article>`
  ).join("");
  inner.appendChild(grid);
}
 
/* Adds nav links for any sections this script created, so the new
   content is reachable from the header on single-page layouts. */
function addNavLinks() {
  const nav = document.getElementById("siteNav") || document.querySelector(".nav");
  if (!nav) return;
  const links = [
    { id: "projects", label: "Projects" },
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
}
 
/* ---------------------------------------------------------
   13. BOOT
   --------------------------------------------------------- */
 
document.addEventListener("DOMContentLoaded", () => {
  injectLightTokens();
  injectSectionStyles();
 
  initMobileNav();
  renderExec();
  renderMembers();
 
  // New sections must mount before scroll-reveal and nav wiring.
  renderProjects();
  renderRecruitment();
  renderCoffeeChats();
  renderInterviewTips();
  addNavLinks();
 
  initScrollReveal();
  initCounters();
  initBackToTop();
  initHeaderScroll();
  initActiveNav();
  initFaqAccordion();
});
