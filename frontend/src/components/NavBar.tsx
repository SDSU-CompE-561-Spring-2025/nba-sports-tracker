"use client";

const navList = [
    {
        label: "Home_Page",
        link: "/home_page",
    },
    {
        label: "Account_Page",
        link: "/account_page",
    },
    {
        label: "File_Path_View_All",
        link: "/file_path_view_all",
    },
    {
        label: "Listning_Page",
        link: "/listening_page",
    },
    {
        label: "sign_in_sign_up",
        link: "/sign_in_sign_up",
    },
    {
        label: "Uploading_File_Path",
        link: "/uploading_file_path",
    }
]

import { ThemeSwitcherButton } from "@/components/ThemeSwitcherButton";
import { link } from "fs";
import Logo from "@/components/Logo";

function NavBar() {
    return (
     <div className={"hidden border-serperate border-b bg-background md:block"}>
        <nav className={'container flex items-center justify-between px-8'}>
            <div className={'flex h-[80px] min-h-[60px] items-center gap-x-4'}>
                <Logo/>
            </div>
        </nav>        
     </div>
    );
}

export default NavBar;