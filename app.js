const OWNER_EMAIL = "quvonch12290@gmail.com";

const firebaseConfig = {
  apiKey: "AIzaSyDvF0qDIv6W93D8yRpNusVO-7kUJM0cD6I",
  authDomain: "school-14-crm.firebaseapp.com",
  projectId: "school-14-crm",
  storageBucket: "school-14-crm.firebasestorage.app",
  messagingSenderId: "11516954370",
  appId: "1:11516954370:web:b85ce688ce69edeab4a41b",
  measurementId: "G-5P16WDYGFW"
};

const i18n = {
  ru: {
    appTitle: "School CRM",
    authSubtitle: "Вход для учителей и администрации через email-код",
    emailLabel: "Email",
    sendLink: "Отправить код-вход",
    tabDashboard: "Главная",
    tabClasses: "Классы",
    tabStudents: "Ученики",
    tabAttendance: "Посещаемость",
    tabReports: "Отчеты",
    tabSettings: "Настройки",
    tabAdmin: "Админ",
    metricStudents: "Ученики",
    metricClasses: "Классы",
    metricPresent: "Присутствуют сегодня",
    metricRate: "Посещаемость",
    attendanceChart: "График посещаемости",
    classManagement: "Управление классами",
    addClass: "Добавить класс",
    selectClass: "Выберите класс",
    importExcel: "Импорт из Excel",
    import: "Импорт",
    addStudent: "Добавить",
    fullName: "ФИО",
    phone: "Телефон",
    className: "Класс",
    actions: "Действия",
    date: "Дата",
    load: "Загрузить",
    saveAttendance: "Сохранить посещаемость",
    fromDate: "От",
    toDate: "До",
    generateReport: "Сформировать отчет",
    present: "Присутствуют",
    absent: "Отсутствуют",
    attendanceRate: "Процент",
    schoolName: "Название школы",
    academicYear: "Учебный год",
    save: "Сохранить",
    userManagement: "Управление пользователями",
    addUser: "Добавить",
    role: "Роль",
    roleTeacher: "Учитель",
    roleSchoolAdmin: "Администрация школы",
    roleSuperAdmin: "Супер админ",
    inviteHint: "Пользователь сможет войти по magic-link на указанный email.",
    classEditor: "Класс",
    classTeacher: "Классный руководитель",
    cancel: "Отмена",
    studentEditor: "Ученик",
    firstName: "Имя",
    lastName: "Фамилия",
    manageRole: "Роль пользователя",
    export: "Экспорт CSV",
    print: "Печать",
    logout: "Выйти"
  },
  uz: {
    appTitle: "School CRM",
    authSubtitle: "O'qituvchi va ma'muriyat uchun email-kod orqali kirish",
    emailLabel: "Email",
    sendLink: "Kirish kodini yuborish",
    tabDashboard: "Bosh sahifa",
    tabClasses: "Sinflar",
    tabStudents: "O'quvchilar",
    tabAttendance: "Davomat",
    tabReports: "Hisobotlar",
    tabSettings: "Sozlamalar",
    tabAdmin: "Admin",
    metricStudents: "O'quvchilar",
    metricClasses: "Sinflar",
    metricPresent: "Bugun kelganlar",
    metricRate: "Davomat",
    attendanceChart: "Davomat grafigi",
    classManagement: "Sinflarni boshqarish",
    addClass: "Sinf qo'shish",
    selectClass: "Sinfni tanlang",
    importExcel: "Excel import",
    import: "Import",
    addStudent: "Qo'shish",
    fullName: "F.I.Sh.",
    phone: "Telefon",
    className: "Sinf",
    actions: "Amallar",
    date: "Sana",
    load: "Yuklash",
    saveAttendance: "Davomatni saqlash",
    fromDate: "Dan",
    toDate: "Gacha",
    generateReport: "Hisobot yaratish",
    present: "Kelgan",
    absent: "Kelmagan",
    attendanceRate: "Foiz",
    schoolName: "Maktab nomi",
    academicYear: "O'quv yili",
    save: "Saqlash",
    userManagement: "Foydalanuvchilar",
    addUser: "Qo'shish",
    role: "Rol",
    roleTeacher: "O'qituvchi",
    roleSchoolAdmin: "Maktab ma'muriyati",
    roleSuperAdmin: "Super admin",
    inviteHint: "Foydalanuvchi ko'rsatilgan email orqali kiradi.",
    classEditor: "Sinf",
    classTeacher: "Sinf rahbari",
    cancel: "Bekor qilish",
    studentEditor: "O'quvchi",
    firstName: "Ism",
    lastName: "Familiya",
    manageRole: "Foydalanuvchi roli",
    export: "CSV eksport",
    print: "Chop etish",
    logout: "Chiqish"
  }
};

