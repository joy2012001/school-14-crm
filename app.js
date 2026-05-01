// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Global variables
let currentUser = null;
let currentLanguage = 'ru';
let studentsData = [];
let classesData = [];
let attendanceData = [];

// Language translations
const translations = {
    ru: {
        title: '14-мактаб CRM',
        subtitle: 'Система контроля посещаемости',
        email: 'Электронная почта',
        password: 'Пароль',
        role: 'Роль',
        teacher: 'Учитель',
        admin: 'Администратор',
        director: 'Директор',
        login: 'Войти',
        dashboard: 'Главная',
        attendance: 'Посещаемость',
        classes: 'Классы',
        reports: 'Отчеты',
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
        attendanceReports: 'Отчеты по посещаемости',
        fromDate: 'От',
        toDate: 'До',
        generateReport: 'Создать отчет',
        importStudents: 'Импорт учеников',
        selectFile: 'Выберите Excel файл',
        importFormat: 'Формат Excel файла: Имя | Фамилия | Телефон (1 столбец)',
        userManagement: 'Управление пользователями',
        addUser: 'Добавить пользователя',
        systemSettings: 'Настройки системы',
        schoolName: 'Название школы',
        academicYear: 'Учебный год',
        save: 'Сохранить',
        classInfo: 'Информация о классе',
        fullName: 'Полное имя',
        className: 'Название класса',
        classTeacher: 'Классный руководитель'
    },
    uz: {
        title: '14-maktab CRM',
        subtitle: 'Davomatni nazorat tizimi',
        email: 'Elektron pochta',
        password: 'Parol',
        role: 'Rol',
        teacher: 'Ustoz',
        admin: 'Administrator',
        director: 'Direktor',
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
        recentActivity: 'So\'nggi faoliyat',
        markAttendance: 'Davomatni belgilash',
        selectClass: 'Sinflarni tanlang',
        refresh: 'Yangilash',
        saveAttendance: 'Davomatni saqlash',
        classList: 'Sinflar ro\'yxati',
        addClass: 'Sinflar qo\'shish',
        attendanceReports: 'Davomat hisobotlari',
        fromDate: 'Dan',
        toDate: 'Gacha',
        generateReport: 'Hisobot yaratish',
        importStudents: 'O\'quvchilarni import qilish',
        selectFile: 'Excel faylni tanlang',
        importFormat: 'Excel fayl formati: Ism | Familiya | Telefon (1-ustun)',
        userManagement: 'Foydalanuvchilarni boshqarish',
        addUser: 'Foydalanuvchi qo\'shish',
        systemSettings: 'Tizim sozlamalari',
        schoolName: 'Maktab nomi',
        academicYear: 'O\'quv yili',
        save: 'Saqlash',
        classInfo: 'Sinflar ma\'lumotlari',
        fullName: 'To\'liq ismi',
        className: 'Sinflar nomi',
        classTeacher: 'Sinflar rahbari'
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Check authentication state
    auth.onAuthStateChanged(function (user) {
        if (user) {
            currentUser = user;
            showDashboard();
        } else {
            showLogin();
        }
    });

    // Setup event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromDate').value = today;
    document.getElementById('toDate').value = today;
}

// Language functions
function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    updateLanguage();
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
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
    // Mock user data for demonstration
    const mockUsers = [
        { email: 'admin@school14.uz', password: 'admin123', role: 'admin', name: 'Администратор' },
        { email: 'teacher@school14.uz', password: 'teacher123', role: 'teacher', name: 'Учитель' },
        { email: 'director@school14.uz', password: 'director123', role: 'director', name: 'Директор' }
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
        currentUser = {
            uid: 'mock_' + Date.now(),
            email: user.email,
            role: user.role,
            name: user.name
        };
        showDashboard();
        showToast('Успешный вход!', 'success');
    } else {
        showToast('Неверные данные для входа', 'danger');
    }
}

function logout() {
    currentUser = null;
    showLogin();
    showToast('Вы вышли из системы', 'info');
}

// Page navigation functions
function showLogin() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('dashboardPage').classList.remove('active');
}

