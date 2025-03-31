import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const totalDegreePrograms = await prisma.degreeProgram.count(); // Get the total count of degree programs
    return new Response(JSON.stringify({ total: totalDegreePrograms }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching total degree programs." }), { status: 500 });
  }
}
