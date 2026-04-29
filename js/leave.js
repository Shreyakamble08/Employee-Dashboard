// ---------- DATA ----------
let myLeaves = [
  {
    id: 1,
    leaveType: "Casual Leave",
    fromDate: "2025-03-10",
    toDate: "2025-03-12",
    numberOfDays: 3,
    reason: "Family function",
    status: "approved",
    addedOn: "2025-03-01",
    actionBy: "HR Admin",
  },
  {
    id: 2,
    leaveType: "Sick Leave",
    fromDate: "2025-02-05",
    toDate: "2025-02-05",
    numberOfDays: 1,
    reason: "Fever",
    status: "approved",
    addedOn: "2025-02-04",
    actionBy: "HR",
  },
  {
    id: 3,
    leaveType: "Casual Leave",
    fromDate: "2025-04-15",
    toDate: "2025-04-17",
    numberOfDays: 3,
    reason: "Personal work",
    status: "pending",
    addedOn: "2025-04-10",
  },
];
const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Bereavement Leave",
];
let balanceData = {
  totalAllotted: 18,
  totalUsed: 4,
  totalRemaining: 14,
  balances: {
    "Casual Leave": { allot: 12, used: 3, remaining: 9 },
    "Sick Leave": { allot: 6, used: 1, remaining: 5 },
    "Earned Leave": { allot: 0, used: 0, remaining: 0 },
    "Bereavement Leave": { allot: 0, used: 0, remaining: 0 },
  },
};
let calYear = new Date().getFullYear(),
  calMonth = new Date().getMonth();
let donutChart = null;

function showToast(msg, type) {
  Toastify({
    text: msg,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    backgroundColor: type === "success" ? "#6faf2e" : "#e56c6c",
  }).showToast();
}
function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}
function openModal(id) {
  document.getElementById(id).classList.add("active");
}

// ---------- TAB SWITCH (KEEP ONLY THIS) ----------
function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.remove("active");
  });

  document.querySelectorAll(".tab-content").forEach((c) => {
    c.classList.remove("active");
  });

  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  const tab = document.getElementById(`tab-${tabId}`);

  if (btn) btn.classList.add("active");
  if (tab) tab.classList.add("active");

  if (tabId === "calendar") renderCalendar();
}

// ---------- TAB CLICK EVENTS (FIXED) ----------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    switchTab(btn.dataset.tab);
  });
});

// ---------- MODAL OPEN / CLOSE ----------
function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// ---------- APPLY MODAL OPEN ----------
function openApplyModalFunc() {
  const select = document.getElementById("modalLeaveType");

  select.innerHTML = leaveTypes
    .map((lt) => `<option value="${lt}">${lt}</option>`)
    .join("");

  document.getElementById("modalFrom").value = "";
  document.getElementById("modalTo").value = "";
  document.getElementById("modalDays").value = "";
  document.getElementById("modalReason").value = "";

  document.getElementById("balanceWarning").style.display = "none";

  openModal("applyModal");
}

// ---------- OUTSIDE CLICK CLOSE MODAL ----------
document.getElementById("applyModal").addEventListener("click", (e) => {
  if (e.target.id === "applyModal") {
    closeModal("applyModal");
  }
});

// ---------- SUBMIT LEAVE ----------
let isSubmitting = false;

function submitLeaveRequest() {
  if (isSubmitting) return;
  isSubmitting = true;

  const lt = document.getElementById("modalLeaveType").value;
  const from = document.getElementById("modalFrom").value;
  const to = document.getElementById("modalTo").value;
  const days = parseInt(document.getElementById("modalDays").value);
  const reason = document.getElementById("modalReason").value;

  if (!lt || !from || !to || !days || !reason) {
    showToast("Fill all required fields", "error");
    isSubmitting = false;
    return;
  }

  const newLeave = {
    id: Date.now(),
    leaveType: lt,
    fromDate: from,
    toDate: to,
    numberOfDays: days,
    reason,
    status: "pending",
    addedOn: new Date().toISOString().split("T")[0],
  };

  myLeaves.unshift(newLeave);

  recalcBalances();
  closeModal("applyModal");

  showToast("Leave request submitted!", "success");

  isSubmitting = false;
}

