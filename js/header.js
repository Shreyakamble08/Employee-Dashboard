// Header specific functionality
class HeaderManager {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
    }

    init() {
        this.setupNotifications();
        this.setupDateTime();
    }

    setupNotifications() {
        const notificationBtn = document.getElementById('notificationBtn');
        
        notificationBtn?.addEventListener('click', () => {
            this.showNotificationPanel();
        });
        
        // Simulate fetching notifications
        this.fetchNotifications();
    }

    async fetchNotifications() {
        // Simulate API call
        this.notifications = [
            { id: 1, title: 'New message', message: 'You have a new message from HR', read: false },
            { id: 2, title: 'Meeting reminder', message: 'Team meeting at 2:00 PM', read: false },
            { id: 3, title: 'Task assigned', message: 'New task has been assigned to you', read: true }
        ];
        
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.updateNotificationBadge();
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
        }
    }

    showNotificationPanel() {
        // Create and show notification panel
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="mark-all-read">Mark all as read</button>
            </div>
            <div class="notification-list">
                ${this.notifications.map(n => `
                    <div class="notification-item ${!n.read ? 'unread' : ''}">
                        <div class="notification-title">${n.title}</div>
                        <div class="notification-message">${n.message}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Position and show panel
        document.body.appendChild(panel);
        
        // Handle mark as read
        panel.querySelector('.mark-all-read')?.addEventListener('click', () => {
            this.markAllNotificationsRead();
        });
        
        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closePanel(e) {
                if (!panel.contains(e.target)) {
                    panel.remove();
                    document.removeEventListener('click', closePanel);
                }
            });
        }, 0);
    }

    markAllNotificationsRead() {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.updateNotificationBadge();
    }

    setupDateTime() {
        // Add current date/time display if needed
        const dateTimeElement = document.createElement('div');
        dateTimeElement.className = 'current-datetime';
        dateTimeElement.style.marginRight = '20px';
        dateTimeElement.style.fontSize = '14px';
        dateTimeElement.style.color = 'var(--text-secondary)';
        
        const headerRight = document.querySelector('.header-right');
        headerRight?.insertBefore(dateTimeElement, headerRight.firstChild);
        
        const updateDateTime = () => {
            const now = new Date();
            const options = { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
        };
        
        updateDateTime();
        setInterval(updateDateTime, 60000);
    }
}

// Initialize header
const headerManager = new HeaderManager();
headerManager.init();