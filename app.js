// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvF0qDIv6W93D8yRpNusVO-7kUJM0cD6I",
    authDomain: "school-14-crm.firebaseapp.com",
    projectId: "school-14-crm",
    storageBucket: "school-14-crm.firebasestorage.app",
    messagingSenderId: "11516954370",
    appId: "1:11516954370:web:b85ce688ce69edeab4a41b",
    measurementId: "G-5P16WDYGFW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global variables
let currentUser = null;
let currentLanguage = 'ru';
let studentsData = [];
let classesData = [];
let attendanceData = [];
let attendanceChart = null;

// Language translations
const translations = {
    ru: {
        title: '14-мактаб CRM',
        subtitle: 'Современная система контроля посещаемости',
        email: 'Электронная почта',
        password: 'Пароль',
        role: 'Роль',
        teacher: 'Учитель',
        school_admin: 'Администрация школы',
        super_admin: 'Супер администратор',
        login: 'Войти',
        dashboard: 'Главная',
        attendance: 'Посещаемость',
        classes: 'Классы',
        reports: 'Отчёты',
        settings: 'Настройки',
        import: 'Импорт',
        adminPanel: 'Админ панель',
        logout: 'Выход',
        totalStudents: 'Всего учеников',
        presentToday: 'Присутствуют сегодня',
        absentToday: 'Отсутствуют сегодня',
        attendanceRate: 'Уровень посещаемости',
        recentActivity: 'Последняя активность',
        markAttendance: 'Отметить посещаемость',
        selectClass: 'Выберите класс',
        refresh: 'Обновить',
        saveAttendance: 'Сохранить посещаемость',
        classList: 'Список классов',
        addClass: 'Добавить класс',
        editClass: 'Изменить класс',
        deleteClass: 'Удалить класс',
        edit: 'Изменить',
        delete: 'Удалить',
        attendanceReports: 'Отчеты по посещаемости',
        attendanceChart: 'График посещаемости',
        fromDate: 'От',
        toDate: 'До',
        date: 'Дата',
        generateReport: 'Сгенерировать отчёт',
        importStudents: 'Импорт учеников',
        selectFile: 'Выберите Excel файл',
        importFormat: 'Формат Excel файла: Имя | Фамилия | Телефон',
        userManagement: 'Управление пользователями',
        addUser: 'Добавить пользователя',
        systemSettings: 'Системные настройки',
        schoolName: 'Название школы',
        academicYear: 'Учебный год',
        save: 'Сохранить',
        classInfo: 'Информация о классе',
        fullName: 'Полное имя',
        className: 'Название класса',
        classTeacher: 'Классный руководитель',
        absent: 'Отсутствует',
        present: 'Присутствует',
        reason: 'Причина',
        illness: 'Болезнь',
        family: 'Семейные обстоятельства',
        other: 'Другое',
        noClasses: 'Нет классов. Создайте первый класс!',
        loading: 'Загрузка...',
        errorLoading: 'Ошибка загрузки классов',
        noPermission: 'У вас нет прав для добавления классов',
        enterClassName: 'Введите название класса',
        classAdded: 'Класс успешно добавлен!',
        classUpdated: 'Класс успешно обновлен!',
        classDeleted: 'Класс успешно удален!',
        confirmDelete: 'Вы уверены, что хотите удалить класс "{className}"? Все связанные данные будут удалены.',
        errorAdding: 'Ошибка добавления класса',
        errorUpdating: 'Ошибка обновления класса',
        errorDeleting: 'Ошибка удаления класса'
    },
    uz: {
        title: '14-maktab CRM',
        subtitle: 'Zamonaviy davomat nazorat tizimi',
        email: 'Elektron pochta',
        password: 'Parol',
        role: 'Lavozim',
        teacher: 'O\'qituvchi',
        school_admin: 'Maktab ma\'muriyati',
        super_admin: 'Super administrator',
        login: 'Kirish',
        dashboard: 'Bosh sahifa',
        attendance: 'Davomat',
        classes: 'Sinflar',
        reports: 'Hisobotlar',
        settings: 'Sozlamalar',
        import: 'Import',
        adminPanel: 'Admin panel',
        logout: 'Chiqish',
        totalStudents: 'Jami o\'quvchilar',
        presentToday: 'Bugun kelganlar',
        absentToday: 'Bugun kelmaganlar',
        attendanceRate: 'Davomat darajasi',
        recentActivity: 'Oxirgi faoliyat',
        markAttendance: 'Davomatni belgilash',
        selectClass: 'Sinfni tanlang',
        refresh: 'Yangilash',
        saveAttendance: 'Davomatni saqlash',
        classList: 'Sinflar ro\'yxati',
        addClass: 'Sinf qo\'shish',
        editClass: 'Sinfni tahrirlash',
        deleteClass: 'Sinfni o\'chirish',
        edit: 'Tahrirlash',
        delete: 'O\'chirish',
        attendanceReports: 'Davomat hisobotlari',
        attendanceChart: 'Davomat grafigi',
        fromDate: 'Dan',
        toDate: 'Gacha',
        date: 'Sana',
        generateReport: 'Hisobot yaratish',
        importStudents: 'O\'quvchilarni import qilish',
        selectFile: 'Excel faylni tanlang',
        importFormat: 'Excel fayl formati: Ism | Familiya | Telefon',
        userManagement: 'Foydalanuvchilarni boshqarish',
        addUser: 'Foydalanuvchi qo\'shish',
        systemSettings: 'Tizim sozlamalari',
        schoolName: 'Maktab nomi',
        academicYear: 'O\'quv yili',
        save: 'Saqlash',
        classInfo: 'Sinf haqida ma\'lumot',
        fullName: 'To\'liq ism',
        className: 'Sinf nomi',
        classTeacher: 'Sinf rahbari',
        absent: 'Kelmagan',
        present: 'Kelgan',
        reason: 'Sabab',
        illness: 'Kasallik',
        family: 'Oilaviy holatlar',
        other: 'Boshqa',
        noClasses: 'Sinflar yo\'q. Birinchi sinf yarating!',
        loading: 'Yuklanmoqda...',
        errorLoading: 'Sinflarni yuklashda xatolik',
        noPermission: 'Sizda sinflarni qo\'shish uchun ruxsat yo\'q',
        enterClassName: 'Sinf nomini kiriting',
        classAdded: 'Sinf muvaffaqiyatli qo\'shildi!',
        classUpdated: 'Sinf muvaffaqiyatli yangilandi!',
        classDeleted: 'Sinf muvaffaqiyatli o\'chirildi!',
        confirmDelete: 'Siz "{className}" sinfini o\'chirmoqchimisiz? Barcha bog\'liq ma\'lumotlar o\'chiriladi.',
        errorAdding: 'Sinfni qo\'shishda xatolik',
        errorUpdating: 'Sinfni yangilashda xatolik',
        errorDeleting: 'Sinfni o\'chirishda xatolik'
    }
};

