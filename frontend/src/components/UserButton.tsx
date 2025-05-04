import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {User} from "lucide-react";
import Link from "next/link";

function UserButton() {
    return (
        
            <Button variant={"outline"} size={"icon"}>
                <Link 
                    href="/sign_in_sign_up"
                    className="
                            inline-flex        /* becomes a flex container */
                            items-center       /* vertically center its content */
                            justify-center     /* horizontally center its content */
                            h-full             /* match the nav’s height (e.g. 80px) */
                            aspect-square      /* force width = height */
                            p-0                /* no extra padding */
                            rounded-none       /* square corners */
                    "
                >
                    <User/>
                </Link>
            </Button>
        
    );
}

export default UserButton;