/* =========================================================
   APPS Site Script
   - Theme toggle (dark/light)
   - Scroll-triggered animations
   - Counter animation for stats
   - Back to top button
   - Active nav highlighting
   - Team page roster rendering
   ========================================================= */

// ---- Theme Toggle (dark/light) ----
(function initTheme() {
  const root = document.documentElement;
  const STORAGE_KEY = "apps_theme";
  const saved = localStorage.getItem(STORAGE_KEY);

  const media = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  function getSystemTheme() {
    if (!media) return "dark";
    return media.matches ? "dark" : "light";
  }

  function syncToggleIcon(theme) {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    const icon = btn.querySelector(".theme-icon");
    if (icon) icon.textContent = theme === "light" ? "\u263E" : "\u2600";

    btn.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark mode" : "Switch to light mode"
    );
  }

  function apply(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) localStorage.setItem(STORAGE_KEY, theme);
    syncToggleIcon(theme);
  }

  if (saved === "light" || saved === "dark") {
    apply(saved, true);
  } else {
    apply(getSystemTheme(), false);

    if (media && typeof media.addEventListener === "function") {
      media.addEventListener("change", () => apply(getSystemTheme(), false));
    } else if (media && typeof media.addListener === "function") {
      media.addListener(() => apply(getSystemTheme(), false));
    }
  }

  function bind() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || getSystemTheme();
      const next = current === "dark" ? "light" : "dark";
      apply(next, true);
    });

    const current = root.getAttribute("data-theme") || getSystemTheme();
    syncToggleIcon(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();

// ---- Scroll-triggered reveal animations ----
function initScrollReveal() {
  const revealSelectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children";
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

// ---- Executive Board Data ----
const EXEC = [
  {
    name: "Hannah Kim",
    role: "Co-President",
    major: "Senior \u2022 Government",
    bio: "Hobbies: baking, chess, shopping, crafts/sewing, eating sushi.",
    photo: "assets/headshots/Headshot - Hannah Kim Large.jpeg",
  },
  {
    name: "Mia Barratt",
    role: "Co-President",
    major: "Senior \u2022 Government",
    bio: "Hobbies: crafting, jewelry-making, baking, chess, puzzles, reading.",
    photo: "assets/headshots/Mia_Barratt_Headshot - Mia Barratt Large.jpeg",
  },
  {
    name: "Arsalan Ansari",
    role: "Vice-President",
    major: "Senior \u2022 Government",
    bio: "Hobbies: poker, guitar, chess, reading, and recently skiing.",
    photo: "assets/headshots/mypicture - Arsalan Ansari Large.jpeg",
  },
  {
    name: "Hannah Hope Lee",
    role: "Project Manager",
    major: "Sophomore \u2022 A&S \u2022 Government & Music",
    bio: "Hobbies: skiing, singing/opera, hot yoga, art/painting.",
    photo: "assets/headshots/IMG_3987 - Hannah Lee Large.jpeg",
  },
  {
    name: "Calista Chang",
    role: "Director of Training & Development",
    major: "Sophomore \u2022 ILR (minor: Business, InfoSci)",
    bio: "Hobbies: iced coffee, Clairo, wandering around campus.",
    photo: "assets/headshots/IMG_0043 - Calista Chang Large.jpeg",
  },
  {
    name: "John Purcell",
    role: "Director of Internal Affairs & Communications",
    major: "Sophomore \u2022 Government (A&S)",
    bio: "Hobbies: concerts, baking, thrifting, playing piano.",
    photo: "assets/headshots/John Purcell Headshot copy - John Purcell Large.jpeg",
  },
  {
    name: "Sophia Chen",
    role: "Project Manager",
    major: "Sophomore \u2022 AEM",
    bio: "Hobbies: gym, legos, grocery store runs, debrief.",
    photo: "assets/headshots/SOPHIA_CHEN_Headshot - Sophia Chen Large.jpeg",
  },
  {
    name: "Mandy Wang",
    role: "Director of Membership & Recruitment",
    major: "Sophomore \u2022 ILR",
    bio: "Hobbies: learning how to play pool, paint, pottery, movies.",
    photo: "assets/headshots/Mandy_Wang_Headshot - Mandy Wang Large.jpeg",
  },
  {
    name: "Samuel Lau",
    role: "Director of Finance & Operations",
    major: "Freshman \u2022 Economics & Sociology",
    bio: "Hobbies: listening to music, going on long walks, thrifting, eating hot pot.",
    photo: "assets/headshots/Headshot - Samuel Lau Large.jpeg",
  },
  {
    name: "Andy Duryea",
    role: "Director of External Affairs",
    major: "Sophomore \u2022 Public Policy",
    bio: "Hobbies: fishing, skiing, listening to music, reading, exploring new places.",
    photo: "assets/headshots/Headshot-Andy Duryea - Andy Duryea Large.jpeg",
  },
];

const MEMBERS = [
  {
    name: "Bransen Fitzwater",
    role: "Project Manager",
    graduationYear: 2028,
    major: "Environment & Sustainability, Minor in Public Policy",
    pronouns: "he/him",
    linkedin: "www.linkedin.com/in/bransen-fitzwater",
    photo: "assets/headshots/Headshot - Bransen Fitzwater Large.jpeg",
  },
  {
    name: "Emily Cho",
    role: "Project Manager",
    graduationYear: 2028,
    major: "Government",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/emily-cho-17eyc1779",
    photo: "assets/headshots/DSC05403 2 - Emily Cho Large.jpeg",
  },
  {
    name: "Eneanya Obioha",
    role: "Project Manager",
    graduationYear: 2028,
    major: "Public Policy, Law and Society",
    pronouns: "she/her",
    linkedin:
      "https://www.linkedin.com/in/eneanya-obioha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/headshots/IMG_0450 - Eneanya Obioha Large.jpeg",
  },
  {
    name: "Flora Kim",
    role: "Project Manager",
    graduationYear: 2028,
    major: "Public Policy / International Relations",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/fk247",
    photo: "assets/headshots/Flora_Kim_Headshot - Flora Kim Large.jpeg",
  },
  {
    name: "Annelie Chang",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "linkedin.com/in/annelie-chang-511b78371",
    photo: "assets/headshots/IMG_7221 - Annelie Chang Large.jpeg",
  },
  {
    name: "Charlie Rogers",
    role: "Policy Analyst",
    graduationYear: 2028,
    major: "Environment & Sustainability / Public Policy and Urban & Regional Studies",
    pronouns: "he/him",
    linkedin: "LinkedIn.com/in/crogers116",
    photo: "assets/headshots/DSCF0607 from Google Drive - Charlie Rogers Large.jpeg",
  },
  {
    name: "Chi-Ray Hsu",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Government",
    pronouns: "she/her",
    linkedin:
      "https://www.linkedin.com/in/chi-ray-hsu-378bb8394?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/headshots/ch2298@cornell.edu-a912eb67 - chiray Large.jpeg",
  },
  {
    name: "Christopher J. Corona-Plancarte",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    pronouns: "he/him",
    photo: "assets/headshots/Kegley250926Cornell 0158 2 - Christopher Corona-Plancarte Large.jpeg",
  },
  {
    name: "Ella Kim",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Environment & Sustainability, Minor in International Relations",
    pronouns: "she/her",
    linkedin: "linkedin.com/in/ellakim7",
    photo: "assets/headshots/Ella-Kim-Headshot - Ella Kim Large.jpeg",
  },
  {
    name: "Elizabeth Chow",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    photo: "assets/headshots/IMG_4484 - Elizabeth Chow Large.jpeg",
  },
  {
    name: "Emma Yu",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/emma-yu-020598335/",
    photo: "assets/headshots/IMG_9679 - Emma Yu Large.jpeg",
  },
  {
    name: "Gabrielle Abraham",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Government, Minor in PAM",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/gabrielle-abraham376",
    photo: "assets/headshots/IMG_6130 - Gabby Abraham Large.jpeg",
  },
  {
    name: "Gargi Singh",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy, Minors in Business and Law & Society",
    photo: "assets/headshots/Gargi_Singh_Headshot - Gargi Singh Large.jpeg",
  },
  {
    name: "Jackie Cho",
    role: "Policy Analyst",
    graduationYear: 2027,
    major: "ILR / Art History",
    pronouns: "she/her",
    linkedin: "http://linkedin.com/in/jackie-cho57",
    photo: "assets/headshots/IMG_4798 - Jackie Cho Large.jpeg",
  },
  {
    name: "Jackson De Guzman",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy, Minor in Urban and Regional Studies",
    pronouns: "he/him/any",
    linkedin:
      "https://www.linkedin.com/in/jackson-de-guzman-3ab289291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/headshots/Epson_01112025151524 - Jackson De Guzman Large.jpeg",
  },
  {
    name: "Julia Ostroff",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Computer Science & Government",
    linkedin: "https://www.linkedin.com/in/julia-rachel-ostroff/",
    photo: "assets/headshots/Julia Headshot - Julia Ostroff Large.jpeg",
  },
  {
    name: "Judy Li",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    linkedin: "www.linkedin.com/in/judy-li-8b5912345",
    photo: "assets/headshots/IMG_0013 - Judy Li Large.jpeg",
  },
  {
    name: "Madeline Shukovsky",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "LinkedIn.com/in/madeline-shukovsky",
    photo: "assets/headshots/IMG_5396 - Madeline Large.jpeg",
  },
  {
    name: "Marianna Wineinger",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy / Portuguese + Law and Society",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/marianna-wineinger-92029b383",
    photo: "assets/headshots/Screenshot 2026-03-10 000457 - Marianna Wineinger Large.jpeg",
  },
  {
    name: "Marianne Custodio",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Economics & Public Policy",
    pronouns: "she/her",
    photo: "assets/headshots/headshot - Marianne Custodio Large.jpeg",
  },
  {
    name: "Muntasir Ansary",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Biometry & Statistics",
    pronouns: "he/him",
    photo: "assets/headshots/Muntasir_Ansary_Headshot - Muntasir Ansary Large.jpeg",
  },
  {
    name: "Shreyash Shrestha",
    role: "Policy Analyst",
    graduationYear: 2028,
    major: "Industrial and Labor Relations",
    pronouns: "he/him",
    linkedin: "https://www.linkedin.com/in/shreyashshrestha/",
    photo: "assets/headshots/Shreyash_Shrestha_Headshot - Shreyash Shrestha Large.jpeg",
  },
  {
    name: "Sophia Kim",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "BME, Minor in Health Policy",
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/sophiayjkim/",
    photo: "assets/headshots/Screenshot 2026-03-06 at 1.49.18 PM - Sophia Kim Large.jpeg",
  },
  {
    name: "Tami Omole",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy / Aerospace Engineering",
    pronouns: "she/they",
    linkedin: "http://linkedin.com/in/tami-omole-558a00282",
    photo: "assets/headshots/DSCN3468 - Tami Omole Large.jpeg",
  },
];

const MOBILE_NAV_BREAKPOINT = 900;

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

function formatMajorLine(member) {
  if (!member.graduationYear) return member.major;
  return `${getYearInCollege(member.graduationYear)} \u2022 ${member.major}`;
}

function normalizeUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

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

  if (member.photo) {
    const img = document.createElement("img");
    img.src = member.photo;
    img.alt = `${member.name} headshot`;
    img.loading = "lazy";
    avatar.appendChild(img);
  } else {
    const span = document.createElement("span");
    span.textContent = initialsFromName(member.name);
    avatar.appendChild(span);
  }

  const meta = document.createElement("div");
  meta.className = "member-meta";

  const name = document.createElement("h3");
  name.className = "member-name";
  name.textContent = member.name;

  const role = document.createElement("p");
  role.className = "member-role";
  role.textContent = member.role;

  const major = document.createElement("p");
  major.className = "member-major";
  major.textContent = formatMajorLine(member);

  meta.appendChild(name);
  meta.appendChild(role);
  meta.appendChild(major);
  if (member.pronouns) {
    const pronouns = document.createElement("p");
    pronouns.className = "member-pronouns";
    pronouns.textContent = member.pronouns;
    meta.appendChild(pronouns);
  }
  if (member.linkedin) {
    const linkWrap = document.createElement("p");
    linkWrap.className = "member-link";

    const link = document.createElement("a");
    link.href = normalizeUrl(member.linkedin);
    link.target = "_blank";
    link.rel = "noreferrer noopener";
    link.textContent = "LinkedIn";

    linkWrap.appendChild(link);
    meta.appendChild(linkWrap);
  }

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

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollReveal();
  initCounters();
  initBackToTop();
  initHeaderScroll();
  initActiveNav();
  renderExec();
  renderMembers();
  initFaqAccordion();
});
