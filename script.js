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

  meta.appendChild(name);
  meta.appendChild(role);
  meta.appendChild(major);
  if (member.bio) {
    // Bio intentionally omitted from rendering on the team page.
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

document.addEventListener("DOMContentLoaded", renderExec);

const saved = localStorage.getItem("apps_theme");

// DEFAULT = LIGHT
if (saved === "dark") {
  apply("dark");
} else {
  apply("light");
}

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
