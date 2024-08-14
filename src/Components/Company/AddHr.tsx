import React ,{ useState, ChangeEvent, useEffect, useRef, useCallback, useMemo } from 'react';
import '@/Components/Company/CSS/AddHr.css';
import { HrApi } from '@/ApiEndpoints/HrApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form, Card } from "react-bootstrap";
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetCompanyBranchesById } from '@/Model/GetCompanyBranchesById';
import { GetDepartmentByComId } from '@/Model/GetDepartmentByComId';
import { TemplateApi } from '@/ApiEndpoints/TemplateApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import { GetTemplateCompanyId } from '@/Model/GetTemplateCompanyId';
import { useNavigate } from 'react-router-dom';


interface FormData {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  gender: string,
  phone: string,
  subdistrict: string,
  district: string,
  province: string,
  country: string,
  companybranch: string,
  department: string,
  position: string,
  startwork: string,
  birthdate: string
}

const AddHr = () => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const hrapi = new HrApi();
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const companyapi = useMemo(() => new CompanyApi(), []);
  const templateapi = useMemo(() => new TemplateApi(), []);
  const [dataBranchesById, setDataBranchesById] = useState<GetCompanyBranchesById[]>([]);
  const [dataDepartmentById, setDataDepartmentById] = useState<GetDepartmentByComId[]>([]);
  const [TemplateBycompanyId, setTemplateBycompanyId] = useState<GetTemplateCompanyId[]>([]);
  const [getDataCompanyById, setGetDataCompanyById] = useState<GetDataCompanyById | null>(null);
  const [genderValue, setGenderValue] = useState('');
  const [departmentValue, setDepartmentValue] = useState('');
  const [branchValue, setBranchValue] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telDepartment, setTelDepartment] = useState('');
  const [addressBranch, setAddressBranch] = useState('');
  const [departName, setDepartmentName] = useState('');
  const [isFetch, setIsFetch] = useState(false);

  const [selectedImage, setSelectedImage] = useState({
    base64textString: '',
    imageName: '',
    showImage: false,
  });

  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [validations, setValidations] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

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


  const handleDepartment = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
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
    setGenderValue(e.target.value);
  };

  const [imageData] = useState({
    base64textString: '',
    imageName: '',
    showImage: false,
  });

  const getInputValue = (id: string): string => {
    const inputElement = document.getElementById(id) as HTMLInputElement | null;
    return inputElement ? inputElement.value : '';
  };

  const uploadData = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const formData: FormData = {
      firstname: getInputValue('firstname'),
      lastname: getInputValue('lastname'),
      email: getInputValue('email'),
      password: getInputValue('password'),
      gender: genderValue,
      phone: getInputValue('phone'),
      subdistrict: getInputValue('subdistrict'),
      district: getInputValue('district'),
      province: getInputValue('province'),
      country: getInputValue('country'),
      companybranch: branchValue,
      department: departmentValue,
      position: getInputValue('position'),
      startwork: getInputValue('startwork'),
      birthdate: getInputValue('birthdate')
    };

    console.log('form data', formData);

    console.log('TemplateBycompanyId[0]', TemplateBycompanyId);

    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-z]{2,}))$/
    );
    const phoneRegex = /^\d+$/;
    const allValuesNotNull = Object.values(formData).every(value => value !== null && value !== '');
    const CheckPassword = Object.values(validations).every(value => value == true);

    if (!allValuesNotNull) {
      Swal.fire({
        title: 'Error!',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        icon: 'error',
      });
      return;
    }

    if (!CheckPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'กำหนดรหัสผ่านตามเงื่อนไข!',
        icon: 'error',
      });
      return;
    }

    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'อีเมลต้องมี "@" และ ".com หรืออื่นๆ"',
        icon: 'error',
      });
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
        icon: 'error',
      });
      return;
    }

    if (!file) {
      Swal.fire({
        title: 'Error!',
        text: 'กรุณาเลือกรูปภาพ!',
        icon: 'error',
      });
      return;
    }

    try {

      const resUploadData = await addData(formData);
      setLoading(true);

      if (resUploadData === '0') {
        Swal.fire({
          title: 'Error!',
          text: 'อีเมลซ้ำ โปรดใช้อีเมลอื่น!',
          icon: 'error',
        });
        return;
      }

      if (resUploadData && file) {

        if (resUploadData !== '0') {

          const folderName = '';
          const collection = 'users';
          const resUploadLogo = await addProfile(file, resUploadData, folderName, collection);
          const resUpdateDetailCard = await updateDetailCard(resUploadData);

          if (resUploadLogo === 200 && resUpdateDetailCard == 200 || resUpdateDetailCard == 400) {

            clearImageCache();
            setLoading(false);
            const res = await Swal.fire({
              title: 'Success!',
              text: 'เพิ่มข้อมูลสำเร็จ',
              icon: 'success',
            })

            if (res) {

              setShow(false);
              handleClose();
              nav('/ListHr');
              window.location.reload();
            }

          } else {
            Swal.fire({
              title: 'Upload Error!',
              text: 'อัปโหลดโลโก้ไม่สำเร็จ!',
              icon: 'error',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in uploadData:', error);
      Swal.fire({
        title: 'Error!',
        text: 'เกิดข้อผิดพลาดในการอัปโหลดข้อมูล',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };



  const updateDetailCard = async (employeeId: string) => {

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

    const formData: FormData = {
      firstname: getInputValue('firstname'),
      lastname: getInputValue('lastname'),
      email: getInputValue('email'),
      password: getInputValue('password'),
      gender: genderValue,
      phone: getInputValue('phone'),
      subdistrict: getInputValue('subdistrict'),
      district: getInputValue('district'),
      province: getInputValue('province'),
      country: getInputValue('country'),
      companybranch: branchValue,
      department: departmentValue,
      position: 'HR',
      startwork: getInputValue('startwork'),
      birthdate: getInputValue('birthdate')
    };

    console.log('form edit', formData);

    const allValuesNotNull = Object.values(formData).every(value => value !== null && value !== '');
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

    if (allValuesNotNull) {

      const textMappingsArray = {
        "fullname": `${formData.firstname} ${formData.lastname}`,
        "companyName": `${getDataCompanyById.name}`,
        "companyAddress": `${addressBranch}`,
        "position": `${formData.position}`,
        "email": `${formData.email}`,
        "phoneDepartment": `Department phone:${telDepartment}`,
        "phone": `${formData.phone}`,
        "departmentName": `Department name:${departName}`,
      };

      console.log('em in updateDetailCard', employeeId);

      try {

        const imageUrl = await drawImage(TemplateBycompanyId[0].background, textMappingsArray, positions, getDataCompanyById.logo);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${employeeId}.png`, { type: 'image/png' });

        if (employeeId) {

          const data = {
            file: file,
            uid: employeeId,
          };

          newGeneratedFiles.push(data);

        } else {
          console.error('employeeId is undefined');
        }

      } catch (error) {
        console.error('Error generating image:', error);
      }
    }

    if (newGeneratedFiles.length > 0) {

      const res = await uploadSelectedTemplate(newGeneratedFiles, temId);
      return res;
    }

  }

  const drawImage = (background: string, textMappings: { [key: string]: string }, positions: { [key: string]: { x: number; y: number; fontSize: string; fontColor: string; fontStyle: string } }, logo: string) => {
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
              const { x, y, fontColor, fontSize, fontStyle } = positions[key];
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
              const { x, y, fontSize } = positions.logo;
              //ctx.drawImage(logoImg, x, y, 200, 100);
              drawLogo(ctx, logoImg, x, y, parseInt(fontSize));

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

  const drawLogo = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, logoSize: number) => {
    const aspectRatio = image.width / image.height;
    const logoWidth = logoSize;
    const logoHeight = logoWidth / aspectRatio;

    ctx.drawImage(image, x, y, logoWidth, logoHeight);
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
      return 400;
    }

  }



  const addProfile = async (file: File, uid: string, folderName: string, collection: string): Promise<number | undefined> => {
    try {
      const res = await hrapi.UploadProfile(file, uid, folderName, collection);
      return res;
    } catch (error) {
      console.log('Error in addLogo method: ', error);
      return 500;
    }
  };

  const addData = async (formData: FormData): Promise<string | undefined> => {

    const res = await hrapi.AddDataHr(
      formData.firstname,
      formData.lastname,
      formData.email,
      formData.password,
      formData.gender,
      formData.phone,
      formData.subdistrict,
      formData.district,
      formData.province,
      formData.country,
      formData.companybranch,
      formData.department,
      formData.position,
      formData.startwork,
      formData.birthdate);

    return res;
  };

  function setPreviewImage(file: File) {

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage({
        base64textString: reader.result as string,
        imageName: file.name,
        showImage: true,
      });
    };
    reader.readAsDataURL(file);
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setPreviewImage(event.target.files[0]);
    }
  };

  const clearImageCache = () => {
    if ('caches' in window) {
      caches.keys().then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            return caches.delete(key);
          })
        );
      }).then(function () {
        console.log('Image cache cleared');
      });
    }
  };

  function handleRemoveImage() {
    setSelectedImage({
      base64textString: '',
      imageName: '',
      showImage: false,
    });
    setFile(null);

    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
  }

  const getCompanyBranchById = useCallback(async (CompanyId: string) => {
    try {
      const res = await companyapi.getCompanyBranchById(CompanyId);
      console.log("Branches Data:", res); // Debugging line
      setDataBranchesById(res);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  }, [companyapi]);

  const GetDepartmentByCompanyId = useCallback(async (CompanyId: string) => {
    try {
      const res = await companyapi.getDepartmentHRByCompanyId(CompanyId);
      console.log("Departments Data:", res); // Debugging sline
      setDataDepartmentById(res);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  }, [companyapi]);


  const getTemplateByCompanyId = useCallback(async (CompanyId: string) => {

    try {

      const res = await templateapi.getTemplateUsedByCompanyId(CompanyId);
      setTemplateBycompanyId(res);

    } catch (error) {
      console.error(error);
    }

  }, [templateapi]);

  const getUrlLogoCompany = useCallback(async (CompanyId: string) => {

    try {

      const resGetdataDetail = await companyapi.GetDataCompanyById(CompanyId);
      setGetDataCompanyById(resGetdataDetail);

    } catch (error) {
      console.error(error);
    }
  }, [companyapi]);

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

        }
      }
    }
  }, [isFetch, GetDepartmentByCompanyId, getCompanyBranchById, getUrlLogoCompany, getTemplateByCompanyId, setIsFetch]);



  return (
    <>
      <div onClick={handleShow} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
        </svg>
        <span className="flex-1 ms-3 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-white">เพิ่มพนักงานฝ่ายบุคคล</span>
      </div>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มข้อมูลพนักงานฝ่ายบุคคล</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={uploadData} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Form.Label htmlFor="firstname">ชื่อ</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="firstname"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="lastname">นามสกุล</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="lastname"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="email">อีเมล</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="email"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="position">ตำแหน่งงาน</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="position"
                required
              />
            </div>

            <div className="col-span-1">
              <p>เพศ</p>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleGender}
                value={genderValue}
                required
              >
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="birthdate">วันเกิด</Form.Label>
              <input
                type="date"
                max={today}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="birthdate"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="phone">เบอร์โทร</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="phone"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="subdistrict">ตำบล</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="subdistrict"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="district">อำเภอ</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="district"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="province">จังหวัด</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="province"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="country">ประเทศ</Form.Label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="country"
                required
              />
            </div>

            <div className="col-span-1">
              <p>สาขาบริษัท</p>
              {dataBranchesById ? (
                <select
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleBranches}
                >
                  <option value="">เลือกสาขาบริษัท</option>
                  {dataBranchesById.map((item: GetCompanyBranchesById, index: number) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">ไม่มีข้อมูลสาขาบริษัท</option>
                </select>
              )}
            </div>

            <div className="col-span-1">
              <p>แผนกบริษัท</p>
              {dataDepartmentById ? (
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleDepartment}
                  required
                >
                  <option value="">เลือกแผนกบริษัท</option>
                  {dataDepartmentById.map((item: GetDepartmentByComId, index: number) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">ไม่มีข้อมูลแผนก</option>
                </select>
              )}
            </div>


            <div className="col-span-1">
              <Form.Label htmlFor="startwork">วันที่เริ่มงาน</Form.Label>
              <input
                type="date"
                max={today}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="startwork"
                required
              />
            </div>

            <div className="col-span-1">
              <Form.Label htmlFor="password">รหัสผ่าน</Form.Label>
              <input
                type={showPass ? "text" : "password"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
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
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <div className="container mt-1">
                <h4>รูปประจำตัวพนักงาน</h4>
                <br />
                <label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    id='selectImg'
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                    ref={backgroundInputRef}
                  />
                </label>
                {imageData.showImage && (
                  <div>
                    <img
                      src={imageData.base64textString}
                      alt={imageData.imageName}
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div id="preview-logo">
                {selectedImage.showImage ? (
                  <><Card style={{ width: '15rem', textAlign: 'center' }}>
                    <Card.Body>
                      <Card.Title style={{ fontSize: '15px' }}>Preview Image</Card.Title>
                      <div className="image-preview">
                        <img src={selectedImage.base64textString} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                      </div>
                    </Card.Body>
                  </Card><div onClick={handleRemoveImage}>
                      <Button disabled={loading} variant="danger">Remove Image</Button>
                    </div></>
                ) : (
                  <p></p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end mt-6">
              <Button
                variant="success"
                type="submit" disabled={loading}>ตกลง</Button>
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
              : <div>
              </div>}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </form>

        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddHr;
