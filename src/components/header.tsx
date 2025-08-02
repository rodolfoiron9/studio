
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Dribbble, Github, Twitter, Youtube, UserCog } from "lucide-react";
import { AdminIcon } from "./icons";

const SocialLinks = () => (
    <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-red-600"/>
            </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
            <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" aria-label="SoundCloud">
                <Dribbble className="h-5 w-5 text-orange-500"/>
            </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-blue-400"/>
            </a>
        </Button>
         <Button variant="ghost" size="icon" asChild>
            <Link href="/admin" aria-label="Admin Panel">
                <AdminIcon className="h-5 w-5" />
            </Link>
        </Button>
    </div>
);


export function Header() {
    return (
        <header className="absolute top-0 left-0 right-0 z-20 p-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                 <Link href="/" className="font-headline text-2xl font-bold text-white drop-shadow-md">
                    RudyBtz
                </Link>
                <div className="flex items-center gap-4 bg-background/50 backdrop-blur-sm rounded-full p-1">
                    <SocialLinks />
                </div>
            </div>
        </header>
    );
}
