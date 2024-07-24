import { useState, useEffect, useCallback, useMemo, ChangeEvent, useRef } from 'react'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi'
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { GetUsersByCompany } from '@/Model/GetUsersByCompany';
import { EmployeesApi } from '@/ApiEndpoints/EmployeesApi';
import Swal from 'sweetalert2';
import { GetTemplateCompanyId } from '@/Model/GetTemplateCompanyId';
import { TemplateApi } from '@/ApiEndpoints/TemplateApi';

export default function EditCompany() {

    const companyapi = useMemo(() => new CompanyApi(), []);
    const employeesapi = useMemo(() => new EmployeesApi(), []);
    const [dataCompanyById, setDataCompanyById] = useState<GetDataCompanyById | null>(null);
    const [getEmployeesByCompany, setGetEmployeesByCompany] = useState<GetUsersByCompany[] | null>(null);
    const [isFetch, setIsfetch] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nav = useNavigate();
    const templateapi = useMemo(() => new TemplateApi(), []);
    const [TemplateBycompanyId, setTemplateBycompanyId] = useState<GetTemplateCompanyId[]>([]);


    const [imageData] = useState({
        base64textString: '',
        imageName: '',
        showImage: false,
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    async function SaveDetails(e: React.FormEvent<HTMLFormElement>, CompanyId: string) {

        try {

            e.preventDefault();
            console.log('company id', CompanyId);


            const nameElement = document.getElementById('nameEdit') as HTMLInputElement;
            const websiteElement = document.getElementById('websiteEdit') as HTMLInputElement;
            const passwordElement = document.getElementById('passwordEdit') as HTMLInputElement;
            const businesstypeElement = document.getElementById('businesstypeEdit') as HTMLInputElement;
            const yearFoundedElement = document.getElementById('yearfoundedEdit') as HTMLInputElement;
            const emailElement = document.getElementById('emailEdit') as HTMLInputElement;

            const formEdit = {
                name: nameElement.value !== '' ? nameElement.value : dataCompanyById?.name ?? '',
                website: websiteElement.value !== '' ? websiteElement.value : dataCompanyById?.website ?? '',
                password: passwordElement.value !== '' ? passwordElement.value : dataCompanyById?.password ?? '',
                businessType: businesstypeElement.value !== '' ? businesstypeElement.value : dataCompanyById?.businessType ?? '',
                yearFounded: yearFoundedElement.value !== '' ? yearFoundedElement.value : dataCompanyById?.yearFounded ?? '',
                email: emailElement.value !== '' ? emailElement.value : dataCompanyById?.email ?? '',
                status: '1'
            };


            if (file) {

                //1 add logo 2 update data
                const folderName = 'logo';
                const collection = 'companies';
                const resUrlLogo = await companyapi.updateLogoCompany(file, CompanyId, folderName, collection);
                console.log('response update logo', resUrlLogo);

                if (resUrlLogo) {

                    const resUpdateDataCompany = await companyapi.updateDataCompany(
                        formEdit.name, formEdit.website, formEdit.password, formEdit.businessType, formEdit.yearFounded,
                        formEdit.email, resUrlLogo, formEdit.status, CompanyId
                    );

                    console.log('response update data company' , resUpdateDataCompany);

                    if (resUpdateDataCompany == 200) {

                        //update card
                        const resUpdateDetailCard = await updateDetailCard(resUrlLogo, formEdit.name);

                        if (resUpdateDetailCard == 200) {
                            Swal.fire({
                                title: 'Success!',
                                text: 'Update ข้อมูลสำเร็จ',
                                icon: 'success',
                            }).then(() => {
                                nav('/ListEmployees');
                            });
                        }
                    }

                }
            }

            if (!file) {

                if (dataCompanyById?.logo) {

                    const resUpdateDataCompany = await companyapi.updateDataCompany(
                        formEdit.name, formEdit.website, formEdit.password, formEdit.businessType, formEdit.yearFounded,
                        formEdit.email, dataCompanyById?.logo, formEdit.status, CompanyId
                    );

                    if (resUpdateDataCompany == 200) {

                        //update card
                        const resUpdateDetailCard = await updateDetailCard(dataCompanyById?.logo, formEdit.name);

                        if (resUpdateDetailCard) {
                            Swal.fire({
                                title: 'Success!',
                                text: 'Update ข้อมูลสำเร็จ',
                                icon: 'success',
                            }).then(() => {
                                nav('/ListEmployees');
                            });
                        }
                    }

                }
                else {
                    console.error('formEdit.logo not found!');
                    return;
                }
            }

        } catch (error) {
            console.error(error);
        }


    }

    async function updateDetailCard(urlLogo: string, nameCompany: string) {

        if (TemplateBycompanyId[0]?.status?.toString() !== '1') {
            return;
        }

        if (!TemplateBycompanyId || !getDataCompanyById) {
            console.error('TemplateBycompanyId or getDataCompanyById is not available');
            return;
        }

        const newGeneratedFiles: { file: File; uid: string }[] = [];
        const temId = TemplateBycompanyId[0].id;
        const positions = {
            companyAddress: { x: TemplateBycompanyId[0].companyAddress.x, y: TemplateBycompanyId[0].companyAddress.y },
            companyName: { x: TemplateBycompanyId[0].companyName.x, y: TemplateBycompanyId[0].companyName.y },
            departmentName: { x: TemplateBycompanyId[0].departmentName.x, y: TemplateBycompanyId[0].departmentName.y },
            email: { x: TemplateBycompanyId[0].email.x, y: TemplateBycompanyId[0].email.y },
            fullname: { x: TemplateBycompanyId[0].fullname.x, y: TemplateBycompanyId[0].fullname.y },
            logo: { x: TemplateBycompanyId[0].logo.x, y: TemplateBycompanyId[0].logo.y },
            phone: { x: TemplateBycompanyId[0].phone.x, y: TemplateBycompanyId[0].phone.y },
            phoneDepartment: { x: TemplateBycompanyId[0].phoneDepartment.x, y: TemplateBycompanyId[0].phoneDepartment.y },
            position: { x: TemplateBycompanyId[0].position.x, y: TemplateBycompanyId[0].position.y }
        };

        console.log('positions', positions);
        console.log('getEmployeesByCompany', getEmployeesByCompany);
        console.log('TemplateBycompanyId', TemplateBycompanyId);
        console.log('dataCompanyById', dataCompanyById);

        if (getEmployeesByCompany && urlLogo) {

            for (const user of getEmployeesByCompany) {

                const textMappings = {
                    "fullname": `${user.firstname} ${user.lastname}`,
                    "companyName": `${nameCompany}`,
                    "companyAddress": `${user.companybranch.address}`,
                    "position": `${user.position}`,
                    "email": `${user.email}`,
                    "phoneDepartment": `${user.department.phone}`,
                    "phone": `${user.phone}`,
                    "departmentName": `${user.department.name}`,
                };

                try {

                    console.log('link logo', urlLogo);
                    //api get status 1 not working if tem status 1 have multi program errors //TemplateBycompanyId[0] status 1 in 1 database!!!
                    const imageUrl = await drawImage(TemplateBycompanyId[0].background, textMappings, positions, urlLogo);
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    const file = new File([blob], `${user.id}.png`, { type: 'image/png' });

                    const data = {
                        file: file,
                        uid: user.id,
                    };

                    newGeneratedFiles.push(data);

                } catch (error) {
                    console.error('Error generating image:', error);
                }
            }
        }

        if (newGeneratedFiles.length > 0) {

            const resuploadSelectedTemplate = await uploadSelectedTemplate(newGeneratedFiles, temId);
            return resuploadSelectedTemplate;
        }

    }

    const drawImage = (background: string, textMappings: { [key: string]: string }, positions: { [key: string]: { x: number; y: number } }, logo: string) => {
        return new Promise<string>((resolve, reject) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (canvas && ctx) {
                canvas.width = 900;
                canvas.height = 600;
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = `${background}`;

                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    Object.keys(textMappings).forEach((key) => {
                        if (positions[key]) {
                            const { x, y } = positions[key];
                            ctx.font = '30px Bold';
                            ctx.fillStyle = 'black';
                            ctx.fillText(textMappings[key], x, y);
                        } else {
                            console.log(`Position for key ${key} not found`);
                        }
                    });

                    const logoImg = new Image();
                    logoImg.crossOrigin = 'anonymous';
                    logoImg.src = `${logo}`;

                    logoImg.onload = () => {
                        if (positions.logo) {
                            const { x, y } = positions.logo;
                            ctx.drawImage(logoImg, x, y, 180, 100);

                            canvas.toBlob((blob) => {
                                if (blob) {
                                    const url = URL.createObjectURL(blob);
                                    resolve(url);
                                } else {
                                    reject('Failed to create blob from canvas');
                                }
                            }, 'image/png');
                        } else {
                            reject('Logo position not found');
                        }
                    };

                    logoImg.onerror = () => {
                        reject('Failed to load logo image');
                    };
                };
                img.onerror = () => {
                    reject('Failed to load background image');
                };
            } else {
                reject('Canvas or context not found');
            }
        });
    };

    async function uploadSelectedTemplate(cardUsers: { file: File, uid: string }[], temId: string) {

        if (TemplateBycompanyId[0]?.status?.toString() === '1' && dataCompanyById) {

            const status = '1';
            const resUpload = await templateapi.uploadSelectedTemplate(cardUsers);
            const allSuccess = resUpload.every((status: number) => status === 200);

            if (allSuccess) {

                const resUpdateStatus = await templateapi.updateStatus(temId, status, dataCompanyById?.id);

                if (resUpdateStatus == 200) {

                    return resUpdateStatus;
                }

            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'บางไฟล์อัพโหลดไม่สำเร็จ',
                    icon: 'error',
                });
            }
        }
        else {
            console.log('Non selected template');
            return;
        }

    }



    function toListEmployees() {
        nav('/ListEmployees');
    }


    const getDataCompanyById = useCallback(async (CompanyId: string) => {

        const resGetdataCompany = await companyapi.GetDataCompanyById(CompanyId);
        setDataCompanyById(resGetdataCompany);

    }, [companyapi]);

    const getAllEmployeesByCompany = useCallback(async (CompanyId: string) => {

        const resGetdataEmployees = await employeesapi.GetAllDataemployeesByCompanyId(CompanyId);
        setGetEmployeesByCompany(resGetdataEmployees);

    }, [employeesapi]);

    const getTemplateByCompanyId = useCallback(async (CompanyId: string) => {
        const res = await templateapi.getTemplateUsedByCompanyId(CompanyId);
        setTemplateBycompanyId(res);
    }, [templateapi]);

    useEffect(() => {

        if (!isFetch) {
            const loggedInData = localStorage.getItem("LoggedIn");

            if (loggedInData) {

                const parsedData = JSON.parse(loggedInData);
                const CompanyId = parsedData.companyId;

                if (CompanyId) {
                    getDataCompanyById(CompanyId);
                    getAllEmployeesByCompany(CompanyId);
                    getTemplateByCompanyId(CompanyId);
                    setIsfetch(true);
                }
            }
        }
    }, [companyapi, isFetch, getDataCompanyById, dataCompanyById, getAllEmployeesByCompany, getTemplateByCompanyId])

    return (

        <>
            <Header />
            <br />
            <div>
                {dataCompanyById && (
                    <div className="bg-card p-6 rounded-lg shadow-lg max-w-max mx-auto">
                        <form onSubmit={(e) => SaveDetails(e, dataCompanyById.id)}>
                            <div className="flex">
                                <div className="max-w-full bg-gray-100 p-3 rounded-lg ml-0">
                                    <h2 className="text-lg font-semibold mb-4">แก้ไขข้อมูลรายละเอียดบริษัท</h2>
                                    <br />
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-muted-foreground">ชื่อบริษัท:</p>
                                            <input
                                                onChange={(e) => setDataCompanyById({ ...dataCompanyById, name: e.target.value })}
                                                value={dataCompanyById.name || ''}
                                                type="text" id="nameEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataCompanyById.name} />
                                            <br />
                                            <p className="text-muted-foreground">ประเภทธุรกิจ:</p>
                                            <input
                                                onChange={(e) => setDataCompanyById({ ...dataCompanyById, businessType: e.target.value })}
                                                value={dataCompanyById.businessType || ''}
                                                type="text" id="businesstypeEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataCompanyById.businessType} />
                                            <br />
                                            <p className="text-muted-foreground">เว็บไซต์:</p>
                                            <input
                                                onChange={(e) => setDataCompanyById({ ...dataCompanyById, website: e.target.value })}
                                                value={dataCompanyById.website || ''}
                                                type="text"
                                                id="websiteEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataCompanyById.website} />
                                            <br />
                                            <p className="text-muted-foreground">ปีที่ก่อตั้ง:</p>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type='datetime-local'
                                                id="yearfoundedEdit"
                                                value={dataCompanyById.yearFounded ? new Date(dataCompanyById.yearFounded).toISOString().slice(0, 16) : ''}
                                                onChange={(e) => setDataCompanyById({ ...dataCompanyById, yearFounded: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">อีเมล:</p>
                                            <input
                                                onChange={(e) => setDataCompanyById({ ...dataCompanyById, email: e.target.value })}
                                                value={dataCompanyById.email || ''}
                                                type="text"
                                                id="emailEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataCompanyById.email} />
                                            <br />
                                            <p className="text-muted-foreground">รหัสผ่าน:</p>
                                            <input
                                                onChange={(e) => setDataCompanyById({ ...dataCompanyById, password: e.target.value })}
                                                value={dataCompanyById.password || ''}
                                                type="text"
                                                id="passwordEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataCompanyById.password} />
                                            <br />
                                            <br />
                                            <p className="text-muted-foreground">Logo บริษัท:</p>
                                            <label>
                                                <input
                                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                                    type="file"
                                                    id='selectImg'
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            {imageData.showImage ? (
                                                <div>
                                                    <img
                                                        src={imageData.base64textString}
                                                        alt={imageData.imageName}
                                                        style={{ maxWidth: '100%' }}
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <br />
                                                    <p>Logo บริษัท :</p>
                                                    <br />
                                                    <img src={dataCompanyById.logo || ''} alt="" />
                                                </div>
                                            )}
                                            <br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg" type='submit'>ตกลง</button>
                                &nbsp;
                                <button className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg" onClick={toListEmployees}>ยกเลิก</button>
                            </div>
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </form>
                    </div>
                )}
            </div>
        </>

    )
}