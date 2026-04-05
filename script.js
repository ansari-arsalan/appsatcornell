/* =========================================================
   APPS Site Script
   - Theme toggle (dark/light)
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
    // In light mode: show moon (switch to dark). In dark mode: show sun (switch to light).
    if (icon) icon.textContent = theme === "light" ? "☾" : "☀";

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

  // Initial theme
  if (saved === "light" || saved === "dark") {
    apply(saved, true);
  } else {
    apply(getSystemTheme(), false);

    // If user hasn't chosen a preference, keep in sync with OS changes
    if (media && typeof media.addEventListener === "function") {
      media.addEventListener("change", () => apply(getSystemTheme(), false));
    } else if (media && typeof media.addListener === "function") {
      // Safari fallback
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

    // Ensure correct icon if nav renders after theme is applied
    const current = root.getAttribute("data-theme") || getSystemTheme();
    syncToggleIcon(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();

// ---- Executive Board Data ----
const EXEC = [
  {
    name: "Hannah Kim",
    role: "Co-President",
    major: "Senior • Government",
    bio:
      "Hobbies: baking, chess, shopping, crafts/sewing, eating sushi.",
    photo: "assets/Headshots/Headshot - Hannah Kim.jpeg",
  },
  {
    name: "Mia Barratt",
    role: "Co-President",
    major: "Senior • Government",
    bio:
      "Hobbies: crafting, jewelry-making, baking, chess, puzzles, reading.",
    photo: "assets/Headshots/Mia_Barratt_Headshot - Mia Barratt.jpg",
  },
  {
    name: "Arsalan Ansari",
    role: "Vice-President",
    major: "Senior • Government",
    bio:
      "Hobbies: poker, guitar, chess, reading, and recently skiing.",
    photo: "assets/Headshots/mypicture - Arsalan Ansari.jpg",
  },
  {
    name: "Hannah Hope Lee",
    role: "Project Manager",
    major: "Sophomore • A&S • Government & Music",
    bio:
      "Hobbies: skiing, singing/opera, hot yoga, art/painting.",
    photo: "assets/Headshots/IMG_3987 - Hannah Lee.jpg",
  },
  {
    name: "Calista Chang",
    role: "Director of Training & Development",
    major: "Sophomore • ILR (minor: Business, InfoSci)",
    bio:
      "Hobbies: iced coffee, Clairo, wandering around campus.",
    photo: "assets/Headshots/IMG_0043 - Calista Chang.jpeg",
  },
  {
    name: "John Purcell",
    role: "Director of Internal Affairs & Communications",
    major: "Sophomore • Government (A&S)",
    bio:
      "Hobbies: concerts, baking, thrifting, playing piano.",
    photo: "assets/Headshots/John Purcell Headshot copy - John Purcell.JPG",
  },
  {
    name: "Sophia Chen",
    role: "Project Manager",
    major: "Sophomore • AEM",
    bio:
      "Hobbies: gym, legos, grocery store runs, debrief.",
    photo: "assets/Headshots/SOPHIA_CHEN_Headshot - Sophia Chen.jpeg",
  },
  {
    name: "Mandy Wang",
    role: "Director of Membership & Recruitment",
    major: "Sophomore • ILR",
    bio:
      "Hobbies: learning how to play pool, paint, pottery, movies.",
    photo: "assets/Headshots/Mandy_Wang_Headshot - Mandy Wang.jpg",
  },
  {
    name: "Samuel Lau",
    role: "Director of Finance & Operations",
    major: "Freshman • Economics & Sociology",
    bio:
      "Hobbies: listening to music, going on long walks, thrifting, eating hot pot.",
    photo: "assets/Headshots/Headshot - Samuel Lau.JPG",
  },
  {
    name: "Andy Duryea",
    role: "Director of External Affairs",
    major: "Sophomore • Public Policy",
    bio:
      "Hobbies: fishing, skiing, listening to music, reading, exploring new places.",
    photo: "assets/Headshots/Headshot-Andy Duryea - Andy Duryea.jpeg",
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
    photo: "assets/Headshots/Headshot - Bransen Fitzwater.jpg",
  },
  {
    name: "Emily Cho",
    role: "Project Manager",
    graduationYear: 2028,
    major: "Government",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/emily-cho-17eyc1779",
    photo: "assets/Headshots/DSC05403 2 - Emily Cho.jpeg",
  },
  {
    name: "Eneanya Obioha",
    role: "Project Manager",
    graduationYear: 2028,
    major: "Public Policy, Law and Society",
    pronouns: "she/her",
    linkedin:
      "https://www.linkedin.com/in/eneanya-obioha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/Headshots/IMG_0450 - Eneanya Obioha.jpeg",
  },
  {
    name: "Flora Kim",
    role: "Project Manager",
    graduationYear: 2028,
    major: "Public Policy / International Relations",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/fk247",
    photo: "assets/Headshots/Flora_Kim_Headshot - Flora Kim.JPG",
  },
  {
    name: "Annelie Chang",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "linkedin.com/in/annelie-chang-511b78371",
    photo: "assets/Headshots/IMG_7221 - Annelie Chang.JPG",
  },
  {
    name: "Charlie Rogers",
    role: "Policy Analyst",
    graduationYear: 2028,
    major: "Environment & Sustainability / Public Policy and Urban & Regional Studies",
    pronouns: "he/him",
    linkedin: "LinkedIn.com/in/crogers116",
    photo: "assets/Headshots/DSCF0607 from Google Drive - Charlie Rogers.jpeg",
  },
  {
    name: "Chi-Ray Hsu",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Government",
    pronouns: "she/her",
    linkedin:
      "https://www.linkedin.com/in/chi-ray-hsu-378bb8394?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/Headshots/ch2298@cornell.edu-a912eb67 - chiray.jpeg",
  },
  {
    name: "Christopher J. Corona-Plancarte",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    pronouns: "he/him",
    photo: "assets/Headshots/Kegley250926Cornell 0158 2 - Christopher Corona-Plancarte.jpg",
  },
  {
    name: "Ella Kim",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Environment & Sustainability, Minor in International Relations",
    pronouns: "she/her",
    linkedin: "linkedin.com/in/ellakim7",
    photo: "assets/Headshots/Ella-Kim-Headshot - Ella Kim.png",
  },
  {
    name: "Elizabeth Chow",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    photo: "assets/Headshots/IMG_4484 - Elizabeth Chow.jpeg",
  },
  {
    name: "Emma Yu",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/emma-yu-020598335/",
    photo: "assets/Headshots/IMG_9679 - Emma Yu.jpg",
  },
  {
    name: "Gabrielle Abraham",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Government, Minor in PAM",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/gabrielle-abraham376",
    photo: "assets/Headshots/IMG_6130 - Gabby Abraham.jpeg",
  },
  {
    name: "Gargi Singh",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy, Minors in Business and Law & Society",
    photo: "assets/Headshots/Gargi_Singh_Headshot - Gargi Singh.jpg",
  },
  {
    name: "Jackie Cho",
    role: "Policy Analyst",
    graduationYear: 2027,
    major: "ILR / Art History",
    pronouns: "she/her",
    linkedin: "http://linkedin.com/in/jackie-cho57",
    photo: "assets/Headshots/IMG_4798 - Jackie Cho.jpeg",
  },
  {
    name: "Jackson De Guzman",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy, Minor in Urban and Regional Studies",
    pronouns: "he/him/any",
    linkedin:
      "https://www.linkedin.com/in/jackson-de-guzman-3ab289291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "assets/Headshots/Epson_01112025151524 - Jackson De Guzman.jpeg",
  },
  {
    name: "Julia Ostroff",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Computer Science & Government",
    linkedin: "https://www.linkedin.com/in/julia-rachel-ostroff/",
    photo: "assets/Headshots/Julia Headshot - Julia Ostroff.jpeg",
  },
  {
    name: "Judy Li",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    linkedin: "www.linkedin.com/in/judy-li-8b5912345",
    photo: "assets/Headshots/IMG_0013 - Judy Li.jpg",
  },
  {
    name: "Madeline Shukovsky",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy",
    pronouns: "she/her",
    linkedin: "LinkedIn.com/in/madeline-shukovsky",
    photo: "assets/Headshots/IMG_5396 - Madeline.jpeg",
  },
  {
    name: "Marianna Wineinger",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy / Portuguese + Law and Society",
    pronouns: "she/her",
    linkedin: "www.linkedin.com/in/marianna-wineinger-92029b383",
    photo: "assets/Headshots/Screenshot 2026-03-10 000457 - Marianna Wineinger.png",
  },
  {
    name: "Marianne Custodio",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Economics & Public Policy",
    pronouns: "she/her",
    photo: "assets/Headshots/headshot - Marianne Custodio.png",
  },
  {
    name: "Muntasir Ansary",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Biometry & Statistics",
    pronouns: "he/him",
    photo: "assets/Headshots/Muntasir_Ansary_Headshot - Muntasir Ansary.jpg",
  },
  {
    name: "Shreyash Shrestha",
    role: "Policy Analyst",
    graduationYear: 2028,
    major: "Industrial and Labor Relations",
    pronouns: "he/him",
    linkedin: "https://www.linkedin.com/in/shreyashshrestha/",
    photo: "assets/Headshots/Shreyash_Shrestha_Headshot - Shreyash Shrestha.jpg",
  },
  {
    name: "Sophia Kim",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "BME, Minor in Health Policy",
    pronouns: "she/her",
    linkedin: "https://www.linkedin.com/in/sophiayjkim/",
    photo: "assets/Headshots/Screenshot 2026-03-06 at 1.49.18 PM - Sophia Kim.png",
  },
  {
    name: "Tami Omole",
    role: "Policy Analyst",
    graduationYear: 2029,
    major: "Public Policy / Aerospace Engineering",
    pronouns: "she/they",
    linkedin: "http://linkedin.com/in/tami-omole-558a00282",
    photo: "assets/Headshots/DSCN3468 - Tami Omole.jpeg",
  },
];

// ---- Team Page Rendering ----
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
  return `${getYearInCollege(member.graduationYear)} • ${member.major}`;
}

function normalizeUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function createMemberCard(member) {
  const card = document.createElement("article");
  card.className = "member-card";

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
    link.textContent = "Profile";

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
  EXEC.forEach((m) => grid.appendChild(createMemberCard(m)));
}

function renderMembers() {
  const grid = document.getElementById("memberGrid");
  if (!grid) return;
  grid.innerHTML = "";
  MEMBERS.forEach((m) => grid.appendChild(createMemberCard(m)));
}

document.addEventListener("DOMContentLoaded", () => {
  renderExec();
  renderMembers();
});

// ---- FAQ Accordion (single open + focus + analytics hook) ----
document.addEventListener("DOMContentLoaded", () => {
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
});