function recalcBalances() {
  let usedMap = {
    "Casual Leave": 0,
    "Sick Leave": 0,
    "Earned Leave": 0,
    "Bereavement Leave": 0,
  };
  myLeaves.forEach((l) => {
    if (l.status === "approved")
      usedMap[l.leaveType] = (usedMap[l.leaveType] || 0) + l.numberOfDays;
  });
  let totalUsed = 0;
  for (let t in balanceData.balances) {
    let used = usedMap[t] || 0;
    balanceData.balances[t].used = used;
    balanceData.balances[t].remaining = Math.max(
      0,
      balanceData.balances[t].allot - used,
    );
    totalUsed += used;
  }
  balanceData.totalUsed = totalUsed;
  balanceData.totalRemaining = balanceData.totalAllotted - totalUsed;
  updateStatsUI();
}

function updateStatsUI() {
  document.getElementById("statTotal").innerText = balanceData.totalAllotted;
  document.getElementById("statUsed").innerText = balanceData.totalUsed;
  document.getElementById("statRemaining").innerText =
    balanceData.totalRemaining;
  const pendingCount = myLeaves.filter((l) => l.status === "pending").length;
  document.getElementById("statPending").innerText = pendingCount;
  document.getElementById("pendingBadge").innerText = pendingCount;
  renderQuickCards();
  renderRecent();
  renderApplicationsTable();
  renderBalanceDetails();
  renderCalendar();
  updateDonut();
}

function renderQuickCards() {
  const container = document.getElementById("quickBalanceCards");

  container.innerHTML = leaveTypes
    .map((lt) => {
      let b = balanceData.balances[lt];
      let pct = b.allot ? (b.used / b.allot) * 100 : 0;

      return `
        <div class="balance-card">
          
          <div class="balance-top">
            <span class="balance-title">${lt}</span>
            <span class="balance-count">${b.remaining}</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>

          <div class="balance-bottom">
            <span>${b.used} used</span>
            <span>${b.allot} total</span>
          </div>

        </div>
      `;
    })
    .join("");
}
function renderRecent() {
  const recent = [...myLeaves]
    .sort((a, b) => b.addedOn.localeCompare(a.addedOn))
    .slice(0, 3);
  const wrap = document.getElementById("recentList");
  if (!recent.length) {
    wrap.innerHTML = '<div class="p-4 text-center">No recent leaves</div>';
    return;
  }
  wrap.innerHTML = recent
    .map(
      (r) =>
        `<div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #eef2f6;"><div><strong>${r.leaveType}</strong><br><span style="font-size:12px;">${r.fromDate} · ${r.numberOfDays} day(s)</span></div><span class="status-pill status-${r.status}">${r.status}</span></div>`,
    )
    .join("");
}

function renderApplicationsTable() {
  const status = document.getElementById("filterStatusApp").value;
  const type = document.getElementById("filterTypeApp").value;
  let filtered = myLeaves.filter(
    (l) =>
      (status === "all" || l.status === status) &&
      (type === "all" || l.leaveType === type),
  );
  const tbody = document.getElementById("appTableBody");
  const emptyDiv = document.getElementById("appEmptyMsg");
  if (!filtered.length) {
    tbody.innerHTML = "";
    emptyDiv.style.display = "block";
    return;
  }
  emptyDiv.style.display = "none";
  tbody.innerHTML = filtered
    .map(
      (l) =>
        `<tr><td>${l.leaveType}</td><td>${l.fromDate}</td><td>${l.toDate || l.fromDate}</td><td>${l.numberOfDays}</td><td>${l.reason || "-"}</td><td>${l.addedOn}</td><td><span class="status-pill status-${l.status}">${l.status}</span></td><td>${l.status === "pending" ? `<button class="cancel-leave-btn" data-id="${l.id}" style="background:#fee2e2; border:none; padding:4px 12px; border-radius:20px; color:#dc2626; cursor:pointer;">Cancel</button>` : "—"}</td></tr>`,
    )
    .join("");
  document.querySelectorAll(".cancel-leave-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      let id = parseInt(btn.dataset.id);
      cancelLeave(id);
    }),
  );
}

