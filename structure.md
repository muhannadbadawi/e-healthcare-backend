src/
├── auth/  
│ ├── auth.controller.ts
│ ├── auth.service.ts
│ ├── auth.module.ts
│ ├── jwt.strategy.ts
│ ├── roles.guard.ts
│ └── roles.decorator.ts
│
├── users/  
│ ├── user.schema.ts
│ ├── users.module.ts
│ ├── users.service.ts
│ ├── users.entity.ts
│ └── users.repository.ts
│
├── admin/  
│ ├── admin.controller.ts
│ ├── admin.service.ts
│ └── admin.module.ts
│
├── doctor/  
│ ├── client.schema.ts
│ ├── doctor.controller.ts
│ ├── doctor.service.ts
│ └── doctor.module.ts
│
├── client/  
│ ├── client.schema.ts
│ ├── client.controller.ts
│ ├── client.service.ts
│ └── client.module.ts
│
├── common/  
│ ├── decorators/
│ │ └── roles.decorator.ts
│ ├── guards/
│ │ └── roles.guard.ts
│ └── constants.ts
│
├── app.module.ts
└── main.ts
