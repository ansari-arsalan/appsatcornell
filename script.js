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
      "Hobbies: baking, chess, shopping, crafts/sewing, eating sushi. " +
      "Where I always am on campus: Duffield, Okenshields, Law School. " +
      "Other activities: Korean Traditional Drumming Club, POLIS, State Policy Advocacy Clinic, TA (InfoSci).",
    photo: "",
  },
  {
    name: "Mia Barratt",
    role: "Co-President",
    major: "Senior • Government",
    bio:
      "Hobbies: crafting, jewelry-making, baking, chess, puzzles, reading. " +
      "Where I always am on campus: CIS, Sage Atrium, Law School. " +
      "Other activities: POLIS, TA (InfoSci & Brooks), Policy Debate. " +
      "Fun fact: I have 6 goats at home!",
    photo: "",
  },
  {
    name: "Arsalan Ansari",
    role: "Vice-President",
    major: "Senior • Government",
    bio:
      "Hobbies: poker, guitar, chess, reading, and recently skiing. " +
      "Where I always am locking in: Mann, Olin, Barnes & Noble. " +
      "Other activities: LII, CGD, Cornell in Washington, Afghan Students Club, Alexander Hamilton Society, Mafia Club.",
    photo: "",
  },
  {
    name: "Hannah Hope Lee",
    role: "Project Manager",
    major: "Sophomore • A&S • Government & Music",
    bio:
      "Interests: entertainment law, preservation of classical music, educational inequality in higher education. " +
      "Hobbies: skiing, singing/opera, hot yoga, art/painting. " +
      "Denver sports: #sko.",
    photo: "",
  },
  {
    name: "Calista Chang",
    role: "Director of Training & Development",
    major: "Sophomore • ILR (minor: Business, InfoSci)",
    bio:
      "Hobbies: iced coffee, Clairo, wandering around campus. " +
      "Where I always am on campus: Olin, bus stop bagels, Hotel. " +
      "Other activities: ASSAT, Emerging Markets Club, Global Delta Securities, Club Tennis, sorority.",
    photo: "",
  },
  {
    name: "John Purcell",
    role: "Director of Internal Affairs & Communications",
    major: "Sophomore • Government (A&S)",
    bio:
      "Hobbies: concerts, baking, thrifting, playing piano. " +
      "Where I always am on campus: Green Dragon or Zeus. " +
      "Other activities: Student Assembly, Phi Alpha Delta, Cornell Votes.",
    photo: "",
  },
  {
    name: "Sophia Chen",
    role: "Project Manager",
    major: "Sophomore • AEM",
    bio:
      "Hobbies: gym, legos, grocery store runs, debrief. " +
      "Where I always am on campus: Olin, Trillium, Bethe dining hall. " +
      "Interests: SZA, exploring new food places, music and podcasts.",
    photo: "",
  },
  {
    name: "Mandy Wang",
    role: "Director of Membership & Recruitment",
    major: "Sophomore • ILR",
    bio:
      "Hobbies: learning how to play pool, paint, pottery, movies. " +
      "Interests: always down to grab food (love matcha & sushi), book stores, art, music (seeing Olivia Dean this summer!).",
    photo: "",
  },
  {
    name: "Samuel Lau",
    role: "Director of Finance & Operations",
    major: "Freshman • Economics & Sociology",
    bio:
      "Hobbies: listening to music, going on long walks, thrifting, eating hot pot. " +
      "Where I always am on campus: Big Red Barn, Mac’s Cafe, Olin, Mann Library. " +
      "Interests: museums, trying new Collegetown restaurants, Tate McRae, Lana Del Rey, cats.",
    photo: "",
  },
  {
    name: "Andy Duryea",
    role: "Director of External Affairs",
    major: "Sophomore • Public Policy",
    bio:
      "Hobbies: fishing, skiing, listening to music, reading, exploring new places. " +
      "Where I always am on campus: MVR, Mann, Warren. " +
      "Other activities: Resident Advisor, Brooks School Ambassador, Brooks School Peer Mentor, Cornell Policy Group.",
    photo: "",
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
  major.textContent = member.major;

  const bio = document.createElement("p");
  bio.className = "member-bio";
  bio.textContent = member.bio;

  meta.appendChild(name);
  meta.appendChild(role);
  meta.appendChild(major);
  meta.appendChild(bio);

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

document.addEventListener("DOMContentLoaded", renderExec);

const saved = localStorage.getItem("apps_theme");

// DEFAULT = LIGHT
if (saved === "dark") {
  apply("dark");
} else {
  apply("light");
}

