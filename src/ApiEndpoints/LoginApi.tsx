import axios from 'axios';
// import { LoginUserData } from '@/Model/LoginUserData';
const url = "https://business-api-638w.onrender.com";

// const hostUrl = "https://ab3d-1-46-31-5.ngrok-free.app";


export class LoginApi {

    async LoginUserData(email:string, password:string) {

    try {
        const datalogin = {
            email: email,
            password: password
        }
        const resLogin = await axios.post(url + '/login', datalogin);
        return resLogin.data; 

    } catch (error) {
        console.error("Login error" , error);
        throw error; 
    }
}
}
