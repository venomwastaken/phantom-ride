import Link from 'next/link';
import styles from './Navbar.module.css'; // Adjust import as needed
import Mobilenav from './Mobilenav';

interface NavbarProps {
  color?: string; // Optional string type for color
}

const Navbar: React.FC<NavbarProps> = ({ color = 'white' }) => {
  return (
    <section className= {color === 'white' ? 'bg-white text-black' : 'bg-black text-white'}>
      <nav className={`wrapper ${styles.navWrapper}`}>
        <Link href="/" className="black">PHANTOM<br />RIDE</Link>
        
        <div className= "hidden lg:flex">
          <ul className={`${styles.navLinks} font-medium`}>
            <li className={styles.navLink}><Link href="/pickups">Pick-ups</Link></li>
            <li className={styles.navLink}><Link href="/about">About Us</Link></li>
            <li className={styles.navLink}><Link href="/faqs">FAQs</Link></li>
            <li className={styles.navLink}><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <button className="mt-0 hidden lg:block">
            <Link className='button' href="/book">Book Ride</Link>
          </button>
          <Mobilenav color={color} />
        </div>
        
        
      </nav>
    </section>
  );
}

export default Navbar;
