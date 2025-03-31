import { cookies } from "next/headers"; // Import server-side session handling

export async function GET() {
  try {
    const cookieStore = cookies(); // Access cookies in the server context
    const adminSession = cookieStore.get("adminSession");

    if (adminSession) {
      return new Response(JSON.stringify({ isLoggedIn: true }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ isLoggedIn: false }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
