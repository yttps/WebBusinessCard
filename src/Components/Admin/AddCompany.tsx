import { useState, ChangeEvent } from 'react'
import '@/Components/Admin/CSS/AddCompany.css'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function AddCompany() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const companyapi = new CompanyApi();
  const [file, setFile] = useState<File | null>(null);
  // const [companyID,setCompanyID] = useState('');
  const nav = useNavigate();

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

  const getEmailValue = (): string => {
    const emailElement = document.getElementById('email') as HTMLInputElement | null;
    return emailElement ? emailElement.value : '';
  };

  const getPasswordValue = (): string => {
    const passwordElement = document.getElementById('password') as HTMLInputElement | null;
    return passwordElement ? passwordElement.value : '';
  };

  const getBusinessTypeValue = (): string => {
    const businessTypeElement = document.getElementById('businessType') as HTMLInputElement | null;
    return businessTypeElement ? businessTypeElement.value : '';
  };

  const getNameValue = (): string => {
    const nameElement = document.getElementById('name') as HTMLInputElement | null;
    return nameElement ? nameElement.value : '';
  };

  const getPhoneNumberValue = (): string => {
    const phoneNumberElement = document.getElementById('phoneNumber') as HTMLInputElement | null;
    return phoneNumberElement ? phoneNumberElement.value : '';
  };

  const getWebsiteValue = (): string => {
    const websiteElement = document.getElementById('website') as HTMLInputElement | null;
    return websiteElement ? websiteElement.value : '';
  };

  const getYearFoundedValue = (): string => {
    const yearFoundedElement = document.getElementById('yearFounded') as HTMLInputElement | null;
    return yearFoundedElement ? yearFoundedElement.value : '';
  };

  const getSubdistrictValue = (): string => {
    const subdistrictElement = document.getElementById('subdistrict') as HTMLInputElement | null;
    return subdistrictElement ? subdistrictElement.value : '';
  };

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

  const formData = {
    email: getEmailValue(),
    password: getPasswordValue(),
    businessType: getBusinessTypeValue(),
    name: getNameValue(),
    phoneNumber: getPhoneNumberValue(),
    website: getWebsiteValue(),
    yearFounded: getYearFoundedValue(),
    subdistrict: getSubdistrictValue(),
    district: getDistrictValue(),
    province: getProvinceValue(),
    country: getCountryValue(),
  };

  const uploadData = async (event: React.FormEvent) => {

    event.preventDefault();

    if (file) {

      console.log(formData);
      const rescompanyId = await addData();

      if (rescompanyId) {

        const folderName = 'logo';
        const collection = 'companies';
        const resUploadLogo = await addLogo(file, rescompanyId, folderName, collection);

        if (resUploadLogo == 200) {

          clearImageCache();
          Swal.fire({
            title: 'Success!',
            text: 'เพิ่มข้อมูลสำเร็จ',
            icon: 'success',
          });

          handleClose();
          nav('/ListCompany', { replace: true });

        }
        else if (resUploadLogo == 500) {
          Swal.fire({
            title: 'Upload Error!',
            text: 'อัปโหลดโลโก้ไม่สำเร็จ!',
            icon: 'error',
          });
          return;
        }

      }
      if (rescompanyId == '0') {

        Swal.fire({
          title: 'Error!',
          text: 'อีเมลซ้ำ โปรดใช้อีเมลอื่น!',
          icon: 'error',
        });
        return;
      }
      if (rescompanyId == 'email') {

        Swal.fire({
          title: 'Add Data Error!',
          text: 'อีเมลหรือเว็บไซต์ต้องมี "@" ',
          icon: 'error',
        });
        return;
      }
      if (rescompanyId == 'web') {
        Swal.fire({
          title: 'Add Data Error!',
          text: 'เว็บไซต์ต้องมี ".com" ',
          icon: 'error',
        });
      }
      if (rescompanyId == 'phonenumber') {
        Swal.fire({
          title: 'Add Data Error!',
          text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
          icon: 'error',
        });
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

  const addLogo = async (file: File, companyId: string, folderName: string, collection: string): Promise<number | undefined> => {

    try {

      const res = await companyapi.UploadLogo(file, companyId, folderName, collection);
      return res;

    } catch (error) {

      console.log('Error in addLogo method: ', error);
      return 500;
    }
  };

  const addData = async (): Promise<string | undefined> => {

    const emailValue = getEmailValue();
    const passwordValue = getPasswordValue();
    const businessTypeValue = getBusinessTypeValue();
    const nameValue = getNameValue();
    const phoneNumberValue = getPhoneNumberValue();
    const websiteValue = getWebsiteValue();
    const yearFoundedValue = getYearFoundedValue();
    const subdistrictValue = getSubdistrictValue();
    const districtValue = getDistrictValue();
    const provinceValue = getProvinceValue();
    const countryValue = getCountryValue();

    const hasAySymbolEmail = emailValue.includes('@');
    const hasAySymbolWeb = websiteValue.includes('.com');
    const phoneRegex = /^\d+$/;

    if (!hasAySymbolEmail) {
      return 'email';
    }

    if (!hasAySymbolWeb) {
      return 'web';
    }

    if (!phoneRegex.test(phoneNumberValue)) {
      return 'phonenumber';
    }

    const resCompanyId = await companyapi.AddDataCompany(
      emailValue,
      passwordValue,
      businessTypeValue,
      nameValue,
      phoneNumberValue,
      websiteValue,
      yearFoundedValue,
      subdistrictValue,
      districtValue,
      provinceValue,
      countryValue);

    if (resCompanyId) {
      return resCompanyId;
    }

  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        เพิ่มบริษัท
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มบริษัท</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={uploadData}>
            <Form.Label htmlFor="email">email</Form.Label>
            <Form.Control type="text" id="email" required />
            <br />
            <Form.Label htmlFor="password">รหัสผ่าน</Form.Label>
            <Form.Control type="text" id="password" required />
            <br />
            <Form.Label htmlFor="name">ชื่อบริษัท</Form.Label>
            <Form.Control type="text" id="name" required />
            <br />
            <Form.Label htmlFor="businessType">ประเภทธุรกิจ</Form.Label>
            <Form.Control type="text" id="businessType" required />
            <br />
            <Form.Label htmlFor="website">เว็บไซต์</Form.Label>
            <Form.Control type="text" id="website" required />
            <br />
            <Form.Label htmlFor="yearFounded">ปีที่ก่อตั้ง</Form.Label>
            <Form.Control type="datetime-local" id="yearFounded" required />
            <br />
            <Form.Label htmlFor="phoneNumber">เบอร์โทรศัพท์ของบริษัท</Form.Label>
            <Form.Control type="text" id="phoneNumber" required />
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

            <div className="container mt-1">
              <h4>Logo บริษัท</h4>
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
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button variant="primary" type="submit">
                ตกลง
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddCompany