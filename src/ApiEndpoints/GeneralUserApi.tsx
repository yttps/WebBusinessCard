import axios from 'axios';
import { GetAllGeneralUser } from '@/Model/GetAllGeneralUser';

const url = "https://business-api-638w.onrender.com";   //use host 


export class GeneralUserApi {

    async GetAllGeneralUser() {

        try {

            const res: GetAllGeneralUser[] = await axios.get(url + '/users');
            return res;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