function showDashboard() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');

    // Show admin link only for admin users
    if (currentUser && currentUser.role === 'admin') {
        document.getElementById('adminLink').style.display = 'block';
    }

    // Load initial data
    loadDashboardData();
    loadClasses();
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
    // Mock data for demonstration
    document.getElementById('totalStudents').textContent = '245';
    document.getElementById('presentToday').textContent = '232';
    document.getElementById('absentToday').textContent = '13';
    document.getElementById('attendanceRate').textContent = '94.7%';

    // Load recent activity
    loadRecentActivity();
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
    const classId = document.getElementById('classSelect').value;

    if (!classId) {
        showToast('Выберите класс', 'warning');
        return;
    }

    // Mock students data
    const mockStudents = [
        { id: '1', name: 'Абдуллаев Али', class: '5-А' },
        { id: '2', name: 'Ахмедова Барно', class: '5-А' },
        { id: '3', name: 'Бобоев Карим', class: '5-А' },
        { id: '4', name: 'Валиева Дилора', class: '5-А' },
        { id: '5', name: 'Ганиев Элдор', class: '5-А' },
        { id: '6', name: 'Джураева Зухра', class: '5-А' },
        { id: '7', name: 'Ермаков Илья', class: '5-А' },
        { id: '8', name: 'Жураева Камола', class: '5-А' },
        { id: '9', name: 'Каримов Лазиз', class: '5-А' },
        { id: '10', name: 'Латипова Мухаббат', class: '5-А' }
    ];

    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    mockStudents.forEach(student => {
        const studentHtml = `
            <div class="student-item">
                <div class="student-info">
                    <div class="student-avatar">${student.name.charAt(0)}</div>
                    <div class="student-details">
                        <div class="student-name">${student.name}</div>
                        <div class="student-class">${student.class}</div>
                    </div>
                </div>
                <div class="attendance-checkbox">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${student.id}" id="student_${student.id}">
                        <label class="form-check-label" for="student_${student.id}">
                            Присутствует
                        </label>
                    </div>
                </div>
            </div>
        `;
        studentsList.innerHTML += studentHtml;
    });
}

function saveAttendance() {
    const checkboxes = document.querySelectorAll('#studentsList input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
        showToast('Выберите хотя бы одного ученика', 'warning');
        return;
    }

    // Show confirmation dialog
    if (confirm(`Отметить присутствие для ${checkboxes.length} учеников?`)) {
        // Mock save operation
        showToast('Посещаемость успешно сохранена!', 'success');

        // Add to recent activity
        const activity = {
            type: 'success',
            title: `${currentUser.name} отметил(а) посещаемость`,
            time: 'Только что'
        };
        addRecentActivity(activity);
    }
}

// Classes functions
function loadClasses() {
    // Mock classes data
    const mockClasses = [
        { id: '1', name: '1-А класс', teacher: 'Иванова А.А.', studentCount: 25, attendance: '96%' },
        { id: '2', name: '2-Б класс', teacher: 'Петров В.В.', studentCount: 23, attendance: '94%' },
        { id: '3', name: '3-В класс', teacher: 'Сидорова К.К.', studentCount: 27, attendance: '92%' },
        { id: '4', name: '4-Г класс', teacher: 'Козлов Д.Д.', studentCount: 22, attendance: '95%' },
        { id: '5', name: '5-А класс', teacher: 'Смирнова Е.Е.', studentCount: 26, attendance: '93%' }
    ];

    const classesList = document.getElementById('classesList');
    classesList.innerHTML = '';

    mockClasses.forEach(cls => {
        const classHtml = `
            <div class="class-item">
                <div class="class-header">
                    <div class="class-name">${cls.name}</div>
                    <div class="class-actions">
                        <button class="btn btn-sm btn-info" onclick="showClassInfo('${cls.id}')">
                            <i class="bi bi-info-circle"></i> Инфо
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="editClass('${cls.id}')">
                            <i class="bi bi-pencil"></i> Изменить
                        </button>
                    </div>
                </div>
                <div class="class-info">
                    <div class="info-item">
                        <i class="bi bi-person"></i>
                        <span class="info-label">Классный руководитель:</span>
                        <span class="info-value">${cls.teacher}</span>
                    </div>
                    <div class="info-item">
                        <i class="bi bi-people"></i>
                        <span class="info-label">Количество учеников:</span>
                        <span class="info-value">${cls.studentCount}</span>
                    </div>
                    <div class="info-item">
                        <i class="bi bi-graph-up"></i>
                        <span class="info-label">Посещаемость:</span>
                        <span class="info-value">${cls.attendance}</span>
                    </div>
                </div>
            </div>
        `;
        classesList.innerHTML += classHtml;
    });
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