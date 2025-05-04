"use client";

const navList = [
    {
        label: "Home_Page",
        link: '/',
    },
    {
        label: "Account_Page",
        link: "/account_page",
    },
    {
        label: "File_Path_View_All",
        link: '/file_path_view_all',
    },
    {
        label: "Listning_Page",
        link: '/listening_page',
    },
    {
        label: "sign_in_sign_up",
        link: '/sign_in_sign_up',
    },
    {
        label: "Uploading_File_Path",
        link: '/uploading_file_path',
    }
]

import { ThemeSwitcherButton } from "@/components/ThemeSwitcherButton";
import { link } from "fs";
import Logo from '@/components/Logo';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from "next/link";

function NavBar() {
    const pathname = usePathname();
    const isActive = pathname === '/';


    return (
     <div className={"hidden border-serperate border-b bg-background md:block"}>
        <nav className={'container flex items-center justify-between px-8'}>
            <div className={'flex h-[80px] min-h-[60px] items-center gap-x-4'}>
                <Logo/>
                <div className={"flex h-full"}>
                    {navList.map((item, index) => (
                        <NavbarItems
                            key={item.label}
                            link={item.link}
                            label={item.label} 
                        />   
                    ))}
                </div>
            </div>
        </nav>        
     </div>
    );
}

interface NavbarItemProps {
    link: string;
    label: string;
    clickCallBack?: () => void;
}

function NavbarItems({link, label, clickCallBack}: NavbarItemProps) {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <>
            <div className="relative flex items-center">
                <Link 
                    href={link} 
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start text-lg text-muted-foreground hover:text-foreground", 
                        isActive && 'text-amber-500'
                    )}
                    onClick={() => {
                        if (clickCallBack) clickCallBack();
                    }}
            >
                    {label}
                </Link>
                {isActive && (
                    <div className="absolute -bottom-[2px] left-1/2 hidden h-[5px] w-[80%] -translate-x-1/2 rounded xl bg-amber-500 md:block" />
                )}
            </div>
        </>
    )
}

export default NavBar;