"use client";


const navList = [
    {
        label: "Home",
        link: '/',
        protected: true,
    },
    {
        label: "Dashboard",
        link: "/dashboard",
        protected: true,
    },
    {
        label: "File Path View All",
        link: '/file_path_view_all',
    },
    {
         label: "Listening Page",
         link: '/listening_page',
         protected: true,
    },
    // {
    //     label: "sign_in_sign_up",
    //     link: '/sign_in_sign_up',
    // },
    // {
    //     label: "Uploading_File_Path",
    //     link: '/uploading_file_path',
    // }
]

import { useAuth } from '@/context/AuthContext'; 
import { ThemeSwitcherButton } from "@/components/ThemeSwitcherButton";
import Logo from '@/components/Logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { UserRoundPlus, LogIn } from "lucide-react";
import UserButton from "@/components/UserButton";

function NavBar() {
    const pathname = usePathname();
    const { token } = useAuth();               // ② grab the JWT
  
    const filteredNavList = navList.filter(item => !item.protected || token);
    // ③ if no token, render nothing
    if (!token) {
        return (
          <div className="w-full py-8 bg-background text-center space-y-4">
            <h1 className="text-5xl font-bold">The Audio Hub</h1>
            <p className="text-lg text-gray-600">
              Paste, manage and play your audio file paths in one place.
            </p>
              <p className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg">
                Get Started  
              </p>
          </div>
        );
      }

    return (
     <div className={"hidden border-serperate border-b bg-background md:block"}>
        <nav className={'w-full lg:w-[90%] mx-auto flex items-center justify-between px-8 py-4'}>
            <div className={'flex items-center gap-x-4'}>
                <Logo/>
                {/*buttons after the logo */}
                <div className={"flex h-full"}>
                    {filteredNavList.map((item, index) => (
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
                    href="/sign_in_sign_up/sign-in"
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