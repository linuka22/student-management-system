import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST for creating a new student (Already in place)
export async function POST(req) {
  try {
    const { firstName, lastName, address, dob, degreeProgramId, courses } = await req.json();

    // Validate input
    if (!firstName || !lastName || !address || !dob || !degreeProgramId || !Array.isArray(courses)) {
      return new Response(JSON.stringify({ message: "All fields are required, and courses must be an array." }), { status: 400 });
    }

    // Get the latest student ID
    const lastStudent = await prisma.student.findFirst({
      orderBy: { id: "desc" },
    });

    // Generate the next student ID
    let nextId = "0001"; // Default if no student exists
    if (lastStudent) {
      const newId = (parseInt(lastStudent.studentId) + 1).toString().padStart(4, "0");
      nextId = newId;
    }

    // Create the student with enrolled courses
    const newStudent = await prisma.student.create({
      data: {
        studentId: nextId,
        firstName,
        lastName,
        address,
        dob: new Date(dob),
        degreeProgramId: parseInt(degreeProgramId),
        enrolledCourses: {
          connect: courses.map((courseId) => ({ id: parseInt(courseId) })), // 🔥 Connect selected courses
        },
      },
      include: {
        enrolledCourses: true, // Include courses in response
      },
    });

    return new Response(JSON.stringify(newStudent), { status: 201 });
  } catch (error) {
    console.error("Error adding student:", error);
    return new Response(JSON.stringify({ message: "Error adding student." }), { status: 500 });
  }
}

// Handle GET for fetching all students
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        degreeProgram: true,
        enrolledCourses: true, // Include courses the student is enrolled in
      },
    });
    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return new Response(JSON.stringify({ message: "Error fetching students." }), { status: 500 });
  }
}
