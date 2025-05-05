import { redirect } from "next/navigation";

export default function Home() {
  redirect("/sign_in_sign_up/sign-in");
}