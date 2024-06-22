import { useState, ChangeEvent } from 'react'
import '@/Components/Company/CSS/AddHr.css'
import { HrApi } from '@/ApiEndpoints/HrApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";

function AddHr() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const hrapi = new HrApi();
  const [file, setFile] = useState<File | null>(null);

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

  console.log("form", formData);
  const uploadData = async () => {


    if (file && formData.firstname && formData.lastname && formData.email &&
      formData.password && formData.gender && formData.phone && formData.subdistrict &&
      formData.district && formData.province && formData.country && formData.companybranch &&
      formData.department && formData.position && formData.startwork
    ) {

      const resUploadData = await addData();
      const resUploadLogo = await addLogo(file);

      console.log("chkk", formData);

      if (resUploadData == 200 && resUploadLogo == 200) {

        clearImageCache();
        Swal.fire({
          title: 'Success!',
          text: 'เพิ่มข้อมูลสำเร็จ',
          icon: 'success',
        });

        await hrapi.GetAllHr();
        handleClose();
      }
      if (resUploadData == 400) {

        Swal.fire({
          title: 'Error!',
          text: 'อีเมลซ้ำ โปรดใช้อีเมลอื่น!',
          icon: 'error',
        });
        return;
      }
      if (resUploadLogo == 500) {
        Swal.fire({
          title: 'Upload Error!',
          text: 'อัปโหลดโลโก้ไม่สำเร็จ!',
          icon: 'error',
        });
        return;
      }
    }
    else {
      Swal.fire({
        title: 'Upload Error!',
        text: 'โปรดใส่ข้อมูลให้ครบและถูกต้อง',
        icon: 'error',
      });
      return;
    }
  }

  const addLogo = async (file: File): Promise<number | undefined> => {

    try {

      const res = await hrapi.UploadLogo(file);
      return res;

    } catch (error) {

      console.log('Error in addLogo method: ', error);
      return 500;
    }
  };

  const addData = async (): Promise<number | undefined> => {

    const firstnameValue = getFirstnameValue();
    const lastnameValue = getLastnameValue();
    const emailValue = getEmailValue();
    const passwordValue = getPasswordValue();
    const genderValue = getGenderValue();
    const phoneValue = getPhoneValue();
    const subdistrictValue = getSubdistrictValue();
    const districtValue = getDistrictValue();
    const provinceValue = getProvinceValue();
    const countryValue = getCountryValue();
    const companyBranchValue = getCompanyBranchValue();
    const departmentValue = getCompanyBranchValue();
    const positionValue = getPositionValue();
    const startworkValue = getStartworkValue();

    const hasAySymbolEmail = emailValue.includes('@');
    const phoneRegex = /^\d+$/;

    if (!hasAySymbolEmail) {

      Swal.fire({
        title: 'Add Data Error!',
        text: 'อีเมลหรือเว็บไซต์ต้องมี "@" ',
        icon: 'error',
      });
      return;
    }

    if (!phoneRegex.test(phoneValue)) {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
        icon: 'error',
      });
      return;
    }

    if (
      firstnameValue &&
      lastnameValue &&
      emailValue &&
      passwordValue &&
      genderValue &&
      phoneValue &&
      subdistrictValue &&
      districtValue &&
      provinceValue &&
      countryValue &&
      companyBranchValue &&
      departmentValue &&
      positionValue &&
      startworkValue) {

      const res = await hrapi.AddDataHr(
        firstnameValue ,
        lastnameValue ,
        emailValue ,
        passwordValue ,
        genderValue ,
        phoneValue ,
        subdistrictValue ,
        districtValue ,
        provinceValue ,
        countryValue ,
        companyBranchValue ,
        departmentValue ,
        positionValue ,
        startworkValue);

        
      console.log('chkkkkkk', res);
      return res;

    } else {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'กรอกข้อมูลให้ครบ',
        icon: 'error',
      });
      return;
    }
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
            <Form.Label htmlFor="inputPassword5">เพศ</Form.Label>
            <Form.Control type="text" id="gender" required />
            <br />
            <Form.Select aria-label="เลือกเพศ">
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
            <Form.Label htmlFor="inputPassword5">สาขาบริษัท</Form.Label>
            <Form.Control type="text" id="companybranch" required />
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
          </form>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={uploadData}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddHr