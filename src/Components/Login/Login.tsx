import '@/Components/Login/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Form, Button, } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import React, { useRef } from 'react';
import Swal from 'sweetalert2';
import { LoginApi } from '@/ApiEndpoints/LoginApi';

export default function Login() {

    const navigate = useNavigate();
    const loginapi = new LoginApi();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);


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
                    console.log('loginnnn');
                }

                if (res.role === "company") {

                    localStorage.setItem("LoggedIn", JSON.stringify(res));
                    navigate('ListHr');
                }

                if (res.role === "hr") {

                    localStorage.setItem("LoggedIn", JSON.stringify(res));
                    navigate('ListEmployees');
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

    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">
                        {' '}
                        Login Page
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <div className="containerLogin">
                <p className='loginTitle'>Login</p>
                <br />
                <p className='title'>Welcome to business card online</p>
                <br />
                <div className='formname'>
                    <Form onSubmit={loginUserData}>
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control className='custom-width' type="email" placeholder="Email"
                                ref={emailRef} required />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control className='custom-width' type="password" placeholder="Password"
                                ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="formBasicCheckbox">
                        </Form.Group>
                        
                        <Button variant="primary" type="submit" className='submit-btn' >
                            Login
                        </Button>
                        <br />
                        <Link to="/Register" className="link-text">
                            <Button variant="success" className='regis-btn'>Register</Button>
                        </Link>
                    </Form>
                </div>
            </div>
            <Link to="/SelectedTem">Selectedtem</Link>
            <br />
            <Link to="/CreateCard">CreateCard</Link>
            <br />
            <Link to="ListEmployees">List Employees</Link>
            <br />
            <Link to="ListHr">ListHR</Link>
            <br />
            <Link to="ListGeneralUser">List General user</Link>
            <br />
            <Link to="ListCompany">List Company</Link>
            <br />
            <Link to="DetiailCompany">Detail Company</Link>
            <br />
            <Link to="CreateTem">Create Template</Link>
            <br />
            <Link to="SelectedPosTem">Selected Pos template</Link>

        </>
    );
}

