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
    year: "Senior",
    college: "College of Arts and Sciences",
    major: "Government",
    bio: "Hobbies: baking, chess, shopping, crafts/sewing, eating sushi.",
    photo: "assets/headshots/hannah-kim.jpeg",
  },
  {
    name: "Mia Barratt",
    role: "Co-President",
    year: "Senior",
    college: "College of Arts and Sciences",
    major: "Government",
    bio: "Hobbies: crafting, jewelry-making, baking, chess, puzzles, reading.",
    photo: "assets/headshots/mia-barratt.jpeg",
  },
  {
    name: "Arsalan Ansari",
    role: "Vice-President",
    year: "Senior",
    college: "College of Arts and Sciences",
    major: "Government",
    bio: "Hobbies: poker, guitar, chess, reading, and recently skiing.",
    photo: "assets/headshots/arsalan-ansari.jpeg",
  },
  {
    name: "Hannah Hope Lee",
    role: "Project Manager",
    year: "Sophomore",
    college: "College of Arts and Sciences",
    major: "Government & Music",
    bio: "Hobbies: skiing, singing/opera, hot yoga, art/painting.",
    photo: "assets/headshots/hannah-hope-lee.jpeg",
  },
  {
    name: "Calista Chang",
    role: "Director of Training & Development",
    year: "Sophomore",
    college: "School of Industrial and Labor Relations",
    major: "ILR, minors in Business and Information Science",
    bio: "Hobbies: iced coffee, Clairo, wandering around campus.",
    photo: "assets/headshots/calista-chang.jpeg",
  },
  {
    name: "John Purcell",
    role: "Director of Internal Affairs & Communications",
    year: "Sophomore",
    college: "College of Arts and Sciences",
    major: "Government",
    bio: "Hobbies: concerts, baking, thrifting, playing piano.",
    photo: "assets/headshots/john-purcell.jpeg",
  },
  {
    name: "Sophia Chen",
    role: "Project Manager",
    year: "Sophomore",
    college: "Dyson School of Applied Economics and Management",
    major: "Applied Economics and Management",
    bio: "Hobbies: gym, legos, grocery store runs, debrief.",
    photo: "assets/headshots/sophia-chen.jpeg",
  },
  {
    name: "Mandy Wang",
    role: "Director of Membership & Recruitment",
    year: "Sophomore",
    college: "School of Industrial and Labor Relations",
    major: "ILR",
    bio: "Hobbies: learning how to play pool, paint, pottery, movies.",
    photo: "assets/headshots/mandy-wang.jpeg",
  },
  {
    name: "Samuel Lau",
    role: "Director of Finance & Operations",
    year: "Freshman",
    college: "College of Arts and Sciences",
    major: "Economics & Sociology",
    bio: "Hobbies: listening to music, going on long walks, thrifting, eating hot pot.",
    photo: "assets/headshots/samuel-lau.jpeg",
  },
  {
    name: "Andy Duryea",
    role: "Director of External Affairs",
    year: "Sophomore",
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    bio: "Hobbies: fishing, skiing, listening to music, reading, exploring new places.",
    photo: "assets/headshots/andy-duryea.jpeg",
  },
];

const MEMBERS = [
  {
    name: "Bransen Fitzwater",
    role: "Project Manager",
    graduationYear: 2028,
    college: "College of Agriculture and Life Sciences",
    major: "Environment & Sustainability, Minor in Public Policy",
    pronouns: "he/him",
    linkedin: "www.linkedin.com/in/bransen-fitzwater",
    photo: "assets/headshots/bransen-fitzwater.jpeg",
  },
  {
    name: "Emily Cho",
    role: "Project Manager",
    graduationYear: 2028,
    college: "College of Arts and Sciences",
    major: "Government",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/emily-cho-17eyc1779",
    photo: "assets/headshots/emily-cho.jpeg",
  },
  {
    name: "Eneanya Obioha",
    role: "Project Manager",
    graduationYear: 2028,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy, Law and Society",
    pronouns: "she/her",
    linkedin:
      "https://www.linkedin.com/in/eneanya-obioha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/headshots/eneanya-obioha.jpeg",
  },
  {
    name: "Flora Kim",
    role: "Project Manager",
    graduationYear: 2028,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy / International Relations",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/fk247",
    photo: "assets/headshots/flora-kim.jpeg",
  },
  {
    name: "Annelie Chang",
    role: "Policy Analyst",
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
    college: "College of Agriculture and Life Sciences",
    major: "Environment & Sustainability / Public Policy and Urban & Regional Studies",
    pronouns: "he/him",
    linkedin: "LinkedIn.com/in/crogers116",
    photo: "assets/headshots/charlie-rogers.jpeg",
  },
  {
    name: "Chi-Ray Hsu",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Arts and Sciences",
    major: "Government",
    pronouns: "she/her",
    linkedin:
      "https://www.linkedin.com/in/chi-ray-hsu-378bb8394?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/headshots/chi-ray-hsu.jpeg",
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
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "College of Agriculture and Life Sciences",
    major: "Environment & Sustainability, Minor in International Relations",
    pronouns: "she/her",
    linkedin: "linkedin.com/in/ellakim7",
    photo: "assets/headshots/ella-kim.jpeg",
  },
  {
    name: "Elizabeth Chow",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy",
    photo: "assets/headshots/elizabeth-chow.jpeg",
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
    linkedin: "www.linkedin.com/in/gabrielle-abraham376",
    photo: "assets/headshots/gabrielle-abraham.jpeg",
  },
  {
    name: "Gargi Singh",
    role: "Policy Analyst",
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
    name: "Jackson De Guzman",
    role: "Policy Analyst",
    graduationYear: 2029,
    college: "Jeb E. Brooks School of Public Policy",
    major: "Public Policy, Minor in Urban and Regional Studies",
    pronouns: "he/him/any",
    linkedin:
      "https://www.linkedin.com/in/jackson-de-guzman-3ab289291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/headshots/jackson-de-guzman.jpeg",
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
    linkedin: "www.linkedin.com/in/judy-li-8b5912345",
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
    linkedin: "www.linkedin.com/in/marianna-wineinger-92029b383",
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
    role: "Policy Analyst",
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