// Role permissions
const rolePermissions = {
    teacher: {
        canViewDashboard: true,
        canMarkAttendance: true,
        canViewClasses: true,
        canViewReports: false,
        canImportStudents: false,
        canManageUsers: false,
        canManageSettings: false
    },
    school_admin: {
        canViewDashboard: true,
        canMarkAttendance: true,
        canViewClasses: true,
        canViewReports: true,
        canImportStudents: true,
        canManageUsers: true,
        canManageSettings: false
    },
    super_admin: {
        canViewDashboard: true,
        canMarkAttendance: true,
        canViewClasses: true,
        canViewReports: true,
        canImportStudents: true,
        canManageUsers: true,
        canManageSettings: true
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Load saved language
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Check for existing session first
    if (!checkExistingSession()) {
        showLogin();
    }

    // Setup event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    
    if (fromDateInput) fromDateInput.value = today;
    if (toDateInput) toDateInput.value = today;
    
    // Auto-load students when class is selected
    const classSelect = document.getElementById('classSelect');
    if (classSelect) {
        classSelect.addEventListener('change', loadStudents);
    }
    
    // Update language on load
    updateLanguage();
}

// Language functions
function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.lang-btn[onclick="setLanguage('${lang}')"]`).classList.add('active');
    
    // Update language label
    const langLabel = document.querySelector('.lang-label');
    if (langLabel) {
        langLabel.textContent = lang === 'uz' ? 'Тил:' : 'Тил:';
    }
    
    // Update all text
    updateLanguage();
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Reload current tab to update content
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        const tabName = activeTab.id.replace('Tab', '');
        if (tabName && tabName !== 'dashboard') {
            setTimeout(() => showTab(tabName), 100);
        }
    }
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Update placeholders
    const placeholders = {
        'newClassName': currentLanguage === 'uz' ? 'Masalan: 1-A sinf' : 'Например: 1-А класс',
        'newClassTeacher': currentLanguage === 'uz' ? 'Sinf rahbarining FISH' : 'ФИО классного руководителя'
    };
    
    Object.keys(placeholders).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.placeholder = placeholders[id];
        }
    });
    
    // Update role options
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
        roleSelect.innerHTML = `
            <option value="teacher" data-lang="teacher">${translations[currentLanguage].teacher}</option>
            <option value="school_admin" data-lang="school_admin">${translations[currentLanguage].school_admin}</option>
            <option value="super_admin" data-lang="super_admin">${translations[currentLanguage].super_admin}</option>
        `;
    }
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // For demo purposes, we'll use mock authentication
    // In production, replace with actual Firebase Auth
    mockLogin(email, password, role);
}

function mockLogin(email, password, role) {
    // Updated mock user data for new roles
    const mockUsers = [
        { email: 'director@school14.uz', password: 'director2024', role: 'super_admin', name: 'Директор школы' },
        { email: 'admin@school14.uz', password: 'admin2024', role: 'school_admin', name: 'Администратор школы' },
        { email: 'teacher1@school14.uz', password: 'teacher2024', role: 'teacher', name: 'Учитель математики' },
        { email: 'teacher2@school14.uz', password: 'teacher2024', role: 'teacher', name: 'Учитель русского языка' },
        { email: 'teacher3@school14.uz', password: 'teacher2024', role: 'teacher', name: 'Учитель физкультуры' }
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
        currentUser = {
            uid: 'mock_' + Date.now(),
            email: user.email,
            role: user.role,
            name: user.name
        };
        
        // Save to localStorage for persistent session
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showDashboard();
        showToast('Успешный вход!', 'success');
    } else {
        showToast('Неверные данные для входа', 'danger');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
    showToast('Вы вышли из системы', 'info');
}

// Page navigation functions
function showLogin() {
    const loginPage = document.getElementById('loginPage');
    const dashboardPage = document.getElementById('dashboardPage');
    
    if (loginPage) loginPage.classList.add('active');
    if (dashboardPage) dashboardPage.classList.remove('active');
}

function showDashboard() {
    const loginPage = document.getElementById('loginPage');
    const dashboardPage = document.getElementById('dashboardPage');
    const mobileHeader = document.querySelector('.mobile-header');
    
    if (loginPage) loginPage.classList.remove('active');
    if (dashboardPage) dashboardPage.classList.add('active');
    
    // Show mobile header on mobile
    if (window.innerWidth <= 768 && mobileHeader) {
        mobileHeader.style.display = 'flex';
    }
    
    // Set today's date for attendance
    const today = new Date().toISOString().split('T')[0];
    const attendanceDateInput = document.getElementById('attendanceDate');
    if (attendanceDateInput) {
        attendanceDateInput.value = today;
    }

    // Load initial data
    loadDashboardData();
    loadClasses();
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function updateSidebarUserInfo() {
    if (currentUser) {
        document.getElementById('sidebarUserName').textContent = currentUser.name;
        document.getElementById('sidebarUserRole').textContent = getRoleDisplayName(currentUser.role);
    }
}

function getRoleDisplayName(role) {
    const roleNames = {
        teacher: 'Учитель',
        school_admin: 'Администрация школы',
        super_admin: 'Супер администратор'
    };
    return roleNames[role] || role;
}

function applyRolePermissions() {
    if (!currentUser) return;
    
    const permissions = rolePermissions[currentUser.role];
    
    // Show/hide admin sections based on permissions
    const adminSection = document.getElementById('adminSection');
    const systemSettingsSection = document.getElementById('systemSettingsSection');
    
    if (permissions.canManageUsers) {
        adminSection.style.display = 'block';
    } else {
        adminSection.style.display = 'none';
    }
    
    if (permissions.canManageSettings) {
        systemSettingsSection.style.display = 'block';
    } else {
        systemSettingsSection.style.display = 'none';
    }
    
    // Disable/enable navigation based on permissions
    const reportsLink = document.querySelector('a[href*="reports"]');
    const settingsLink = document.querySelector('a[href*="settings"]');
    
    if (!permissions.canViewReports && reportsLink) {
        reportsLink.style.opacity = '0.5';
        reportsLink.style.pointerEvents = 'none';
    }
    
    if (!permissions.canImportStudents && !permissions.canManageUsers && settingsLink) {
        settingsLink.style.opacity = '0.5';
        settingsLink.style.pointerEvents = 'none';
    }
}

// Check for existing session on page load
function checkExistingSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showDashboard();
            return true;
        } catch (error) {
            localStorage.removeItem('currentUser');
        }
    }
    return false;
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Load tab-specific data
    switch (tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'attendance':
            loadAttendanceData();
            break;
        case 'classes':
            loadClasses();
            break;
        case 'reports':
            loadReports();
            break;
        case 'import':
            loadImportData();
            break;
        case 'admin':
            if (currentUser.role === 'admin') {
                loadAdminData();
            }
            break;
    }
}

// Dashboard functions
function loadDashboardData() {
    // Load real data from Firebase
    loadDashboardStats();
    loadRecentActivity();
    loadAttendanceChart();
}

function loadDashboardStats() {
    // Get total students count
    db.collection('students').get().then((snapshot) => {
        const totalStudents = snapshot.size;
        document.getElementById('totalStudents').textContent = totalStudents;
    }).catch((error) => {
        console.error('Error loading students:', error);
        document.getElementById('totalStudents').textContent = '0';
    });

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    db.collection('attendance').where('date', '==', today).get().then((snapshot) => {
        let presentCount = 0;
        let absentCount = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.present) {
                presentCount += data.presentCount || 0;
            }
            if (data.absent) {
                absentCount += data.absentCount || 0;
            }
        });

        document.getElementById('presentToday').textContent = presentCount;
        document.getElementById('absentToday').textContent = absentCount;
        
        const total = presentCount + absentCount;
        const rate = total > 0 ? ((presentCount / total) * 100).toFixed(1) + '%' : '0%';
        document.getElementById('attendanceRate').textContent = rate;
    }).catch((error) => {
        console.error('Error loading attendance:', error);
        document.getElementById('presentToday').textContent = '0';
        document.getElementById('absentToday').textContent = '0';
        document.getElementById('attendanceRate').textContent = '0%';
    });
}

function loadAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (attendanceChart) {
        attendanceChart.destroy();
    }
    
    // Create new chart
    attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'],
            datasets: [{
                label: 'Посещаемость (%)',
                data: [95, 94, 96, 93, 94.7],
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(102, 126, 234)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return 'Посещаемость: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 85,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateDashboardStats() {
    // Update dashboard with new attendance data
    const presentToday = document.getElementById('presentToday');
    const absentToday = document.getElementById('absentToday');
    const attendanceRate = document.getElementById('attendanceRate');
    
    // Mock update - in real app this would come from database
    const currentPresent = parseInt(presentToday.textContent);
    const currentAbsent = parseInt(absentToday.textContent);
    
    presentToday.textContent = currentPresent + 1;
    absentToday.textContent = currentAbsent;
    
    const total = currentPresent + currentAbsent + 1;
    const rate = ((currentPresent + 1) / total * 100).toFixed(1);
    attendanceRate.textContent = rate + '%';
}

function loadRecentActivity() {
    const activities = [
        { type: 'success', title: 'Учитель Иванов отметил посещаемость', time: '5 минут назад' },
        { type: 'info', title: 'Добавлен новый ученик в 5-А класс', time: '1 час назад' },
        { type: 'danger', title: 'Учитель Петров отсутствует сегодня', time: '2 часа назад' },
        { type: 'success', title: 'Создан отчет за неделю', time: '3 часа назад' }
    ];

    const activityList = document.getElementById('recentActivityList');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const activityHtml = `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="bi bi-${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `;
        activityList.innerHTML += activityHtml;
    });
}

