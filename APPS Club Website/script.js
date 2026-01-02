// ---- Theme Toggle (dark/light) ----
(function initTheme(){
    const root = document.documentElement;
    const saved = localStorage.getItem("apps_theme");
  
    function apply(theme){
      root.setAttribute("data-theme", theme);
      localStorage.setItem("apps_theme", theme);
      const btn = document.getElementById("themeToggle");
      if (btn){
        const icon = btn.querySelector(".theme-icon");
        // show moon in light mode (switch to dark), sun in dark mode (switch to light)
        if (icon) icon.textContent = theme === "light" ? "☾" : "☀";
      }
    }
  
    // If user has saved preference, use it; else use OS preference
    if (saved === "light" || saved === "dark") {
      apply(saved);
    } else {
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      apply(prefersLight ? "light" : "dark");
    }
  
    // Bind click
    const btn = document.getElementById("themeToggle");
    if (btn){
      btn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") || "dark";
        apply(current === "dark" ? "light" : "dark");
      });
    }
  })();

  const EXEC = [
    {
      name: "Hannah Kim",
      role: "Co-President",
      major: "Senior • Government • Long Island, NY",
      bio: "Hobbies: baking, chess, shopping, crafts/sewing, sushi. Usually at: Duffield, Okenshields, Law School. Other: Korean Traditional Drumming Club, POLIS, State Policy Advocacy Clinic, TA (InfoSci).",
      photo: ""
    },
    {
      name: "Mia Barratt",
      role: "Co-President",
      major: "Senior • Government • Dansville, NY",
      bio: "Hobbies: crafting, jewelry-making, baking, chess, puzzles, reading. Usually at: CIS, Sage Atrium, Law School. Other: POLIS, TA (InfoSci & Brooks), Policy Debate. Fun fact: has 6 goats at home.",
      photo: ""
    },
    {
      name: "Arsalan Ansari",
      role: "Vice-President",
      major: "Senior • Government • Balkh, Afghanistan",
      bio: "Hobbies: poker, guitar, chess, reading, recently skiing. Usually at: Mann, Olin, Barnes & Noble. Other: LII, CGD, Cornell in Washington, Afghan Students Club, Alexander Hamilton Society, Mafia Club.",
      photo: ""
    },
    {
      name: "Hannah Hope Lee",
      role: "Project Manager",
      major: "Sophomore • A&S • Government & Music • Denver, CO",
      bio: "Interests: entertainment law, preservation of classical music, educational inequality in higher education. Hobbies: skiing, singing/opera, hot yoga, art/painting. Denver sports: #sko.",
      photo: ""
    },
    {
      name: "Calista Chang",
      role: "Director of Training & Development",
      major: "Sophomore • ILR (minor: Business, InfoSci) • Chicago, IL",
      bio: "Hobbies: iced coffee, Clairo, wandering around campus. Usually at: Olin, bus stop bagels, Hotel. Other: ASSAT, Emerging Markets Club, Global Delta Securities, Club Tennis, sorority.",
      photo: ""
    },
    {
      name: "John Purcell",
      role: "Director of Internal Affairs & Communications",
      major: "Sophomore • Government (A&S) • Long Island, NY",
      bio: "Hobbies: concerts, baking, thrifting, piano. Usually at: Green Dragon or Zeus. Other: Student Assembly, Phi Alpha Delta, Cornell Votes.",
      photo: ""
    },
    {
      name: "Sophia Chen",
      role: "Project Manager",
      major: "Sophomore • AEM • Cleveland, OH",
      bio: "Hobbies: gym, legos, grocery store runs, debrief. Usually at: Olin, Trillium, Bethe dining hall. Interests: SZA, exploring new food places, music & podcasts.",
      photo: ""
    },
    {
      name: "Mandy Wang",
      role: "Director of Membership & Recruitment",
      major: "Sophomore • ILR • NYC",
      bio: "Hobbies: learning pool, painting, pottery, movies. Interests: matcha & sushi, bookstores, art, music (seeing Olivia Dean this summer). Always down to grab food.",
      photo: ""
    },
    {
      name: "Samuel Lau",
      role: "Director of Finance & Operations",
      major: "Freshman • Economics & Sociology • Sacramento, CA",
      bio: "Hobbies: music, long walks, thrifting, hot pot. Usually at: Big Red Barn, Mac’s Cafe, Olin, Mann Library. Interests: museums, new Collegetown restaurants, Tate McRae, Lana Del Rey, cats.",
      photo: ""
    },
    {
      name: "Andy Duryea",
      role: "Director of External Affairs",
      major: "Sophomore • Public Policy • Anchorage, AK",
      bio: "Hobbies: fishing, skiing, music, reading, exploring new places. Usually at: MVR, Mann, Warren. Other: Resident Advisor, Brooks School Ambassador, Brooks School Peer Mentor, Cornell Policy Group.",
      photo: ""
    }
  ];
  
  