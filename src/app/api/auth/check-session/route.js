// src/app/api/admin/check-session/route.js
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Get the adminSession cookie
    const cookieStore = cookies();
    const adminSession = cookieStore.get("adminSession");

    if (!adminSession) {
      return new Response(
        JSON.stringify({ isAuthenticated: false }),
        { status: 200 }
      );
    }

    // Check if the session is valid by verifying the adminId in the session
    const admin = await prisma.administrator.findUnique({
      where: { id: adminSession.value },
    });

    if (!admin) {
      return new Response(
        JSON.stringify({ isAuthenticated: false }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ isAuthenticated: true, username: admin.username }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
