import { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AiOutlineLogout } from "react-icons/ai";

export default function Header() {

    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    async function handleLogOut() {

        const result = await Swal.fire({
            title: 'Logout?',
            text: 'ต้องการออกจากระบบหรือไม่!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'อยู่ในระบบ'
        });

        if (result.isConfirmed) {
            localStorage.clear();
            navigate('/');
        }

    }

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xxl flex flex-wrap items-center justify-between mx-auto p-3 relative">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-6" alt="Flowbite Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Business Card</span>
                    </div>
                    <button
                        data-collapse-toggle="navbar-default"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default"
                        aria-expanded="false"
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="w-full md:block md:w-auto relative pr-3">
                        <button
                            id="multiLevelDropdownButton"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            type="button"
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                        >
                            <AiOutlineLogout size={30}/>
                        </button>
                        <br />
                        <div id="multi-dropdown" className={`${dropdownVisible ? 'block' : 'hidden'} absolute right-0 z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-80 dark:bg-gray-700`}>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
                                <li>
                                    <a href="#" onClick={handleLogOut} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ออกจากระบบ</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <hr />
        </>
    );
}