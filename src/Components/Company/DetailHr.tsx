import { useEffect, useState, ChangeEvent, useRef, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { HrApi } from '@/ApiEndpoints/HrApi';
import { GetDataHrById } from '@/Model/GetDataHrById';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetCompanyBranchesById } from '@/Model/GetCompanyBranchesById';
import { GetDepartmentByComId } from '@/Model/GetDepartmentByComId';
import { GetTemplateCompanyId } from '@/Model/GetTemplateCompanyId';
import { TemplateApi } from '@/ApiEndpoints/TemplateApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';


export default function DetailHr() {

    const { id: HrId } = useParams();
    const hrapi = useMemo(() => new HrApi(), []);
    const templateapi = useMemo(() => new TemplateApi(), []);
    const companyapi = useMemo(() => new CompanyApi(), []);
    const [hrById, setHrById] = useState<GetDataHrById | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetch, setIsFetch] = useState(false);
    const nav = useNavigate();
    const [update, setUpdate] = useState(false);
    const [dataBranchesById, setDataBranchesById] = useState<GetCompanyBranchesById[]>([]);
    const [dataDepartmentById, setDataDepartmentById] = useState<GetDepartmentByComId[]>([]);
    const [TemplateBycompanyId, setTemplateBycompanyId] = useState<GetTemplateCompanyId[]>([]);
    const [getDataCompanyById, setGetDataCompanyById] = useState<GetDataCompanyById | null>(null);
    const [genderValue, setGenderValue] = useState('');
    const [departmentValue, setDepartmentValue] = useState('');
    const [departName, setDepartmentName] = useState('');
    const [branchValue, setBranchValue] = useState('');
    const [addressBranch, setAddressBranch] = useState('');
    const [telDepartment, setTelDepartment] = useState('');

    const [subdistrict, setSubdistrict] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('');

    const [file, setFile] = useState<File | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    async function SaveDetails(e: React.FormEvent<HTMLFormElement>, HRId: string) {

        try {

            e.preventDefault();
            const firstnameElement = document.getElementById('firstnameEdit') as HTMLInputElement;
            const lastnameElement = document.getElementById('lastnameEdit') as HTMLInputElement;
            const positionElement = document.getElementById('positionEdit') as HTMLInputElement;
            const birthdayElement = document.getElementById('birthdayEdit') as HTMLInputElement;
            const startworkElement = document.getElementById('startworkEdit') as HTMLInputElement;
            const subdistrictElement = document.getElementById('subdistrictEdit') as HTMLInputElement;
            const districtElement = document.getElementById('districtEdit') as HTMLInputElement;
            const provinceElement = document.getElementById('provinceEdit') as HTMLInputElement;
            const countryElement = document.getElementById('countryEdit') as HTMLInputElement;
            const telElement = document.getElementById('telEdit') as HTMLInputElement;
            const emailElement = document.getElementById('emailEdit') as HTMLInputElement;
            const passwordElement = document.getElementById('passwordEdit') as HTMLInputElement;

            const formEdit = {
                firstname: firstnameElement.value !== '' ? firstnameElement.value : hrById?.firstname ?? '',
                lastname: lastnameElement.value !== '' ? lastnameElement.value : hrById?.lastname ?? '',
                position: positionElement.value !== '' ? positionElement.value : hrById?.position ?? '',
                gender: genderValue !== '' ? genderValue : hrById?.gender ?? '',
                birthdate: birthdayElement.value !== '' ? birthdayElement.value : hrById?.birthdate ?? '',
                startwork: startworkElement.value !== '' ? startworkElement.value : hrById?.startwork ?? '',
                subdistrict: subdistrictElement.value !== '' ? subdistrictElement.value : subdistrict ?? '',
                district: districtElement.value !== '' ? districtElement.value : district ?? '',
                province: provinceElement.value !== '' ? provinceElement.value : province ?? '',
                country: countryElement.value !== '' ? countryElement.value : country ?? '',
                phone: telElement.value !== '' ? telElement.value : hrById?.phone ?? '',
                email: emailElement.value !== '' ? emailElement.value : hrById?.email ?? '',
                password: passwordElement.value !== '' ? passwordElement.value : hrById?.password ?? '',
                branch: branchValue !== '' ? branchValue : hrById?.companybranch?.id ?? '',
                department: departmentValue !== '' ? departmentValue : hrById?.department.id ?? ''
            };

            console.log('formEdit check before update', formEdit);

            const allValuesNotNull = Object.values(formEdit).every(value => value !== null && value !== '');
            const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            const phoneRegex = /^\d+$/;

            if (!allValuesNotNull) {
                Swal.fire({
                    title: 'Error!',
                    text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
                    icon: 'error',
                });
                return;
            }

            if (passwordElement.value.length < 6) {
                Swal.fire({
                    title: 'Error!',
                    text: 'กำหนดรหัสผ่านอย่างน้อย 6 ตัว!',
                    icon: 'error',
                });
                return;
            }
            if (!emailRegex.test(emailElement.value)) {
                Swal.fire({
                    title: 'Add Data Error!',
                    text: 'อีเมลต้องมี "@" และ ".com"',
                    icon: 'error',
                });
                return;
            }
            if (!phoneRegex.test(telElement.value)) {
                Swal.fire({
                    title: 'Add Data Error!',
                    text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
                    icon: 'error',
                });
                return;
            }

            const resUpdateData = await hrapi.updateDataHR(
                formEdit.firstname,
                formEdit.lastname,
                formEdit.position,
                formEdit.gender,
                formEdit.birthdate,
                formEdit.startwork,
                formEdit.subdistrict,
                formEdit.district,
                formEdit.province,
                formEdit.country,
                formEdit.phone,
                formEdit.email,
                formEdit.branch,
                formEdit.department,
                formEdit.password,
                HRId
            );

            console.log('res data', resUpdateData);

            if (resUpdateData == 200) {

                if (file) {
                    const folderName = '';
                    const collection = 'users';
                    const resUploadLogo = await hrapi.UploadProfile(file, HRId, folderName, collection);
                    //update card
                    const resUpdateDetailCard = await updateDetailCard();

                    if (resUploadLogo == 200 && resUpdateDetailCard == 200) {

                        Swal.fire({
                            title: 'Success!',
                            text: 'อัปเดทข้อมูลและรูปสำเร็จ!',
                            icon: 'success',
                        }).then(() => {
                            nav('/ListHr');
                            window.location.reload();
                        });
                    }
                }

                if (!file) {

                    //update card
                    const resUpdateDetailCard = await updateDetailCard();
                    console.log('check1', resUpdateDetailCard);

                    if (resUpdateDetailCard == 200) {

                        console.log('check2', resUpdateDetailCard);

                        Swal.fire({
                            title: 'Success!',
                            text: 'อัปเดทข้อมูลสำเร็จ!',
                            icon: 'success',
                        }).then(() => {
                            nav('/ListHr');
                            window.location.reload();
                        });
                    }
                }

            }

        } catch (error) {
            console.error(error);
        }
    }


    function editDetails() {

        if (update == true) {
            setUpdate(false);
        }
        if (update == false) {
            setUpdate(true);
        }
    }

    const handleDepartment = (e: ChangeEvent<HTMLSelectElement>) => {

        const selectedValue = e.target.value;
        setDepartmentValue(selectedValue);

        const selectedDepartment = dataDepartmentById.find(department => department.id === selectedValue);
        if (selectedDepartment) {
            setDepartmentName(selectedDepartment.name);
            setTelDepartment(selectedDepartment.phone);
        } else {
            setDepartmentName('');
        }

    };

    const handleBranches = (e: ChangeEvent<HTMLSelectElement>) => {

        const selectedValue = e.target.value;
        setBranchValue(e.target.value);

        const selectedBranch = dataBranchesById.find(branch => branch.id === selectedValue);
        if (selectedBranch) {
            setAddressBranch(selectedBranch.address)
        } else {
            setAddressBranch('');
        }

    };

    const handleGender = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setGenderValue(e.target.value);
    };

    console.log(handleGender);



    const DeleteHrData = async (): Promise<void> => {

        if (!hrById) return;

        try {
            const result = await Swal.fire({
                title: 'ลบข้อมูล?',
                text: 'ยืนยันเพื่อทำการลบข้อมูล!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const response = await hrapi.DeleteHr(hrById.id);

                if (response == 200) {
                    await Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });
                    nav('/ListHr', { replace: true });
                }
            }
        } catch (error) {
            console.error('Error deleting general user:', error);
            await Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
                icon: 'error',
            });
        }
    }



    async function updateDetailCard() {

        if (TemplateBycompanyId[0]?.status?.toString() !== '1') {
            return;
        }

        if (!TemplateBycompanyId || !getDataCompanyById) {
            console.error('TemplateBycompanyId or getDataCompanyById is not available');
            return;
        }

        const firstnameElement = document.getElementById('firstnameEdit') as HTMLInputElement;
        const lastnameElement = document.getElementById('lastnameEdit') as HTMLInputElement;
        const positionElement = document.getElementById('positionEdit') as HTMLInputElement;
        const birthdayElement = document.getElementById('birthdayEdit') as HTMLInputElement;
        const startworkElement = document.getElementById('startworkEdit') as HTMLInputElement;
        const subdistrictElement = document.getElementById('subdistrictEdit') as HTMLInputElement;
        const districtElement = document.getElementById('districtEdit') as HTMLInputElement;
        const provinceElement = document.getElementById('provinceEdit') as HTMLInputElement;
        const countryElement = document.getElementById('countryEdit') as HTMLInputElement;
        const telElement = document.getElementById('telEdit') as HTMLInputElement;
        const emailElement = document.getElementById('emailEdit') as HTMLInputElement;
        const passwordElement = document.getElementById('passwordEdit') as HTMLInputElement;

        const formEdit = {
            firstname: firstnameElement.value !== '' ? firstnameElement.value : hrById?.firstname ?? '',
            lastname: lastnameElement.value !== '' ? lastnameElement.value : hrById?.lastname ?? '',
            position: positionElement.value !== '' ? positionElement.value : hrById?.position ?? '',
            gender: genderValue !== '' ? genderValue : hrById?.gender ?? '',
            birthdate: birthdayElement.value !== '' ? birthdayElement.value : hrById?.birthdate ?? '',
            startwork: startworkElement.value !== '' ? startworkElement.value : hrById?.startwork ?? '',
            subdistrict: subdistrictElement.value !== '' ? subdistrictElement.value : subdistrict ?? '',
            district: districtElement.value !== '' ? districtElement.value : district ?? '',
            province: provinceElement.value !== '' ? provinceElement.value : province ?? '',
            country: countryElement.value !== '' ? countryElement.value : country ?? '',
            phone: telElement.value !== '' ? telElement.value : hrById?.phone ?? '',
            email: emailElement.value !== '' ? emailElement.value : hrById?.email ?? '',
            password: passwordElement.value !== '' ? passwordElement.value : hrById?.password ?? '',
            branch: branchValue !== '' ? branchValue : hrById?.companybranch?.id ?? '',
            department: departmentValue !== '' ? departmentValue : hrById?.department.id ?? ''
        };

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

        if (hrById) {

            const textMappingsArray = {
                "fullname": `${formEdit.firstname} ${formEdit.lastname}`,
                "companyName": `${hrById.companybranch.company.name}`,
                "companyAddress": `${addressBranch ? addressBranch : hrById.companybranch.address}`, //
                "position": `${formEdit.position}`, //
                "email": `${formEdit.email}`,
                "phoneDepartment": `${telDepartment ? telDepartment : hrById.department.phone}`, //
                "phone": `${formEdit.phone}`,
                "departmentName": `${departName ? departName : hrById.department.name}`, //
            };

            console.log('textMappings', textMappingsArray);

            try {
                const imageUrl = await drawImage(TemplateBycompanyId[0].background, textMappingsArray, positions, getDataCompanyById.logo);
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], `${hrById.id}.png`, { type: 'image/png' });

                const data = {
                    file: file,
                    uid: hrById.id,
                };

                newGeneratedFiles.push(data);

            } catch (error) {
                console.error('Error generating image:', error);
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
                            ctx.drawImage(logoImg, x, y, 120, 100);

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

        if (TemplateBycompanyId[0]?.status?.toString() === '1' && getDataCompanyById) {

            const status = '1';
            const resUpload = await templateapi.uploadSelectedTemplate(cardUsers);
            const allSuccess = resUpload.every((status: number) => status === 200);

            if (allSuccess) {

                const resUpdateStatus = await templateapi.updateStatus(temId, status, getDataCompanyById?.id);

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

    const getCompanyBranchById = useCallback(async (CompanyId: string) => {
        const res = await companyapi.getCompanyBranchById(CompanyId);
        setDataBranchesById(res);
    }, [companyapi]);

    const GetDepartmentByCompanyId = useCallback(async (CompanyId: string) => {
        const res = await companyapi.getDepartmentByCompanyId(CompanyId);
        setDataDepartmentById(res);
    }, [companyapi]);

    const getTemplateByCompanyId = useCallback(async (CompanyId: string) => {
        const res = await templateapi.getTemplateUsedByCompanyId(CompanyId);
        setTemplateBycompanyId(res);
    }, [templateapi]);

    const getUrlLogoCompany = useCallback(async (CompanyId: string) => {
        const resGetdataDetail = await companyapi.GetDataCompanyById(CompanyId);
        setGetDataCompanyById(resGetdataDetail);
    }, [companyapi]);

    useEffect(() => {

        function splitAddress() {

            if (hrById?.address) {
                const [subdistrict, district, province, country] = hrById.address.split(',');
                setHrById(prevState => prevState ? {
                    ...prevState,
                    subdistrict: subdistrict || '',
                    district: district || '',
                    province: province || '',
                    country: country || ''
                } : null);

                setSubdistrict(subdistrict);
                setDistrict(district);
                setProvince(province);
                setCountry(country);
            }
        }

        splitAddress();
    }, [hrById?.address]);

    useEffect(() => {

        const fetchData = async () => {
            try {

                if (HrId) {

                    const resGetdataDetail = await hrapi.GetDataHrById(HrId);
                    setHrById(resGetdataDetail);
                    setIsLoading(true);
                }
            } catch (error) {
                console.error('Error fetching company data:', error);
                setIsLoading(false);
            }
        };

        if (!isLoading) {
            fetchData();
        }

    }, [HrId, hrapi, isLoading]);

    useEffect(() => {

        if (!isFetch) {

            const loggedInData = localStorage.getItem("LoggedIn");

            if (loggedInData) {

                const parsedData = JSON.parse(loggedInData);
                const CompanyId = parsedData.id;

                if (CompanyId) {
                    getCompanyBranchById(CompanyId);
                    GetDepartmentByCompanyId(CompanyId);
                    getTemplateByCompanyId(CompanyId);
                    getUrlLogoCompany(CompanyId);
                    setIsFetch(true);
                }
            }
        }

    }, [isFetch, getCompanyBranchById, GetDepartmentByCompanyId, getTemplateByCompanyId, getUrlLogoCompany]);


    if (!hrById) {
        return <div>No company data found.</div>;
    }

    if (update) {
        return (
            <>
                <Header />
                <br />
                <div className="bg-card p-6 rounded-lg shadow-lg max-w-max mx-auto">
                    <form onSubmit={(e) => SaveDetails(e, hrById.id)}>
                        <div className="flex">
                            <div className="max-w-full bg-gray-100 p-3 rounded-lg ml-0">
                                <h2 className="text-lg font-semibold mb-4">แก้ไขข้อมูลรายละเอียดพนักงานฝ่ายบุคคล</h2>
                                <br />
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-muted-foreground">ชื่อ:</p>
                                        <input
                                            onChange={(e) => setHrById({ ...hrById, firstname: e.target.value })}
                                            value={hrById.firstname || ''}
                                            type="text" id="firstnameEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={hrById.firstname} />
                                        <br />
                                        <p className="text-muted-foreground">นามสกุล:</p>
                                        <input
                                            onChange={(e) => setHrById({ ...hrById, lastname: e.target.value })}
                                            value={hrById.lastname || ''}
                                            type="text" id="lastnameEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={hrById.lastname} />
                                        <br />
                                        <p className="text-muted-foreground">ตำแหน่ง:</p>
                                        <input
                                            onChange={(e) => setHrById({ ...hrById, position: e.target.value })}
                                            value={hrById.position || ''}
                                            type="text"
                                            id="positionEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={hrById.position} />
                                        <br />
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลือกเพศ</label>
                                        <select
                                            id="genderEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            //onChange={handleGender}
                                            value={hrById.gender ? hrById.gender : genderValue}
                                            onChange={(e) => setHrById({ ...hrById, gender: e.target.value })}
                                        >
                                            <option value="">เลือกเพศ</option>
                                            <option value="ชาย">ชาย</option>
                                            <option value="หญิง">หญิง</option>
                                        </select>
                                        <br />
                                        <p className="text-muted-foreground">วันเกิด:</p>
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            type='datetime-local'
                                            id="birthdayEdit"
                                            value={hrById.birthdate ? new Date(hrById.birthdate).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => setHrById({ ...hrById, birthdate: e.target.value })}
                                        />
                                        <br />
                                        <p className="text-muted-foreground">วันที่เริ่มงาน:</p>
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            type='datetime-local'
                                            id="startworkEdit"
                                            placeholder={hrById.startwork}
                                            value={hrById.startwork || ''}
                                            onChange={(e) => setHrById({ ...hrById, startwork: e.target.value })}
                                        />
                                        <br />
                                        <p className="text-muted-foreground">ตำบล:</p>
                                        <input
                                            onChange={(e) => setSubdistrict(e.target.value)}
                                            value={subdistrict || ''}
                                            type="text" id="subdistrictEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={subdistrict} />
                                        <br />
                                        <p className="text-muted-foreground">อำเภอ:</p>
                                        <input
                                            onChange={(e) => setDistrict(e.target.value)}
                                            value={district || ''}
                                            type="text"
                                            id="districtEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={district} />
                                        <br />
                                        <p className="text-muted-foreground">จังหวัด:</p>
                                        <input
                                            onChange={(e) => setProvince(e.target.value)}
                                            value={province || ''}
                                            type="text"
                                            id="provinceEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={province} />
                                        <br />
                                        <p className="text-muted-foreground">ประเทศ:</p>
                                        <input
                                            onChange={(e) => setCountry(e.target.value)}
                                            value={country || ''}
                                            type="text"
                                            id="countryEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={country} />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">เบอร์โทร:</p>
                                        <input
                                            onChange={(e) => setHrById({ ...hrById, phone: e.target.value })}
                                            value={hrById.phone || ''}
                                            type="text"
                                            id="telEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={hrById.phone} />
                                        <br />
                                        <label htmlFor="branches" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            เลือกสาขาบริษัท
                                        </label>
                                        {dataBranchesById && hrById && (
                                            <select
                                                id="branches"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                onChange={handleBranches}
                                                value={branchValue !== '' ? branchValue : hrById.companybranch?.id || ''}
                                            >
                                                <option value="">เลือกสาขาบริษัท</option>
                                                {hrById.companybranch && !dataBranchesById.some(branch => branch.id === hrById.companybranch.id) && (
                                                    <option key={hrById.companybranch.id} value={hrById.companybranch.id}>
                                                        {hrById.companybranch.name}
                                                    </option>
                                                )}
                                                {dataBranchesById.map((item: GetCompanyBranchesById) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        <br />
                                        <label htmlFor="departments" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            เลือกแผนกบริษัท
                                        </label>
                                        {dataDepartmentById && hrById && (
                                            <select
                                                id="departments"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                onChange={handleDepartment}
                                                value={departmentValue !== '' ? departmentValue : hrById.department?.id || ''}
                                            >
                                                <option value="">เลือกแผนกบริษัท</option>
                                                {hrById.department && !dataDepartmentById.some(dept => dept.id === hrById.department.id) && (
                                                    <option key={hrById.department.id} value={hrById.department.id}>
                                                        {hrById.department.name}
                                                    </option>
                                                )}
                                                {dataDepartmentById.map((item: GetDepartmentByComId) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        <br />
                                        <p className="text-muted-foreground">อีเมล:</p>
                                        <input
                                            onChange={(e) => setHrById({ ...hrById, email: e.target.value })}
                                            value={hrById.email || ''} type="text" id="emailEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={hrById.email} />
                                        <br />
                                        <p className="text-muted-foreground">รหัสผ่าน:</p>
                                        <input
                                            onChange={(e) => setHrById({ ...hrById, password: e.target.value })}
                                            value={hrById.password || ''}
                                            type="text" id="passwordEdit"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder={hrById.password} />
                                        <br />
                                        <br />
                                        <p className="text-muted-foreground">รูปประจำตัวพนักงาน:</p>
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
                                                <p>รูปประจำตัวพนักงาน :</p>
                                                <br />
                                                <img src={hrById.profile || ''} alt="" />
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
                            <button className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg" onClick={editDetails}>ยกเลิก</button>
                        </div>
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </form>
                </div>
            </>
        );
    }

    return (
        <>
            <div>
                <Header />
                <br />
                <div className="bg-card p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
                    <div className="flex">
                        <div className="w-1/3 bg-gray-50 p-4 rounded-lg">
                            <div className="flex flex-col items-center">
                                <img src={hrById.profile} alt="Profile Picture" className="w-70 h-24 object-cover rounded-lg mb-5" />
                                <h2 className="text-lg font-semibold mb-2">Profile</h2>
                                <br />
                                <div className="text-center">
                                    <p className="text-muted-foreground">ชื่อ:</p>
                                    <p>{hrById.firstname}</p>
                                    <br />
                                    <p className="text-muted-foreground">นามสกุล:</p>
                                    <p>{hrById.lastname}</p>
                                    <br />
                                    <p className="text-muted-foreground">ตำแหน่ง:</p>
                                    <p>{hrById.position}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-2/3 bg-gray-50 p-4 rounded-lg ml-4">
                            <h2 className="text-lg font-semibold mb-4">รายละเอียดพนักงานฝ่ายบุคคล</h2>
                            <br />
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-muted-foreground">เพศ:</p>
                                    <p>{hrById.gender}</p>
                                    <br />
                                    <p className="text-muted-foreground">วันเกิด:</p>
                                    <p>{hrById.birthdate}</p>
                                    <br />
                                    <p className="text-muted-foreground">วันที่เริ่มงาน:</p>
                                    <p>{hrById.startwork}</p>
                                    <br />
                                    <p className="text-muted-foreground">ที่อยู่:</p>
                                    <p>{hrById.address}</p>
                                    <br />
                                    <p className="text-muted-foreground">เบอร์โทร:</p>
                                    <p>{hrById.phone}</p>
                                    <br />
                                    <p className="text-muted-foreground">สาขาบริษัท:</p>
                                    <p>{hrById.companybranch.name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">แผนก:</p>
                                    <p>{hrById.department.name}</p>
                                    <br />
                                    <p className="text-muted-foreground">อีเมล:</p>
                                    <p>{hrById.email}</p>
                                    <br />
                                    <p className="text-muted-foreground">รหัสผ่าน:</p>
                                    <p>{hrById.password}</p>

                                    <br />
                                    <br />
                                    <p className="text-muted-foreground">นามบัตร:</p>
                                    <img src={hrById.business_card} alt="Profile Picture" className="w-35 h-30 object-cover rounded-lg mb-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg" onClick={DeleteHrData}>ลบข้อมูล</button>
                        &nbsp;
                        <button className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg" onClick={editDetails}>แก้ไขข้อมูล</button>
                    </div>
                </div>
            </div>
        </>
    );


}