import './Header.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Header() {

    const navigate = useNavigate();

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
                <div className="max-w-screen-xxl flex flex-wrap items-center justify-between mx-auto p-3"> {/* Increased padding to 2 for more spacing */}
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-6" alt="Flowbite Logo" /> {/* Reduced height of the logo */}
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Business Card</span> {/* Reduced font size */}
                    </a>
                    <button
                        data-collapse-toggle="navbar-default"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-2 md:p-0 mt-2 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-6 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a href="#" className="block py-1 px-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-5 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" onClick={handleLogOut}>ออกจากระบบ</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <hr />

        </>
    );
}