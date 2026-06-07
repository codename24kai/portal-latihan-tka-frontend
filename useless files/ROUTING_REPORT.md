# Routing Report

Generated on 2026-06-01.

## Public Routes
| Path | Component | Allowed Roles |
|------|-----------|---------------|
| `/login` | `Login` | *None* |
| `/forgot-password` | `LupaPassword` | *None* |

## Student Routes (requires **student** role)
| Path | Component | Allowed Roles |
|------|-----------|---------------|
| `/` | `StudentDashboard` | `student` |
| `/ujian` | `StudentTest` | `student` |
| `/modul` | `StudentModul` | `student` |
| `/pengaturan` | `StudentSetting` | `student` |
| `/notifikasi` | `NotifikasiHalaman` | `student` |

## Exam & Quiz Routes (no layout, **student** role)
| Path | Component | Allowed Roles |
|------|-----------|---------------|
| `/modules/quiz/:moduleId` | `ModuleQuiz` | `student` |
| `/exam/:examId/prepare` | `PreSimulation` | `student` |
| `/exam/:examId` | `ExamExecution` | `student` |
| `/exam/:examId/result` | `ExamResult` | `student` |

## Survey Routes (no layout, **student** role)
| Path | Component | Allowed Roles |
|------|-----------|---------------|
| `/survey/:surveyId` | `SurveyExecution` | `student` |
| `/survey/:surveyId/complete` | `SurveyComplete` | `student` |

## Teacher (Guru) Routes (requires **guru** role)
| Path | Component | Allowed Roles |
|------|-----------|---------------|
| `/guru` | `GuruDashboard` (layout: `GuruLayout`) | `guru` |
| `/guru/agenda` | `GuruAgendaKelas` | `guru` |
| `/guru/students` | `GuruStudentList` | `guru` |
| `/guru/reports` | `GuruScoreReports` | `guru` |
| `/guru/modules` | `GuruManageModules` | `guru` |
| `/guru/modules/add` | `GuruAddModule` | `guru` |
| `/guru/modules/edit/:id` | `GuruAddModule` | `guru` |
| `/guru/quizzes` | `GuruManageQuizzes` | `guru` |
| `/guru/quizzes/add` | `GuruAddQuiz` | `guru` |
| `/guru/quizzes/edit/:id` | `GuruAddQuiz` | `guru` |
| `/guru/reports/survey` | `SurveyReports` | `guru` |

## Administrator Routes (requires **admin** role)
| Path | Component | Allowed Roles |
|------|-----------|---------------|
| `/admin` | `AdminDashboard` (layout: `AdminLayout`) | `admin` |
| `/admin/users` | `UserManagement` | `admin` |
| `/admin/users/add` | `AddUser` | `admin` |
| `/admin/users/edit/:id` | `AddUser` | `admin` |
| `/admin/question-bank` | `QuestionBank` | `admin` |
| `/admin/question-bank/add` | `AddQuestion` | `admin` |
| `/admin/question-bank/edit/:id` | `AddQuestion` | `admin` |
| `/admin/tryout` | `TryoutManagement` | `admin` |
| `/admin/tryout/add` | `AddTryout` | `admin` |
| `/admin/tryout/edit/:id` | `AddTryout` | `admin` |
| `/admin/reports` | `ScoreReports` | `admin` |
| `/admin/reports/survey` | `AdminSurveyReports` | `admin` |
| `/admin/modules` | `ModuleManagement` | `admin` |
| `/admin/modules/add` | `AddModule` | `admin` |
| `/admin/modules/edit/:id` | `AddModule` | `admin` |
| `/admin/reports/survey` | `AdminSurveyReports` | `admin` |

*Note*: Routes that are nested inside a layout inherit the layout component automatically.
