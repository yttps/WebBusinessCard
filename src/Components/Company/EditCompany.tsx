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
import { Button } from 'react-bootstrap';


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
    const [loading, setLoading] = useState(true);
    // const [hasGetDataCompanyById, setHasGetDataCompanyById] = useState(false);
    // const [hasGetAllEmployeesByCompany, setHasGetAllEmployeesByCompany] = useState(false);
    const [hasGetTemplateByCompanyId, setHasGetTemplateByCompanyId] = useState(false);
    const [checkLoading, setCheckLoading] = useState(false);
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const today = new Date().toISOString().split('T')[0];

    const [imageData, setImageData] = useState({
        base64textString: '',
        imageName: '',
        showImage: false,
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setPreviewImage(event.target.files[0]);
            console.log(hasGetTemplateByCompanyId);
        }
    };

    function handleRemoveImage() {
        setImageData({
            base64textString: '',
            imageName: '',
            showImage: false,
        });
        setFile(null);

        if (backgroundInputRef.current) {
            backgroundInputRef.current.value = "";
        }
    }

    function setPreviewImage(file: File) {

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageData({
                base64textString: reader.result as string,
                imageName: file.name,
                showImage: true,
            });
        };
        reader.readAsDataURL(file);
    }

    async function SaveDetails(e: React.FormEvent<HTMLFormElement>, CompanyId: string) {



        e.preventDefault();

        const cancleBtn = document.getElementById('cancleBtn') as HTMLButtonElement;
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;

        console.log('company id', CompanyId);

        const nameElement = document.getElementById('nameEdit') as HTMLInputElement;
        const websiteElement = document.getElementById('websiteEdit') as HTMLInputElement;
        const businesstypeElement = document.getElementById('businesstypeEdit') as HTMLInputElement;
        const yearFoundedElement = document.getElementById('yearfoundedEdit') as HTMLInputElement;
        const emailElement = document.getElementById('emailEdit') as HTMLInputElement;

        const formEdit = {
            name: nameElement.value !== '' ? nameElement.value : dataCompanyById?.name ?? '',
            website: websiteElement.value !== '' ? websiteElement.value : dataCompanyById?.website ?? '',
            password: dataCompanyById?.password ?? '',
            businessType: businesstypeElement.value !== '' ? businesstypeElement.value : dataCompanyById?.businessType ?? '',
            yearFounded: yearFoundedElement.value !== '' ? yearFoundedElement.value : dataCompanyById?.yearFounded ?? '',
            email: emailElement.value !== '' ? emailElement.value : dataCompanyById?.email ?? '',
            status: '1'
        };

        const emailRegex = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-z]{2,}))$/
        );
        const websiteRegex = new RegExp(/^www\.[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-z]{2,}$/);
        const allValuesNotNull = Object.values(formEdit).every(value => value !== null && value !== '');

        if (!allValuesNotNull) {
            Swal.fire({
                title: 'Error!',
                text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
                icon: 'error',
            });
            return;
        }

        if (!emailRegex.test(formEdit.email)) {
            Swal.fire({
                title: 'Add Data Error!',
                text: 'อีเมลต้องมี "@" และ ".com"',
                icon: 'error',
            });
            return;
        }
        if (!websiteRegex.test(formEdit.website)) {
            Swal.fire({
                title: 'Error!',
                text: 'กรอกข้อมูลเว็บไซต์ให้ถูกต้อง!',
                icon: 'error',
            });
            return;
        }
        if (!file) {
            Swal.fire({
                title: 'Error!',
                text: 'โปรดเลือกรูปภาพ',
                icon: 'error',
            });
            return;
        }

    

        cancleBtn.style.visibility = 'hidden';
        submitBtn.style.visibility = 'hidden';
        if (imageData.showImage) {
            const removeBtn = document.getElementById('removeBtn') as HTMLButtonElement;
            removeBtn.style.visibility = 'hidden';
        }
        setCheckLoading(true);

        try {

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

                     //check ซ้ำอีเมล

                    console.log('response update data company', resUpdateDataCompany);

                    if (resUpdateDataCompany == 200) {

                        //update card
                        const resUpdateDetailCard = await updateDetailCard(resUrlLogo, formEdit.name);

                        if (resUpdateDetailCard == 200) {

                            setCheckLoading(false);

                            const res = await Swal.fire({
                                title: 'Success!',
                                text: 'Update ข้อมูลสำเร็จ',
                                icon: 'success',
                            });

                            if (res) {
                                nav('/ListHr', { replace: true });
                                window.location.reload();
                            }
                        } else {
                            setCheckLoading(false);
                            const res = await Swal.fire({
                                title: 'Success!',
                                text: 'Update ข้อมูลสำเร็จ',
                                icon: 'success',
                            });

                            if (res) {
                                nav('/ListHr', { replace: true });
                                window.location.reload();
                            }
                        }
                    }
                    //check ซ้ำ 0
                    if(resUpdateDataCompany == 400){
                        if (imageData.showImage) {
                            const removeBtn = document.getElementById('removeBtn') as HTMLButtonElement;
                            removeBtn.style.visibility = 'visible';
                        }
                        cancleBtn.style.visibility = 'visible';
                        submitBtn.style.visibility = 'visible';
                        Swal.fire({
                            title: 'Error!',
                            text: 'อีเมลซ้ำกับ User อื่น',
                            icon: 'error',
                        });
                    }

                }
            }

            if (!file) {

                if (dataCompanyById?.logo) {

                    // setCheckLoading(false);
                    // removeBtn.style.visibility = 'hidden';
                    const resUpdateDataCompany = await companyapi.updateDataCompany(
                        formEdit.name, formEdit.website, formEdit.password, formEdit.businessType, formEdit.yearFounded,
                        formEdit.email, dataCompanyById?.logo, formEdit.status, CompanyId
                    );

                    if (resUpdateDataCompany == 200) {

                        //update card
                        const resUpdateDetailCard = await updateDetailCard(dataCompanyById?.logo, formEdit.name);

                        if (resUpdateDetailCard) {

                            setCheckLoading(false);

                            const res = await Swal.fire({
                                title: 'Success!',
                                text: 'Update ข้อมูลสำเร็จ',
                                icon: 'success',
                            });

                            if (res) {
                                nav('/ListHr', { replace: true });
                                window.location.reload();
                            }
                        }
                    }
                    else {
                        setCheckLoading(false);
                        const res = await Swal.fire({
                            title: 'Success!',
                            text: 'Update ข้อมูลสำเร็จ',
                            icon: 'success',
                        });

                        if (res) {
                            nav('/ListHr', { replace: true });
                            window.location.reload();
                        }
                    }
                }
                else {
                    if (imageData.showImage) {
                        const removeBtn = document.getElementById('removeBtn') as HTMLButtonElement;
                        removeBtn.style.visibility = 'visible';
                    }
                    cancleBtn.style.visibility = 'visible';
                    submitBtn.style.visibility = 'visible';
                    setCheckLoading(false);
                    console.error('logo not found!');
                    return;
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            if (imageData.showImage) {
                const removeBtn = document.getElementById('removeBtn') as HTMLButtonElement;
                removeBtn.style.visibility = 'visible';
            }
            cancleBtn.style.visibility = 'visible';
            submitBtn.style.visibility = 'visible';
            setCheckLoading(false);
        }


    }

    async function updateDetailCard(urlLogo: string, nameCompany: string) {

        if (!TemplateBycompanyId) {
            return 400;
        }

        if (TemplateBycompanyId[0]?.status?.toString() !== '1') {
            return 400;
        }

        if (!TemplateBycompanyId || !getDataCompanyById) {
            console.error('TemplateBycompanyId or getDataCompanyById is not available');
            return;
        }

        const newGeneratedFiles: { file: File; uid: string }[] = [];
        const temId = TemplateBycompanyId[0].id;
        const positions = {
            companyAddress: {
                x: TemplateBycompanyId[0].companyAddress.x,
                y: TemplateBycompanyId[0].companyAddress.y,
                fontSize: TemplateBycompanyId[0].companyAddress.fontSize || '0',
                fontColor: TemplateBycompanyId[0].companyAddress.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].companyAddress.fontStyle || 'Bold',
            },
            companyName: {
                x: TemplateBycompanyId[0].companyName.x,
                y: TemplateBycompanyId[0].companyName.y,
                fontSize: TemplateBycompanyId[0].companyName.fontSize || '0',
                fontColor: TemplateBycompanyId[0].companyName.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].companyName.fontStyle || 'Bold',
            },
            departmentName: {
                x: TemplateBycompanyId[0].departmentName.x,
                y: TemplateBycompanyId[0].departmentName.y,
                fontSize: TemplateBycompanyId[0].departmentName.fontSize || '0',
                fontColor: TemplateBycompanyId[0].departmentName.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].departmentName.fontStyle || 'Bold',
            },
            email: {
                x: TemplateBycompanyId[0].email.x,
                y: TemplateBycompanyId[0].email.y,
                fontSize: TemplateBycompanyId[0].email.fontSize || '0',
                fontColor: TemplateBycompanyId[0].email.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].email.fontStyle || 'Bold',
            },
            fullname: {
                x: TemplateBycompanyId[0].fullname.x,
                y: TemplateBycompanyId[0].fullname.y,
                fontSize: TemplateBycompanyId[0].fullname.fontSize || '0',
                fontColor: TemplateBycompanyId[0].fullname.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].fullname.fontStyle || 'Bold',
            },
            logo: {
                x: TemplateBycompanyId[0].logo.x,
                y: TemplateBycompanyId[0].logo.y,
                fontSize: TemplateBycompanyId[0].logo.fontSize || '0',
                fontColor: TemplateBycompanyId[0].logo.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].logo.fontStyle || 'Bold',
            },
            phone: {
                x: TemplateBycompanyId[0].phone.x,
                y: TemplateBycompanyId[0].phone.y,
                fontSize: TemplateBycompanyId[0].phone.fontSize || '0',
                fontColor: TemplateBycompanyId[0].phone.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].phone.fontStyle || 'Bold',
            },
            phoneDepartment: {
                x: TemplateBycompanyId[0].phoneDepartment.x,
                y: TemplateBycompanyId[0].phoneDepartment.y,
                fontSize: TemplateBycompanyId[0].phoneDepartment.fontSize || '0',
                fontColor: TemplateBycompanyId[0].phoneDepartment.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].phoneDepartment.fontStyle || 'Bold',
            },
            position: {
                x: TemplateBycompanyId[0].position.x,
                y: TemplateBycompanyId[0].position.y,
                fontSize: TemplateBycompanyId[0].position.fontSize || '0',
                fontColor: TemplateBycompanyId[0].position.fontColor || '#000000',
                fontStyle: TemplateBycompanyId[0].position.fontStyle || 'Bold',
            },
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

    const drawImage = (background: string, textMappings: { [key: string]: string },
        positions: { [key: string]: { x: number; y: number, fontSize: string, fontColor: string, fontStyle: string } }, logo: string) => {
        return new Promise<string>((resolve, reject) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (canvas && ctx) {
                canvas.width = 950;
                canvas.height = 550;
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = `${background}`;

                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    Object.keys(textMappings).forEach((key) => {
                        if (positions[key]) {
                            const { x, y, fontSize, fontColor, fontStyle } = positions[key];
                            ctx.font = `${fontSize}px ${fontStyle}`;
                            ctx.fillStyle = `${fontColor}`;
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
                            //ctx.drawImage(logoImg, x, y, 200, 100);
                            drawLogo(ctx, logoImg, x, y, canvas.width, canvas.height);

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

    const drawLogo = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, canvasWidth: number, canvasHeight: number) => {
        const aspectRatio = image.width / image.height;
        let logoWidth = canvasWidth * 0.5; // Example width, adjust as needed
        let logoHeight = logoWidth / aspectRatio;

        // Ensure the logo fits within the canvas height
        if (logoHeight > canvasHeight * 0.5) {
            logoHeight = canvasHeight * 0.5;
            logoWidth = logoHeight * aspectRatio;
        }

        ctx.drawImage(image, x, y, logoWidth, logoHeight);
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
            return 400;
        }

    }

    function toListHr() {
        nav('/ListHr');
    }

    const getDataCompanyById = useCallback(async (CompanyId: string) => {
        try {

            const resGetdataCompany = await companyapi.GetDataCompanyById(CompanyId);
            setDataCompanyById(resGetdataCompany);
            setLoading(false);
            // setHasGetDataCompanyById(resGetdataCompany.length > 0);

        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    }, [companyapi]);

    const getAllEmployeesByCompany = useCallback(async (CompanyId: string) => {
        try {

            const resGetdataEmployees = await employeesapi.GetAllDataemployeesByCompanyId(CompanyId);
            setGetEmployeesByCompany(resGetdataEmployees);
            // setHasGetAllEmployeesByCompany(resGetdataEmployees.length > 0);

        } catch (error) {
            console.error('Error fetching employees data:', error);
        }
    }, [employeesapi]);

    const getTemplateByCompanyId = useCallback(async (CompanyId: string) => {
        try {

            const res = await templateapi.getTemplateUsedByCompanyId(CompanyId);
            setTemplateBycompanyId(res);
            setHasGetTemplateByCompanyId(res.length > 0);

        } catch (error) {
            console.error('Error fetching template data:', error);
        }
    }, [templateapi]);


    useEffect(() => {

        if (!isFetch) {
            const loggedInData = localStorage.getItem("LoggedIn");

            if (loggedInData) {

                const parsedData = JSON.parse(loggedInData);
                const CompanyId = parsedData.id;

                if (CompanyId) {
                    setLoading(true);
                    getDataCompanyById(CompanyId);
                    getAllEmployeesByCompany(CompanyId);
                    getTemplateByCompanyId(CompanyId);
                    setIsfetch(true);
                }
            }
        }

        console.log('data em',);
    }, [companyapi, isFetch, getDataCompanyById, dataCompanyById, getAllEmployeesByCompany, getTemplateByCompanyId]);

    console.log('chkk', dataCompanyById);


    if (loading) {
        return (
            <div>
                <Header />
                <br />
                <div className="bg-card p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
                    <div className="flex">
                        <div className="w-1/3 bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-center items-center">
                                <p className='pr-5'>Loading data</p>
                                <l-tail-chase
                                    size="30"
                                    speed="1.75"
                                    color="black"
                                ></l-tail-chase>
                            </div>
                        </div>

                        <div className="flex justify-center w-2/3 bg-gray-50 p-4 rounded-lg ml-4">
                            <p className='pr-5'>Loading data</p>
                            <l-tail-chase
                                size="30"
                                speed="1.75"
                                color="black"
                            ></l-tail-chase>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <br />
            <div>
                {dataCompanyById ? (
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
                                                type='date'
                                                id="yearfoundedEdit"
                                                max={today}
                                                value={dataCompanyById.yearFounded ? dataCompanyById.yearFounded : ''}
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
                                            <br />
                                            <p className="text-muted-foreground">Logo บริษัท:</p>
                                            <label>
                                                <input
                                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                                    type="file"
                                                    id='selectImg'
                                                    onChange={handleFileChange}
                                                    ref={backgroundInputRef}
                                                />
                                            </label>
                                            {imageData.showImage ? (

                                                <div>
                                                    <br />
                                                    <p>รูปโลโก้ใหม่ :</p>
                                                    <br />
                                                    <img src={imageData.base64textString} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                                    <div onClick={handleRemoveImage}>
                                                        <Button id='removeBtn' variant="danger">Remove Image</Button>
                                                    </div>
                                                </div>

                                            ) : (

                                                <div>
                                                    <br />
                                                    <p>รูปโลโก้ที่มีอยู่แล้ว :</p>
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
                                <button id='cancleBtn' className="bg-gray-500 text-red-50 hover:bg-gray-600 py-2 px-4 rounded-lg" onClick={toListHr}>ยกเลิก</button>
                                &nbsp;
                                <button id='submitBtn' className="bg-green-500 text-red-50 hover:bg-green-600 py-2 px-4 rounded-lg" type='submit'>ตกลง</button>
                            </div>

                            {checkLoading ?
                                <div className='flex justify-content-end'>
                                    <h1>กำลังตรวจสอบข้อมูล </h1>
                                    &nbsp;
                                    <l-tail-chase
                                        size="15"
                                        speed="1.75"
                                        color="black"
                                    ></l-tail-chase>
                                </div>
                                : <div></div>}

                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </form>
                    </div>
                ) : (
                    <div>
                        <Header />
                        <br />
                        <div className="bg-card p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
                            <div className="flex">
                                <div className="w-1/3 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-center items-center">
                                        <h5>Not Found Data</h5>
                                    </div>
                                </div>

                                <div className="flex justify-center w-2/3 bg-gray-50 p-4 rounded-lg ml-4">
                                    <img src="https://lh6.googleusercontent.com/Bu-pRqU_tWZV7O3rJ5nV1P6NjqFnnAs8kVLC5VGz_Kf7ws0nDUXoGTc7pP87tyUCfu8VyXi0YviIm7CxAISDr2lJSwWwXQxxz98qxVfMcKTJfLPqbcfhn-QEeOowjrlwX1LYDFJN"
                                        alt=""
                                        style={{ width: '50%' }}
                                    />
                                    <h5>Not Found Data</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>

    )




}