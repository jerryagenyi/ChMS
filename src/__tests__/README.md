src/__tests__/
├── integration/               # Integration tests
│   ├── attendance/           # Critical flow: Attendance
│   │   ├── check-in.test.ts
│   │   └── reports.test.ts
│   └── auth/                 # Critical flow: Authentication
│       └── login.test.ts
├── unit/
│   ├── components/           # Core components only
│   │   ├── AttendanceForm/
│   │   └── AuthForms/
│   └── services/            # Critical services
│       ├── attendance/
│       └── auth/
└── e2e/                     # Minimal E2E suite
    └── critical-paths/      # 3-4 most important user journeys