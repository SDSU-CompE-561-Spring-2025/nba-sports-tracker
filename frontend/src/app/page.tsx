import { redirect } from "next/navigation";

export default function Home() {
    const token = localStorage.getItem("accessToken")
    if(token) redirect("/file_path_view_all")
    else redirect("/sign_in_sign_up/sign-in");
}