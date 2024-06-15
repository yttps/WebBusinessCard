import axios from 'axios';
// import { GetAllCompany } from '@/Model/GetAllCompany';

const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:8080";   
const axiosHeaders = {
    "ngrok-skip-browser-warning": "ngrok-skip-browser-warning",
}

export class CompanyApi {

    async GetAllCompany() {

        try {

            const res = await axios.get(url + '/companies', {
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

    async GetDataCompanyById(id: string) {

        try {

            const res = await axios.get(`${url}/companies/${id}`, {
                headers: axiosHeaders,
            });

            const companyDataById = res.data;
            return companyDataById;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async UploadLogo(Logo: File) {

 
        const companyIdString = localStorage.getItem('LoggedIn');

        if (companyIdString !== null) {

            const companyId = JSON.parse(companyIdString);
            const folderName = 'logo';
            const formData = new FormData();

            formData.append('file', Logo);
            formData.append('folder', folderName);
            formData.append('uid', companyId.id);

            // const data = {
            //     file: Logo,
            //     folderName: folderName,
            //     companyId: companyId.id
            // }

            console.log('////////' , formData);

            try {


                const res = await fetch(`${url}/upload` , {
                    method:'POST',
                    body:formData
                });
                
                // const res = await axios.post(`${url}/upload`, formData);
                console.log('in context upload logo', res.status);
                return res.status;

            } catch (error) {
                console.error(error);
                throw error;
            }


        } else {
            console.log('Company ID is not available');
        }


    }

    async AddDataCompany(
        email: string, password: string,
        businessType: string, name: string, phoneNumber: string,
        website: string, yearFounded: string, subdistrict: string,
        district: string, province: string, country: string) {

        const dataCompany = {
            email: email,
            password: password,
            businessType: businessType,
            name: name,
            phoneNumber: phoneNumber,
            website: website,
            yearFounded: yearFounded,
            subdistrict: subdistrict,
            district: district,
            province: province,
            country: country
        }

        try {


            // const res = await fetch.post(`${url}/companies`, dataCompany, {
            //     headers: axiosHeaders,
            // });

            const res = await fetch(`${url}/companies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataCompany)
            });

            console.log('in context', res.status);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
