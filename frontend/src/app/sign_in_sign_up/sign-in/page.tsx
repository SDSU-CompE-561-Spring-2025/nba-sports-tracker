import SignInForm from "@/components/SignInForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function SignInPage() {
    return (
        <div className="
            flex flex-col items-center justify-center 
            bg-background
            container mx-auto px-4 mt-25
            "
        >
            <div className={"items-center w-75"}>
                <SignInForm/> 
            </div>
            <div className={"flex items-center gap-4 justify-center mt-3"}> 
                <p className={"text-sm leading-none m-0"}>New to The Audio Hub?</p>
                <Button variant={"outline"} className="">
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
                        Sign Up
                    </Link>
                </Button>
            </div>
        </div>
    );
}