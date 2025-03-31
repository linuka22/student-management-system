import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const totalStudents = await prisma.student.count(); // Get the total count of students
    return new Response(JSON.stringify({ total: totalStudents }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching total students." }), { status: 500 });
  }
}