function getActivityIcon(type) {
    switch (type) {
        case 'success': return 'check-circle-fill';
        case 'danger': return 'x-circle-fill';
        case 'info': return 'info-circle-fill';
        default: return 'circle';
    }
}

// Attendance functions
function loadAttendanceData() {
    loadClassesSelect();
}

function loadClassesSelect() {
    const classSelect = document.getElementById('classSelect');
    const reportClassSelect = document.getElementById('reportClassSelect');
    const classImport = document.getElementById('classImport');
    const classTeacherSelect = document.getElementById('classTeacherSelect');

    // Mock classes data
    const mockClasses = [
        { id: '1', name: '1-А класс', teacher: 'Иванова А.А.', studentCount: 25 },
        { id: '2', name: '2-Б класс', teacher: 'Петров В.В.', studentCount: 23 },
        { id: '3', name: '3-В класс', teacher: 'Сидорова К.К.', studentCount: 27 },
        { id: '4', name: '4-Г класс', teacher: 'Козлов Д.Д.', studentCount: 22 },
        { id: '5', name: '5-А класс', teacher: 'Смирнова Е.Е.', studentCount: 26 }
    ];

    // Clear existing options
    classSelect.innerHTML = '<option value="" data-lang="selectClass">Выберите класс</option>';
    reportClassSelect.innerHTML = '<option value="">Все классы</option>';
    classImport.innerHTML = '<option value="">Выберите класс</option>';
    classTeacherSelect.innerHTML = '<option value="">Выберите</option>';

    mockClasses.forEach(cls => {
        const option1 = new Option(cls.name, cls.id);
        const option2 = new Option(cls.name, cls.id);
        const option3 = new Option(cls.name, cls.id);
        const option4 = new Option(cls.name + ' - ' + cls.teacher, cls.id);

        classSelect.add(option1);
        reportClassSelect.add(option2);
        classImport.add(option3);
        classTeacherSelect.add(option4);
    });
}

