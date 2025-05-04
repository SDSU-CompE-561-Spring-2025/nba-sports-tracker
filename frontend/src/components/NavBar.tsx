"use client";

const navList = [
    {
        label: "Home",
        link: '/',
    },
    {
        label: "Dashboard",
        link: "/account_page",
 },
    // {
    //     label: "File_Path_View_All",
    //     link: '/file_path_view_all',
    // },
    // {
    //     label: "Listning_Page",
    //     link: '/listening_page',
    // },
    // {
    //     label: "sign_in_sign_up",
    //     link: '/sign_in_sign_up',
    // },
    // {
    //     label: "Uploading_File_Path",
    //     link: '/uploading_file_path',
    // }
]

import { ThemeSwitcherButton } from "@/components/ThemeSwitcherButton";
import { link } from "fs";
import Logo from '@/components/Logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { UserRoundPlus, LogIn } from "lucide-react";
import UserButton from "@/components/UserButton";

function NavBar() {
    const pathname = usePathname();
    const isActive = pathname === '/';


    return (
     <div className={"hidden border-serperate border-b bg-background md:block"}>
        <nav className={'w-full lg:w-[90%] mx-auto flex items-center justify-between px-8 py-4'}>
            <div className={'flex items-center gap-x-4'}>
                <Logo/>
                {/*buttons after the logo */}
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
            {/*Right side buttons on the navbar */}
            <div className={'flex items-center gap-4 ml-auto'}>
                
            <Button variant={'outline'} size={'icon'}>
                <Link
                    href="/sign_in_sign_up"
                        className="
                        flex           
                        items-center       
                        justify-center     
                        h-full             
                        aspect-square      
                        p-0                
                        rounded-none       
                        "
                    >                       
                    <LogIn/>
                </Link>
            </Button>
                
            <Button variant={'outline'} size={'icon'}>
                <Link
                    href="/sign_in_sign_up/sign-up"
                    className="
                            flex              
                            items-center       
                            justify-center     
                            h-full            
                            aspect-square      
                            p-0               
                            rounded-none     
                    "
                >
                    <UserRoundPlus/>
                </Link>
            </Button>

            <div className="h-full flex items-center">
                <ThemeSwitcherButton />
            </div>  

            <div className="h-full flex items-center">
                <UserButton/>
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
                    <div className="absolute -bottom-[1px] left-1/2 hidden h-[3.5px] w-[80%] -translate-x-1/2 rounded xl bg-amber-500 md:block" />
                )}
            </div>
        </>
    )
}

export default NavBar;