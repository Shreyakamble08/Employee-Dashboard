
        // ==================== POLICY DATA ====================
        const policiesData = {
            "HR Policies": [
                { id: "hr1", title: "Code of Conduct", description: "Standards of professional behavior and ethics.", lastUpdated: "2024-01-15", acknowledged: false, content: "<h3>Purpose</h3><p>This Code of Conduct outlines the ethical and professional standards expected of all employees.</p><h3>Key Principles</h3><ul><li>Integrity and honesty in all dealings</li><li>Respect for colleagues and stakeholders</li><li>Compliance with laws and regulations</li><li>Confidentiality of company information</li></ul><h3>Reporting Violations</h3><p>Any violations should be reported to HR immediately.</p>" },
                { id: "hr2", title: "Anti-Harassment Policy", description: "Workplace harassment prevention and reporting.", lastUpdated: "2024-02-10", acknowledged: false, content: "<h3>Zero Tolerance Policy</h3><p>Our company maintains a zero-tolerance approach to harassment.</p><h3>Definitions</h3><ul><li>Sexual harassment</li><li>Bullying and intimidation</li><li>Discrimination based on protected characteristics</li></ul><h3>Reporting Process</h3><p>Employees can report anonymously through the HR hotline.</p>" },
                { id: "hr3", title: "Recruitment Policy", description: "Guidelines for hiring and selection.", lastUpdated: "2023-11-05", acknowledged: false, content: "<h3>Recruitment Principles</h3><ul><li>Merit-based selection</li><li>Diversity and inclusion focus</li><li>Transparent interview process</li></ul>" }
            ],
            "Leave Policies": [
                { id: "leave1", title: "Annual Leave Policy", description: "Vacation and paid time off guidelines.", lastUpdated: "2024-03-01", acknowledged: false, content: "<h3>Annual Leave Entitlement</h3><ul><li>0-2 years: 15 days</li><li>3-5 years: 20 days</li><li>5+ years: 25 days</li></ul><h3>Carry Forward</h3><p>Maximum 5 days can be carried forward to next year.</p>" },
                { id: "leave2", title: "Sick Leave Policy", description: "Medical leave and documentation rules.", lastUpdated: "2024-01-20", acknowledged: false, content: "<h3>Sick Leave Entitlement</h3><p>12 days per financial year.</p><h3>Documentation</h3><p>Medical certificate required for leaves exceeding 3 consecutive days.</p>" },
                { id: "leave3", title: "Parental Leave", description: "Maternity, paternity, and adoption leave.", lastUpdated: "2023-12-10", acknowledged: false, content: "<h3>Maternity Leave</h3><p>26 weeks paid leave.</p><h3>Paternity Leave</h3><p>15 days paid leave.</p><h3>Adoption Leave</h3><p>12 weeks for primary caregiver.</p>" }
            ],
            "Attendance Policies": [
                { id: "att1", title: "Work Hours Policy", description: "Standard working hours and breaks.", lastUpdated: "2024-02-15", acknowledged: false, content: "<h3>Working Hours</h3><p>Monday to Friday, 9:00 AM to 6:00 PM.</p><h3>Break Policy</h3><ul><li>1 hour lunch break</li><li>Two 15-minute tea breaks</li></ul>" },
                { id: "att2", title: "Remote Work Policy", description: "WFH guidelines and expectations.", lastUpdated: "2024-01-25", acknowledged: false, content: "<h3>Eligibility</h3><p>Employees with 6+ months tenure can request remote work up to 2 days/week.</p><h3>Expectations</h3><ul><li>Available during core hours (10AM-4PM)</li><li>Reliable internet connection</li></ul>" },
                { id: "att3", title: "Overtime Policy", description: "Compensation for extra working hours.", lastUpdated: "2023-10-30", acknowledged: false, content: "<h3>Overtime Compensation</h3><p>Overtime paid at 1.5x hourly rate for hours beyond 45/week.</p><h3>Approval Required</h3><p>All overtime must be pre-approved by manager.</p>" }
            ],
            "Code of Conduct": [
                { id: "code1", title: "Professional Ethics", description: "Ethical guidelines for employees.", lastUpdated: "2024-02-01", acknowledged: false, content: "<h3>Core Values</h3><ul><li>Integrity</li><li>Accountability</li><li>Respect</li><li>Excellence</li></ul>" },
                { id: "code2", title: "Conflict of Interest", description: "Managing personal and professional boundaries.", lastUpdated: "2024-01-10", acknowledged: false, content: "<h3>Definition</h3><p>A conflict arises when personal interests interfere with company duties.</p><h3>Disclosure</h3><p>All potential conflicts must be disclosed to HR.</p>" }
            ],
            "IT / Security Policies": [
                { id: "it1", title: "Data Protection Policy", description: "Handling sensitive company data.", lastUpdated: "2024-03-10", acknowledged: false, content: "<h3>Data Classification</h3><ul><li>Public</li><li>Internal</li><li>Confidential</li><li>Restricted</li></ul><h3>Handling Guidelines</h3><p>Confidential data must be encrypted.</p>" },
                { id: "it2", title: "Password Security", description: "Password creation and management rules.", lastUpdated: "2024-01-05", acknowledged: false, content: "<h3>Password Requirements</h3><ul><li>Minimum 12 characters</li><li>Mix of uppercase, lowercase, numbers, symbols</li><li>Change every 90 days</li></ul>" },
                { id: "it3", title: "Bring Your Own Device", description: "Personal device usage policy.", lastUpdated: "2023-12-15", acknowledged: false, content: "<h3>BYOD Guidelines</h3><p>Employees may use personal devices with installed security software.</p><h3>Company Rights</h3><p>Company can remotely wipe devices if lost or stolen.</p>" }
            ]
        };

        let currentTab = "HR Policies";
        let currentView = "list";
        let selectedPolicy = null;
        let acknowledgedPolicies = JSON.parse(localStorage.getItem("acknowledgedPolicies") || "{}");

        // Helper
        function showToast(msg, type) {
            Toastify({ text: type === 'success' ? `✓ ${msg}` : `✕ ${msg}`, duration: 3000, gravity: "bottom", position: "right", backgroundColor: type === 'success' ? "#6faf2e" : "#e56c6c", stopOnFocus: true, style: { borderRadius: "10px", padding: "12px 16px", fontSize: "14px" } }).showToast();
        }

        function getFilteredPolicies(tab, searchTerm) {
            let policies = policiesData[tab] || [];
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                policies = policies.filter(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
            }
            return policies;
        }

        function renderTabs() {
            const tabsContainer = document.getElementById('tabsContainer');
            const tabs = Object.keys(policiesData);
            tabsContainer.innerHTML = tabs.map(tab => `<button class="tab-btn ${currentTab === tab ? 'active' : ''}" data-tab="${tab}">${tab}</button>`).join('');
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentTab = btn.dataset.tab;
                    currentView = "list";
                    selectedPolicy = null;
                    renderTabs();
                    renderContent();
                });
            });
        }

        function renderContent() {
            const contentArea = document.getElementById('contentArea');
            const searchTerm = document.getElementById('searchInput')?.value || '';

            if (currentView === "list") {
                const policies = getFilteredPolicies(currentTab, searchTerm);
                if (policies.length === 0) {
                    contentArea.innerHTML = `<div class="empty-state"><i class="fas fa-file-alt"></i><p>No policies found matching your search.</p></div>`;
                    return;
                }
                contentArea.innerHTML = `<div class="policy-grid">${policies.map(p => `
                <div class="policy-card" data-id="${p.id}">
                    <div class="policy-card-header">
                        <h3>${p.title}</h3>
                        ${acknowledgedPolicies[p.id] ? '<span class="ack-badge"><i class="fas fa-check-circle"></i> Acknowledged</span>' : '<span class="policy-badge">Pending</span>'}
                    </div>
                    <div class="policy-desc">${p.description}</div>
                    <div class="policy-meta">
                        <span><i class="far fa-calendar-alt"></i> Updated: ${p.lastUpdated}</span>
                        <span style="color: var(--primary);">Click to view →</span>
                    </div>
                </div>
            `).join('')}</div>`;

                document.querySelectorAll('.policy-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const id = card.dataset.id;
                        selectedPolicy = getFilteredPolicies(currentTab, '').find(p => p.id === id);
                        currentView = "detail";
                        renderContent();
                    });
                });
            } else if (currentView === "detail" && selectedPolicy) {
                const isAcknowledged = acknowledgedPolicies[selectedPolicy.id] || false;
                contentArea.innerHTML = `
                <button class="btn-back" id="backToListBtn"><i class="fas fa-arrow-left"></i> Back to Policies</button>
                <div class="policy-detail-view">
                    <div class="detail-header">
                        <div class="detail-title">
                            <h2>${selectedPolicy.title}</h2>
                            <span class="policy-badge" style="margin-top: 8px; display: inline-block;">${currentTab}</span>
                        </div>
                        <div class="detail-actions">
                            <button class="btn-download" id="downloadPolicyBtn"><i class="fas fa-download"></i> Download (PDF)</button>
                            <button class="btn-acknowledge" id="acknowledgeBtn" ${isAcknowledged ? 'disabled' : ''}>${isAcknowledged ? '<i class="fas fa-check-circle"></i> Acknowledged' : '<i class="fas fa-check"></i> Acknowledge & Agree'}</button>
                        </div>
                    </div>
                    <div class="detail-content">${selectedPolicy.content}</div>
                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-muted);">
                        <i class="far fa-calendar-alt"></i> Last updated: ${selectedPolicy.lastUpdated}
                    </div>
                </div>
            `;
                document.getElementById('backToListBtn')?.addEventListener('click', () => {
                    currentView = "list";
                    selectedPolicy = null;
                    renderContent();
                });
                document.getElementById('downloadPolicyBtn')?.addEventListener('click', () => {
                    const content = `${selectedPolicy.title}\n\n${selectedPolicy.description}\n\n${selectedPolicy.content.replace(/<[^>]*>/g, '')}\n\nLast Updated: ${selectedPolicy.lastUpdated}`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedPolicy.title.replace(/\s/g, '_')}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast("Policy downloaded", "success");
                });
                document.getElementById('acknowledgeBtn')?.addEventListener('click', () => {
                    if (!acknowledgedPolicies[selectedPolicy.id]) {
                        acknowledgedPolicies[selectedPolicy.id] = { policyId: selectedPolicy.id, title: selectedPolicy.title, acknowledgedAt: new Date().toISOString() };
                        localStorage.setItem("acknowledgedPolicies", JSON.stringify(acknowledgedPolicies));
                        showToast(`You have acknowledged "${selectedPolicy.title}"`, "success");
                        renderContent();
                    }
                });
            }
        }

        // Search handler
        document.getElementById('searchInput')?.addEventListener('input', () => {
            if (currentView === "list") renderContent();
        });

        // Sidebar & UI
        const sidebar = document.getElementById('sidebar');
        document.getElementById('collapseSidebarBtn')?.addEventListener('click', () => { sidebar.classList.toggle('collapsed'); document.getElementById('mainContent').classList.toggle('sidebar-collapsed'); });
        document.getElementById('mobileToggleBtn')?.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
        const profileBtn = document.getElementById('profileDropdownBtn'), profileDropdown = document.getElementById('profileDropdown');
        if (profileBtn && profileDropdown) {
            profileBtn.addEventListener('click', (e) => { e.stopPropagation(); profileDropdown.classList.toggle('active'); });
            document.addEventListener('click', (e) => { if (!profileBtn.contains(e.target)) profileDropdown.classList.remove('active'); });
        }
        document.getElementById('logoutBtn')?.addEventListener('click', () => { if (confirm("Logout?")) showToast("Logged out", "success"); });

        renderTabs();
        renderContent();
  