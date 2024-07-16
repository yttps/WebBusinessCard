import axios from "axios";

const url = "https://business-api-638w.onrender.com";
// const url = "http://localhost:3000";
type TextPosition = {
    x: number;
    y: number;
};

type AllPosition = {
    [key: string]: TextPosition;
};

export class TemplateApi {



    async uploadBgTemplate(background: File, TemIDcompany: string, folderName: string, collection: string): Promise<string | undefined> {

        try {

            const formData = new FormData();

            formData.append('folder', folderName);
            formData.append('collection', collection);
            formData.append('uid', TemIDcompany);
            formData.append('file', background);


            // const res = await fetch(`${url}/upload-image`, {
            //     method: 'POST',
            //     body: formData
            // });

            const res = await axios.post(`${url}/upload-image` , formData);

            console.log('detail', TemIDcompany, folderName, collection , background);
            console.log('res ponse url', res.data.imageUrl);
            return res.data.imageUrl;


            // if (res.ok) {
            //     console.log('Upload successful:', res.status);
            //     return data;
            // } else {
            //     console.log('Upload failed with status:', res.status);
            //     return data;
            // }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // async createCardsForUsers(userData[]: string[], TemIDcompany: string, folderName: string, collection: string): Promise<string | undefined> {

    //     try {

    //         const formData = new FormData();

    //         formData.append('folder', folderName);
    //         formData.append('collection', collection);
    //         formData.append('uid', TemIDcompany);
    //         // formData.append('file', background);


    //         // const res = await fetch(`${url}/upload-image`, {
    //         //     method: 'POST',
    //         //     body: formData
    //         // });

    //         const res = await axios.post(`${url}/upload-image` , formData);

    //         console.log('detail', TemIDcompany, folderName, collection , background);
    //         console.log('res ponse url', res.data.imageUrl);
    //         return res.data.imageUrl;


    //         // if (res.ok) {
    //         //     console.log('Upload successful:', res.status);
    //         //     return data;
    //         // } else {
    //         //     console.log('Upload failed with status:', res.status);
    //         //     return data;
    //         // }

    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // }

    async uploadTemplateCompany(nameTemplate: string, getCompanyId: string, allPositions: AllPosition, status: string): Promise<string | undefined> {

        try {


            const data = {
                name: nameTemplate,
                companyID: getCompanyId,
                fullname: allPositions.fullname,
                companyName: allPositions.companyName,
                companyAddress: allPositions.companyAddress,
                position: allPositions.position,
                email: allPositions.email,
                phoneDepartment: allPositions.phoneDepartment,
                phone: allPositions.phone,
                departmentName: allPositions.departmentName,
                logo: allPositions.logo,
                status: status,
            };

            console.log(data);

            const res = await axios.post(`${url}/templates`, data);           
            console.log('check' , res.data.templateId);
            return res.data.templateId;

        } catch (error) {
            console.error("check" , error);
            throw error;
        }
    }

    async getTemplateByCompanyId(companyId: string) {

        try {

            if (companyId) {

                const res = await axios.get(`${url}/templates/by-company/${companyId}`);

                return res.data;
            }
            else {
                console.log("company id not found");
                return;
            }


        } catch (error) {
            console.error();
        }
    }

}