function loadStudents() {
    const classSelect = document.getElementById('classSelect');
    const classId = classSelect.value;
    
    if (!classId) {
        document.getElementById('studentsList').innerHTML = '<p class="text-muted">Выберите класс для отображения учеников</p>';
        updateAttendanceCounts();
        return;
    }
    
    // Get selected class name
    const selectedOption = classSelect.options[classSelect.selectedIndex];
    const className = selectedOption.text;
    
    const studentsList = document.getElementById('studentsList');
    
    if (!classId) {
        studentsList.innerHTML = `<div class="alert alert-warning">${translations[currentLanguage].selectClass}</div>`;
        return;
    }
    
    // Show loading
    studentsList.innerHTML = `<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">${translations[currentLanguage].loading}</span></div></div>`;
    
    // Load real students from Firebase
    db.collection('students').where('classId', '==', classId).get().then((snapshot) => {
        studentsList.innerHTML = '';
        
        if (snapshot.empty) {
            studentsList.innerHTML = `<div class="alert alert-info">${currentLanguage === 'uz' ? 'Bu sinfda o\'quvchilar yo\'q' : 'В этом классе нет учеников'}</div>`;
            return;
        }
        
        const today = new Date().toISOString().split('T')[0];
        
        // Load today's attendance for this class
        db.collection('attendance').where('classId', '==', classId).where('date', '==', today).get().then((attendanceSnapshot) => {
            const attendanceData = {};
            attendanceSnapshot.forEach((doc) => {
                attendanceData[doc.data().studentId] = doc.data();
            });
            
            snapshot.forEach((doc) => {
                const student = doc.data();
                student.id = doc.id;
                
                const isPresent = attendanceData[student.id] ? attendanceData[student.id].present : true;
                const absentReason = attendanceData[student.id] ? attendanceData[student.id].absentReason : '';
                
                const studentHtml = `
                    <div class="student-item">
                        <div class="student-info">
                            <div class="student-avatar">${student.name.charAt(0)}</div>
                            <div class="student-details">
                                <div class="student-name">${student.name}</div>
                                <div class="student-class">${currentLanguage === 'uz' ? 'Sinf:' : 'Класс:'} ${classId}</div>
                            </div>
                        </div>
                        <div class="attendance-checkbox">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="student_${student.id}" ${isPresent ? 'checked' : ''}>
                                <label class="form-check-label" for="student_${student.id}">
                                    ${translations[currentLanguage].present}
                                </label>
                            </div>
                            <div class="absent-reason" id="reason_${student.id}" style="display: ${isPresent ? 'none' : 'block'};">
                                <select class="form-select form-select-sm">
                                    <option value="">${currentLanguage === 'uz' ? 'Sababni tanlang' : 'Выберите причину'}</option>
                                    <option value="illness" ${absentReason === 'illness' ? 'selected' : ''}>${translations[currentLanguage].illness}</option>
                                    <option value="family" ${absentReason === 'family' ? 'selected' : ''}>${translations[currentLanguage].family}</option>
                                    <option value="other" ${absentReason === 'other' ? 'selected' : ''}>${translations[currentLanguage].other}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `;
                studentsList.innerHTML += studentHtml;
            });
            
            // Add event listeners for checkboxes
            document.querySelectorAll('.attendance-checkbox input').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const studentId = this.id.replace('student_', '');
                    const reasonDiv = document.getElementById(`reason_${studentId}`);
                    
                    if (this.checked) {
                        reasonDiv.style.display = 'none';
                    } else {
                        reasonDiv.style.display = 'block';
                    }
                    
                    updateAttendanceSummary();
                });
            });
            
            updateAttendanceSummary();
        });
    }).catch((error) => {
        console.error('Error loading students:', error);
        studentsList.innerHTML = '<div class="alert alert-danger">Ошибка загрузки учеников</div>';
    });
}

