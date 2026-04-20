// Sidebar specific functionality
class SidebarManager {
    constructor() {
        this.sidebar = null;
        this.navItems = [];
    }

    init() {
        this.sidebar = document.getElementById('sidebar');
        this.navItems = document.querySelectorAll('.nav-link');
        this.setupNavigation();
        this.setupKeyboardNavigation();
    }

    setupNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                this.navItems.forEach(nav => nav.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + S to toggle sidebar
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                window.dashboardManager?.toggleSidebar();
            }
        });
    }

    expandSidebar() {
        this.sidebar?.classList.remove('collapsed');
        document.querySelector('.main-content')?.classList.remove('sidebar-collapsed');
    }

    collapseSidebar() {
        this.sidebar?.classList.add('collapsed');
        document.querySelector('.main-content')?.classList.add('sidebar-collapsed');
    }
}

// Initialize sidebar
const sidebarManager = new SidebarManager();
sidebarManager.init();