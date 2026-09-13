import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasDemoSession = cookieStore.get("brandpilot_demo_session")?.value === "active";

  redirect(hasDemoSession ? "/dashboard" : "/login");
}
