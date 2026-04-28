
    // ==================== IMPROVED ATTENDANCE MODULE ====================
    const STORAGE_RECORDS = "hrms_attendance_records_enhanced";
    const STORAGE_TODAY_SESSION = "hrms_attendance_today_session_v2";
    let currentSession = null;
    let timerInterval = null;

    // Helper Functions
    function getTodayStr() { return new Date().toISOString().split('T')[0]; }
    function formatTimeFromDate(dateObj) { if(!dateObj) return "--:--"; return new Date(dateObj).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }); }
    function formatFullTime(dateObj) { if(!dateObj) return "--:--"; return new Date(dateObj).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' }); }
    
    function calcHoursDiff(checkInISO, checkOutISO) { 
        if(!checkInISO || !checkOutISO) return 0; 
        const diffMs = new Date(checkOutISO) - new Date(checkInISO);
        return Math.max(0, diffMs / (1000 * 3600));
    }
    
    function getStatusFromHours(hours, checkInTimeISO = null) { 
        if(hours === 0) return "Absent"; 
        if(hours >= 7) return "Present"; 
        if(hours >= 3.5) return "Half Day"; 
        return "Late"; 
    }
    
    function getOvertimeHours(hours) { return hours > 8 ? (hours - 8).toFixed(1) : 0; }

    function loadRecords() { 
        const stored = localStorage.getItem(STORAGE_RECORDS); 
        const records = stored ? JSON.parse(stored) : [];
        // Sort by date descending
        return records.sort((a,b) => new Date(b.date) - new Date(a.date));
    }
    
    function saveRecords(records) { localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records)); }

    function finalizeAndStoreRecord(session) {
        if(!session || !session.checkInTimeISO) return false;
        const records = loadRecords();
        const existingIndex = records.findIndex(r => r.date === session.date);
        const hours = session.checkOutTimeISO ? calcHoursDiff(session.checkInTimeISO, session.checkOutTimeISO) : 0;
        const status = session.checkOutTimeISO ? getStatusFromHours(hours, session.checkInTimeISO) : "Absent";
        const overtime = getOvertimeHours(hours);
        const record = { 
            date: session.date, 
            checkIn: session.checkInTimeISO, 
            checkOut: session.checkOutTimeISO || null, 
            hours: parseFloat(hours.toFixed(2)),
            status: status,
            overtime: overtime
        };
        if(existingIndex !== -1) records[existingIndex] = record;
        else records.push(record);
        saveRecords(records);
        return true;
    }

    function checkInAction() {
        const today = getTodayStr();
        const records = loadRecords();
        const todayRecord = records.find(r => r.date === today);
        
        // Prevent multiple check-ins
        if(todayRecord && todayRecord.checkOut) { 
            showToast("Already checked out today! Cannot check in again.", "error"); 
            return; 
        }
        if(todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
            showToast("You have an open session from earlier! Please check out first.", "error");
            return;
        }
        if(currentSession && currentSession.checkInTimeISO && !currentSession.checkOutTimeISO) { 
            showToast("Already checked in! Please check out first.", "error"); 
            return; 
        }
        
        const nowISO = new Date().toISOString();
        currentSession = { date: today, checkInTimeISO: nowISO, checkOutTimeISO: null };
        localStorage.setItem(STORAGE_TODAY_SESSION, JSON.stringify(currentSession));
        
        // Remove any incomplete pending record
        const idx = records.findIndex(r => r.date === today && !r.checkOut);
        if(idx !== -1) records.splice(idx,1);
        saveRecords(records);
        
        showToast(`Check-in successful at ${formatFullTime(nowISO)}!`, "success");
        refreshUI();
    }

    function checkOutAction() {
        if(!currentSession || !currentSession.checkInTimeISO || currentSession.checkOutTimeISO) { 
            showToast("No active check-in session.", "error"); 
            return; 
        }
        
        const nowISO = new Date().toISOString();
        const checkInTime = new Date(currentSession.checkInTimeISO);
        const checkOutTime = new Date(nowISO);
        const hoursWorked = (checkOutTime - checkInTime) / (1000 * 3600);
        
        if(hoursWorked < 0.0167) { // Less than 1 minute
            showToast("Check-out too soon! Minimum working time required.", "error");
            return;
        }
        
        currentSession.checkOutTimeISO = nowISO;
        finalizeAndStoreRecord(currentSession);
        localStorage.removeItem(STORAGE_TODAY_SESSION);
        
        const hoursDisplay = hoursWorked.toFixed(1);
        showToast(`Check-out successful! Total hours: ${hoursDisplay} hrs`, "success");
        currentSession = null;
        refreshUI();
    }

    function loadTodaySession() {
        const raw = localStorage.getItem(STORAGE_TODAY_SESSION);
        if(raw) {
            try {
                const sess = JSON.parse(raw);
                if(sess.date === getTodayStr() && !sess.checkOutTimeISO) {
                    currentSession = sess;
                } else if(sess.date === getTodayStr() && sess.checkOutTimeISO) {
                    // Session has checkout but not stored? store it
                    finalizeAndStoreRecord(sess);
                    localStorage.removeItem(STORAGE_TODAY_SESSION);
                    currentSession = null;
                } else {
                    localStorage.removeItem(STORAGE_TODAY_SESSION);
                }
            } catch(e) { currentSession = null; }
        }
        
        // Verify consistency with stored records
        const records = loadRecords();
        const todayRecord = records.find(r => r.date === getTodayStr());
        if(todayRecord && todayRecord.checkOut && currentSession) {
            currentSession = null;
            localStorage.removeItem(STORAGE_TODAY_SESSION);
        }
        refreshUI();
    }

    function updateLiveTimer() {
        if(currentSession && currentSession.checkInTimeISO && !currentSession.checkOutTimeISO) {
            const diffSec = Math.floor((new Date() - new Date(currentSession.checkInTimeISO)) / 1000);
            const hrs = Math.floor(diffSec/3600), mins = Math.floor((diffSec%3600)/60), secs = diffSec%60;
            const timerEl = document.getElementById('liveTimer');
            if(timerEl) { 
                timerEl.style.display = "inline-flex"; 
                timerEl.innerText = `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`; 
            }
        } else { 
            const timerEl = document.getElementById('liveTimer'); 
            if(timerEl) timerEl.style.display = "none"; 
        }
    }

    function refreshUI() {
        const today = getTodayStr();
        const records = loadRecords();
        const todayRecord = records.find(r => r.date === today);
        const isCheckedIn = currentSession && currentSession.checkInTimeISO && !currentSession.checkOutTimeISO;
        const isCheckedOut = (todayRecord && todayRecord.checkOut);
        
        let sessionStatus = "Not Checked In";
        let statusBadgeClass = "badge-secondary";
        if(isCheckedIn) { sessionStatus = "Checked In"; statusBadgeClass = "badge-warning"; }
        else if(isCheckedOut) { sessionStatus = "Checked Out"; statusBadgeClass = "badge-success"; }
        
        const sessionBadge = document.getElementById('sessionBadge');
        sessionBadge.innerText = sessionStatus;
        sessionBadge.className = `badge ${statusBadgeClass}`;
        document.getElementById('todayStatusText').innerText = sessionStatus;
        
        let checkInTimeVal = "--:--", checkOutTimeVal = "--:--", workedHours = 0;
        if(currentSession && currentSession.checkInTimeISO) {
            checkInTimeVal = formatTimeFromDate(currentSession.checkInTimeISO);
            if(currentSession.checkOutTimeISO) checkOutTimeVal = formatTimeFromDate(currentSession.checkOutTimeISO);
        } else if(todayRecord) {
            checkInTimeVal = formatTimeFromDate(todayRecord.checkIn);
            checkOutTimeVal = todayRecord.checkOut ? formatTimeFromDate(todayRecord.checkOut) : "--:--";
            workedHours = todayRecord.hours || 0;
        }
        
        if(currentSession && !currentSession.checkOutTimeISO && currentSession.checkInTimeISO) {
            workedHours = calcHoursDiff(currentSession.checkInTimeISO, new Date().toISOString());
        }
        
        document.getElementById('checkInTimeDisplay').innerText = checkInTimeVal;
        document.getElementById('checkOutTimeDisplay').innerText = checkOutTimeVal;
        document.getElementById('todayHoursDisplay').innerHTML = workedHours.toFixed(1) + " hrs";
        
        const canCheckIn = (!currentSession || currentSession.checkOutTimeISO) && !(todayRecord && todayRecord.checkOut) && !(todayRecord && todayRecord.checkIn && !todayRecord.checkOut);
        const canCheckOut = (currentSession && currentSession.checkInTimeISO && !currentSession.checkOutTimeISO);
        
        document.getElementById('checkInBtn').disabled = !canCheckIn;
        document.getElementById('checkOutBtn').disabled = !canCheckOut;
        
        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => { updateLiveTimer(); }, 1000);
        updateRunningSub(workedHours, isCheckedIn);
        renderTable(records);
    }

    function updateRunningSub(workedHours, isCheckedIn) {
        const sub = document.getElementById('runningTimerSub');
        if(isCheckedIn) sub.innerHTML = `<i class="fas fa-hourglass-half"></i> Live tracking...`;
        else sub.innerHTML = ` Total recorded today`;
    }

    function renderTable(records) {
        let fromDate = document.getElementById('filterDateFrom').value;
        let toDate = document.getElementById('filterDateTo').value;
        let statusFilter = document.getElementById('filterStatus').value;
        let filtered = [...records];
        
        if(fromDate) filtered = filtered.filter(r => r.date >= fromDate);
        if(toDate) filtered = filtered.filter(r => r.date <= toDate);
        if(statusFilter !== 'all') filtered = filtered.filter(r => r.status === statusFilter);
        
        const tbody = document.getElementById('attendanceTableBody');
        if(filtered.length === 0) { 
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No attendance records found</td></tr>'; 
            return; 
        }
        tbody.innerHTML = filtered.map(rec => `
            <tr>
                <td>${rec.date}</td>
                <td><strong>${rec.checkIn ? formatTimeFromDate(rec.checkIn) : "--:--"}</strong></td>
                <td>${rec.checkOut ? formatTimeFromDate(rec.checkOut) : "--:--"}</td>
                <td>${rec.hours ? rec.hours.toFixed(1) : "0.0"} hrs</td>
                <td><span class="status-badge-table" style="background:${getStatusColor(rec.status)}20; color:${getStatusColor(rec.status)}">${rec.status}</span></td>
            </tr>
        `).join('');
    }

    function getStatusColor(status) { 
        if(status==="Present") return "#6faf2e"; 
        if(status==="Absent") return "#e56c6c"; 
        if(status==="Late") return "#f59e0b"; 
        if(status==="Half Day") return "#8b5cf6"; 
        return "#64748b"; 
    }
    
    function resetFilters() { 
        document.getElementById('filterDateFrom').value = ''; 
        document.getElementById('filterDateTo').value = ''; 
        document.getElementById('filterStatus').value = 'all'; 
        renderTable(loadRecords()); 
    }
    
    function showToast(msg, type) { 
        Toastify({ 
            text: type === 'success' ? `✓ ${msg}` : `✕ ${msg}`, 
            duration: 3000, 
            gravity: "bottom", 
            position: "right", 
            backgroundColor: type === 'success' ? "#6faf2e" : "#e56c6c", 
            stopOnFocus: true,
            style: { borderRadius: "10px", padding: "12px 16px", fontSize: "14px", fontWeight: "500" }
        }).showToast(); 
    }

    // Event Listeners
    document.getElementById('checkInBtn').addEventListener('click', checkInAction);
    document.getElementById('checkOutBtn').addEventListener('click', checkOutAction);
    document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
    document.getElementById('filterDateFrom').addEventListener('change', () => renderTable(loadRecords()));
    document.getElementById('filterDateTo').addEventListener('change', () => renderTable(loadRecords()));
    document.getElementById('filterStatus').addEventListener('change', () => renderTable(loadRecords()));

    // Sidebar Interactions
    const sidebar = document.getElementById('sidebar');
    document.getElementById('collapseSidebarBtn').addEventListener('click', () => { 
        sidebar.classList.toggle('collapsed'); 
        document.getElementById('mainContent').classList.toggle('sidebar-collapsed'); 
    });
    document.getElementById('mobileToggleBtn').addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
    
    const profileBtn = document.getElementById('profileDropdownBtn'), profileDropdown = document.getElementById('profileDropdown');
    if(profileBtn && profileDropdown) { 
        profileBtn.addEventListener('click', (e) => { e.stopPropagation(); profileDropdown.classList.toggle('active'); }); 
        document.addEventListener('click', (e) => { if(!profileBtn.contains(e.target)) profileDropdown.classList.remove('active'); }); 
    }
    
    document.getElementById('logoutBtn')?.addEventListener('click', () => { if(confirm("Logout?")) showToast("Logged out", "success"); });
    
    // Initial Load
    loadTodaySession();
    window.addEventListener('beforeunload', () => { if(timerInterval) clearInterval(timerInterval); });