function toggleAbsentReason(studentId) {
    const studentItem = document.querySelector(`[data-student-id="${studentId}"]`);
    const reasonDiv = document.getElementById(`reason_${studentId}`);
    const checkbox = document.getElementById(`student_${studentId}`);
    
    if (checkbox.checked) {
        studentItem.classList.add('absent');
        reasonDiv.style.display = 'block';
    } else {
        studentItem.classList.remove('absent');
        reasonDiv.style.display = 'none';
        document.getElementById(`reason_select_${studentId}`).value = '';
    }
    
    updateAttendanceCounts();
}

function updateAttendanceCounts() {
    const totalStudents = document.querySelectorAll('.student-item').length;
    const absentStudents = document.querySelectorAll('.student-item.absent').length;
    const presentStudents = totalStudents - absentStudents;
    
    document.getElementById('presentCount').textContent = presentStudents;
    document.getElementById('absentCount').textContent = absentStudents;
}

function saveAttendance() {
    const classSelect = document.getElementById('classSelect');
    const selectedClass = classSelect.options[classSelect.selectedIndex].text;
    const attendanceDate = document.getElementById('attendanceDate').value;
    const absentCheckboxes = document.querySelectorAll('#studentsList input[type="checkbox"]:checked');
    const totalStudents = document.querySelectorAll('.student-item').length;
    const presentStudents = totalStudents - absentCheckboxes.length;

    if (totalStudents === 0) {
        showToast('Сначала выберите класс', 'warning');
        return;
    }

    // Validate absent reasons
    let validAbsent = true;
    absentCheckboxes.forEach(checkbox => {
        const studentId = checkbox.value;
        const reasonSelect = document.getElementById(`reason_select_${studentId}`);
        if (checkbox.checked && (!reasonSelect.value || reasonSelect.value === '')) {
            validAbsent = false;
        }
    });

    if (!validAbsent) {
        showToast('Укажите причину отсутствия для всех отмеченных учеников', 'warning');
        return;
    }

    // Prepare attendance data
    const attendanceData = {
        class: selectedClass,
        date: attendanceDate,
        totalStudents: totalStudents,
        presentStudents: presentStudents,
        absentStudents: absentCheckboxes.length,
        attendanceRate: ((presentStudents / totalStudents) * 100).toFixed(1) + '%',
        absentDetails: []
    };

    // Collect absent details
    absentCheckboxes.forEach(checkbox => {
        const studentItem = document.querySelector(`[data-student-id="${checkbox.value}"]`);
        const studentName = studentItem.querySelector('.student-name').textContent;
        const reasonSelect = document.getElementById(`reason_select_${checkbox.value}`);
        
        attendanceData.absentDetails.push({
            studentId: checkbox.value,
            studentName: studentName,
            reason: reasonSelect.value,
            reasonText: reasonSelect.options[reasonSelect.selectedIndex].text
        });
    });

    // Show confirmation dialog
    const confirmMessage = `Сохранить посещаемость для класса ${selectedClass}?\n` +
                          `Присутствуют: ${presentStudents}\n` +
                          `Отсутствуют: ${absentCheckboxes.length}\n` +
                          `Процент посещаемости: ${attendanceData.attendanceRate}`;

    if (confirm(confirmMessage)) {
        // Mock save operation
        console.log('Saving attendance:', attendanceData);
        showToast('Посещаемость успешно сохранена!', 'success');

        // Add to recent activity
        const activity = {
            type: 'success',
            title: `${currentUser.name} сохранил(а) посещаемость для ${selectedClass}`,
            time: 'Только что'
        };
        addRecentActivity(activity);
        
        // Update dashboard stats
        updateDashboardStats();
    }
}

