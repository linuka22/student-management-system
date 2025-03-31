import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const degreePrograms = await prisma.degreeProgram.findMany();
    return new Response(JSON.stringify(degreePrograms), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching degree programs." }), { status: 500 });
  }
}
