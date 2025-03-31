import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const degreeProgramId = url.searchParams.get("degreeProgramId");

    let courses;

    if (degreeProgramId) {
      // Fetch courses for a specific degree program (Used in Add Student page)
      courses = await prisma.course.findMany({
        where: {
          degreeProgramId: parseInt(degreeProgramId),
        },
      });
    } else {
      // Fetch all courses (Used in View Courses page)
      courses = await prisma.course.findMany();
    }

    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching courses." }),
      { status: 500 }
    );
  }
}
