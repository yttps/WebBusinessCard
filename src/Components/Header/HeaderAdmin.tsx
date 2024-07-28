import { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function HeaderAdmin() {

    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    async function handleLogOut() {

        const result = await Swal.fire({
            title: 'Logout?',
            text: 'ต้องการออกจากระบบหรือไม่!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
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
                    <div className="w-full md:block md:w-auto relative">
                        <button
                            id="multiLevelDropdownButton"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            type="button"
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                        >
                            Accout
                            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        <div id="multi-dropdown" className={`${dropdownVisible ? 'block' : 'hidden'} absolute right-0 z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-80 dark:bg-gray-700`}>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
                                <li>
                                    <div className="w-full max-w-sm bg-white rounded-lg pt-10">
                                        <div className="flex flex-col items-center pb-20">
                                            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" alt="Bonnie image" />
                                            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Bonnie Green</h5>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
                                        </div>
                                    </div>

                                </li>
                                <li>
                                    <hr style={{width:'20rem' , textAlign:'center'}}/>
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