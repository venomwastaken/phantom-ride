import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"

 import { Separator } from "@/components/ui/separator"

import Image from "next/image"
import Link from "next/link"



interface NavbarProps {
    color?: string; // Optional string type for color
  }


const Mobilenav:React.FC<NavbarProps> = ({color}) => {
  return (
    <nav>
        <Sheet>
            <SheetTrigger asChild className="lg:hidden">
                <Image 
                    src={color === 'white' ? "/assets/icons/menuFill.png" : "/assets/icons/menu.png"}
                    alt="menu_icon"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
            </SheetTrigger>
            <SheetContent side = "top" className={`${color==="white"?"bg-black":"bg-white"} h-screen border-0"`}>
                <SheetClose asChild className=" absolute right-5 ">
                    <div className="p-2 rounded-full hover:bg-stone-200/30 top-6 ">
                        <Image 
                            src={color === 'white' ? "/assets/icons/close.png" : "/assets/icons/closeFill.png"}
                            alt="menu_icon"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                        />
                    </div>
                </SheetClose>
                <h2 className={`black ${color==="white"?"text-white":"text-black"}`}>PHANTOM<br />RIDE</h2>
                <Separator className="mt-4"/>
                <div>
                    <ul className={`flex flex-col gap-10 text-3xl bold mt-5 ${color==="white"?"text-white":"text-neutral-800"} `} >
                        <li ><Link href="/pickups" className="hover:opacity-50">End-points</Link></li>
                        <li ><Link href="/about" className="hover:opacity-50">About Us</Link></li>
                        <li ><Link href="/faqs" className="hover:opacity-50">FAQs</Link></li>
                        <li ><Link href="/contact" className="hover:opacity-50">Contact Us</Link></li>
                        <li ><Link href="/book" className="hover:opacity-50">Book Ride</Link></li>
                    </ul>
                </div>


            </SheetContent>
        </Sheet>
    </nav>
  )
}

export default Mobilenav