const appState = {
  language: localStorage.getItem("preferredLanguage") || "ru",
  user: null,
  profile: null,
  classes: [],
  students: [],
  users: [],
  reportRows: [],
  chart: null
};

let auth;
let db;
let classModal;
let studentModal;
let userRoleModal;

const COLLECTIONS = {
  users: "users",
  usersByEmail: "usersByEmail",
  classes: "classes",
  students: "students",
  attendance: "attendance",
  settings: "settings"
};

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  initFirebase();
  initUiBindings();
  applyTranslations();
  tryCompleteMagicLinkSignIn();
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      appState.user = null;
      appState.profile = null;
      showAuthScreen();
      return;
    }
    appState.user = user;
    appState.profile = await ensureUserProfile(user);
    showDashboardScreen();
    await bootstrapData();
  });
}

function initFirebase() {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
}

function initUiBindings() {
  classModal = new bootstrap.Modal(document.getElementById("classModal"));
  studentModal = new bootstrap.Modal(document.getElementById("studentModal"));
  userRoleModal = new bootstrap.Modal(document.getElementById("userRoleModal"));

  document.getElementById("magicLinkForm").addEventListener("submit", handleSendMagicLink);
  document.getElementById("logoutBtn").addEventListener("click", () => auth.signOut());
  document.getElementById("openSidebarBtn").addEventListener("click", () => document.getElementById("sidebar").classList.add("open"));
  document.getElementById("closeSidebarBtn").addEventListener("click", () => document.getElementById("sidebar").classList.remove("open"));

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });

  document.querySelectorAll(".sidebar-link").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  document.getElementById("addClassBtn").addEventListener("click", () => openClassModal());
  document.getElementById("classForm").addEventListener("submit", saveClass);

  document.getElementById("addStudentBtn").addEventListener("click", () => openStudentModal());
  document.getElementById("studentForm").addEventListener("submit", saveStudent);
  document.getElementById("studentsClassFilter").addEventListener("change", renderStudentsTable);
  document.getElementById("importExcelBtn").addEventListener("click", importStudentsFromExcel);

  document.getElementById("loadAttendanceBtn").addEventListener("click", loadAttendanceSheet);
  document.getElementById("saveAttendanceBtn").addEventListener("click", saveAttendanceSheet);

  document.getElementById("generateReportBtn").addEventListener("click", generateReport);
  document.getElementById("exportReportBtn").addEventListener("click", exportReportCsv);
  document.getElementById("printReportBtn").addEventListener("click", () => window.print());

  document.getElementById("saveSettingsBtn").addEventListener("click", saveSettings);
  document.getElementById("addUserBtn").addEventListener("click", () => openUserRoleModal());
  document.getElementById("userRoleForm").addEventListener("submit", saveUserRole);
}

async function handleSendMagicLink(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  if (!email) return;
  const settings = { url: window.location.origin + window.location.pathname, handleCodeInApp: true };
  await auth.sendSignInLinkToEmail(email, settings);
  localStorage.setItem("emailForSignIn", email);
  toast("Код-вход отправлен на email.");
}

