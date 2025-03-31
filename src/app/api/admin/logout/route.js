import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("adminSession");

    if (adminSession) {
      // Log logout activity
      await prisma.auditLog.create({
        data: {
          adminId: adminSession.value,
          action: "Logged out",
        },
      });

      // Clear session cookie
      cookieStore.set("adminSession", "", { expires: new Date(0) });
    }

    return Response.json({ message: "Logged out" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

