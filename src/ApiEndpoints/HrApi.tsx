import axios from 'axios';
const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:8080";

export class HrApi {

    async GetAllHrByCompanyId() {

        const loggedInData = localStorage.getItem("LoggedIn");

        if (loggedInData) {

            const parsedData = JSON.parse(loggedInData);
            const CompanyId = parsedData.id;
            const endpointGetDepartmentByCom = `https://business-api-638w.onrender.com/users/by-company/${CompanyId}/departmentName/HR`;


            if (CompanyId) {

                try {

                    const res = await axios.get(endpointGetDepartmentByCom);
                    return res.data;
                
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

            const res = await axios.get(`${url}/user/${id}`);

            const HrDataById = res.data;
            console.log("hr by id", res.data);
            return HrDataById;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async UploadProfile(Image: File, uid: string, folderName: string, collection: string) {


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
        birthdateValue: string
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
                birthdate: birthdateValue
            }

            console.log('in api' , dataHr);
            const endpoint = `${url}/users`;
            const res = await axios.post(endpoint, dataHr);
            console.log('res data' , res.data.userId);
            return res.data.userId;

        } catch (error) {
            console.error(error);
            return '0';
        }
    }

    async DeleteHr(HrId: string) {

        try {

            const res = await axios.delete(`${url}/users/${HrId}`);

            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateDataHR(firstnameElement: string, lastnameElement: string, positionElement: string, genderElement: string,
        birthdayElement: string, startworkElement: string, subdistrictElement: string, districtElement: string,
        provinceElement: string, countryElement: string, telElement: string, emailElement: string,
        branchElement: string, departmentElement: string, passwordElement: string, HRId: string
    ) {

        try {

            const dataHr = {
                firstname: firstnameElement,
                lastname: lastnameElement,
                email: emailElement,
                password: passwordElement,
                gender: genderElement,
                birthdate: birthdayElement,
                companybranch: branchElement,
                department: departmentElement,
                phone: telElement,
                position: positionElement,
                startwork: startworkElement,
                subdistrict: subdistrictElement,
                district: districtElement,
                province: provinceElement,
                country: countryElement,

            }

            const res = await axios.put(`${url}/users/${HRId}`, dataHr);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }


}