// Classes functions
function loadClasses() {
    const classesList = document.getElementById('classesList');
    const addClassBtn = document.getElementById('addClassBtn');
    
    if (!classesList) return;
    
    // Show/hide add class button based on permissions
    if (currentUser && (currentUser.role === 'school_admin' || currentUser.role === 'super_admin')) {
        addClassBtn.style.display = 'inline-flex';
    } else {
        addClassBtn.style.display = 'none';
    }
    
    classesList.innerHTML = `<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">${translations[currentLanguage].loading}</span></div></div>`;
    
    // Try to load from Firebase, fallback to mock data
    try {
        if (db && typeof db.collection === 'function') {
            db.collection('classes').get().then((querySnapshot) => {
                classesData = [];
                classesList.innerHTML = '';
                
                if (querySnapshot.empty) {
                    loadMockClasses();
                    return;
                }
                
                querySnapshot.forEach((doc) => {
                    const classData = doc.data();
                    classData.id = doc.id;
                    classesData.push(classData);
                    
                    const classHtml = createClassCard(classData);
                    classesList.innerHTML += classHtml;
                });
                
                updateClassSelectors();
            }).catch((error) => {
                console.error('Firebase error, using mock data:', error);
                loadMockClasses();
            });
        } else {
            loadMockClasses();
        }
    } catch (error) {
        console.error('Error loading classes:', error);
        loadMockClasses();
    }
}

function loadMockClasses() {
    const classesList = document.getElementById('classesList');
    classesData = [
        { id: '1', name: '1-А класс', teacher: 'Иванова А.А.', studentCount: 25, present: 23, absent: 2 },
        { id: '2', name: '2-Б класс', teacher: 'Петров В.В.', studentCount: 23, present: 22, absent: 1 },
        { id: '3', name: '3-В класс', teacher: 'Сидорова К.К.', studentCount: 27, present: 25, absent: 2 },
        { id: '4', name: '4-Г класс', teacher: 'Козлов Д.Д.', studentCount: 22, present: 21, absent: 1 },
        { id: '5', name: '5-А класс', teacher: 'Смирнова Е.Е.', studentCount: 26, present: 24, absent: 2 }
    ];
    
    classesList.innerHTML = '';
    
    if (classesData.length === 0) {
        classesList.innerHTML = `<div class="alert alert-info text-center">${translations[currentLanguage].noClasses}</div>`;
        return;
    }
    
    classesData.forEach(cls => {
        const classHtml = createClassCard(cls);
        classesList.innerHTML += classHtml;
    });
    
    updateClassSelectors();
}

