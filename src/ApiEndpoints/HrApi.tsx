import axios from 'axios';
const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:8080";   
const axiosHeaders = {
    "ngrok-skip-browser-warning": "ngrok-skip-browser-warning",
}

export class HrApi {

    private urlLogo: string = '';

    async GetAllHrByCompanyId() {

        const loggedInData = localStorage.getItem("LoggedIn");

        if (loggedInData) {

            const parsedData = JSON.parse(loggedInData);
            const CompanyId = parsedData.id;
            const endpoint = `https://business-api-638w.onrender.com/users/by-company/${CompanyId}`;

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

            const res = await axios.get(`${url}/user/${id}`, {
                headers: axiosHeaders,
            });

            const HrDataById = res.data;
            console.log("hr by id" , res.data);
            return HrDataById;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async UploadProfile(Image:File , uid : string ,folderName : string , collection : string) {

    
            const formData = new FormData();

            formData.append('file', Image); 
            formData.append('folder', folderName);
            formData.append('collection', collection)
            formData.append('uid', uid);

            try {

                const res = await fetch(`${url}/upload-image`, {
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
        startworkValue: string,
        birthdateValue:string
        ) {



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
            companybranch: companyBranchValue,
            department: departmentValue,
            position: positionValue,
            startwork: startworkValue,
            birthdate: birthdateValue        }

            // const res = await fetch(`${url}/users`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(dataHr)
            // });

            const endpoint = `${url}/users`;
            const res = await axios.post(endpoint , dataHr);

            console.log('res in context', res.data.userId);
            return res.data.userId;

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