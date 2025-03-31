const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Insert Administrators
  await prisma.administrator.createMany({
    data: [
      { name: "John Doe", email: "john.doe@example.com", username: "admin_john", password: "$2b$10$abc123hashedpassword" },
      { name: "Jane Smith", email: "jane.smith@example.com", username: "admin_jane", password: "$2b$10$xyz789hashedpassword" }
    ]
  });

  // Insert Degree Programs
  const degreePrograms = await prisma.degreeProgram.createMany({
    data: [
      { name: "BSc in Computer Science" },
      { name: "BSc in Information Technology" },
      { name: "BSc in Law" },
      { name: "BSc in Business Administration" }
    ]
  });

  // Retrieve Degree Program IDs
  const degrees = await prisma.degreeProgram.findMany();

  // Create a mapping of degree names to their IDs
  const degreeMap = {};
  degrees.forEach(degree => {
    degreeMap[degree.name] = degree.id;
  });

  // Insert Courses
  await prisma.course.createMany({
    data: [
      { courseName: "Computer Architecture", credits: 3, degreeProgramId: degreeMap["BSc in Computer Science"] },
      { courseName: "Data Structures and Algorithms", credits: 3, degreeProgramId: degreeMap["BSc in Computer Science"] },
      { courseName: "Object-Oriented Programming", credits: 3, degreeProgramId: degreeMap["BSc in Computer Science"] },
      { courseName: "Database Management Systems", credits: 3, degreeProgramId: degreeMap["BSc in Information Technology"] },
      { courseName: "Cybersecurity Basics", credits: 3, degreeProgramId: degreeMap["BSc in Information Technology"] },
      { courseName: "Introduction to Law", credits: 3, degreeProgramId: degreeMap["BSc in Law"] },
      { courseName: "Legal Ethics", credits: 3, degreeProgramId: degreeMap["BSc in Law"] },
      { courseName: "Contract Law", credits: 3, degreeProgramId: degreeMap["BSc in Law"] },
      { courseName: "Business Accounting", credits: 3, degreeProgramId: degreeMap["BSc in Business Administration"] },
      { courseName: "Marketing Principles", credits: 3, degreeProgramId: degreeMap["BSc in Business Administration"] }
    ]
  });

  console.log("✅ Dummy data inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
