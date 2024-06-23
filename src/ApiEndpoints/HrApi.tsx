import axios from 'axios';
const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:8080";   
const axiosHeaders = {
    "ngrok-skip-browser-warning": "ngrok-skip-browser-warning",
}

export class HrApi {

    private urlLogo: string = '';

    async GetAllHr() {

        const loggedInData = localStorage.getItem("LoggedIn");

        if (loggedInData) {

            const parsedData = JSON.parse(loggedInData);
            const CompanyId = parsedData.id;
            const endpoint = `https://business-api-638w.onrender.com/users/by-companyandposition/${CompanyId}/HR`;

            if (CompanyId) {

                try {

                    const res = await axios.get(endpoint, {
                        headers: axiosHeaders,
                    });
                    console.log('in context', res);
                    const companyData = res.data;

                    return companyData;

                } catch (error) {
                    console.error(error);
                    throw error;
                }

            }



        } else {
            console.log("No logged in data found");
        }


    }

    async GetDataHrById(id: string) {

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

            try {


                const res = await fetch(`${url}/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {

                    const data = await res.json();
                    this.setUrlLogo(data.Url)
                    console.log('Upload logo successful:', res.status);
                    return res.status;
                }
                else {
                    console.log('in context upload logo', res.status);
                    return res.status;
                }


            } catch (error) {
                console.error(error);
                throw error;
            }


        } else {
            console.log('Company ID is not available');
        }
    }

    async AddDataHr(
        firstnameValue: string,
        lastnameValue: string,
        emailValue: string,
        passwordValue: string,
        genderValue: string,
        phoneValue: string,
        subdistrictValue: string,
        districtValue: string,
        provinceValue: string,
        countryValue: string,
        companyBranchValue: string,
        departmentValue: string,
        positionValue: string,
        startworkValue: string) {



        try {        
            
            
            const dataHr = {
            firstname: firstnameValue,
            lastname: lastnameValue,
            email: emailValue,
            password: passwordValue,
            gender: genderValue,
            phone: phoneValue,
            subdistrict: subdistrictValue,
            district: districtValue,
            province: provinceValue,
            country: countryValue,
            companyBranch: companyBranchValue,
            department: departmentValue,
            position: positionValue,
            startwork: startworkValue
        }

        console.log('data hr in context' , dataHr);

            // const res = await fetch(`${url}/users`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(dataHr)
            // });
            const endpoint = `${url}/users`;
            const res = await axios.post(endpoint , dataHr);

            console.log('in context', res.data.id);
            return res.data.id;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async DeleteHr(companyId: string) {

        try {

            const res = await fetch(`${url}/companies/${companyId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: companyId
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