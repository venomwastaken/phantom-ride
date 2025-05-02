import Image from "next/image";
import styles from "./Footer.module.css";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const date = new Date();

const Footer = () => {
  return (
    <section className="footerSection">
      <footer className="wrapper">
        <div className={styles.footerColumns}>
          <div className={`${styles.footerColumn} ${styles.footerLogo}`}>
            <Image
              src="/assets/logo.JPG"
              alt="Picture of the author"
              sizes="100vw"
              style={{
                width: "114px",
                height: "auto",
                borderRadius: "200px",
              }}
              width={914}
              height={914}
              quality={100}
            />
          </div>
          <div className={styles.footerColumn}>
            <h3 className="black">Navigations</h3>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/pickups">Pickup</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/faqs">FAQS</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3 className="black text-base">Support</h3>
            <ul>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none bg-transparent p-0 m-0 hover:opacity-100">
                    Snapchat
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="ml-9">
                    <DropdownMenuItem>
                      <a href="https://www.snapchat.com/add/dan_iell16?share_id=O_zoHanCEII&locale=en-GB">
                        Daniel
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="https://www.snapchat.com/add/diidi.i?share_id=dZvdyVU0Vac&locale=en-GB">
                        Derrik
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="https://www.snapchat.com/add/totchere1?share_id=TwyHdQf_YQ0&locale=en-GB">
                        Thelma
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none bg-transparent p-0 m-0 hover:opacity-100">
                    WhatsApp
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="ml-9">
                    <DropdownMenuItem>
                      <a href="http://wa.me/+233243980353">Daniel</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="http://wa.me/+233205289685">Thelma</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="http://wa.me/+233509638300">Derrick</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          &copy; {date.getFullYear()} Phantom Ride
        </div>
      </footer>
    </section>
  );
};

export default Footer;
