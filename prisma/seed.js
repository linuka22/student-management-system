const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.administrator.findUnique({
    where: { username: "admin" },
  });

  if (!existingAdmin) {
    await prisma.administrator.create({
      data: {
        username: "admin",
        password: "admin123", // Store plain text password
      },
    });
    console.log("Admin created successfully.");
  } else {
    console.log("Admin already exists. Skipping creation.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
