import React, { useState, ChangeEvent, useEffect } from 'react'
import { EmployeesApi } from '@/ApiEndpoints/EmployeesApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetCompanyBranchesById } from '@/Model/GetCompanyBranchesById';
import { GetDepartmentByComId } from '@/Model/GetDepartmentByComId';

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
  const [file, setFile] = useState<File | null>(null);
  const [dataBranchesById, setDataBranchesById] = useState<GetCompanyBranchesById[]>([]);
  const [dataDepartmentById, setDataDepartmentById] = useState<GetDepartmentByComId[]>([]);
  const [genderValue, setGenderValue] = useState('');
  const [departmentValue, setDepartmentValue] = useState('');
  const [branchValue, setBranchValue] = useState('');

  const handleDepartment = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setDepartmentValue(e.target.value);
  };

  const handleBranches = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setBranchValue(e.target.value);
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

    console.log('form data', formData);

    if (file) {

      try {

        const resUploadData = await addData(formData);

        if (resUploadData) {

          const folderName = '';
          const collection = 'users';
          const resUploadLogo = await addProfile(file, resUploadData, folderName, collection);

          if (resUploadLogo === 200) {
            clearImageCache();
            Swal.fire({
              title: 'Success!',
              text: 'เพิ่มข้อมูลสำเร็จ',
              icon: 'success',
            });
            // await hrapi.GetAllHr();
            handleClose();
          } else {
            Swal.fire({
              title: 'Upload Error!',
              text: 'อัปโหลดโลโก้ไม่สำเร็จ!',
              icon: 'error',
            });
          }
        }
        if (resUploadData === undefined) {
          Swal.fire({
            title: 'Error!',
            text: 'อีเมลซ้ำ โปรดใช้อีเมลอื่น!',
            icon: 'error',
          });
        }
        if (resUploadData == 'email') {
          Swal.fire({
            title: 'Add Data Error!',
            text: 'อีเมลหรือเว็บไซต์ต้องมี "@" ',
            icon: 'error',
          });
        }
        if (resUploadData == 'phonenumber') {
          Swal.fire({
            title: 'Add Data Error!',
            text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
            icon: 'error',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล',
          icon: 'error',
        });
      }
    } else {
      Swal.fire({
        title: 'Upload Error!',
        text: 'โปรดใส่ข้อมูลให้ครบและถูกต้อง',
        icon: 'error',
      });
    }
  };

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

    const hasAtSymbolEmail = formData.email.includes('@');
    const phoneRegex = /^\d+$/;

    if (!hasAtSymbolEmail) {
      return 'email';
    }

    if (!phoneRegex.test(formData.phone)) {
      return 'phonenumber';
    }

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

  useEffect(() => {

    if (!isFetch) {
      const loggedInData = localStorage.getItem("LoggedIn");

      if (loggedInData) {
        const parsedData = JSON.parse(loggedInData);
        const CompanyId = parsedData.companyId;

        if (CompanyId) {
          getCompanyBranchById(CompanyId);
          GetDepartmentByCompanyId(CompanyId);
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