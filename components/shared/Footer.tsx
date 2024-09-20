import Image from "next/image"
import styles from "./Footer.module.css"
import Link from "next/link"

const date = new Date()

const Footer = () => {
  return (
    <section className = "footerSection">
    <footer className="wrapper">
      <div className={styles.footerColumns}>
        <div className={`${styles.footerColumn} ${styles.footerLogo}`}>
        <Image
            src="/assets/logo.JPG"
            alt="Picture of the author"
            sizes="100vw"
            style={{
              width: '114px',
              height: 'auto',
              borderRadius: '200px',
            }}
            width={914}
            height={914}
            quality={100}
          />
        </div>
        <div className={styles.footerColumn}>
          <h3 className="black">Navigations</h3>
          <ul>
            <li><Link href="#">Home</Link></li>
            <li><Link href="#">Pickups</Link></li>
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">FAQS</Link></li>
            <li><Link href="#">Contact Us</Link></li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3 className="black text-base">Support</h3>
          <ul>
            <li><Link href="#">Snapchat</Link></li>
            <li><Link href="#">WhatsApp</Link></li>
          </ul>
        </div>    
      </div>

      <div className={styles.copyright}>
        &copy; {date.getFullYear()} Phantom Ride
      </div>
    </footer>
  </section>
  )
}

export default Footer