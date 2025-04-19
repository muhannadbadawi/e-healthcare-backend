src/
├── auth/  
│ ├── dto/
│ │ └── auth.dto.ts
│ ├── auth.controller.ts
│ ├── auth.service.ts
│ ├── auth.module.ts
│ ├── jwt.strategy.ts
│ ├── roles.guard.ts
│ └── roles.decorator.ts
│
├── users/  
│ ├── dto/
│ │ └── user.dto.ts
│ ├── user.schema.ts
│ ├── users.module.ts
│ ├── users.service.ts
│ ├── users.entity.ts
│ └── users.repository.ts
│
├── admin/  
│ ├── dto/
│ │ └── create-admin.dto.ts
│ ├── admin.controller.ts
│ ├── admin.service.ts
│ ├── admin.schema.ts
│ └── admin.module.ts
│
├── doctor/
│ ├── dto/
│ │ └── create-doctor.dto.ts  
│ ├── doctor.schema.ts
│ ├── doctor.controller.ts
│ ├── doctor.service.ts
│ └── doctor.module.ts
│
├── client/  
│ ├── dto/
│ │ └── create-client.dto.ts
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
