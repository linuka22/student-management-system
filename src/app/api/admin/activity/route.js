import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
    });

    return new Response(JSON.stringify(logs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch logs" }),
      { status: 500 }
    );
  }
}
