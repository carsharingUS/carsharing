import Camp from '../components/initialPage/Camp'
import Features from '../components/initialPage/Features'
import GetApp from '../components/initialPage/GetApp'
import Guide from '../components/initialPage/Guide'
import Hero from '../components/initialPage/Hero'
import React from 'react'
import Navbar from '../components/initialPage/Navbar'
import Footer from '../components/initialPage/Footer'
import '../components/initialPage/InitialPage.css'


const InitialPage = () => {
    return (
        <div className='bodyInitialPage'>
            <Navbar />
            <main className='relative overflow-hidden'>
                <Hero />
                <Camp />
                <Guide />
                <Features />
                <GetApp />
            </main>
            <Footer />
        </div>
    )
}

export default InitialPage
