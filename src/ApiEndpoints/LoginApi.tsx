import axios from 'axios';
// import { LoginUserData } from '@/Model/LoginUserData';


const axiosHeaders = {
    "ngrok-skip-browser-warning": "ngrok-skip-browser-warning",
}

const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:3000";

export class LoginApi {

    async LoginUserData(email: string, password: string) {

        try {
            const datalogin = {
                email: email,
                password: password
            }
            const resLogin = await axios.post(url + '/login', datalogin);
            return resLogin.data;

        } catch (error) {
            console.error("Login error", error);
            throw error;
        }
    }

    async GetDetailHRlogin() {

        try {

            const loggedInData = localStorage.getItem("LoggedIn");

            if (loggedInData) {

                const parsedData = JSON.parse(loggedInData);
                const userId = parsedData.id;

                if (userId) {

                    const res = await axios.get(`${url}/user/${userId}`, {
                        headers: axiosHeaders,
                    });

                    const HrDataById = res.data;
                    console.log("login employee by id", res.data);
                    return HrDataById;
                }
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
