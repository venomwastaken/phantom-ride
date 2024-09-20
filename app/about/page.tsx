import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import React from 'react'

const about = () => {
  return (
    <>
    <Navbar/>
    <section className='wrapper'>
        <div className='md:mt-10 max-w-5xl'>
            <h2 className='text-3xl bold'>About Us</h2>
            <p className='mt-4'>
                It is quite diffucult to find your way when you dont know exactly where you are going. 
                And so we take you straight there. We a offer husstle-free comfortable rides to and from <span className='font-medium'>
                Kwame Nkrumah Universty of Science and Technology</span>. No long queues and struggle. Book and instantly get your ticket right on your device.
                Oh yeah, luggage is <span className='font-medium'>free</span> too!
            </p>
        </div>
        <div className=' mt-10 md:mt-20 max-w-5xl'>
             <h2 className='text-3xl bold'>Our Mission</h2>
            <p className='mt-4'>
                We are dedicated to providing high-quality services customized to meet our your needs. 
                We place a strong emphasis on meticulous attention to detail and are committed to achieving customer satisfaction by consistently exceeding expectations in every aspect of our work.
            </p>
        </div>
       
    </section>
    <Footer/>
    </>
  )
}

export default about