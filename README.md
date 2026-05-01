# School CRM (Reboot)

Modern school CRM with Firebase persistence, passwordless login via email magic-link, role-based access, Excel import, attendance, and reporting.

## Main features

- Passwordless authentication with Firebase Email Link
- Automatic owner role (`super_admin`) for `quvonch12290@gmail.com`
- Roles: `teacher`, `school_admin`, `super_admin`
- Persistent Firestore storage:
  - classes
  - students
  - attendance
  - settings
  - user role mapping
- Excel import (`.xlsx`, `.xls`) for students
- Attendance reporting with CSV export and print
- RU/UZ localization with instant switch
- Responsive modern Bootstrap UI

## Stack

- HTML + SCSS + Vanilla JS
- Bootstrap 5
- Firebase Auth + Firestore
- Chart.js
- SheetJS (XLSX)

## Local run

```bash
npm install
npm run build
npx serve .
```

Open the printed local URL and use the magic-link login form.

## Firebase setup

1. Create/choose Firebase project.
2. Enable **Authentication**:
   - Sign-in method: **Email link (passwordless sign-in)**
   - Add your domain(s) in Authorized domains (localhost + production domain)
3. Enable **Firestore** in production mode.
4. Replace firebase config in `app.js` if needed.

## Firestore data model

- `users/{uid}`
  - `uid`, `email`, `displayName`, `role`, timestamps
- `usersByEmail/{encodedEmail}`
  - `email`, `role`, timestamps
- `classes/{classId}`
  - `name`, `teacher`, timestamps
- `students/{studentId}`
  - `firstName`, `lastName`, `phone`, `classId`, timestamps
- `attendance/{date_class_student}`
  - `date`, `classId`, `studentId`, `present`, `reason`, `markedBy`, timestamps
- `settings/main`
  - `schoolName`, `academicYear`, timestamps

## Owner and roles

- Owner email: `quvonch12290@gmail.com`
- On first login, owner is automatically assigned `super_admin`.
- `super_admin` can manage role invitations in Admin tab.
- `school_admin` can manage classes/students/attendance/settings.
- `teacher` can work with attendance and reports (read-oriented flow).

## Deploy

This is a static app and can be deployed on Netlify/Vercel/GitHub Pages.

### Netlify

- Build command: `npm run build`
- Publish directory: `.`

## GitHub push (manual commands)

```bash
git add .
git commit -m "reboot school crm with firebase magic-link auth and persistent workflows"
git push -u origin HEAD
```

## Notes

- Email-link authentication requires users to open the link from the same browser/session for best UX.
- Firestore security rules should be configured in Firebase Console according to your policy before production go-live.
