import { useEffect, useState, ChangeEvent, useRef, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { GetEmployeeById } from '@/Model/GetEmployeeById';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GetCompanyBranchesById } from '@/Model/GetCompanyBranchesById';
import { GetDepartmentByComId } from '@/Model/GetDepartmentByComId';
import { HrApi } from '@/ApiEndpoints/HrApi';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { EmployeesApi } from '@/ApiEndpoints/EmployeesApi';
import { GetTemplateCompanyId } from '@/Model/GetTemplateCompanyId';
import { TemplateApi } from '@/ApiEndpoints/TemplateApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import { Button } from 'react-bootstrap';


export default function DetailEmployees() {

    const { id: employeesId } = useParams();
    const employeesapi = useMemo(() => new EmployeesApi(), []);
    const [dataemployeesById, setDataEmployeesById] = useState<GetEmployeeById | null>(null);
    const [dataBranchesById, setDataBranchesById] = useState<GetCompanyBranchesById[]>([]);
    const [dataDepartmentById, setDataDepartmentById] = useState<GetDepartmentByComId[]>([]);
    const [TemplateBycompanyId, setTemplateBycompanyId] = useState<GetTemplateCompanyId[]>([]);
    const [getDataCompanyById, setGetDataCompanyById] = useState<GetDataCompanyById | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const templateapi = useMemo(() => new TemplateApi(), []);
    const nav = useNavigate();
    const [update, setUpdate] = useState(false);
    const [branchValue, setBranchValue] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const hrapi = new HrApi();
    const [isFetch, setIsFetch] = useState(false);
    const companyapi = useMemo(() => new CompanyApi(), []);

    const employeeapi = new EmployeesApi();
    const [genderValue, setGenderValue] = useState('');
    const [departmentValue, setDepartmentValue] = useState('');
    const [addressBranch, setAddressBranch] = useState('');
    const [telDepartment, setTelDepartment] = useState('');
    const [departName, setDepartmentName] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [subdistrict, setSubdistrict] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('');

    const [loading, setLoading] = useState(false);
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const [password, setPassword] = useState('');
    const [validations, setValidations] = useState({
        lowercase: false,
        uppercase: false,
        number: false,
        length: false,
    });
    const [showPass, setShowPass] = useState(false);

    console.log('new pass', password);

    const [imageData, setImageData] = useState({
        base64textString: '',
        imageName: '',
        showImage: false,
    });


    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const newPassword = event.target.value;


        if (dataemployeesById?.password) {

            setPassword(newPassword);
            validatePassword(newPassword || dataemployeesById.password);
            setDataEmployeesById({ ...dataemployeesById, password: event.target.value });
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

    const validatePassword = (password: string) => {


        const lowerCaseRegex = /[a-z]/;
        const upperCaseRegex = /[A-Z]/;
        const numberRegex = /\d/;
        const lengthRegex = /.{8,}/;

        setValidations({
            lowercase: lowerCaseRegex.test(password),
            uppercase: upperCaseRegex.test(password),
            number: numberRegex.test(password),
            length: lengthRegex.test(password),
        });
    };

    function handleShowPassword() {

        setShowPass(!showPass);

    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setPreviewImage(event.target.files[0]);
        }
    };

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

    useEffect(() => {

        if (dataemployeesById?.password) {
            validatePassword(dataemployeesById.password);
        }
        console.log('is loading', isLoading);

    }, [dataemployeesById?.password, isLoading]);



    const getCompanyBranchById = useCallback(async (CompanyId: string) => {
        try {
            const res = await companyapi.getCompanyBranchById(CompanyId);
            setDataBranchesById(res);
            setIsFetch(true);
        } catch (error) {
            console.error("Error fetching company branch by ID:", error);
        }
    }, [setDataBranchesById, setIsFetch, companyapi]);

    const GetDepartmentByCompanyId = useCallback(async (CompanyId: string) => {
        try {
            const res = await companyapi.getDepartmentByCompanyId(CompanyId);
            setDataDepartmentById(res);
            setIsFetch(true);
        } catch (error) {
            console.error("Error fetching department by company ID:", error);
        }
    }, [setDataDepartmentById, setIsFetch, companyapi]);

    const getTemplateByCompanyId = useCallback(async (CompanyId: string) => {
        try {
            const res = await templateapi.getTemplateUsedByCompanyId(CompanyId);
            setTemplateBycompanyId(res);
            setIsFetch(true);
        } catch (error) {
            console.error("Error fetching template by company ID:", error);
        }
    }, [setTemplateBycompanyId, setIsFetch, templateapi]);

    const getUrlLogoCompany = useCallback(async (CompanyId: string) => {
        try {
            const resGetdataDetail = await companyapi.GetDataCompanyById(CompanyId);
            setGetDataCompanyById(resGetdataDetail);
            setIsFetch(true);
        } catch (error) {
            console.error("Error fetching URL logo company:", error);
        }
    }, [setGetDataCompanyById, setIsFetch, companyapi]);

    function handleUpdate() {

        if (update == true) {
            setUpdate(false);
        }
        if (update == false) {
            setUpdate(true);
        }
    }

    const handleDepartment = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        console.log(e.target.value);
        setDepartmentValue(e.target.value);

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

        console.log(e.target.value);
        setBranchValue(selectedValue);

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

    const fetchData = useCallback(async () => {
        try {
            if (employeesId) {
                const resGetdataDetail = await employeesapi.GetDatadataemployeesById(employeesId);
                setDataEmployeesById(resGetdataDetail);
                setIsLoading(true);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setIsLoading(false);
        }
    }, [employeesId, setDataEmployeesById, setIsLoading, employeesapi]);

    const DeleteEmployeeData = async (): Promise<void> => {

        const deleteButton = document.getElementById('deleteButton') as HTMLButtonElement;
        const editButton = document.getElementById('editButton') as HTMLButtonElement;


        if (!dataemployeesById) return;

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

                deleteButton.style.visibility = 'hidden';
                editButton.style.visibility = 'hidden'

                setLoading(true);
                const response = await employeesapi.DeleteEmployee(dataemployeesById.id);

                if (response == 200) {

                    setLoading(false);
                    const res = await Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });

                    if (res) {
                        nav('/ListEmployees', { replace: true });
                    }

                }
            }
        } catch (error) {
            console.error('Error deleting general user:', error);
            await Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    }

    async function SaveDetails(e: React.FormEvent<HTMLFormElement>, EMId: string) {

        try {

            e.preventDefault();

            const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
            const cancleButton = document.getElementById('cancleButton') as HTMLButtonElement;


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
                firstname: firstnameElement.value !== '' ? firstnameElement.value : dataemployeesById?.firstname ?? '',
                lastname: lastnameElement.value !== '' ? lastnameElement.value : dataemployeesById?.lastname ?? '',
                position: positionElement.value !== '' ? positionElement.value : dataemployeesById?.position ?? '',
                gender: genderValue !== '' ? genderValue : dataemployeesById?.gender ?? '',
                birthdate: birthdayElement.value !== '' ? birthdayElement.value : dataemployeesById?.birthdate ?? '',
                startwork: startworkElement.value !== '' ? startworkElement.value : dataemployeesById?.startwork ?? '',
                subdistrict: subdistrictElement.value !== '' ? subdistrictElement.value : subdistrict ?? '',
                district: districtElement.value !== '' ? districtElement.value : district ?? '',
                province: provinceElement.value !== '' ? provinceElement.value : province ?? '',
                country: countryElement.value !== '' ? countryElement.value : country ?? '',
                phone: telElement.value !== '' ? telElement.value : dataemployeesById?.phone ?? '',
                email: emailElement.value !== '' ? emailElement.value : dataemployeesById?.email ?? '',
                password: passwordElement.value !== '' ? passwordElement.value : dataemployeesById?.password ?? '',
                branch: branchValue !== '' ? branchValue : dataemployeesById?.companybranch?.id ?? '',
                department: departmentValue !== '' ? departmentValue : dataemployeesById?.department.id ?? ''
            }

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

            setLoading(true);
            submitButton.style.visibility = 'hidden';
            cancleButton.style.visibility = 'hidden';

            const resUpdateData = await employeeapi.updateDataEmployee(
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
                EMId
            );


            if (resUpdateData == 200) {

                console.log(handleGender);

                if (file) {

                    const folderName = '';
                    const collection = 'users';
                    const resUploadLogo = await hrapi.UploadProfile(file, EMId, folderName, collection);
                    const resUpdateDetailCard = await updateDetailCard();

                    if (resUploadLogo == 200 && resUpdateDetailCard == 200) {

                        setLoading(false);
                        const res = await Swal.fire({
                            title: 'Success!',
                            text: 'อัปเดทข้อมูลสำเร็จ!',
                            icon: 'success',
                        });

                        if (res) {
                            nav('/ListEmployees');
                            window.location.reload();
                        }


                    }

                    if (resUploadLogo == 200 && resUpdateDetailCard == 400) {

                        setLoading(false);

                        const res = await Swal.fire({
                            title: 'Success!',
                            text: 'อัปเดทข้อมูลและรูปสำเร็จ!',
                            icon: 'success',
                        });

                        if (res) {
                            nav('/ListEmployees');
                            window.location.reload();
                        }
                    }
                }


                if (!file) {

                    const resUpdateDetailCard = await updateDetailCard();

                    if (resUpdateDetailCard == 200 || resUpdateDetailCard == 400) {

                        setLoading(false);
                        const res = await Swal.fire({
                            title: 'Success!',
                            text: 'อัปเดทข้อมูลสำเร็จ!',
                            icon: 'success',
                        });

                        if (res) {
                            nav('/ListEmployees');
                            window.location.reload();
                        }

                    }
                }
            }

        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    const updateDetailCard = async () => {

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
            firstname: firstnameElement.value !== '' ? firstnameElement.value : dataemployeesById?.firstname ?? '',
            lastname: lastnameElement.value !== '' ? lastnameElement.value : dataemployeesById?.lastname ?? '',
            position: positionElement.value !== '' ? positionElement.value : dataemployeesById?.position ?? '',
            gender: genderValue !== '' ? genderValue : dataemployeesById?.gender ?? '',
            birthdate: birthdayElement.value !== '' ? birthdayElement.value : dataemployeesById?.birthdate ?? '',
            startwork: startworkElement.value !== '' ? startworkElement.value : dataemployeesById?.startwork ?? '',
            subdistrict: subdistrictElement.value !== '' ? subdistrictElement.value : subdistrict ?? '',
            district: districtElement.value !== '' ? districtElement.value : district ?? '',
            province: provinceElement.value !== '' ? provinceElement.value : province ?? '',
            country: countryElement.value !== '' ? countryElement.value : country ?? '',
            phone: telElement.value !== '' ? telElement.value : dataemployeesById?.phone ?? '',
            email: emailElement.value !== '' ? emailElement.value : dataemployeesById?.email ?? '',
            password: passwordElement.value !== '' ? passwordElement.value : dataemployeesById?.password ?? '',
            branch: branchValue !== '' ? branchValue : dataemployeesById?.companybranch?.id ?? '',
            department: departmentValue !== '' ? departmentValue : dataemployeesById?.department.id ?? ''
        }

        const newGeneratedFiles: { file: File; uid: string }[] = [];
        const temId = TemplateBycompanyId[0].id;
        const positions = {
            companyAddress: { x: TemplateBycompanyId[0].companyAddress.x, y: TemplateBycompanyId[0].companyAddress.y, fontSize: TemplateBycompanyId[0].companyAddress.fontSize, fontColor: TemplateBycompanyId[0].companyAddress.fontColor },
            companyName: { x: TemplateBycompanyId[0].companyName.x, y: TemplateBycompanyId[0].companyName.y, fontSize: TemplateBycompanyId[0].companyName.fontSize, fontColor: TemplateBycompanyId[0].companyName.fontColor },
            departmentName: { x: TemplateBycompanyId[0].departmentName.x, y: TemplateBycompanyId[0].departmentName.y, fontSize: TemplateBycompanyId[0].departmentName.fontSize, fontColor: TemplateBycompanyId[0].departmentName.fontColor },
            email: { x: TemplateBycompanyId[0].email.x, y: TemplateBycompanyId[0].email.y, fontSize: TemplateBycompanyId[0].email.fontSize, fontColor: TemplateBycompanyId[0].email.fontColor },
            fullname: { x: TemplateBycompanyId[0].fullname.x, y: TemplateBycompanyId[0].fullname.y, fontSize: TemplateBycompanyId[0].fullname.fontSize, fontColor: TemplateBycompanyId[0].fullname.fontColor },
            logo: { x: TemplateBycompanyId[0].logo.x, y: TemplateBycompanyId[0].logo.y, fontSize: TemplateBycompanyId[0].logo.fontSize, fontColor: TemplateBycompanyId[0].logo.fontColor },
            phone: { x: TemplateBycompanyId[0].phone.x, y: TemplateBycompanyId[0].phone.y, fontSize: TemplateBycompanyId[0].phone.fontSize, fontColor: TemplateBycompanyId[0].phone.fontColor },
            phoneDepartment: { x: TemplateBycompanyId[0].phoneDepartment.x, y: TemplateBycompanyId[0].phoneDepartment.y, fontSize: TemplateBycompanyId[0].phoneDepartment.fontSize, fontColor: TemplateBycompanyId[0].phoneDepartment.fontColor },
            position: { x: TemplateBycompanyId[0].position.x, y: TemplateBycompanyId[0].position.y, fontSize: TemplateBycompanyId[0].position.fontSize, fontColor: TemplateBycompanyId[0].position.fontColor },
        };

        console.log('positions', positions);

        if (dataemployeesById) {

            const textMappingsArray = {
                "fullname": `${formEdit.firstname} ${formEdit.lastname}`,
                "companyName": `${dataemployeesById.companybranch.company.name}`,
                "companyAddress": `${addressBranch ? addressBranch : dataemployeesById.companybranch.address}`,
                "position": `${formEdit.position}`,
                "email": `${formEdit.email}`,
                "phoneDepartment": `${telDepartment ? telDepartment : dataemployeesById.department.phone}`,
                "phone": `${formEdit.phone}`,
                "departmentName": `${departName ? departName : dataemployeesById.department.name}`,
            };

            console.log('textMappings', textMappingsArray);

            try {
                const imageUrl = await drawImage(TemplateBycompanyId[0].background, textMappingsArray, positions, getDataCompanyById.logo);
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], `${dataemployeesById.id}.png`, { type: 'image/png' });

                const data = {
                    file: file,
                    uid: dataemployeesById.id,
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

    const drawImage = (background: string, textMappings: { [key: string]: string }, 
        positions: { [key: string]: { x: number; y: number, fontSize: string, fontColor: string } }, logo: string) => {
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
                            const { x, y, fontSize, fontColor } = positions[key];
                            ctx.font = `${fontSize}px Bold`;
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

        if (TemplateBycompanyId[0]?.status?.toString() === '1' && getDataCompanyById) {

            const status = '1';
            const resUpload = await templateapi.uploadSelectedTemplate(cardUsers);
            const allSuccess = resUpload.every((status: number) => status === 200);

            // all undifined

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
            return 400;
        }

    }

    useEffect(() => {

        if (!isLoading) {
            fetchData();
        }

    }, [employeesId, fetchData, isLoading]);

    useEffect(() => {

        if (!isFetch) {
            const loggedInData = localStorage.getItem("LoggedIn");

            if (loggedInData) {
                const parsedData = JSON.parse(loggedInData);
                const CompanyId = parsedData.companyId;

                if (CompanyId) {
                    getCompanyBranchById(CompanyId);
                    GetDepartmentByCompanyId(CompanyId);
                    getTemplateByCompanyId(CompanyId);
                    getUrlLogoCompany(CompanyId);
                }
            }
        }

    }, [isFetch, GetDepartmentByCompanyId, getCompanyBranchById, getTemplateByCompanyId, getUrlLogoCompany]);

    useEffect(() => {

        function splitAddress() {

            if (dataemployeesById?.address) {
                const [subdistrict, district, province, country] = dataemployeesById.address.split(',');
                setDataEmployeesById(prevState => prevState ? {
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
    }, [dataemployeesById?.address]);

    if (update) {
        return (
            <>
                <Header />
                <br />
                {dataemployeesById && (
                    <div className="bg-card p-6 rounded-lg shadow-lg max-w-max mx-auto">
                        <form onSubmit={(e) => SaveDetails(e, dataemployeesById.id)}>
                            <div className="flex">
                                <div className="max-w-full bg-gray-100 p-3 rounded-lg ml-0">
                                    <h2 className="text-lg font-semibold mb-4">แก้ไขข้อมูลรายละเอียดพนักงานฝ่ายบุคคล</h2>
                                    <br />
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-muted-foreground">ชื่อ:</p>
                                            <input
                                                onChange={(e) => setDataEmployeesById({ ...dataemployeesById, firstname: e.target.value })}
                                                value={dataemployeesById.firstname || ''}
                                                type="text" id="firstnameEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataemployeesById.firstname} />
                                            <br />
                                            <p className="text-muted-foreground">นามสกุล:</p>
                                            <input
                                                onChange={(e) => setDataEmployeesById({ ...dataemployeesById, lastname: e.target.value })}
                                                value={dataemployeesById.lastname || ''}
                                                type="text" id="lastnameEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataemployeesById.lastname} />
                                            <br />
                                            <p className="text-muted-foreground">ตำแหน่ง:</p>
                                            <input
                                                onChange={(e) => setDataEmployeesById({ ...dataemployeesById, position: e.target.value })}
                                                value={dataemployeesById.position || ''}
                                                type="text"
                                                id="positionEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataemployeesById.position} />
                                            <br />
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลือกเพศ</label>
                                            <select
                                                id="genderEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={dataemployeesById.gender ? dataemployeesById.gender : genderValue}
                                                onChange={(e) => setDataEmployeesById({ ...dataemployeesById, gender: e.target.value })}
                                            >
                                                <option value="">เลือกเพศ</option>
                                                <option value="ชาย">ชาย</option>
                                                <option value="หญิง">หญิง</option>
                                            </select>
                                            <br />
                                            <p className="text-muted-foreground">วันเกิด:</p>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type='date'
                                                id="birthdayEdit"
                                                value={dataemployeesById.birthdate ? dataemployeesById.birthdate : ''}
                                                onChange={(e) => setDataEmployeesById({ ...dataemployeesById, birthdate: e.target.value })}
                                            />
                                            <br />
                                            <p className="text-muted-foreground">วันที่เริ่มงาน:</p>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type='date'
                                                id="startworkEdit"
                                                placeholder={dataemployeesById.startwork}
                                                value={dataemployeesById.startwork || ''}
                                                onChange={(e) => setDataEmployeesById({ ...dataemployeesById, startwork: e.target.value })}
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
                                                onChange={(e) => setDataEmployeesById({ ...dataemployeesById, phone: e.target.value })}
                                                value={dataemployeesById.phone || ''}
                                                type="text"
                                                id="telEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataemployeesById.phone} />
                                            <br />
                                            <label htmlFor="branches" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                เลือกสาขาบริษัท
                                            </label>
                                            {dataBranchesById && dataemployeesById && (
                                                <select
                                                    id="branches"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={handleBranches}
                                                    value={branchValue !== '' ? branchValue : dataemployeesById.companybranch?.id || ''}
                                                >
                                                    <option value="">เลือกสาขาบริษัท</option>
                                                    {dataemployeesById.companybranch && !dataBranchesById.some(branch => branch.id === dataemployeesById.companybranch.id) && (
                                                        <option key={dataemployeesById.companybranch.id} value={dataemployeesById.companybranch.id}>
                                                            {dataemployeesById.companybranch.name}
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
                                            {dataDepartmentById && dataemployeesById && (
                                                <select
                                                    id="departments"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={handleDepartment}
                                                    value={departmentValue !== '' ? departmentValue : dataemployeesById.department?.id || ''}
                                                >
                                                    <option value="">เลือกแผนกบริษัท</option>
                                                    {dataemployeesById.department && !dataDepartmentById.some(dept => dept.id === dataemployeesById.department.id) && (
                                                        <option key={dataemployeesById.department.id} value={dataemployeesById.department.id}>
                                                            {dataemployeesById.department.name}
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
                                                onChange={(e) => setDataEmployeesById({ ...dataemployeesById, email: e.target.value })}
                                                value={dataemployeesById.email || ''} type="text" id="emailEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataemployeesById.email} />
                                            <br />
                                            <p className="text-muted-foreground">รหัสผ่าน:</p>
                                            <input
                                                onChange={handlePasswordChange}
                                                value={dataemployeesById.password || ''}
                                                type="text" id="passwordEdit"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={dataemployeesById.password} />
                                            <label className="flex items-center pt-2 pl-2">
                                                <input onClick={handleShowPassword} id="showpass" type="checkbox" className="mr-2" />
                                                <span className="text-muted-foreground">Show Password</span>
                                            </label>
                                            <div id="message" style={{ paddingLeft: '0px' }}>
                                                <br />
                                                <p id="letter" className={validations.lowercase ? 'valid' : 'invalid'}>
                                                    <b>- ตัวพิมพ์เล็ก (a-z)</b>
                                                    {validations.lowercase && <i className="fas fa-check icon"></i>}
                                                    {!validations.lowercase && <i className="fas fa-times icon"></i>}
                                                </p>
                                                <p id="capital" className={validations.uppercase ? 'valid' : 'invalid'}>
                                                    <b>- ตัวพิมพ์ใหญ่ (A-Z)</b>
                                                    {validations.uppercase && <i className="fas fa-check icon"></i>}
                                                    {!validations.uppercase && <i className="fas fa-times icon"></i>}
                                                </p>
                                                <p id="number" className={validations.number ? 'valid' : 'invalid'}>
                                                    <b>- ตัวเลข (0-9)</b>
                                                    {validations.number && <i className="fas fa-check icon"></i>}
                                                    {!validations.number && <i className="fas fa-times icon"></i>}
                                                </p>
                                                <p id="length" className={validations.length ? 'valid' : 'invalid'}>
                                                    <b>- ความยาวรหัสผ่าน 8 ตัว</b>
                                                    {validations.length && <i className="fas fa-check icon"></i>}
                                                    {!validations.length && <i className="fas fa-times icon"></i>}
                                                </p>
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
                                                        <br />
                                                        <p>รูปประจำตัวพนักงานใหม่ :</p>
                                                        <br />
                                                        <img src={imageData.base64textString} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                                        <div onClick={handleRemoveImage}>
                                                            <Button variant="danger">Remove Image</Button>
                                                        </div>
                                                    </div>

                                                ) : (

                                                    <div>
                                                        <br />
                                                        <p>รูปประจำตัวพนักงานที่มีอยู่แล้ว :</p>
                                                        <br />
                                                        <img src={dataemployeesById.profile || ''} alt="" />
                                                    </div>

                                                )}
                                                <br />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    id='cancleButton'
                                    type="button"
                                    onClick={handleUpdate}
                                    className="bg-gray-500 text-red-50 hover:bg-gray-600 py-2 px-4 rounded-lg"
                                >
                                    ยกเลิก
                                </button>
                                &nbsp;
                                <button
                                    id="submitButton"
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-500 text-red-50 hover:bg-green-600 py-2 px-4 rounded-lg"
                                >
                                    ตกลง
                                </button>
                            </div>
                            <br />

                            {loading ?
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
                )}
            </>
        );
    }


    if (!dataemployeesById) {
        return (
            <div>
                <Header />
                <br />
                //check loading 10 sec to not found data
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
        <div>
            <Header />
            <br />
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
                <div className="flex">
                    <div className="w-1/3 bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-col items-center">
                            <img src={dataemployeesById.profile} alt="Profile Picture" className="w-70 h-24 object-cover rounded-lg mb-5" />
                            <h2 className="text-lg font-semibold mb-2">Profile</h2>
                            <br />
                            <div className="text-center">
                                <p className="text-muted-foreground">ชื่อ:</p>
                                <p>{dataemployeesById.firstname}</p>
                                <br />
                                <p className="text-muted-foreground">นามสกุล:</p>
                                <p>{dataemployeesById.lastname}</p>
                                <br />
                                <p className="text-muted-foreground">ตำแหน่ง:</p>
                                <p>{dataemployeesById.position}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-2/3 bg-gray-50 p-4 rounded-lg ml-4">
                        <h2 className="text-lg font-semibold mb-4">รายละเอียดพนักงานฝ่ายบุคคล</h2>
                        <br />
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-muted-foreground">เพศ:</p>
                                <p>{dataemployeesById.gender}</p>
                                <br />
                                <p className="text-muted-foreground">วันเกิด:</p>
                                <p>{dataemployeesById.birthdate}</p>
                                <br />
                                <p className="text-muted-foreground">วันที่เริ่มงาน:</p>
                                <p>{dataemployeesById.startwork}</p>
                                <br />
                                <p className="text-muted-foreground">ที่อยู่:</p>
                                <p>{dataemployeesById.address}</p>
                                <br />
                                <p className="text-muted-foreground">เบอร์โทร:</p>
                                <p>{dataemployeesById.phone}</p>
                                <br />
                                <p className="text-muted-foreground">สาขาบริษัท:</p>
                                <p>{dataemployeesById.companybranch.name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">แผนก:</p>
                                <p>{dataemployeesById.department.name}</p>
                                <br />
                                <p className="text-muted-foreground">อีเมล:</p>
                                <p>{dataemployeesById.email}</p>
                                <br />
                                <p className="text-muted-foreground">รหัสผ่าน:</p>
                                <p>{dataemployeesById.password}</p>

                                <br />
                                <br />
                                <p className="text-muted-foreground">นามบัตร:</p>
                                {dataemployeesById.business_card ? (
                                    <img src={dataemployeesById.business_card} alt="Profile Picture" className="w-35 h-30 object-cover rounded-lg mb-5" />
                                ) : (
                                    <>
                                        <div className='pl-3'>
                                            <br />
                                            <p className="text-muted-foreground">ยังไม่ได้สร้างนามบัตรหรือไม่ได้เลือกเทมเพลต</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">

                    <button
                        id='deleteButton'
                        type="button"
                        onClick={DeleteEmployeeData}
                        className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg"
                    >
                        ลบข้อมูล
                    </button>
                    &nbsp;
                    <button
                        id="editButton"
                        disabled={loading}
                        onClick={handleUpdate}
                        className="bg-green-500 text-red-50 hover:bg-green-600 py-2 px-4 rounded-lg"
                    >
                        แก้ไขข้อมูล
                    </button>
                </div>
                <br />

                {loading ?
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

            </div>
        </div>
    );
}