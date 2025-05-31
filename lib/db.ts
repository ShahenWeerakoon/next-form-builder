// import { PrismaClient } from "./generated/prisma";


// const prismaClientSingleton = () => {
//   return new PrismaClient()
// }
// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;
// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// export default prisma
// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

import { PrismaClient } from "./generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a new PrismaClient if one doesn't exist
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, cache the PrismaClient on globalThis
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export the Prisma client for use in your app
export default prisma;
