// Mock Data for Employee Dashboard

const MockData = {
    // User Information
    user: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'Senior Developer',
        department: 'Engineering',
        joinDate: '2022-01-15',
        avatar: '../assets/icons/avatar-placeholder.svg',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001'
    },

    // Attendance Data
    attendance: {
        today: {
            checkIn: '09:00 AM',
            checkOut: null,
            status: 'present',
            totalHours: 0
        },
        thisMonth: {
            present: 18,
            absent: 2,
            late: 1,
            halfDay: 1,
            totalDays: 22
        },
        weeklyData: [
            { day: 'Mon', hours: 8, status: 'present' },
            { day: 'Tue', hours: 7.5, status: 'present' },
            { day: 'Wed', hours: 8, status: 'present' },
            { day: 'Thu', hours: 8.5, status: 'present' },
            { day: 'Fri', hours: 4, status: 'half-day' },
            { day: 'Sat', hours: 0, status: 'weekend' },
            { day: 'Sun', hours: 0, status: 'weekend' }
        ],
        monthlyAttendance: [18, 19, 20, 18, 17, 19, 20, 18, 19, 17, 18, 16]
    },

    // Tasks Data
    tasks: {
        completed: 24,
        inProgress: 8,
        pending: 5,
        overdue: 2,
        weeklyProgress: [65, 70, 75, 80, 85, 88, 90],
        priorityTasks: [
            {
                id: 1,
                title: 'Complete Q4 Report',
                priority: 'high',
                dueDate: '2024-12-20',
                status: 'in-progress',
                assignee: 'John Doe'
            },
            {
                id: 2,
                title: 'Review Pull Request #234',
                priority: 'medium',
                dueDate: '2024-12-18',
                status: 'pending',
                assignee: 'John Doe'
            },
            {
                id: 3,
                title: 'Update Documentation',
                priority: 'low',
                dueDate: '2024-12-25',
                status: 'pending',
                assignee: 'John Doe'
            },
            {
                id: 4,
                title: 'Client Meeting Preparation',
                priority: 'high',
                dueDate: '2024-12-17',
                status: 'completed',
                assignee: 'John Doe'
            }
        ]
    },

    // Leave Data
    leave: {
        total: 20,
        used: 2,
        remaining: 18,
        pending: 1,
        approved: 2,
        rejected: 0,
        upcomingLeaves: [
            {
                id: 1,
                type: 'Annual Leave',
                startDate: '2024-12-23',
                endDate: '2024-12-27',
                days: 5,
                status: 'approved'
            }
        ],
        leaveHistory: [
            {
                id: 1,
                type: 'Sick Leave',
                startDate: '2024-11-15',
                endDate: '2024-11-16',
                days: 2,
                status: 'approved'
            }
        ]
    },

    // Payroll Data
    payroll: {
        monthlySalary: 4500,
        currency: 'USD',
        nextPayDate: '2024-12-30',
        lastPayDate: '2024-11-30',
        yearToDate: 49500,
        taxDeductions: 900,
        netPay: 3600,
        salaryHistory: [
            { month: 'Jan', amount: 4500 },
            { month: 'Feb', amount: 4500 },
            { month: 'Mar', amount: 4500 },
            { month: 'Apr', amount: 4600 },
            { month: 'May', amount: 4600 },
            { month: 'Jun', amount: 4600 },
            { month: 'Jul', amount: 4700 },
            { month: 'Aug', amount: 4700 },
            { month: 'Sep', amount: 4700 },
            { month: 'Oct', amount: 4800 },
            { month: 'Nov', amount: 4800 },
            { month: 'Dec', amount: 4800 }
        ]
    },

    // Recent Activities
    activities: [
        {
            id: 1,
            type: 'task',
            action: 'Completed task',
            title: 'Update user authentication flow',
            timestamp: '2024-12-17T10:30:00',
            user: 'John Doe'
        },
        {
            id: 2,
            type: 'attendance',
            action: 'Checked in',
            title: 'Morning check-in',
            timestamp: '2024-12-17T09:00:00',
            user: 'John Doe'
        },
        {
            id: 3,
            type: 'leave',
            action: 'Leave request',
            title: 'Annual leave request submitted',
            timestamp: '2024-12-16T14:15:00',
            user: 'John Doe'
        },
        {
            id: 4,
            type: 'task',
            action: 'Started task',
            title: 'API documentation update',
            timestamp: '2024-12-16T11:00:00',
            user: 'John Doe'
        },
        {
            id: 5,
            type: 'payroll',
            action: 'Salary credited',
            title: 'November salary processed',
            timestamp: '2024-11-30T09:00:00',
            user: 'John Doe'
        }
    ],

    // Upcoming Events
    events: [
        {
            id: 1,
            name: 'Team Meeting',
            type: 'meeting',
            date: '2024-12-18',
            time: '10:00 AM',
            location: 'Conference Room A',
            attendees: 8
        },
        {
            id: 2,
            name: 'Project Deadline',
            type: 'deadline',
            date: '2024-12-20',
            project: 'Q4 Feature Release'
        },
        {
            id: 3,
            name: 'Company Holiday Party',
            type: 'event',
            date: '2024-12-22',
            time: '6:00 PM',
            location: 'Grand Ballroom'
        },
        {
            id: 4,
            name: 'Performance Review',
            type: 'meeting',
            date: '2024-12-26',
            time: '2:00 PM',
            with: 'Sarah Johnson (Manager)'
        }
    ],

    // Notifications
    notifications: [
        {
            id: 1,
            title: 'Leave Request Approved',
            message: 'Your annual leave request for Dec 23-27 has been approved.',
            type: 'success',
            read: false,
            timestamp: '2024-12-17T09:30:00'
        },
        {
            id: 2,
            title: 'New Task Assigned',
            message: 'You have been assigned a new task: "Update documentation".',
            type: 'info',
            read: false,
            timestamp: '2024-12-17T08:15:00'
        },
        {
            id: 3,
            title: 'Meeting Reminder',
            message: 'Team meeting tomorrow at 10:00 AM in Conference Room A.',
            type: 'warning',
            read: true,
            timestamp: '2024-12-16T16:00:00'
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
}