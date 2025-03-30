import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const admin = await prisma.administrator.findUnique({
      where: { username },
    });

    // Fix: Directly compare password (since they are not hashed)
    if (!admin || admin.password !== password) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Await cookies before setting session
    const cookieStore = await cookies();
    cookieStore.set("adminSession", admin.id, { httpOnly: true });

    // Log login activity in AuditLog
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "Logged in",
      },
    });

    return Response.json({ username: admin.username }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

