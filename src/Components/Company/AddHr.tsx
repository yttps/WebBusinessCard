import { useState, ChangeEvent, useEffect } from 'react'
import '@/Components/Company/CSS/AddHr.css'
import { HrApi } from '@/ApiEndpoints/HrApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetCompanyBranchesById } from '@/Model/GetCompanyBranchesById';

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
  startwork: string
}

const AddHr: React.FC<AddHrProps> = ({ isFetch, setIsFetch }) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const hrapi = new HrApi();
  const [file, setFile] = useState<File | null>(null);
  // const [isFetch, setIsFetch] = useState(false);
  const companyapi = new CompanyApi();
  const [dataBranchesById, setDataBranchesById] = useState<GetCompanyBranchesById[]>([])
  const [branchValue, setBranchValue] = useState('');
  const [genderValue, setGenderValue] = useState('');

  const handleBranches = (e: ChangeEvent<HTMLSelectElement>) => {

    e.preventDefault();
    const selectedBranchIndex = e.target.value;
    if (selectedBranchIndex) {
      setBranchValue(selectedBranchIndex);
      console.log('indexxxx', branchValue);
    }

  }
  const handleGender = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectedGender = e.target.value;

    if (selectedGender) {
      setGenderValue(selectedGender);
      console.log('genderrrrr', genderValue);
    }

  }

  const [imageData] = useState({
    base64textString: '',
    imageName: '',
    showImage: false,
  });

  const getFirstnameValue = (): string => {
    const nameElement = document.getElementById('firstname') as HTMLInputElement | null;
    return nameElement ? nameElement.value : '';
  };

  const getLastnameValue = (): string => {
    const lastnameElement = document.getElementById('lastname') as HTMLInputElement | null;
    return lastnameElement ? lastnameElement.value : '';
  };

  const getEmailValue = (): string => {
    const emailTypeElement = document.getElementById('email') as HTMLInputElement | null;
    return emailTypeElement ? emailTypeElement.value : '';
  };

  const getPasswordValue = (): string => {
    const passwordElement = document.getElementById('password') as HTMLInputElement | null;
    return passwordElement ? passwordElement.value : '';
  };

  const getGenderValue = (): string => {
    const genderElement = document.getElementById('gender') as HTMLInputElement | null;
    return genderElement ? genderElement.value : '';
  };

  const getPhoneValue = (): string => {
    const phoneElement = document.getElementById('phone') as HTMLInputElement | null;
    return phoneElement ? phoneElement.value : '';
  };

  const getSubdistrictValue = (): string => {
    const subdistrictElement = document.getElementById('subdistrict') as HTMLInputElement | null;
    return subdistrictElement ? subdistrictElement.value : '';
  }

  const getDistrictValue = (): string => {
    const districtElement = document.getElementById('district') as HTMLInputElement | null;
    return districtElement ? districtElement.value : '';
  };

  const getProvinceValue = (): string => {
    const provinceElement = document.getElementById('province') as HTMLInputElement | null;
    return provinceElement ? provinceElement.value : '';
  };

  const getCountryValue = (): string => {
    const countryElement = document.getElementById('country') as HTMLInputElement | null;
    return countryElement ? countryElement.value : '';
  };

  const getCompanyBranchValue = (): string => {
    const companyBranchElement = document.getElementById('companybranch') as HTMLInputElement | null;
    return companyBranchElement ? companyBranchElement.value : '';
  };
  const getDepartmentValue = (): string => {
    const departmentElement = document.getElementById('department') as HTMLInputElement | null;
    return departmentElement ? departmentElement.value : '';
  };
  const getPositionValue = (): string => {
    const positionElement = document.getElementById('position') as HTMLInputElement | null;
    return positionElement ? positionElement.value : '';
  };

  const getStartworkValue = (): string => {
    const startworkElement = document.getElementById('startwork') as HTMLInputElement | null;
    return startworkElement ? startworkElement.value : '';
  };


  const uploadData = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const formData = {
      firstname: getFirstnameValue(),
      lastname: getLastnameValue(),
      email: getEmailValue(),
      password: getPasswordValue(),
      gender: getGenderValue(),
      phone: getPhoneValue(),
      subdistrict: getSubdistrictValue(),
      district: getDistrictValue(),
      province: getProvinceValue(),
      country: getCountryValue(),
      companybranch: getCompanyBranchValue(),
      department: getDepartmentValue(),
      position: getPositionValue(),
      startwork: getStartworkValue()
    };

    if (file && Object.values(formData).every(value => value !== '')) {

      try {

        const resUploadData = await addData(formData);

        if (resUploadData) {
          const resUploadLogo = await addLogo(file);

          if (resUploadLogo === 200) {
            clearImageCache();
            Swal.fire({
              title: 'Success!',
              text: 'เพิ่มข้อมูลสำเร็จ',
              icon: 'success',
            });

            await hrapi.GetAllHr();
            handleClose();

          }
          else {
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

  const addLogo = async (file: File): Promise<number | undefined> => {

    try {

      const res = await hrapi.UploadLogo(file);
      return res;

    } catch (error) {

      console.log('Error in addLogo method: ', error);
      return 500;
    }
  };

  const addData = async (formData: FormData): Promise<number | undefined> => {


    const hasAySymbolEmail = formData.email.includes('@');
    const phoneRegex = /^\d+$/;

    if (!hasAySymbolEmail) {

      Swal.fire({
        title: 'Add Data Error!',
        text: 'อีเมลหรือเว็บไซต์ต้องมี "@" ',
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
      formData.startwork
    );
    console.log('check res hr id', res);
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


  async function getCompanyBranchById() {

    const loggedInData = localStorage.getItem("LoggedIn");

    if (loggedInData) {

      const parsedData = JSON.parse(loggedInData);
      const CompanyId = parsedData.id;

      if (CompanyId) {
        setIsFetch(true);
        const res = await companyapi.getCompanyBranchById(CompanyId);
        setDataBranchesById(res);
        console.log("res", res);
        console.log("branches by id", dataBranchesById);
      }
    }
  }

  useEffect(() => {

    if (!isFetch) {
      getCompanyBranchById();
    }

  }, [isFetch, dataBranchesById])


  return (
    <>
      <Button variant="success" onClick={handleShow}>
        เพิ่มพนักงานฝ่ายบุคลล
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มพนักงานฝ่ายบุคคล</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={uploadData}>
            <Form.Label htmlFor="inputPassword5">ชื่อ</Form.Label>
            <Form.Control type="text" id="firstname" required />
            <br />
            <Form.Label htmlFor="inputPassword5">นามสกุล</Form.Label>
            <Form.Control type="text" id="lastname" required />
            <br />
            <Form.Label htmlFor="inputPassword5">อีเมล</Form.Label>
            <Form.Control type="text" id="email" required />
            <br />
            <Form.Label htmlFor="inputPassword5">รหัสผ่าน</Form.Label>
            <Form.Control type="text" id="password" required />
            <br />
            <p>เพศ</p>
            <Form.Select aria-label="เลือกเพศ" onChange={handleGender}>
              <option value="male">ชาย</option>
              <option value="famale">หญิง</option>
            </Form.Select>
            <br />
            <Form.Label htmlFor="inputPassword5">เบอร์โทร</Form.Label>
            <Form.Control type="text" id="phone" required />
            <br />
            <Form.Label htmlFor="inputPassword5">ตำบล</Form.Label>
            <Form.Control type="text" id="subdistrict" required />
            <br />
            <Form.Label htmlFor="inputPassword5">อำเภอ</Form.Label>
            <Form.Control type="text" id="district" required />
            <br />
            <Form.Label htmlFor="inputPassword5">จังหวัด</Form.Label>
            <Form.Control type="text" id="province" required />
            <br />
            <p>สาขาบริษัท</p>
            {dataBranchesById && (
              <Form.Select onChange={handleBranches}>
                {dataBranchesById.map((item: GetCompanyBranchesById, index: number) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            )}
            <br />
            <Form.Label htmlFor="inputPassword5">แผนก</Form.Label>
            <Form.Control type="text" id="department" required />
            <br />
            <Form.Label htmlFor="inputPassword5">ตำแหน่ง</Form.Label>
            <Form.Control type="text" id="position" required />
            <br />
            <Form.Label htmlFor="inputPassword5">วันที่เริ่มงาน</Form.Label>
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


export default AddHr