function cancelLeave(id) {
  const idx = myLeaves.findIndex((l) => l.id === id);
  if (idx !== -1 && myLeaves[idx].status === "pending") {
    myLeaves[idx].status = "cancelled";
    recalcBalances();
    renderApplicationsTable();
    showToast("Leave cancelled", "success");
  } else showToast("Cannot cancel", "error");
}

function renderBalanceDetails() {
  const container = document.getElementById("balanceCardsGrid");

  container.innerHTML = leaveTypes
    .map((lt) => {
      let b = balanceData.balances[lt];

      return `
        <div class="balance-mini-card">
          
          <div class="balance-top">
            <span class="balance-type">${lt}</span>
            <span class="balance-remaining">${b.remaining}</span>
          </div>

          <div class="balance-bottom">
            <span>Allotted: <strong>${b.allot}</strong></span>
            <span>Used: <strong>${b.used}</strong></span>
          </div>

        </div>
      `;
    })
    .join("");

  const approved = myLeaves.filter((l) => l.status === "approved");
  const histDiv = document.getElementById("approvedHistoryList");

  if (!approved.length) {
    histDiv.innerHTML = '<div class="empty-state">No approved leaves</div>';
  } else {
    histDiv.innerHTML = `
      <table class="attendance-table compact">
        <thead>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>Days</th>
            <th>Approved By</th>
          </tr>
        </thead>
        <tbody>
          ${approved
            .map(
              (l) => `
                <tr>
                  <td>${l.leaveType}</td>
                  <td>${l.fromDate}</td>
                  <td>${l.numberOfDays}</td>
                  <td>${l.actionBy || "HR"}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }
}

function renderCalendar() {
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const calTitle = document.getElementById("calTitle");
    if (calTitle) calTitle.innerText = `${months[calMonth]} ${calYear}`;
    
    const firstDayOfMonth = new Date(calYear, calMonth, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    
    const leaveMap = {};
    myLeaves.forEach(leave => {
        if (!leave.fromDate || !leave.status) return;
        const startDate = new Date(leave.fromDate);
        const endDate = leave.toDate ? new Date(leave.toDate) : new Date(leave.fromDate);
        
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const day = currentDate.getDate();
            
            if (year === calYear && month === calMonth) {
                if (!leaveMap[day]) {
                    leaveMap[day] = {
                        status: leave.status,
                        type: leave.leaveType,
                        reason: leave.reason || 'No reason provided'
                    };
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });
    
    let html = '';
    
    // Weekday headers
    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    weekdays.forEach(day => {
        html += `<div class="cal-day-header">${day}</div>`;
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        html += `<div class="cal-day-cell cal-empty"></div>`;
    }
    
    // Days of month
    const today = new Date();
    const isCurrentMonth = (today.getFullYear() === calYear && today.getMonth() === calMonth);
    const currentDay = today.getDate();
    
    for (let d = 1; d <= daysInMonth; d++) {
        const leaveInfo = leaveMap[d];
        const dayIndex = (startDay + d - 1) % 7;
        const isWeekend = (dayIndex === 0 || dayIndex === 6);
        const isToday = (isCurrentMonth && d === currentDay);
        
        let statusClass = "";
        let statusText = "";
        let tooltipText = "";
        
        if (leaveInfo) {
            switch (leaveInfo.status) {
                case "approved":
                    statusClass = "cal-approved";
                    statusText = "Approved";
                    break;
                case "pending":
                    statusClass = "cal-pending";
                    statusText = "Pending";
                    break;
                case "rejected":
                    statusClass = "cal-rejected";
                    statusText = "Rejected";
                    break;
            }
            tooltipText = `${leaveInfo.type} - ${statusText}`;
        } else if (isWeekend) {
            statusClass = "cal-weekend";
        }
        
        const todayClass = isToday ? "cal-today" : "";
        
        html += `
            <div class="cal-day-cell ${statusClass} ${todayClass}" 
                 ${tooltipText ? `data-tooltip="${tooltipText.replace(/"/g, '&quot;')}"` : ''}>
                <span class="day-number">${d}</span>
                ${statusText ? `<span class="status-badge-mini">${statusText}</span>` : ''}
            </div>
        `;
    }
    
    // Fill remaining cells
    const totalCells = startDay + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
        html += `<div class="cal-day-cell cal-empty"></div>`;
    }
    
    const calendarGrid = document.getElementById("calendarGrid");
    if (calendarGrid) {
        calendarGrid.innerHTML = html;
    }
}
// Function to update legend
function updateCalendarLegend() {
    let legendDiv = document.querySelector('.calendar-legend');
    if (!legendDiv && document.getElementById("tab-calendar")) {
        legendDiv = document.createElement('div');
        legendDiv.className = 'calendar-legend';
        legendDiv.innerHTML = `
            <div class="legend-item"><span class="legend-dot approved"></span><span>Approved</span></div>
            <div class="legend-item"><span class="legend-dot pending"></span><span>Pending</span></div>
            <div class="legend-item"><span class="legend-dot rejected"></span><span>Rejected</span></div>
            <div class="legend-item"><span class="legend-dot weekend"></span><span>Weekend</span></div>
            <div class="legend-item"><span class="legend-dot today"></span><span>Today</span></div>
        `;
        const calendarSection = document.getElementById("tab-calendar");
        const sectionCard = calendarSection?.querySelector('.section-card');
        if (sectionCard) {
            sectionCard.appendChild(legendDiv);
        }
    }
}

// Month navigation with proper boundaries
function changeMonth(delta) {
    calMonth += delta;
    if (calMonth < 0) {
        calMonth = 11;
        calYear--;
    } else if (calMonth > 11) {
        calMonth = 0;
        calYear++;
    }
    renderCalendar();
}

// Go to current month
function goToCurrentMonth() {
    calYear = new Date().getFullYear();
    calMonth = new Date().getMonth();
    renderCalendar();
}

// Initialize calendar with proper event listeners
function initCalendar() {
    renderCalendar();
    
    // Add navigation event listeners if they exist
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');
    
    if (prevBtn) {
        prevBtn.onclick = () => changeMonth(-1);
    }
    if (nextBtn) {
        nextBtn.onclick = () => changeMonth(1);
    }
}



// Call this when your page loads
// initCalendar();
function updateDonut() {
  const ctx = document.getElementById("miniDonutChart").getContext("2d");

  const usedData = leaveTypes.map((lt) => balanceData.balances[lt]?.used || 0);

  if (donutChart) donutChart.destroy();

  donutChart = new Chart(ctx, {
    type: "bar", // ✅ changed

    data: {
      labels: leaveTypes,
      datasets: [
        {
          label: "Leaves Used",
          data: usedData,
          borderRadius: 6,
          barThickness: 10,
          backgroundColor: ["#1f6f7f", "#6faf2e", "#5fafc2", "#f59e0b"],
        },
      ],
    },

    options: {
      indexAxis: "y", // ✅ horizontal
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: { display: false },
      },

      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#94A3B8", font: { size: 10 } },
        },
        y: {
          grid: { display: false },
          ticks: { color: "#334155", font: { size: 11 } },
        },
      },
    },
  });
}
function openApplyModalFunc() {
  document.getElementById("modalLeaveType").innerHTML = leaveTypes
    .map((lt) => `<option value="${lt}">${lt}</option>`)
    .join("");
  document.getElementById("modalFrom").value = "";
  document.getElementById("modalTo").value = "";
  document.getElementById("modalDays").value = "";
  document.getElementById("modalReason").value = "";
  document.getElementById("balanceWarning").style.display = "none";
  openModal("applyModal");
}
function calcDaysAndWarn() {
  const from = document.getElementById("modalFrom").value,
    to = document.getElementById("modalTo").value;
  if (!from || !to) return;
  let days = 0,
    cur = new Date(from),
    end = new Date(to);
  while (cur <= end) {
    if (cur.getDay() !== 0 && cur.getDay() !== 6) days++;
    cur.setDate(cur.getDate() + 1);
  }
  document.getElementById("modalDays").value = days;
  const lt = document.getElementById("modalLeaveType").value,
    bal = balanceData.balances[lt];
  const warnDiv = document.getElementById("balanceWarning");
  if (bal && days > bal.remaining) {
    warnDiv.style.display = "block";
    warnDiv.style.background = "#FEF3C7";
    warnDiv.style.color = "#D97706";
    warnDiv.innerHTML = `⚠️ You have only ${bal.remaining} days left in ${lt}.`;
  } else warnDiv.style.display = "none";
}
function submitLeaveRequest() {
  const lt = document.getElementById("modalLeaveType").value,
    from = document.getElementById("modalFrom").value,
    to = document.getElementById("modalTo").value,
    days = parseInt(document.getElementById("modalDays").value),
    reason = document.getElementById("modalReason").value;
  if (!lt || !from || !to || days < 1 || !reason) {
    showToast("Fill all required fields", "error");
    return;
  }
  const bal = balanceData.balances[lt];
  if (
    bal &&
    days > bal.remaining &&
    !confirm(`Insufficient balance. Submit anyway?`)
  )
    return;
  const newLeave = {
    id: Date.now(),
    leaveType: lt,
    fromDate: from,
    toDate: to,
    numberOfDays: days,
    reason: reason,
    status: "pending",
    addedOn: new Date().toISOString().split("T")[0],
  };
  myLeaves.unshift(newLeave);
  recalcBalances();
  closeModal("applyModal");
  showToast("Leave request submitted!", "success");
  renderApplicationsTable();
  renderCalendar();
}

function switchTab(tabId) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));
  document
    .querySelector(`.tab-btn[data-tab="${tabId}"]`)
    .classList.add("active");
  document.getElementById(`tab-${tabId}`).classList.add("active");
  if (tabId === "calendar") renderCalendar();
}
function exportCSV() {
  let csv = [["Type", "From", "To", "Days", "Reason", "Status", "Applied On"]];
  myLeaves.forEach((l) =>
    csv.push([
      l.leaveType,
      l.fromDate,
      l.toDate || l.fromDate,
      l.numberOfDays,
      l.reason || "",
      l.status,
      l.addedOn,
    ]),
  );
  const blob = new Blob([csv.map((r) => r.join(",")).join("\n")], {
    type: "text/csv",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `leaves_export.csv`;
  a.click();
  showToast("Exported", "success");
}

// Event Listeners & Sidebar
document
  .getElementById("openApplyBtn")
  .addEventListener("click", openApplyModalFunc);
document
  .getElementById("submitLeaveBtn")
  .addEventListener("click", submitLeaveRequest);
document
  .getElementById("closeApplyModalBtn")
  .addEventListener("click", () => closeModal("applyModal"));
document.getElementById("exportLeavesBtn").addEventListener("click", exportCSV);
document.getElementById("prevMonthBtn").addEventListener("click", () => {
  calMonth--;
  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  renderCalendar();
});
document.getElementById("nextMonthBtn").addEventListener("click", () => {
  calMonth++;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }
  renderCalendar();
});
document
  .getElementById("filterStatusApp")
  .addEventListener("change", renderApplicationsTable);
document.getElementById("filterTypeApp").innerHTML =
  `<option value="all">All Types</option>${leaveTypes.map((t) => `<option value="${t}">${t}</option>`).join("")}`;
document
  .getElementById("filterTypeApp")
  .addEventListener("change", renderApplicationsTable);
document
  .getElementById("modalFrom")
  .addEventListener("change", calcDaysAndWarn);
document.getElementById("modalTo").addEventListener("change", calcDaysAndWarn);
document
  .getElementById("modalLeaveType")
  .addEventListener("change", calcDaysAndWarn);
document.querySelectorAll(".tab-btn").forEach((btn) =>
  btn.addEventListener("click", function () {
    switchTab(this.dataset.tab);
  }),
);
// sidebar interactions
document.getElementById("collapseSidebarBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
  document.getElementById("mainContent").classList.toggle("sidebar-collapsed");
});
document
  .getElementById("mobileToggleBtn")
  .addEventListener("click", () =>
    document.getElementById("sidebar").classList.toggle("mobile-open"),
  );
document.getElementById("profileDropdownBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("profileDropdown").classList.toggle("active");
});
document.addEventListener("click", () =>
  document.getElementById("profileDropdown")?.classList.remove("active"),
);
recalcBalances();