async function tryCompleteMagicLinkSignIn() {
  if (!auth.isSignInWithEmailLink(window.location.href)) return;
  let email = localStorage.getItem("emailForSignIn");
  if (!email) email = window.prompt("Введите email для подтверждения входа:");
  if (!email) return;
  await auth.signInWithEmailLink(email, window.location.href);
  localStorage.removeItem("emailForSignIn");
  window.history.replaceState({}, document.title, window.location.pathname);
}

async function ensureUserProfile(user) {
  const email = (user.email || "").toLowerCase();
  const userRef = db.collection(COLLECTIONS.users).doc(user.uid);
  const userDoc = await userRef.get();
  const invitedRef = db.collection(COLLECTIONS.usersByEmail).doc(encodeEmailKey(email));
  const invitedDoc = await invitedRef.get();

  const invitedRole = invitedDoc.exists ? invitedDoc.data().role : null;
  const role = email === OWNER_EMAIL ? "super_admin" : invitedRole || (userDoc.exists ? userDoc.data().role : "teacher");
  const displayName = user.displayName || email.split("@")[0];

  const payload = {
    uid: user.uid,
    email,
    displayName,
    role,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (!userDoc.exists) payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  await userRef.set(payload, { merge: true });
  await invitedRef.set({ email, role, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return payload;
}

async function bootstrapData() {
  syncUserBanner();
  applyRoleUi();
  await Promise.all([loadSettings(), loadClasses(), loadStudents(), loadUsers()]);
  await loadDashboard();
  activateTab("dashboard");
}

function showAuthScreen() {
  document.getElementById("authScreen").classList.remove("d-none");
  document.getElementById("dashboardScreen").classList.add("d-none");
}

function showDashboardScreen() {
  document.getElementById("authScreen").classList.add("d-none");
  document.getElementById("dashboardScreen").classList.remove("d-none");
}

function syncUserBanner() {
  document.getElementById("currentUserName").textContent = appState.profile?.displayName || "User";
  document.getElementById("currentUserEmail").textContent = appState.user?.email || "";
  document.getElementById("userRoleBadge").textContent = roleName(appState.profile?.role);
}

function applyRoleUi() {
  const isAdmin = ["school_admin", "super_admin"].includes(appState.profile?.role);
  const isOwner = appState.profile?.role === "super_admin";
  document.getElementById("adminTabButton").classList.toggle("d-none", !isAdmin);
  document.getElementById("addClassBtn").disabled = !isAdmin;
  document.getElementById("addStudentBtn").disabled = !isAdmin;
  document.getElementById("addUserBtn").disabled = !isOwner;
}

async function loadClasses() {
  const snap = await db.collection(COLLECTIONS.classes).orderBy("name").get();
  appState.classes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderClasses();
  bindClassOptions();
}

function renderClasses() {
  const grid = document.getElementById("classesGrid");
  if (!appState.classes.length) {
    grid.innerHTML = `<div class="col-12"><div class="alert alert-light border">Нет классов.</div></div>`;
    return;
  }
  grid.innerHTML = appState.classes.map((cls) => `
    <div class="col-md-6 col-xl-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body">
          <h5 class="mb-1">${escapeHtml(cls.name || "")}</h5>
          <p class="text-muted mb-3">${escapeHtml(cls.teacher || "-")}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary" onclick="window.openClassModal('${cls.id}')"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.removeClass('${cls.id}')"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function bindClassOptions() {
  const options = `<option value="">-</option>` + appState.classes.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  ["studentsClassFilter", "attendanceClassSelect", "reportClassFilter", "studentClassInput"].forEach((id) => {
    const select = document.getElementById(id);
    if (select) select.innerHTML = options;
  });
}

function openClassModal(classId = "") {
  if (!canManageData()) return toast("Недостаточно прав.");
  const cls = appState.classes.find((c) => c.id === classId);
  document.getElementById("classIdInput").value = cls?.id || "";
  document.getElementById("classNameInput").value = cls?.name || "";
  document.getElementById("classTeacherInput").value = cls?.teacher || "";
  classModal.show();
}

async function saveClass(event) {
  event.preventDefault();
  if (!canManageData()) return toast("Недостаточно прав.");
  const id = document.getElementById("classIdInput").value;
  const payload = {
    name: document.getElementById("classNameInput").value.trim(),
    teacher: document.getElementById("classTeacherInput").value.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (!payload.name) return;
  if (id) await db.collection(COLLECTIONS.classes).doc(id).set(payload, { merge: true });
  else await db.collection(COLLECTIONS.classes).add({ ...payload, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  classModal.hide();
  await loadClasses();
  toast("Класс сохранен.");
}

async function removeClass(classId) {
  if (!canManageData()) return toast("Недостаточно прав.");
  if (!window.confirm("Удалить класс?")) return;
  await db.collection(COLLECTIONS.classes).doc(classId).delete();
  await loadClasses();
  await loadStudents();
  toast("Класс удален.");
}

async function loadStudents() {
  const snap = await db.collection(COLLECTIONS.students).orderBy("lastName").get();
  appState.students = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderStudentsTable();
}

function renderStudentsTable() {
  const body = document.getElementById("studentsTableBody");
  const classId = document.getElementById("studentsClassFilter").value;
  const rows = appState.students.filter((s) => !classId || s.classId === classId);
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Нет учеников</td></tr>`;
    return;
  }
  body.innerHTML = rows.map((s) => `
    <tr>
      <td>${escapeHtml(`${s.lastName || ""} ${s.firstName || ""}`.trim())}</td>
      <td>${escapeHtml(s.phone || "-")}</td>
      <td>${escapeHtml(classNameById(s.classId))}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" onclick="window.openStudentModal('${s.id}')"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="window.removeStudent('${s.id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join("");
}

function openStudentModal(studentId = "") {
  if (!canManageData()) return toast("Недостаточно прав.");
  const s = appState.students.find((x) => x.id === studentId);
  document.getElementById("studentIdInput").value = s?.id || "";
  document.getElementById("studentFirstNameInput").value = s?.firstName || "";
  document.getElementById("studentLastNameInput").value = s?.lastName || "";
  document.getElementById("studentPhoneInput").value = s?.phone || "";
  document.getElementById("studentClassInput").value = s?.classId || "";
  studentModal.show();
}

async function saveStudent(event) {
  event.preventDefault();
  if (!canManageData()) return toast("Недостаточно прав.");
  const id = document.getElementById("studentIdInput").value;
  const payload = {
    firstName: document.getElementById("studentFirstNameInput").value.trim(),
    lastName: document.getElementById("studentLastNameInput").value.trim(),
    phone: document.getElementById("studentPhoneInput").value.trim(),
    classId: document.getElementById("studentClassInput").value,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (!payload.firstName || !payload.lastName || !payload.classId) return;
  if (id) await db.collection(COLLECTIONS.students).doc(id).set(payload, { merge: true });
  else await db.collection(COLLECTIONS.students).add({ ...payload, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  studentModal.hide();
  await loadStudents();
  toast("Ученик сохранен.");
}

async function removeStudent(studentId) {
  if (!canManageData()) return toast("Недостаточно прав.");
  if (!window.confirm("Удалить ученика?")) return;
  await db.collection(COLLECTIONS.students).doc(studentId).delete();
  await loadStudents();
  toast("Ученик удален.");
}

async function loadAttendanceSheet() {
  const classId = document.getElementById("attendanceClassSelect").value;
  const date = document.getElementById("attendanceDate").value;
  const container = document.getElementById("attendanceList");
  if (!classId || !date) {
    container.innerHTML = `<div class="alert alert-light border">Выберите класс и дату.</div>`;
    return;
  }

  const classStudents = appState.students.filter((s) => s.classId === classId);
  const attendanceSnap = await db.collection(COLLECTIONS.attendance)
    .where("classId", "==", classId)
    .where("date", "==", date)
    .get();
  const attendanceMap = new Map(attendanceSnap.docs.map((d) => [d.data().studentId, d.data()]));

  container.innerHTML = classStudents.map((s) => {
    const rec = attendanceMap.get(s.id) || { present: true, reason: "" };
    return `
      <div class="card border-0 shadow-sm attendance-item" data-student-id="${s.id}">
        <div class="card-body d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between">
          <div><strong>${escapeHtml(`${s.lastName} ${s.firstName}`)}</strong></div>
          <div class="d-flex gap-2">
            <select class="form-select attendance-status" style="min-width:170px">
              <option value="present" ${rec.present ? "selected" : ""}>Присутствует</option>
              <option value="absent" ${!rec.present ? "selected" : ""}>Отсутствует</option>
            </select>
            <input class="form-control attendance-reason" placeholder="Причина" value="${escapeHtml(rec.reason || "")}">
          </div>
        </div>
      </div>
    `;
  }).join("");
}

async function saveAttendanceSheet() {
  const classId = document.getElementById("attendanceClassSelect").value;
  const date = document.getElementById("attendanceDate").value;
  if (!classId || !date) return toast("Выберите класс и дату.");
  const items = document.querySelectorAll(".attendance-item");
  if (!items.length) return toast("Нет записей для сохранения.");

  const batch = db.batch();
  items.forEach((item) => {
    const studentId = item.dataset.studentId;
    const status = item.querySelector(".attendance-status").value;
    const reason = item.querySelector(".attendance-reason").value.trim();
    const id = `${date}_${classId}_${studentId}`;
    const ref = db.collection(COLLECTIONS.attendance).doc(id);
    batch.set(ref, {
      id,
      classId,
      studentId,
      date,
      present: status === "present",
      reason: status === "absent" ? reason : "",
      markedBy: appState.user.uid,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
  await batch.commit();
  toast("Посещаемость сохранена.");
  await loadDashboard();
}

async function loadDashboard() {
  document.getElementById("metricStudents").textContent = String(appState.students.length);
  document.getElementById("metricClasses").textContent = String(appState.classes.length);
  const today = new Date().toISOString().slice(0, 10);
  const todaySnap = await db.collection(COLLECTIONS.attendance).where("date", "==", today).get();
  let present = 0;
  let absent = 0;
  todaySnap.forEach((d) => (d.data().present ? present++ : absent++));
  const total = present + absent;
  document.getElementById("metricPresent").textContent = String(present);
  document.getElementById("metricRate").textContent = total ? `${((present / total) * 100).toFixed(1)}%` : "0%";
  renderAttendanceChart();
}

async function renderAttendanceChart() {
  const ctx = document.getElementById("attendanceChartCanvas");
  const end = new Date();
  const labels = [];
  const values = [];

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    labels.push(date.slice(5));
    const snap = await db.collection(COLLECTIONS.attendance).where("date", "==", date).get();
    let p = 0;
    let a = 0;
    snap.forEach((doc) => (doc.data().present ? p++ : a++));
    const rate = p + a ? (p / (p + a)) * 100 : 0;
    values.push(Number(rate.toFixed(1)));
  }

  if (appState.chart) appState.chart.destroy();
  appState.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Attendance %", data: values, borderColor: "#4f46e5", backgroundColor: "rgba(79,70,229,0.15)", tension: 0.35, fill: true }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

async function generateReport() {
  const fromDate = document.getElementById("reportFromDate").value;
  const toDate = document.getElementById("reportToDate").value;
  const classFilter = document.getElementById("reportClassFilter").value;
  if (!fromDate || !toDate) return toast("Укажите период.");

  const snap = await db.collection(COLLECTIONS.attendance).where("date", ">=", fromDate).where("date", "<=", toDate).get();
  const grouped = new Map();
  snap.forEach((doc) => {
    const row = doc.data();
    if (classFilter && row.classId !== classFilter) return;
    const key = `${row.date}_${row.classId}`;
    if (!grouped.has(key)) grouped.set(key, { date: row.date, classId: row.classId, present: 0, absent: 0 });
    const bucket = grouped.get(key);
    row.present ? bucket.present++ : bucket.absent++;
  });

  appState.reportRows = [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date));
  const body = document.getElementById("reportTableBody");
  body.innerHTML = appState.reportRows.map((r) => {
    const total = r.present + r.absent;
    const rate = total ? ((r.present / total) * 100).toFixed(1) : "0.0";
    return `<tr><td>${r.date}</td><td>${escapeHtml(classNameById(r.classId))}</td><td>${r.present}</td><td>${r.absent}</td><td>${rate}%</td></tr>`;
  }).join("") || `<tr><td colspan="5" class="text-center text-muted py-4">Нет данных</td></tr>`;

  const totalPresent = appState.reportRows.reduce((sum, r) => sum + r.present, 0);
  const totalAbsent = appState.reportRows.reduce((sum, r) => sum + r.absent, 0);
  const total = totalPresent + totalAbsent;
  const avg = total ? ((totalPresent / total) * 100).toFixed(1) : "0.0";
  document.getElementById("reportSummary").innerHTML = `
    <div class="col-md-4"><div class="metric-card"><small>Присутствуют</small><h3>${totalPresent}</h3></div></div>
    <div class="col-md-4"><div class="metric-card"><small>Отсутствуют</small><h3>${totalAbsent}</h3></div></div>
    <div class="col-md-4"><div class="metric-card"><small>Средний процент</small><h3>${avg}%</h3></div></div>
  `;
}

function exportReportCsv() {
  if (!appState.reportRows.length) return toast("Сначала сформируйте отчет.");
  const lines = ["date,class,present,absent,rate"];
  appState.reportRows.forEach((r) => {
    const total = r.present + r.absent;
    const rate = total ? ((r.present / total) * 100).toFixed(1) : "0.0";
    lines.push(`${r.date},"${classNameById(r.classId)}",${r.present},${r.absent},${rate}`);
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "attendance-report.csv";
  link.click();
}

async function loadUsers() {
  if (appState.profile?.role !== "super_admin") return;
  const snap = await db.collection(COLLECTIONS.usersByEmail).get();
  appState.users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderUsers();
}

function renderUsers() {
  const body = document.getElementById("usersTableBody");
  body.innerHTML = appState.users.map((u) => `
    <tr>
      <td>${escapeHtml((u.email || "").split("@")[0])}</td>
      <td>${escapeHtml(u.email || "")}</td>
      <td>${roleName(u.role)}</td>
      <td class="text-end"><button class="btn btn-sm btn-outline-primary" onclick="window.openUserRoleModal('${u.id}')"><i class="bi bi-pencil"></i></button></td>
    </tr>
  `).join("");
}

function openUserRoleModal(key = "") {
  if (appState.profile?.role !== "super_admin") return toast("Только владелец может менять роли.");
  const user = appState.users.find((u) => u.id === key);
  document.getElementById("userRoleUidInput").value = user?.id || "";
  document.getElementById("userRoleEmailInput").value = user?.email || "";
  document.getElementById("userRoleSelect").value = user?.role || "teacher";
  userRoleModal.show();
}

async function saveUserRole(event) {
  event.preventDefault();
  if (appState.profile?.role !== "super_admin") return;
  const email = document.getElementById("userRoleEmailInput").value.trim().toLowerCase();
  const role = document.getElementById("userRoleSelect").value;
  if (!email) return;
  const key = encodeEmailKey(email);
  await db.collection(COLLECTIONS.usersByEmail).doc(key).set({ email, role, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
  userRoleModal.hide();
  await loadUsers();
  toast("Роль обновлена.");
}

async function loadSettings() {
  const doc = await db.collection(COLLECTIONS.settings).doc("main").get();
  const data = doc.exists ? doc.data() : { schoolName: "14-maktab", academicYear: "2026-2027" };
  document.getElementById("schoolNameInput").value = data.schoolName || "";
  document.getElementById("academicYearInput").value = data.academicYear || "";
}

async function saveSettings() {
  if (!canManageData()) return toast("Недостаточно прав.");
  await db.collection(COLLECTIONS.settings).doc("main").set({
    schoolName: document.getElementById("schoolNameInput").value.trim(),
    academicYear: document.getElementById("academicYearInput").value.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  toast("Настройки сохранены.");
}

async function importStudentsFromExcel() {
  if (!canManageData()) return toast("Недостаточно прав.");
  const file = document.getElementById("excelFileInput").files[0];
  const classId = document.getElementById("studentsClassFilter").value;
  if (!file || !classId) return toast("Выберите класс и Excel файл.");
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).filter((r) => Array.isArray(r) && r.length > 0);
  if (rows.length < 2) return toast("Файл пуст.");

  let added = 0;
  let skipped = 0;
  const batch = db.batch();
  const existing = new Set(appState.students.filter((s) => s.classId === classId).map((s) => `${s.lastName}|${s.firstName}`.toLowerCase()));
  rows.slice(1).forEach((row) => {
    const firstName = String(row[0] || "").trim();
    const lastName = String(row[1] || "").trim();
    const phone = String(row[2] || "").trim();
    if (!firstName || !lastName) return;
    const key = `${lastName}|${firstName}`.toLowerCase();
    if (existing.has(key)) {
      skipped += 1;
      return;
    }
    const ref = db.collection(COLLECTIONS.students).doc();
    batch.set(ref, { firstName, lastName, phone, classId, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    existing.add(key);
    added += 1;
  });
  await batch.commit();
  await loadStudents();
  toast(`Импорт завершен: добавлено ${added}, пропущено ${skipped}.`);
}

function activateTab(tab) {
  const titles = {
    dashboard: ["Dashboard", "Overview"],
    classes: ["Classes", "Manage school classes"],
    students: ["Students", "Registry and Excel import"],
    attendance: ["Attendance", "Daily attendance sheet"],
    reports: ["Reports", "Analytics and export"],
    settings: ["Settings", "System preferences"],
    admin: ["Admin", "User role management"]
  };
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
  document.getElementById(`tab-${tab}`)?.classList.add("active");
  document.querySelectorAll(".sidebar-link").forEach((l) => l.classList.toggle("active", l.dataset.tab === tab));
  document.getElementById("pageTitle").textContent = titles[tab]?.[0] || "Dashboard";
  document.getElementById("pageSubtitle").textContent = titles[tab]?.[1] || "";
  document.getElementById("sidebar").classList.remove("open");
}

function setLanguage(lang) {
  appState.language = lang;
  localStorage.setItem("preferredLanguage", lang);
  document.querySelectorAll(".lang-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));
  applyTranslations();
}

function applyTranslations() {
  const dict = i18n[appState.language] || i18n.ru;
  document.documentElement.lang = appState.language;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
}

function canManageData() {
  return ["school_admin", "super_admin"].includes(appState.profile?.role);
}

function roleName(role) {
  const dict = {
    teacher: i18n[appState.language].roleTeacher,
    school_admin: i18n[appState.language].roleSchoolAdmin,
    super_admin: i18n[appState.language].roleSuperAdmin
  };
  return dict[role] || role || "teacher";
}

function classNameById(classId) {
  return appState.classes.find((c) => c.id === classId)?.name || "-";
}

function encodeEmailKey(email) {
  return encodeURIComponent(email.toLowerCase());
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message) {
  const el = document.getElementById("appToast");
  document.getElementById("appToastMessage").textContent = message;
  bootstrap.Toast.getOrCreateInstance(el).show();
}

window.openClassModal = openClassModal;
window.removeClass = removeClass;
window.openStudentModal = openStudentModal;
window.removeStudent = removeStudent;
window.openUserRoleModal = openUserRoleModal;
