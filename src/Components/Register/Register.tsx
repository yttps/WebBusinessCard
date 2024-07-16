import React, { useState, ChangeEvent } from 'react'
import { Container, Navbar, Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';


export default function Register() {

  const [file, setFile] = useState<File | null>(null);
  const nav = useNavigate();
  const companyapi = new CompanyApi();
  const [companyID, setCompanyID] = useState('');

  console.log(companyID);

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
    file: file
  };

  const uploadData = async (event: React.FormEvent) => {

    event.preventDefault();
    const emailValue = getEmailValue();
    const passwordValue = getPasswordValue();
    const phoneNumberValue = getPhoneNumberValue();
    const websiteValue = getWebsiteValue();


    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const phoneRegex = /^\d+$/;
    const allValuesNotNull = Object.values(formData).every(value => value !== null && value !== '');
    const websiteRegex = new RegExp(/^www\.[a-zA-Z0-9-]+\.[a-z]{2,}$/);


    if (!allValuesNotNull) {
      Swal.fire({
        title: 'Error!',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        icon: 'error',
      });
      return;
    }

    if (!websiteRegex.test(websiteValue)) {
      Swal.fire({
        title: 'Error!',
        text: 'กรอกข้อมูลเว็บไซต์ให้ถูกต้อง!',
        icon: 'error',
      });
      return;
    }

    if (passwordValue.length < 6) {
      Swal.fire({
        title: 'Error!',
        text: 'กำหนดรหัสผ่านอย่างน้อย 6 ตัว!',
        icon: 'error',
      });
      return;
    }

    if (!emailRegex.test(emailValue)) {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'อีเมลต้องมี "@" และ ".com"',
        icon: 'error',
      });
      return;
    }

    if (!phoneRegex.test(phoneNumberValue)) {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
        icon: 'error',
      });
      return;
    }

    const rescompanyId = await addData();

    if (rescompanyId == '0') {
      Swal.fire({
        title: 'เพิ่มข้อมูลล้มเหลว!',
        text: 'อีเมลซ้ำกับ User อื่น!',
        icon: 'error',
      });
      return;
    }

    if (rescompanyId && file) {

      const resUploadLogo = await addLogo(file, rescompanyId);

      if (resUploadLogo == 200) {

        clearImageCache();
        Swal.fire({
          title: 'Success!',
          text: 'เพิ่มข้อมูลสำเร็จ',
          icon: 'success',
        });

        nav('/', { replace: true });

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
  }

  const addLogo = async (file: File, companyId: string): Promise<number | undefined> => {

    try {

      const folderName = 'logo';
      const collection = 'companies';
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

    //add status
    if (resCompanyId) {
      console.log(resCompanyId);
      setCompanyID(resCompanyId);
      return resCompanyId;
    }
  };

  return (
    <>
      <Navbar className="bg-body-alert-dark">
        <Container>
          <Navbar.Brand className='navbar' href="#home">
            <img
              alt=""
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwdWKPb51hE9MLud6jfCNprFSAHOWFi6be-G3iT-KIIUxxLCkTXxy0Ug-egsYYz3IZLcY&usqp=CAU"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Register Page
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div className='con1'>
        <Container className="mt-5">
          <h2>Register</h2>
          <div className='con2'>
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

              <div>
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
              <div className='btn'>
                <Button variant="success" type="submit">
                  ตกลง
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </>
  )
}
