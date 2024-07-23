import { useState, ChangeEvent, useEffect, useRef, useCallback, useMemo } from 'react';
import '@/Components/Company/CSS/AddHr.css';
import { HrApi } from '@/ApiEndpoints/HrApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetCompanyBranchesById } from '@/Model/GetCompanyBranchesById';
import { GetDepartmentByComId } from '@/Model/GetDepartmentByComId';
import { TemplateApi } from '@/ApiEndpoints/TemplateApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import { GetTemplateCompanyId } from '@/Model/GetTemplateCompanyId';
import { useNavigate } from 'react-router-dom';

interface AddHrProps {
  isFetch: boolean;
  setIsFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

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

const AddHr: React.FC<AddHrProps> = ({ isFetch, setIsFetch }) => {

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
  const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);


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

    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const phoneRegex = /^\d+$/;
    const allValuesNotNull = Object.values(formData).every(value => value !== null && value !== '');

    if (!allValuesNotNull || !file) {
      Swal.fire({
        title: 'Error!',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        icon: 'error',
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        title: 'Error!',
        text: 'กำหนดรหัสผ่านอย่างน้อย 6 ตัว!',
        icon: 'error',
      });
      return;
    }

    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'อีเมลต้องมี "@" และ ".com"',
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

    try {

      const resUploadData = await addData(formData);

      if (resUploadData === '0') {
        Swal.fire({
          title: 'Error!',
          text: 'อีเมลซ้ำ โปรดใช้อีเมลอื่น!',
          icon: 'error',
        });
        return;
      }

      setEmployeeId(resUploadData);

      if (resUploadData && file) {
        const folderName = '';
        const collection = 'users';
        const resUploadLogo = await addProfile(file, resUploadData, folderName, collection);

        console.log('em id' , employeeId);

        const res = await updateDetailCard();

        if (resUploadLogo === 200 && res == 200) {

          clearImageCache();

          Swal.fire({
            title: 'Success!',
            text: 'เพิ่มข้อมูลสำเร็จ',
            icon: 'success',
          }).then(() => {
            setShow(true);
            nav('/ListHr');
            // window.location.reload();
          })

          handleClose();
        } else {
          Swal.fire({
            title: 'Upload Error!',
            text: 'อัปโหลดโลโก้ไม่สำเร็จ!',
            icon: 'error',
          });
        }
      }
    } catch (error) {
      console.error('Error in uploadData:', error);
      Swal.fire({
        title: 'Error!',
        text: 'เกิดข้อผิดพลาดในการอัปโหลดข้อมูล',
        icon: 'error',
      });
    }
  };


  const updateDetailCard = async () => {

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

    if (TemplateBycompanyId[0]?.status?.toString() !== '1') {
      return;
    }

    if (!TemplateBycompanyId || !getDataCompanyById) {
      console.error('TemplateBycompanyId or getDataCompanyById is not available');
      return;
    }

    const allValuesNotNull = Object.values(formData).every(value => value !== null && value !== '');
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

    if (allValuesNotNull) {

      const textMappingsArray = {
        "fullname": `${formData.firstname} ${formData.lastname}`,
        "companyName": `${getDataCompanyById.name}`,
        "companyAddress": `${addressBranch}`,
        "position": `${formData.position}`,
        "email": `${formData.email}`,
        "phoneDepartment": `${telDepartment}`,
        "phone": `${formData.phone}`,
        "departmentName": `${departName}`,
      };

      console.log('textMappings', textMappingsArray);
      console.log('em id', employeeId);

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
              ctx.drawImage(logoImg, x, y, 100, 70);

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
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

  const getCompanyBranchById = useCallback(async (CompanyId: string) => {
    const res = await companyapi.getCompanyBranchById(CompanyId);
    setDataBranchesById(res);
  }, [companyapi]);

  const GetDepartmentByCompanyId = useCallback(async (CompanyId: string) => {
    const res = await companyapi.getDepartmentHRByCompanyId(CompanyId);
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
  }, [isFetch, GetDepartmentByCompanyId, getCompanyBranchById, getUrlLogoCompany, getTemplateByCompanyId, setIsFetch]);

  useEffect(() => {
    if (employeeId) {
      console.log('Employee ID set:', employeeId);
    }
  }, [employeeId]);

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
          <Modal.Title>เพิ่มพนักงานฝ่ายบุคคล</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={uploadData}>
            <Form.Label htmlFor="firstname">ชื่อ</Form.Label>
            {/* <Form.Control type="text" id="firstname" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="firstname"
              required
            />
            <br />
            <Form.Label htmlFor="lastname">นามสกุล</Form.Label>
            {/* <Form.Control type="text" id="lastname" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="lastname"
              required
            />
            <br />
            <Form.Label htmlFor="email">อีเมล</Form.Label>
            {/* <Form.Control type="text" id="email" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="email"
              required
            />
            <br />
            <Form.Label htmlFor="password">รหัสผ่าน</Form.Label>
            {/* <Form.Control type="text" id="password" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="password"
              required
            />
            <br />
            <p>เพศ</p>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleGender}
              value={genderValue}
              required
            >
              <option value="">เลือกเพศ</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
            <br />
            <Form.Label htmlFor="birthdate">วันเกิด</Form.Label>
            {/* <Form.Control type="datetime-local" id="birthdate" required /> */}
            <input
              type="datetime-local"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="birthdate"
              required
            />
            <br />
            <Form.Label htmlFor="phone">เบอร์โทร</Form.Label>
            {/* <Form.Control type="text" id="phone" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="phone"
              required
            />
            <br />
            <Form.Label htmlFor="subdistrict">ตำบล</Form.Label>
            {/* <Form.Control type="text" id="subdistrict" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="subdistrict"
              required
            />
            <br />
            <Form.Label htmlFor="district">อำเภอ</Form.Label>
            {/* <Form.Control type="text" id="district" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="district"
              required
            />
            <br />
            <Form.Label htmlFor="province">จังหวัด</Form.Label>
            {/* <Form.Control type="text" id="province" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="province"
              required
            />
            <br />
            <Form.Label htmlFor="country">ประเทศ</Form.Label>
            {/* <Form.Control type="text" id="country" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="country"
              required
            />
            <br />
            <p>สาขาบริษัท</p>
            {dataBranchesById ? (
              <select
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleBranches}>
                <option value="">เลือกสาขาบริษัท</option>
                {dataBranchesById.map((item: GetCompanyBranchesById, index: number) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : (
              <p><b>**ไม่มีสาขาบริษัท</b></p>
            )}
            <br />
            <p>แผนกบริษัท</p>
            {dataDepartmentById ? (
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleDepartment}
                required>
                <option value="">เลือกแผนกบริษัท</option>
                {dataDepartmentById.map((item: GetDepartmentByComId, index: number) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : (
              <p><b>**ไม่มีแผนก</b></p>
            )}
            <br />
            <Form.Label htmlFor="position">ตำแหน่งงาน</Form.Label>
            {/* <Form.Control type="text" id="position" required /> */}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="position"
              required
            />
            <br />
            <Form.Label htmlFor="startwork">วันที่เริ่มงาน</Form.Label>
            {/* <Form.Control type="datetime-local" id="startwork" required /> */}
            <input
              type="datetime-local"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="startwork"
              required
            />
            <br />
            <div className="container mt-1">
              <h4>รูปประจำตัวพนักงาน</h4>
              <br />
              <label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file"
                  id='selectImg'
                  onChange={handleFileChange} />
              </label>
              {imageData.showImage && (
                <div>
                  <img
                    src={imageData.base64textString}
                    alt={imageData.imageName}
                    style={{ maxWidth: '100%' }} />
                </div>
              )}
              <br />
            </div>
            <br />
            <hr />
            <div className="flex justify-end mt-4">
              <Button variant="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
              &nbsp;
              <Button variant="primary" type='submit'>
                ตกลง
              </Button>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddHr;
