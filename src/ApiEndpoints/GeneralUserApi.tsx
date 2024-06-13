import axios from 'axios';
import { GetAllGeneralUser } from '@/Model/GetAllGeneralUser';

const url = "http://localhost:8080";   //use host 


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