function createClassCard(cls) {
    const studentCount = cls.studentCount || 0;
    const present = cls.present || 0;
    const absent = cls.absent || 0;
    const attendance = studentCount > 0 ? ((present / studentCount) * 100).toFixed(1) + '%' : '0%';
    
    return `
        <div class="class-card" data-class-id="${cls.id}">
            <div class="class-header">
                <div class="class-name">${cls.name}</div>
                <div class="class-teacher">
                    <i class="bi bi-person-badge"></i> ${cls.teacher || 'Не назначен'}
                </div>
            </div>
            <div class="class-stats">
                <div class="stat-row">
                    <div class="stat-label">
                        <i class="bi bi-people-fill"></i>
                        <span>${translations[currentLanguage].totalStudents || 'Всего учеников'}</span>
                    </div>
                    <div class="stat-value">${studentCount}</div>
                </div>
                <div class="stat-row">
                    <div class="stat-label">
                        <i class="bi bi-check-circle-fill text-success"></i>
                        <span>${translations[currentLanguage].presentToday || 'Присутствуют'}</span>
                    </div>
                    <div class="stat-value text-success">${present}</div>
                </div>
                <div class="stat-row">
                    <div class="stat-label">
                        <i class="bi bi-x-circle-fill text-danger"></i>
                        <span>${translations[currentLanguage].absentToday || 'Отсутствуют'}</span>
                    </div>
                    <div class="stat-value text-danger">${absent}</div>
                </div>
                <div class="stat-row">
                    <div class="stat-label">
                        <i class="bi bi-percent"></i>
                        <span>${translations[currentLanguage].attendanceRate || 'Посещаемость'}</span>
                    </div>
                    <div class="stat-value">${attendance}</div>
                </div>
            </div>
            <div class="class-actions">
                <button class="btn btn-primary" onclick="showClassInfo('${cls.id}')">
                    <i class="bi bi-info-circle"></i> ${translations[currentLanguage].classInfo || 'Информация'}
                </button>
                <button class="btn btn-info" onclick="goToAttendance('${cls.id}')">
                    <i class="bi bi-calendar-check"></i> ${translations[currentLanguage].markAttendance || 'Посещаемость'}
                </button>
                ${currentUser && (currentUser.role === 'school_admin' || currentUser.role === 'super_admin') ? `
                    <button class="btn btn-warning" onclick="editClass('${cls.id}')">
                        <i class="bi bi-pencil"></i> ${translations[currentLanguage].edit || 'Изменить'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteClass('${cls.id}')">
                        <i class="bi bi-trash"></i> ${translations[currentLanguage].delete || 'Удалить'}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

function updateClassSelectors() {
    const selectors = [
        'classSelect',
        'reportClassSelect', 
        'classImport'
    ];
    
    selectors.forEach(selectorId => {
        const select = document.getElementById(selectorId);
        if (!select) return;
        
        const currentValue = select.value;
        const defaultOption = selectorId === 'reportClassSelect' ? 
            '<option value="">Все классы</option>' : 
            '<option value="" data-lang="selectClass">Выберите класс</option>';
        
        select.innerHTML = defaultOption;
        
        classesData.forEach(cls => {
            const option = new Option(cls.name, cls.id);
            select.add(option);
        });
        
        // Restore previous selection
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

function showAddClassModal() {
    if (!currentUser || (currentUser.role !== 'school_admin' && currentUser.role !== 'super_admin')) {
        showToast(translations[currentLanguage].noPermission, 'warning');
        return;
    }
    
    // Clear form
    document.getElementById('newClassName').value = '';
    document.getElementById('newClassTeacher').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('addClassModal'));
    modal.show();
}

function addClass() {
    const className = document.getElementById('newClassName').value.trim();
    const teacher = document.getElementById('newClassTeacher').value.trim();
    
    if (!className) {
        showToast(translations[currentLanguage].enterClassName, 'warning');
        return;
    }
    
    const classData = {
        name: className,
        teacher: teacher,
        studentCount: 0,
        present: 0,
        absent: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.uid
    };
    
    db.collection('classes').add(classData).then((docRef) => {
        showToast(translations[currentLanguage].classAdded, 'success');
        
        // Add activity
        addRecentActivity({
            type: 'success',
            title: `${currentUser.name} добавил(а) класс: ${className}`,
            time: 'Только что'
        });
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addClassModal')).hide();
        
        // Reload classes
        loadClasses();
        
    }).catch((error) => {
        console.error('Error adding class:', error);
        showToast(translations[currentLanguage].errorAdding, 'danger');
    });
}

function editClass(classId) {
    const classData = classesData.find(c => c.id === classId);
    if (!classData) return;
    
    // Fill form with existing data
    document.getElementById('editClassName').value = classData.name;
    document.getElementById('editClassTeacher').value = classData.teacher || '';
    document.getElementById('editClassId').value = classId;
    
}

function goToAttendance(classId) {
    // Switch to attendance tab and select the class
    showTab('attendance');
    document.getElementById('classSelect').value = classId;
    loadStudents();
}

function showClassInfo(classId) {
    // Mock class info
    const classInfo = {
        name: '5-А класс',
        teacher: 'Смирнова Елена Евгеньевна',
        studentCount: 26,
        schedule: 'Пн-Пт: 8:00-14:00',
        room: 'Кабинет 205',
        attendance: {
            present: 24,
            absent: 2,
            rate: '92.3%'
        }
    };

    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6>Основная информация</h6>
                <p><strong>Название:</strong> ${classInfo.name}</p>
                <p><strong>Классный руководитель:</strong> ${classInfo.teacher}</p>
                <p><strong>Количество учеников:</strong> ${classInfo.studentCount}</p>
                <p><strong>Расписание:</strong> ${classInfo.schedule}</p>
                <p><strong>Кабинет:</strong> ${classInfo.room}</p>
            </div>
            <div class="col-md-6">
                <h6>Статистика посещаемости</h6>
                <div class="progress mb-2">
                    <div class="progress-bar bg-success" style="width: ${classInfo.attendance.rate}">${classInfo.attendance.rate}</div>
                </div>
                <p><strong>Присутствуют:</strong> ${classInfo.attendance.present}</p>
                <p><strong>Отсутствуют:</strong> ${classInfo.attendance.absent}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6>Список учеников</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>ФИО</th>
                                <th>Статус</th>
                                <th>Примечание</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>1</td><td>Абдуллаев Али</td><td><span class="badge bg-success">Присутствует</span></td><td>-</td></tr>
                            <tr><td>2</td><td>Ахмедова Барно</td><td><span class="badge bg-danger">Отсутствует</span></td><td>Болезнь</td></tr>
                            <tr><td>3</td><td>Бобоев Карим</td><td><span class="badge bg-success">Присутствует</span></td><td>-</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.getElementById('classInfoContent').innerHTML = content;

    const modal = new bootstrap.Modal(document.getElementById('classInfoModal'));
    modal.show();
}

function showAddClassModal() {
    const modal = new bootstrap.Modal(document.getElementById('addClassModal'));
    modal.show();
}

function addClass() {
    const className = document.getElementById('newClassName').value;
    const teacherId = document.getElementById('classTeacherSelect').value;

    if (!className || !teacherId) {
        showToast('Заполните все поля', 'warning');
        return;
    }

    // Mock add operation
    showToast('Класс успешно добавлен!', 'success');

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addClassModal')).hide();

    // Reload classes
    loadClasses();
}

// Reports functions
function loadReports() {
    loadClassesSelect();
}

function generateReport() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const classId = document.getElementById('reportClassSelect').value;

    if (!fromDate || !toDate) {
        showToast('Выберите период', 'warning');
        return;
    }

    // Mock report data
    const reportData = {
        totalStudents: 245,
        totalDays: 5,
        averageAttendance: '94.2%',
        bestClass: '1-А класс (98%)',
        worstClass: '3-В класс (89%)'
    };

    const reportHtml = `
        <div class="alert alert-info">
            <h5>Отчет за период: ${fromDate} - ${toDate}</h5>
        </div>
        <div class="row">
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body text-center">
                        <h4>${reportData.totalStudents}</h4>
                        <p>Всего учеников</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body text-center">
                        <h4>${reportData.totalDays}</h4>
                        <p>Учебных дней</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body text-center">
                        <h4>${reportData.averageAttendance}</h4>
                        <p>Средняя посещаемость</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body text-center">
                        <h4>${reportData.bestClass}</h4>
                        <p>Лучший класс</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <button class="btn btn-success" onclick="exportReport()">
                <i class="bi bi-download"></i> Скачать отчет
            </button>
            <button class="btn btn-primary" onclick="printReport()">
                <i class="bi bi-printer"></i> Печать
            </button>
        </div>
    `;

    document.getElementById('reportResults').innerHTML = reportHtml;
    showToast('Отчет успешно создан!', 'success');
}

function exportReport() {
    showToast('Отчет экспортирован в Excel', 'success');
}

function printReport() {
    window.print();
}

// Import functions
function loadImportData() {
    loadClassesSelect();
}

function importStudents() {
    const classId = document.getElementById('classImport').value;
    const fileInput = document.getElementById('excelFile');

    if (!classId) {
        showToast('Выберите класс', 'warning');
        return;
    }

    if (!fileInput.files.length) {
        showToast('Выберите Excel файл', 'warning');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // Process imported data
            const students = jsonData.filter(row => row && row.length > 0).map(row => ({
                name: row[0] || '',
                lastName: row[1] || '',
                phone: row[2] || ''
            })).filter(student => student.name);

            if (students.length === 0) {
                showToast('Файл пуст или неверный формат', 'danger');
                return;
            }

            // Mock import operation
            showToast(`Успешно импортировано ${students.length} учеников!`, 'success');

            // Clear file input
            fileInput.value = '';

            // Add to recent activity
            const activity = {
                type: 'info',
                title: `Импортировано ${students.length} учеников в класс`,
                time: 'Только что'
            };
            addRecentActivity(activity);

        } catch (error) {
            showToast('Ошибка при чтении файла', 'danger');
        }
    };

    reader.readAsArrayBuffer(file);
}

// Admin functions
function loadAdminData() {
    loadUsers();
    loadSystemSettings();
}

function loadUsers() {
    // Mock users data
    const mockUsers = [
        { id: '1', name: 'Иванова Анна Андреевна', email: 'ivanova@school14.uz', role: 'teacher' },
        { id: '2', name: 'Петров Виктор Владимирович', email: 'petrov@school14.uz', role: 'teacher' },
        { id: '3', name: 'Сидорова Ксения Кирилловна', email: 'sidorova@school14.uz', role: 'director' },
        { id: '4', name: 'Козлов Дмитрий Дмитриевич', email: 'kozlov@school14.uz', role: 'admin' }
    ];

    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    mockUsers.forEach(user => {
        const userHtml = `
            <div class="user-item">
                <div class="user-info">
                    <div class="user-avatar">${user.name.charAt(0)}</div>
                    <div class="user-details">
                        <div class="user-name">${user.name}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
                <div class="user-role ${user.role}">${getRoleName(user.role)}</div>
                <div class="user-actions">
                    <button class="btn btn-sm btn-warning" onclick="editUser('${user.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        usersList.innerHTML += userHtml;
    });
}

function getRoleName(role) {
    const roleNames = {
        teacher: 'Учитель',
        admin: 'Администратор',
        director: 'Директор'
    };
    return roleNames[role] || role;
}

function loadSystemSettings() {
    // Mock settings
    document.getElementById('schoolName').value = '14-мактаб';
    document.getElementById('academicYear').value = '2024-2025';
}

function showAddUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();
}

function addUser() {
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;

    if (!name || !email || !password || !role) {
        showToast('Заполните все поля', 'warning');
        return;
    }

    // Mock add operation
    showToast('Пользователь успешно добавлен!', 'success');

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();

    // Reload users
    loadUsers();
}

function saveSettings() {
    const schoolName = document.getElementById('schoolName').value;
    const academicYear = document.getElementById('academicYear').value;

    // Mock save operation
    showToast('Настройки успешно сохранены!', 'success');
}

// Utility functions
function showToast(message, type = 'info') {
    const toastElement = document.getElementById('liveToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    toastTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    toastMessage.textContent = message;

    // Update toast class based on type
    toastElement.className = `toast show`;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function addRecentActivity(activity) {
    const activityList = document.getElementById('recentActivityList');
    const activityHtml = `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="bi bi-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `;

    activityList.insertAdjacentHTML('afterbegin', activityHtml);

    // Keep only last 10 activities
    const activities = activityList.querySelectorAll('.activity-item');
    if (activities.length > 10) {
        activities[activities.length - 1].remove();
    }
}

function editClass(classId) {
    showToast('Редактирование класса', 'info');
}

function editUser(userId) {
    showToast('Редактирование пользователя', 'info');
}

function deleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        showToast('Пользователь удален', 'success');
        loadUsers();
    }
}

// Security functions
function hashPassword(password) {
    // Simple hash function for demonstration
    // In production, use proper hashing
    return btoa(password);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function generateSecureToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Export functions for global access
window.setLanguage = setLanguage;
window.showTab = showTab;
window.logout = logout;
window.loadStudents = loadStudents;
window.saveAttendance = saveAttendance;
window.showClassInfo = showClassInfo;
window.showAddClassModal = showAddClassModal;
window.addClass = addClass;
window.generateReport = generateReport;
window.exportReport = exportReport;
window.printReport = printReport;
window.importStudents = importStudents;
window.showAddUserModal = showAddUserModal;
window.addUser = addUser;
window.saveSettings = saveSettings;
window.editClass = editClass;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.toggleAbsentReason = toggleAbsentReason;
window.goToAttendance = goToAttendance;