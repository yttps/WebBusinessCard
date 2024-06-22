import axios from 'axios';
const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:8080";   
const axiosHeaders = {
    "ngrok-skip-browser-warning": "ngrok-skip-browser-warning",
}

export class GeneralUserApi {

    private urlLogo: string = '';

    async GetAllGeneralUsers() {

        try {

            const res = await axios.get(url + '/users', {
                headers: axiosHeaders,
            });
            const companyData = res.data;
            console.log('in context', companyData);
            return companyData;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetDataGeneralUserById(id: string) {

        try {

            const res = await axios.get(`${url}/users/${id}`, {
                headers: axiosHeaders,
            });

            const companyDataById = res.data;
            return companyDataById;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async DeleteGeneralUser(UserId: string) {

        try {

            const res = await fetch(`${url}/users/${UserId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: UserId
            });
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    setUrlLogo = (url: string) => {
        this.urlLogo = url;
        return this.urlLogo;
    }
}