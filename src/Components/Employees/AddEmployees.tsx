import React, { useState, ChangeEvent, useEffect, useRef } from 'react'
import { EmployeesApi } from '@/ApiEndpoints/EmployeesApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetCompanyBranchesById } from '@/Model/GetCompanyBranchesById';
import { GetDepartmentByComId } from '@/Model/GetDepartmentByComId';
import { TemplateApi } from '@/ApiEndpoints/TemplateApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import { GetTemplateCompanyId } from '@/Model/GetTemplateCompanyId';


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

const AddEmployees: React.FC<AddHrProps> = ({ isFetch, setIsFetch }) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const companyapi = new CompanyApi();
  const employeesapi = new EmployeesApi();
  const templateapi = new TemplateApi();

  const [file, setFile] = useState<File | null>(null);
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
  const [statusEditCard, setStatusEditCard] = useState(0);
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
    console.log(e.target.value);
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

    const resUploadData = await addData(formData);
    setEmployeeId(resUploadData);

    if (resUploadData === '0')  //add return 0 in node js
    {
      Swal.fire({
        title: 'Error!',
        text: 'อีเมลซ้ำ โปรดใช้อีเมลอื่น!',
        icon: 'error',
      });
      return;
    }


    console.log(resUploadData, file);

    if (resUploadData && resUploadData !== '0' && file) {

      const folderName = '';
      const collection = 'users';
      const resUploadLogo = await addProfile(file, resUploadData, folderName, collection);
      //update card
      await updateDetailCard();

      if (resUploadLogo === 200 && statusEditCard == 200) {
        clearImageCache();
        Swal.fire({
          title: 'Success!',
          text: 'เพิ่มข้อมูลสำเร็จ',
          icon: 'success',
        });

        handleClose();
      } else {
        Swal.fire({
          title: 'Upload Error!',
          text: 'อัปโหลดโลโก้ไม่สำเร็จ!',
          icon: 'error',
        });
      }
    }

  };

  const updateDetailCard = async () => {

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
      firstname: firstnameElement.value,
      lastname: lastnameElement.value,
      position: positionElement.value,
      gender: genderValue,
      birthdate: birthdayElement.value,
      startwork: startworkElement.value,
      subdistrict: subdistrictElement.value,
      district: districtElement.value,
      province: provinceElement.value,
      country: countryElement.value,
      phone: telElement.value,
      email: emailElement.value,
      password: passwordElement.value,
      branch: branchValue,
      department: departmentValue
    }

    const allValuesNotNull = Object.values(formEdit).every(value => value !== null && value !== '');
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

    if (allValuesNotNull)  //check every value in formdata
    {

      const textMappingsArray = {
        "fullname": `${formEdit.firstname} ${formEdit.lastname}`,
        "companyName": `${getDataCompanyById.name}`,
        "companyAddress": `${addressBranch}`,
        "position": `${departName}`,
        "email": `${formEdit.email}`,
        "phoneDepartment": `${telDepartment}`,
        "phone": `${formEdit.phone}`,
        "departmentName": `${departName}`,
      };

      console.log('textMappings', textMappingsArray);

      try {
        const imageUrl = await drawImage(TemplateBycompanyId[0].background, textMappingsArray, positions, getDataCompanyById.logo);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${employeeId}.png`, { type: 'image/png' });

        if (employeeId !== undefined) {

          const data = {
            file: file,
            uid: employeeId || '',
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

      await uploadSelectedTemplate(newGeneratedFiles, temId);

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

          setStatusEditCard(resUpdateStatus);
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

      const res = await employeesapi.UploadProfile(file, uid, folderName, collection);
      return res;

    } catch (error) {

      console.log('Error in addLogo method: ', error);
      return 500;
    }
  };

  const addData = async (formData: FormData): Promise<string | undefined> => {

    const res = await employeesapi.AddDataEmployee(
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

  async function getCompanyBranchById(CompanyId: string) {
    const res = await companyapi.getCompanyBranchById(CompanyId);
    setDataBranchesById(res);
    setIsFetch(true);
  }

  async function GetDepartmentByCompanyId(CompanyId: string) {
    const res = await companyapi.getDepartmentByCompanyId(CompanyId);
    setDataDepartmentById(res);
    setIsFetch(true);
  }

  async function getTemplateByCompanyId(CompanyId: string) {
    const res = await templateapi.getTemplateUsedByCompanyId(CompanyId);
    setTemplateBycompanyId(res);
    setIsFetch(true);
  }

  async function getUrlLogoCompany(CompanyId: string) {
    const resGetdataDetail = await companyapi.GetDataCompanyById(CompanyId);
    setGetDataCompanyById(resGetdataDetail);
    setIsFetch(true);
  }

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

  }, [isFetch]);



  return (
    <>
      <Button variant="success" onClick={handleShow}>
        เพิ่มข้อมูลพนักงาน
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มพนักงานฝ่ายบุคคล</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={uploadData}>
            <Form.Label htmlFor="firstname">ชื่อ</Form.Label>
            <Form.Control type="text" id="firstname" required />
            <br />
            <Form.Label htmlFor="lastname">นามสกุล</Form.Label>
            <Form.Control type="text" id="lastname" required />
            <br />
            <Form.Label htmlFor="email">อีเมล</Form.Label>
            <Form.Control type="text" id="email" required />
            <br />
            <Form.Label htmlFor="password">รหัสผ่าน</Form.Label>
            <Form.Control type="text" id="password" required />
            <br />
            <p>เพศ</p>
            <Form.Select aria-label="เลือกเพศ" onChange={handleGender} value={genderValue}>
              <option value="">เลือกเพศ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
            </Form.Select>
            <br />
            <Form.Label htmlFor="birthdate">วันเกิด</Form.Label>
            <Form.Control type="datetime-local" id="birthdate" required />
            <br />
            <Form.Label htmlFor="phone">เบอร์โทร</Form.Label>
            <Form.Control type="text" id="phone" required />
            <br />
            <Form.Label htmlFor="subdistrict">ตำบล</Form.Label>
            <Form.Control type="text" id="subdistrict" required />
            <br />
            <Form.Label htmlFor="district">อำเภอ</Form.Label>
            <Form.Control type="text" id="district" required />
            <br />
            <Form.Label htmlFor="province">จังหวัด</Form.Label>
            <Form.Control type="text" id="province" required />
            <br />
            <Form.Label htmlFor="country">ประเทศ</Form.Label>
            <Form.Control type="text" id="country" required />
            <br />
            <p>สาขาบริษัท</p>
            {dataBranchesById && (
              <Form.Select onChange={handleBranches}>
                <option value="">เลือกสาขาบริษัท</option>
                {dataBranchesById.map((item: GetCompanyBranchesById, index: number) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            )}
            <br />
            <p>แผนกบริษัท</p>
            {dataDepartmentById && (
              <Form.Select onChange={handleDepartment}>
                <option value="">เลือกแผนกบริษัท</option>
                {dataDepartmentById.map((item: GetDepartmentByComId, index: number) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            )}
            <br />
            <p><b>ส่วนนี้จะไม่มีการเพิ่มแผนก * HR *</b></p>
            <Form.Label htmlFor="position">ตำแหน่ง</Form.Label>
            <Form.Control type="text" id="position" required />
            <br />
            <Form.Label htmlFor="startwork">วันที่เริ่มงาน</Form.Label>
            <Form.Control type="datetime-local" id="startwork" required />
            <br />
            <div className="container mt-1">
              <h4>รูปประจำตัวพนักงาน</h4>
              <label>
                <input className="btn btn-primary" type="file" id='selectImg' onChange={handleFileChange} />
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
            <Button variant="secondary" onClick={handleClose}>
              ยกเลิก
            </Button>
            <Button variant="primary" type='submit'>
              ตกลง
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddEmployees