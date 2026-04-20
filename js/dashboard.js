// Dashboard Page Specific JavaScript

class DashboardPage {
    constructor() {
        this.currentUser = MockData.user;
        this.attendance = MockData.attendance;
        this.tasks = MockData.tasks;
        this.activities = MockData.activities;
        this.events = MockData.events;
    }

    init() {
        this.updateUserInfo();
        this.updateGreeting();
        this.updateDateTime();
        this.updateStats();
        this.loadActivities();
        this.loadEvents();
        this.loadPriorityTasks();
        this.setupEventListeners();
        
        // Update datetime every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    updateUserInfo() {
        const userNameElement = document.getElementById('dashboardUserName');
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.name.split(' ')[0];
        }
    }

    updateGreeting() {
        const greetingElement = document.getElementById('greetingMessage');
        if (!greetingElement) return;

        const hour = new Date().getHours();
        let greeting;

        if (hour < 12) {
            greeting = 'Good morning';
        } else if (hour < 18) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }

        greetingElement.textContent = `${greeting}! Here's your dashboard overview for today.`;
    }

    updateDateTime() {
        const dateTimeElement = document.getElementById('currentDateTime');
        if (!dateTimeElement) return;

        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }

    updateStats() {
        // Update attendance rate
        const attendanceRate = document.getElementById('attendanceRate');
        if (attendanceRate) {
            const rate = Math.round((this.attendance.thisMonth.present / this.attendance.thisMonth.totalDays) * 100);
            attendanceRate.textContent = `${rate}%`;
        }

        // Update tasks completed
        const tasksCompleted = document.getElementById('tasksCompleted');
        if (tasksCompleted) {
            tasksCompleted.textContent = this.tasks.completed;
        }

        // Update leave balance
        const leaveBalance = document.getElementById('leaveBalance');
        if (leaveBalance) {
            leaveBalance.textContent = MockData.leave.remaining;
        }

        // Update monthly salary
        const monthlySalary = document.getElementById('monthlySalary');
        if (monthlySalary) {
            monthlySalary.textContent = `$${MockData.payroll.monthlySalary.toLocaleString()}`;
        }
    }

    loadActivities() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const activities = this.activities.slice(0, 5); // Show latest 5 activities
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    ${this.getActivityIcon(activity.type)}
                </div>
                <div class="activity-content">
                    <div class="activity-title">
                        ${activity.action}: ${activity.title}
                    </div>
                    <div class="activity-time">
                        ${this.formatTimeAgo(activity.timestamp)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            task: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M18 10L16 8L14 10L12 8L10 10L8 8L6 10L4 8L2 10L4 12L6 10L8 12L10 10L12 12L14 10L16 12L18 10Z"/></svg>',
            attendance: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8"/></svg>',
            leave: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="4" width="14" height="12" rx="1"/></svg>',
            payroll: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="3"/><line x1="5" y1="5" x2="15" y2="15"/></svg>'
        };
        return icons[type] || icons.task;
    }

    loadEvents() {
        const eventsList = document.getElementById('eventsList');
        if (!eventsList) return;

        const upcomingEvents = this.events
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

        eventsList.innerHTML = upcomingEvents.map(event => {
            const eventDate = new Date(event.date);
            return `
                <div class="event-item">
                    <div class="event-date">
                        <div class="event-day">${eventDate.getDate()}</div>
                        <div class="event-month">${eventDate.toLocaleString('en-US', { month: 'short' })}</div>
                    </div>
                    <div class="event-details">
                        <div class="event-name">${event.name}</div>
                        <div class="event-type">${event.type} ${event.time ? `at ${event.time}` : ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadPriorityTasks() {
        const tasksList = document.getElementById('priorityTasks');
        if (!tasksList) return;

        const priorityTasks = this.tasks.priorityTasks
            .filter(task => task.status !== 'completed')
            .slice(0, 4);

        tasksList.innerHTML = priorityTasks.map(task => `
            <div class="task-item">
                <input type="checkbox" class="task-checkbox" 
                       ${task.status === 'completed' ? 'checked' : ''}
                       onchange="toggleTaskStatus(${task.id}, this.checked)">
                <div class="task-info">
                    <div class="task-name">${task.title}</div>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                        <span>Due: ${this.formatDate(task.dueDate)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    setupEventListeners() {
        // Add task form submission
        const addTaskForm = document.getElementById('addTaskForm');
        addTaskForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewTask();
        });

        // Handle search from header
        window.addEventListener('dashboard-search', (e) => {
            this.handleSearch(e.detail.query);
        });
    }

    addNewTask() {
        const title = document.getElementById('taskTitle').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const description = document.getElementById('taskDescription').value;

        // Add task to mock data
        const newTask = {
            id: this.tasks.priorityTasks.length + 1,
            title: title,
            priority: priority,
            dueDate: dueDate,
            status: 'pending',
            assignee: this.currentUser.name,
            description: description
        };

        this.tasks.priorityTasks.unshift(newTask);
        
        // Refresh tasks list
        this.loadPriorityTasks();
        
        // Close modal
        closeAddTaskModal();
        
        // Show success message
        window.dashboardManager?.showSuccess('Task added successfully!');
        
        // Reset form
        document.getElementById('addTaskForm').reset();
    }

    handleSearch(query) {
        console.log('Searching dashboard for:', query);
        // Implement dashboard-specific search
    }
}

// Global functions for task management
window.toggleTaskStatus = function(taskId, completed) {
    const task = MockData.tasks.priorityTasks.find(t => t.id === taskId);
    if (task) {
        task.status = completed ? 'completed' : 'pending';
        
        // Update stats
        if (completed) {
            MockData.tasks.completed++;
            MockData.tasks.inProgress--;
        } else {
            MockData.tasks.completed--;
            MockData.tasks.inProgress++;
        }
        
        // Refresh dashboard
        dashboardPage.updateStats();
        dashboardPage.loadPriorityTasks();
        
        // Show notification
        window.dashboardManager?.showSuccess(
            completed ? 'Task marked as completed!' : 'Task marked as pending'
        );
    }
};

window.showAddTaskModal = function() {
    document.getElementById('addTaskModal').classList.add('active');
    // Set minimum date to today
    const dateInput = document.getElementById('taskDueDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
};

window.closeAddTaskModal = function() {
    document.getElementById('addTaskModal').classList.remove('active');
};

// Initialize dashboard page
let dashboardPage;

window.addEventListener('dashboard-ready', () => {
    dashboardPage = new DashboardPage();
    dashboardPage.init();
});

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('addTaskModal');
    if (e.target === modal) {
        closeAddTaskModal();
    }
});