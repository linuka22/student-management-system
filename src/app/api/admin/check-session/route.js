import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ⬅️ Await cookies()
    const adminSession = cookieStore.get("adminSession")?.value || null; // Ensure we get the value

    console.log("Admin Session in API:", adminSession);

    return new Response(JSON.stringify({ isLoggedIn: !!adminSession }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error checking admin session:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
