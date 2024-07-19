import axios from 'axios';
const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:8080";   


export class GeneralUserApi {


    async GetAllGeneralUsers() {

        try {

            const res = await axios.get(url + '/generalusers');
            console.log('get all generalusers : ', res);
            return res.data;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetDataGeneralUserById(id: string) {

        try {

            const res = await axios.get(`${url}/users/${id}`);

            const companyDataById = res.data;
            return companyDataById;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async DeleteGeneralUser(UserId: string) {

        try {

            // const res = await fetch(`${url}/users/${UserId}`, {
            //     method: 'DELETE',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: UserId
            // });

            const res = await axios.delete(`${url}/users/${UserId}`);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}