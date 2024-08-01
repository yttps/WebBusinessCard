import '@/Components/Login/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { LoginApi } from '@/ApiEndpoints/LoginApi';
import { GetDetailHRLogin } from '@/Model/GetDetailHRLogin';

export default function Login() {

    const navigate = useNavigate();
    const loginapi = new LoginApi();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [detailHrLogin, setDetailHrLogin] = useState<GetDetailHRLogin[]>([]);
    const [showPass, setShowPass] = useState(false);


    async function loginUserData(e: React.MouseEvent<HTMLFormElement>) {

        e.preventDefault();

        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;

        try {

            const res = await loginapi.LoginUserData(email, password);
            console.log(email, password);

            if (res) {

                if (res.role === "admin") {

                    localStorage.setItem("LoggedIn", JSON.stringify(res));
                    navigate('ListCompany');
                }

                if (res.role === "company") {

                    localStorage.setItem("LoggedIn", JSON.stringify(res));
                    const response = await loginapi.GetDetailCompanylogin();

                    if (response.status != '0') {
                        navigate('ListHr');
                    }
                    else {
                        Swal.fire({
                            title: 'Login Error!',
                            text: 'รออนุมัติจากระบบ',
                            icon: 'error',
                        });
                        return;
                    }

                }

                if (res.role === "user") {

                    localStorage.setItem("LoggedIn", JSON.stringify(res));
                    const response = await loginapi.GetDetailHRlogin();

                    if (response) {

                        setDetailHrLogin(response);

                        const dataLoginUser = {
                            userLoginId: response.id,
                            companyId: response.companybranch.companyID
                        }

                        if (dataLoginUser) {
                            localStorage.setItem("LoggedIn", JSON.stringify(dataLoginUser));
                            navigate('ListEmployees');
                        }

                    }

                }
            }

            else {
                Swal.fire({
                    title: 'Login Error',
                    text: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง!',
                    icon: 'error',
                });
            }

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                text: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง!',
                icon: 'error',
            });
        }
    }

    function handleShowPassword() {

        setShowPass(!showPass);

    }

    useEffect(() => {
        console.log("detailHrLogin updated", detailHrLogin); 
    }, [detailHrLogin]);

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900 pb-[10px] ">
                <div className="max-w-screen-xxl flex flex-wrap items-center justify-between mx-auto p-3"> {/* Increased padding to 2 for more spacing */}
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-6" alt="Flowbite Logo" /> {/* Reduced height of the logo */}
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Business Card</span> {/* Reduced font size */}
                    </div>
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
                </div>
            </nav>
            <hr />
            <div className="flex items-center justify-center min-h-max bg-background mt-[5rem]">
                <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-foreground">เข้าสู่ระบบ</h1>
                    <br />
                    <p className="text-muted-foreground">ยินดีต้อนรับ 👋</p>

                    <form className="mt-6" onSubmit={loginUserData}>
                        <label className="block text-muted-foreground" htmlFor="email">
                            Email
                        </label>
                        <input ref={emailRef} type="email" id="email" className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" placeholder="you@example.com" required />

                        <label className="block text-muted-foreground mt-4" htmlFor="password">
                            Password
                        </label>
                        <input type={showPass ? "text" : "password"} ref={passwordRef} id="password" className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" placeholder="Enter your password" required />

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center pt-2">
                                <input onClick={handleShowPassword} id="showpass" type="checkbox" className="mr-2" />
                                <span className="text-muted-foreground">Show Password</span>
                            </label>
                            <a href="#" className="text-primary hover:underline">
                                ลืมรหัสผ่าน?
                            </a>
                        </div>

                        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/80 w-full mt-6 p-2 rounded-lg">
                            Login
                        </button>
                    </form>

                    <p className="text-muted-foreground mt-4">
                        ยังไม่มีบัญชี?{' '}
                        <Link to="/Register" className="text-primary hover:underline">
                            สมัครสมาชิก
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

