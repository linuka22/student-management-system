import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
    });

    return Response.json(logs);
  } catch (error) {
    return Response.json({ message: "Error fetching logs" }, { status: 500 });
  }
}
