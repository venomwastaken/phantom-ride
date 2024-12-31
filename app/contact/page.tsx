import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import Link from 'next/link'
import React from 'react'

const contact = () => {
  return (
    <>
    <Navbar/>
    <section className='wrapper'>
        <h2 className='text-3xl medium lg:mt-10 lg:text-4xl'>Email Us</h2>
        <p className='my-6'>Have questions or need assistance with your booking? Email us at <span>
            <Link href="mailto:danasaretunes@gmail.com?subject=PhantomRide@support-" className='underline font-medium'>danasaretunes@gmail.com</Link></span>,
             and we'll respond promptly to ensure your travel experience is seamless!</p>

        <h2 className='text-3xl medium lg:mt-20 lg:text-4xl'>Call Us</h2>
        <p className='mt-6'>You can also call any of the following:</p>
            <ul className=' list-disc ps-10 underline font-medium mb-20'>
                <li><Link href="tel:+233243980353" className='hover:opacity-70'>+233243980353</Link></li>
                <li><Link href="tel:+233509113689" className='hover:opacity-70'>+233509113689</Link></li>
                <li><Link href="tel:+233509681084" className='hover:opacity-70'>+233509681084</Link></li>
            </ul>
        
    </section>
    <Footer/>
    </>
  )
}

export default contact