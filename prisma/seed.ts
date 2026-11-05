import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Add it to your .env file before running the seed script.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

// async function seedRBAC() {
//   const permissionDefs = [
//     {
//       name: 'entries:create',
//       resource: 'work-entries',
//       action: 'create',
//       description: 'Create work entries',
//     },
//     {
//       name: 'entries:read',
//       resource: 'work-entries',
//       action: 'read',
//       description: 'View work entries',
//     },
//     {
//       name: 'entries:update',
//       resource: 'work-entries',
//       action: 'update',
//       description: 'Edit work entry details',
//     },
//     {
//       name: 'entries:delete',
//       resource: 'work-entries',
//       action: 'delete',
//       description: 'Delete work entries',
//     },
//     {
//       name: 'analysis:create',
//       resource: 'analysis',
//       action: 'create',
//       description: 'Create analysis',
//     },
//     {
//       name: 'analysis:read',
//       resource: 'analysis',
//       action: 'read',
//       description: 'View analyzed entries',
//     },
//     {
//       name: 'users:read',
//       resource: 'users',
//       action: 'read',
//       description: 'View user list',
//     },
//     {
//       name: 'users:manage',
//       resource: 'users',
//       action: 'manage',
//       description: 'Manage user accounts',
//     },
//     {
//       name: 'roles:manage',
//       resource: 'roles',
//       action: 'manage',
//       description: 'Manage roles and permissions',
//     },
//   ];

//   const permissions: Record<string, { id: string }> = {};

//   for (const perm of permissionDefs) {
//     const record = await prisma.permission.upsert({
//       where: { name: perm.name },
//       update: {
//         description: perm.description,
//         resource: perm.resource,
//         action: perm.action,
//       },
//       create: perm,
//     });

//     permissions[perm.name] = { id: record.id };
//   }

//   const roleDefs = [
//     {
//       name: 'admin',
//       description: 'Full system access',
//       isDefault: false,
//       permissions: Object.keys(permissions),
//     },
//     {
//       name: 'member',
//       description: 'Standard user',
//       isDefault: true,
//       permissions: [
//         'entries:create',
//         'entries:read',
//         'entries:update',
//         'analysis:create',
//         'analysis:read',
//       ],
//     },
//     {
//       name: 'viewer',
//       description: 'Read-only access',
//       isDefault: false,
//       permissions: ['entries:read', 'analysis:read'],
//     },
//   ];

//   for (const roleDef of roleDefs) {
//     const role = await prisma.role.upsert({
//       where: { name: roleDef.name },
//       update: {
//         description: roleDef.description,
//         isDefault: roleDef.isDefault,
//       },
//       create: {
//         name: roleDef.name,
//         description: roleDef.description,
//         isDefault: roleDef.isDefault,
//       },
//     });

//     for (const permName of roleDef.permissions) {
//       const permissionId = permissions[permName]?.id;

//       if (!permissionId) {
//         throw new Error(`Permission not found: ${permName}`);
//       }

//       await prisma.rolePermission.upsert({
//         where: {
//           roleId_permissionId: {
//             roleId: role.id,
//             permissionId,
//           },
//         },
//         update: {},
//         create: {
//           roleId: role.id,
//           permissionId,
//         },
//       });
//     }
//   }

//   console.log('RBAC seeded: 3 roles, 9 permissions');
// }

// async function main() {
//   try {
//     await seedRBAC();
//   } catch (error) {
//     console.error('Failed to seed RBAC data:', error);
//     process.exitCode = 1;
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();



// const defaultRole = await prisma.role.findFirst({
//   where: { isDefault: true },
// });

// if (!defaultRole) {
//   throw new Error('Default role not found');
// }

// const users = await prisma.user.findMany({
//   where: {
//     roles: {
//       none: {},
//     },
//     deletedAt: null,
//   },
//   select: {
//     id: true,
//   },
// });

// await prisma.userRole.createMany({
//   data: users.map((user) => ({
//     userId: user.id,
//     roleId: defaultRole.id,
//   })),
//   skipDuplicates: true,
// });


await prisma.$transaction([
  prisma.achievement.deleteMany(),
  prisma.analysisSession.deleteMany(),
  prisma.workEntry.deleteMany(),
  prisma.usageLog.deleteMany(),
  prisma.refreshToken.deleteMany(),
  prisma.userRole.deleteMany(),
  prisma.user.deleteMany()
]);