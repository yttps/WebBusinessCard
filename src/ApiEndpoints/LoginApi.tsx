import axios from 'axios';
// import { LoginUserData } from '@/Model/LoginUserData';



const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:3000";

export class LoginApi {

    async LoginUserData(email:string, password:string) {

    try {
        const datalogin = {
            email: email,
            password: password
        }
        const resLogin = await axios.post(url + '/login', datalogin);
        console.log('chk' , resLogin.status);
        return resLogin.data; 

    } catch (error) {
        console.error("Login error" , error);
        throw error; 
    }
}
}
