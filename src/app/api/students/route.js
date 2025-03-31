import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST for creating a new student
export async function POST(req) {
  try {
    const { firstName, lastName, address, dob, degreeProgramId, courses } = await req.json();

    if (!firstName || !lastName || !address || !dob || !degreeProgramId || !Array.isArray(courses)) {
      return new Response(JSON.stringify({ message: "All fields are required, and courses must be an array." }), { status: 400 });
    }

    const lastStudent = await prisma.student.findFirst({ orderBy: { id: "desc" } });

    let nextId = "0001"; // Default if no student exists
    if (lastStudent) {
      const newId = (parseInt(lastStudent.studentId) + 1).toString().padStart(4, "0");
      nextId = newId;
    }

    const newStudent = await prisma.student.create({
      data: {
        studentId: nextId,
        firstName,
        lastName,
        address,
        dob: new Date(dob),
        degreeProgramId: parseInt(degreeProgramId),
        enrolledCourses: {
          connect: courses.map((courseId) => ({ id: parseInt(courseId) })),
        },
      },
      include: {
        enrolledCourses: true,
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
        enrolledCourses: true,
      },
    });
    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return new Response(JSON.stringify({ message: "Error fetching students." }), { status: 500 });
  }
}

// Handle PUT for updating a student's enrolled courses
export async function PUT(req) {
  try {
    const { id, courses } = await req.json();

    if (!id || !Array.isArray(courses)) {
      return new Response(JSON.stringify({ message: "Invalid input data." }), { status: 400 });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        enrolledCourses: {
          set: courses.map((courseId) => ({ id: parseInt(courseId) })),
        },
      },
      include: {
        degreeProgram: true,
        enrolledCourses: true,
      },
    });

    return new Response(JSON.stringify({
      message: "Changes saved successfully!",
      studentId: updatedStudent.studentId,
      updatedStudent,
    }), { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return new Response(JSON.stringify({ message: "Error updating student." }), { status: 500 });
  }
}
