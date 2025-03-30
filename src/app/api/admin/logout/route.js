import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const adminId = cookies().get("adminSession");

    if (!adminId) {
      return new Response(
        JSON.stringify({ error: "No active session" }),
        { status: 401 }
      );
    }

    // Remove session
    cookies().delete("adminSession");

    // Log logout activity
    await prisma.auditLog.create({
      data: {
        adminId: adminId.value,
        action: "Logged out",
      },
    });

    return new Response(
      JSON.stringify({ message: "Logout successful" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
