import axios from 'axios';

const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:3000";   
interface departmentData {
    name: string,
    companyID: string,
    phone: string
}

export class CompanyApi {

    private urlLogo: string = '';

    async GetAllCompanyAccept() {

        try {

            const res = await axios.get(url + '/companies');
            const companyData = res.data;

            const filteredData = companyData.filter((company: { status: string }) => company.status !== '0');
            console.log('in context', filteredData);
            return filteredData;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async AcceptCompanyData(companyid: string) {

        try {

            const status = { status: '1' };
            const res = await axios.put(`${url}/companies/status/${companyid}`, status);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetAllCompanyNoAccept() {

        try {

            const res = await axios.get(url + '/companies');
            const companyData = res.data;

            const filteredData = companyData.filter((company: { status: string }) => company.status === '0');
            console.log('in context', filteredData);
            return filteredData;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetDataCompanyById(id: string) {

        try {

            const res = await axios.get(`${url}/companies/${id}`);

            const companyDataById = res.data;
            return companyDataById;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetLinkLogoCompanyById(id: string) {

        try {

            const res = await axios.get(`${url}/companies/${id}`);

            const urlLogo = res.data.logo;
            return urlLogo;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateLogoCompany(Logo: File, companyid: string, folderName: string, collection: string): Promise<string | undefined> {

        try {

            const formData = new FormData();

            formData.append('file', Logo);
            formData.append('folder', folderName);
            formData.append('collection', collection)
            formData.append('uid', companyid);

            const res = await axios.post(`${url}/upload-image`, formData);
            return res.data.imageUrl;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async UploadLogo(Logo: File, companyid: string, folderName: string, collection: string): Promise<number | undefined> {

        const formData = new FormData();

        formData.append('file', Logo);
        formData.append('folder', folderName);
        formData.append('collection', collection)
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

        try {

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
                logo: 'logo',
                status: '0'
            }

            console.log('data com in context', dataCompany);

            const res = await axios.post(`${url}/companies`, dataCompany);
            console.log("upload data in context", res.data.companyId);
            return res.data.companyId;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
                if (error.response) {
                    console.log('Response data:', error.response.data);
                    console.log('Company ID:', error.response.data.companyId);
                    return error.response.data.companyId;
                }
            } else {
                console.error('Unexpected error:', error);
            }
            throw error;
        }
    }

    async DeleteCompany(companyId: string) {

        try {

            console.log('DeleteCompany', companyId);
            const res = await axios.delete(`${url}/companies/${companyId}`);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteBranch(branchId: string) {

        try {

            const urlWithId = `${url}/companybranches/${branchId}`;
            const res = await axios.delete(urlWithId);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteDepartment(departmentId: string) {

        try {

            const urlWithId = `${url}/departments/${departmentId}`;
            const res = await axios.delete(urlWithId);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateDataCompany(
        name:string,
        website:string,
        password:string,
        businessType:string,
        yearFounded: string,
        email: string,
        logo: string,
        status: string,
        CompanyId: string
    ){

        try {
            
            const data = {
                name:name,
                businessType:businessType,
                website:website,
                email:email,
                password: password,
                yearFounded: yearFounded,
                status: status,
                logo: logo,
                id:CompanyId
            };

            const res = await axios.put(`${url}/companies/${data.id}`,data);
            console.log('in api' , data);
            return res.status;

        } catch (error) {
            console.error(error);
        }
    }

    async AddCompanyBranch(
        nameBranches: string,
        subdistrict: string,
        district: string,
        province: string,
        country: string) {

        const loggedInData = localStorage.getItem("LoggedIn");

        if (loggedInData) {

            const parsedData = JSON.parse(loggedInData);
            const CompanyId = parsedData.id;
            const endpoint = `${url}/companybranches`;

            if (CompanyId) {

                try {

                    const dataBranch = {
                        name: nameBranches,
                        companyID: CompanyId,
                        subdistrict: subdistrict,
                        district: district,
                        province: province,
                        country: country
                    }

                    console.log('check', dataBranch);

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

        if (loggedInData) {
            const parsedData = JSON.parse(loggedInData);
            const CompanyId = parsedData.id;
            const endpoint = `${url}/departments`;

            if (CompanyId) {
                try {
                    // Fetch existing departments once
                    const resCheckData = await axios.get(`${url}/departments/by-company/${CompanyId}`);
                    const DepartmentcheckData: departmentData[] = resCheckData.data;

                    for (const dept of departments) {
                        // Check if the department name already exists
                        const exists = DepartmentcheckData.some(existingDept => existingDept.name.toUpperCase() === dept.name.toUpperCase());

                        if (!exists) {
                            const dataDepartment = {
                                name: dept.name,
                                companyID: CompanyId,
                                phone: dept.phone
                            };

                            const res = await fetch(endpoint, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(dataDepartment)
                            });

                            statusCodes.push(res.status);
                        } else {
                            console.log(`Department with name ${dept.name} already exists.`);
                        }
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

    async getCompanyBranchById(companyId: string) {

        try {

            const endpoint = `${url}/companybranches/by-company/${companyId}`;
            const res = await axios.get(endpoint);
            console.log("getCompanyBranchById", res.data);
            return res.data;

        } catch (error) {
            console.error(error);
        }

    }

    async getDepartmentByCompanyId(companyId: string) {

        try {

            const endpoint = `${url}/departments/by-company/${companyId}`;
            const res = await axios.get(endpoint);
            console.log("getDepartmentByCompanyId", res.data);
            return res.data;

        } catch (error) {
            console.error(error);
        }

    }

    async getDepartmentNotHrByCompanyId(companyId: string) {

        try {

            const endpoint = `${url}/departments/by-company/${companyId}`;
            const res = await axios.get(endpoint);
            const departmentData = res.data;
            const filteredData = departmentData.filter((departmentHR: { name: string }) => departmentHR.name !== 'HR');

            console.log("getDepartmentByCompanyId", res.data);
            return filteredData;

        } catch (error) {
            console.error(error);
        }

    }

    async getDepartmentHRByCompanyId(companyId: string) {

        try {

            const endpoint = `${url}/departments/by-company/${companyId}`;
            const res = await axios.get(endpoint);
            const departmentHR = res.data;
            //filter 
            const filteredData = departmentHR.filter((departmentHR: { name: string }) => departmentHR.name === 'HR');

            console.log("getDepartmentByCompanyId", filteredData);
            return filteredData;

        } catch (error) {
            console.error(error);
        }

    }

    async GetUsersByCompany(companyId: string) {
        try {

            const endpoint = `${url}/user/by-company/${companyId}`;
            const res = await axios.get(endpoint);
            console.log("GetUsersByCompany", res.data);
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