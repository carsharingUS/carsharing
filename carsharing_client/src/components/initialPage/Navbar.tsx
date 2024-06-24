/*import Link from "next/link"*/
/*import Image from "next/image"*/
import { Link } from "react-router-dom";
import { NAV_LINKS } from "../../constants"
import Button from "./Button"
import '../initialPage/InitialPage.css'
import React from 'react';

const Navbar = () => {
    return (
        <nav className="flexBetween max-container padding-container relative z-30 py-5">
            <Link to="/">
                <img src="/carsharing.svg" alt="logo" width={100} height={50}></img>
            </Link>
            
            <ul className="hidden h-full gap-11 lg:flex">
                {NAV_LINKS.map((link) => (
                    <Link to={link.href} key={link.key} className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 
                    transition-all hover:font-bold">{link.label}</Link>
                ))}
            </ul>
            
            <div className="lg:flexCenter">
                <Link to="/login"> <Button type="button" title="Login" icon="/user.svg" variant="btn_dark_green2"/></Link>
                <Link to="/login"><button type="button" className="flexCenter gap-3 rounded-full border bg-black text-white px-8 py-4 hover:bg-gray-900 focus:outline-none focus:ring focus:border-blue-100"><img src="/user.svg" alt="Login" width={24} height={24} />Login</button></Link>

            </div>

            <img src="menu.svg" alt="menu" width={32} height={32} className="inline-block cursor-pointer lg:hidden" />

        </nav>
    )
}

export default Navbar