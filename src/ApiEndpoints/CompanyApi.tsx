import axios from 'axios';

const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:3000";   
const axiosHeaders = {
    "ngrok-skip-browser-warning": "ngrok-skip-browser-warning",
}

export class CompanyApi {

    private urlLogo: string = '';

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

    async UploadLogo(Logo: File, companyid: string) {

        const folderName = 'logo';
        const formData = new FormData();
        console.log('id', companyid);

        formData.append('file', Logo);
        formData.append('folder', folderName);
        formData.append('collection', 'companies')
        formData.append('uid', companyid);

        console.log('formdata', formData);

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
            country: country,
            logo: 'logo'
        }



        try {

            // const res = await fetch(`${url}/companies`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(dataCompany)
            // });

            const res = await axios.post(`${url}/companies`, dataCompany);
            console.log("upload data in context", res.data.companyId);
            return res.data.companyId;


        } catch (error) {
            console.error(error);
        }
    }

    async DeleteCompany(companyId: string) {

        try {

            const urlWithId = `${url}/companies/${companyId}`;
            const res = await axios.delete(urlWithId);
            console.log('delete company status', res.status);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async AddCompanyBranch(
        nameBranches : string , 
        subdistrict: string ,
        district : string ,
        province : string , 
        country : string ) {

        const loggedInData = localStorage.getItem("LoggedIn");

        if (loggedInData) {

            const parsedData = JSON.parse(loggedInData);
            const CompanyId = parsedData.id;
            const endpoint = `${url}/companybranches`;

            if (CompanyId) {

                try {

                    const dataBranch = {
                        name : nameBranches,
                        companyID : CompanyId,
                        subdistrict: subdistrict, 
                        district: district, 
                        province: province, 
                        country: country
                    }

                    console.log('check' , dataBranch);

                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataBranch)
                    });

                    console.log('in context', res.status);

                    return res.status;

                } catch (error) {
                    console.error(error);
                    throw error;
                }

            }



        } else {
            console.log("No logged in data found");
        }
    }

    async AddDepartments(departments: { name: string; phone: string }[]): Promise<number[]> {
        const loggedInData = localStorage.getItem("LoggedIn");
        const statusCodes: number[] = [];
      
        //เหลือเช็คว่าซ้ำหรือไม่
        if (loggedInData) {
          const parsedData = JSON.parse(loggedInData);
          const CompanyId = parsedData.id;
          const endpoint = `${url}/departments`;
      
          if (CompanyId) {
            try {
              for (let i = 0; i < departments.length; i++) {
                const dept = departments[i];
                const dataDepartment = {
                  name: dept.name,
                  companyID: CompanyId,
                  phone: dept.phone
                };
      
                console.log(`Sending department ${i + 1}:`, dataDepartment);
      
                const res = await fetch(endpoint, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(dataDepartment)
                });
      
                statusCodes.push(res.status);
                console.log(`Response status for department ${i + 1}:`, res.status);
              }
      
              return statusCodes;

            } catch (error) {
              console.error('Error:', error);
              throw error;
            }
          }
        } else {
          console.log("No logged in data found");
        }
      
        return statusCodes;
      }

      async getCompanyBranchById (companyId : string) {

        try {
            
            const endpoint = `${url}/companybranches/by-company/${companyId}`;
            const res = await axios.get(endpoint);
            return res.data;

        } catch (error) {
            console.error(error);
        }

      }
      

    setUrlLogo = (url: string) => {
        this.urlLogo = url;
        return this.urlLogo;
    }
}