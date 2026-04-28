
(function () {

    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const collapseBtn = document.getElementById("collapseSidebarBtn");
    const mobileToggle = document.getElementById("mobileToggleBtn");
    const profileBtn = document.getElementById("profileDropdownBtn");
    const profileDropdown = document.getElementById("profileDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutItems = document.querySelectorAll(".logout-item");

    let taskCompletedCount = 24;
    let isProgrammaticResize = false; // ✅ prevent loop

    // ================= SIDEBAR TOGGLE =================
    function setSidebarCollapsed(isCollapsed, skipStorage = false) {

        if (isCollapsed) {
            sidebar.classList.add("collapsed");
            mainContent.classList.add("sidebar-collapsed");
        } else {
            sidebar.classList.remove("collapsed");
            mainContent.classList.remove("sidebar-collapsed");
        }

        const icon = collapseBtn?.querySelector("i");
        if (icon) {
            icon.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
        }

        if (!skipStorage) {
            localStorage.setItem("hrms_sidebar_collapsed", isCollapsed ? "true" : "false");
        }
    }

    function toggleCollapse() {
        const willCollapse = !sidebar.classList.contains("collapsed");
        setSidebarCollapsed(willCollapse);
    }

    if (collapseBtn) collapseBtn.addEventListener("click", toggleCollapse);

    // ================= MOBILE SIDEBAR =================
    if (mobileToggle) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("mobile-open");
        });
    }

    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove("mobile-open");
        }

        if (profileDropdown && profileBtn && !profileBtn.contains(e.target)) {
            profileDropdown.classList.remove("active");
        }
    });

    // ================= PROFILE DROPDOWN =================
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle("active");
        });
    }

    // ================= LOGOUT =================
    function handleLogout() {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            window.location.href = "../index.html";
        }
    }

    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    logoutItems.forEach(btn => btn.addEventListener("click", handleLogout));

    // ================= USER DATA =================
    const storedName = localStorage.getItem("hrms_employee_name") || "Alex Mercer";
    const storedRole = localStorage.getItem("hrms_employee_role") || "Senior Developer";

    const firstName = storedName.split(" ")[0];

    document.getElementById("userName").innerText = storedName;
    document.getElementById("userRole").innerText = storedRole;
    document.getElementById("dashboardUserName").innerText = firstName;

    const avatarEl = document.getElementById("userAvatar");
    if (avatarEl) {
        avatarEl.innerText = storedName.split(" ").map(n => n[0]).join("").toUpperCase();
    }

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good morning" :
        hour < 18 ? "Good afternoon" : "Good evening";

    document.getElementById("greetingMessage").innerText =
        `${greeting}! Here's your dashboard overview.`;

    function updateDateTime() {
        const now = new Date();
        document.getElementById("currentDateTime").innerText =
            now.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
    }

    updateDateTime();
    setInterval(updateDateTime, 60000);

    // ================= CHARTS =================
    const attendanceCtx = document.getElementById("attendanceChart").getContext("2d");
    new Chart(attendanceCtx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [{
                label: "Hours Worked",
                data: [8, 7.5, 8.5, 8, 7.5, 4],
                borderColor: "#1F6F7F",
                backgroundColor: "rgba(31,111,127,0.08)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } }
        }
    });

    const taskCtx = document.getElementById("taskChart").getContext("2d");
    new Chart(taskCtx, {
        type: "bar",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [{
                label: "Tasks Completed",
                data: [5, 7, 6, 8, 6, 2],
                backgroundColor: "#6FAF2E",
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } }
        }
    });

    // ================= SIDEBAR RESTORE =================
    const saved = localStorage.getItem("hrms_sidebar_collapsed") === "true";

    if (window.innerWidth > 768) {
        setSidebarCollapsed(saved, true);
    }

    // ================= RESIZE (FIXED - NO LOOP) =================
    window.addEventListener("resize", () => {

        if (isProgrammaticResize) return;

        isProgrammaticResize = true;

        if (window.innerWidth <= 768) {
            sidebar.classList.remove("collapsed");
            mainContent.classList.remove("sidebar-collapsed");
            sidebar.classList.remove("mobile-open");
        } else {
            const stored = localStorage.getItem("hrms_sidebar_collapsed") === "true";
            setSidebarCollapsed(stored, true);
        }

        setTimeout(() => {
            isProgrammaticResize = false;
        }, 100);
    });

})();
