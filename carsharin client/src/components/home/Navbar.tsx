/*import Link from "next/link"*/
/*import Image from "next/image"*/
import { Link } from "react-router-dom";
import { NAV_HOME_LINKS, NAV_HOME_LINKS_NO_LOGIN } from "../../constants"
import '../initialPage/InitialPage.css'
import React, { useState } from 'react';
import { useAuthStore } from "../../store/auth";
import * as jwt_decode from 'jwt-decode';
import { useQuery } from "@tanstack/react-query";
import { get_solo_user } from "../../api/UserService";
import { Token } from "../../Interfaces";


const Navbar = () => {


    

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const token: string = useAuthStore.getState().access;
    const { isAuth } = useAuthStore()

    
    let is_admin: boolean = false;
    let username: string = "";
    let avatar: string = "";
    let id: number = 0;

    if (isAuth) {
        const tokenDecoded: Token = jwt_decode.jwtDecode(token)
        is_admin = tokenDecoded.is_staff;
        avatar = String(tokenDecoded.avatar)
        username = String(tokenDecoded.username)
        id = tokenDecoded.user_id
        
    }

    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => get_solo_user(id),
      })

    

    function logOutFun() {
        useAuthStore.getState().logout()
        window.location.href = '/login'
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };



    return (
        <nav className="flexBetween max-container padding-container relative z-30 py-5">
            <Link to="/">
                <img src="/carsharing.svg" alt="logo" width={100} height={50}></img>
            </Link>
            {isAuth ? (
            <ul className="hidden h-full gap-11 lg:flex">
                {NAV_HOME_LINKS.map((link) => (
                    <Link to={link.href} key={link.key} className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 
                    transition-all hover:font-bold">{link.label}</Link>
                ))}
            </ul>

            ) : (
                <ul className="hidden h-full gap-11 lg:flex">
                {NAV_HOME_LINKS_NO_LOGIN.map((link) => (
                    <Link to={link.href} key={link.key} className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 
                    transition-all hover:font-bold">{link.label}</Link>
                ))}
            </ul>
            )}

            <div className="lg:flexCenter">
                {isAuth ? (
                    <div className="relative">

                        <div
                            onClick={toggleDropdown}
                            className="cursor-pointer"
                        >
                            {user && user.avatar !== undefined && <img src={`http://localhost:8000${user.avatar}`} alt={user.username} width={100} height={50} />}
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg">
                                <Link
                                    to={`/updateUser/`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Mi Perfil
                                </Link>
                                <button
                                    onClick={logOutFun}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">
                        <button
                            type="button"
                            className="flexCenter gap-3 rounded-full border bg-black text-white px-8 py-4 hover:bg-gray-900 focus:outline-none focus:ring focus:border-blue-100"
                        >
                            <img src="/user.svg" alt="Login" width={24} height={24} />
                            Login
                        </button>
                    </Link>
                )}
            </div>

            <img src="menu.svg" alt="menu" width={32} height={32} className="inline-block cursor-pointer lg:hidden" />
        </nav>
    );
}

export default Navbar