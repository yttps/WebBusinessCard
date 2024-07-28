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



    async deleteTemplate(templateId: string) {

        try {

            const res = await axios.delete(`${url}/templates/${templateId}`);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async uploadBgTemplate(background: File, TemIDcompany: string, folderName: string, collection: string): Promise<string | undefined> {

        try {

            const formData = new FormData();

            formData.append('folder', folderName);
            formData.append('collection', collection);
            formData.append('uid', TemIDcompany);
            formData.append('file', background);

            const res = await axios.post(`${url}/upload-image`, formData);

            console.log('detail', TemIDcompany, folderName, collection, background);
            console.log('res ponse url', res.data.imageUrl);
            return res.data.imageUrl;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateStatus (temId: string,status:string ,companyId: string) {


        try {
            
            const data = { status : status };
            const res = await axios.put(`${url}/templates/status/${temId}/${companyId}`, data);
            console.log('updateStatus' , res.status);
            return res.status;
        
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async uploadTemplateCompany(
        nameTemplate: string, getCompanyId: string, allPositions: AllPosition, status: string, fontSize: string, selectedColor: string): Promise<string | undefined> {

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
                fontSize: fontSize,
                fontColor: selectedColor
            };

            console.log(data);

            const res = await axios.post(`${url}/templates`, data);
            console.log('check', res.data.templateId);
            return res.data.templateId;

        } catch (error) {
            console.error("check", error);
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

    async getTemplateUsedByCompanyId(companyId: string) {

        try {

            if (companyId) {

                const res = await axios.get(`${url}/templates/by-company/${companyId}`);
                const templateData = res.data;
                const filteredTemplateData = templateData.filter((template: { status: string }) => template.status == '1');
                return filteredTemplateData;
            }
            else {
                console.log("company id not found");
                return;
            }


        } catch (error) {
            console.error();
        }
    }

    async uploadSelectedTemplate(cardUsers: { file: File, uid: string }[]) {

        console.log('in context test', cardUsers);
        const statusCodes: number[] = [];
        const folderName = 'business_card';

        cardUsers.map(async (cardUser) => {
            const formData = new FormData();
            formData.append('file', cardUser.file);
            formData.append('folder', folderName);
            formData.append('uid', cardUser.uid);

            try {

                const res = await axios.post(`${url}/upload-image`, formData);
                statusCodes.push(res.status);
                console.log('status' , res.status);

            } catch (error) {
                console.error('Error uploading file:', error);
            }
        });

        console.log('Upload statuses:', statusCodes);
        return statusCodes;

    }

}
