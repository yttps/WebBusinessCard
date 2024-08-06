import React, { useState, ChangeEvent, useRef } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { tailChase } from 'ldrs';

tailChase.register();

export default function Register() {

  const [file, setFile] = useState<File | null>(null);
  const nav = useNavigate();
  const companyapi = new CompanyApi();
  const [companyID, setCompanyID] = useState('');
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

  console.log(companyID);

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {

    if (event.target.files && event.target.files.length > 0) {

      setFile(event.target.files[0]);
      setPreviewImage(event.target.files[0]);
    }
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

    const removeBtn  = document.getElementById('removeBtn') as HTMLButtonElement;


    const emailValue = getEmailValue();
    const phoneNumberValue = getPhoneNumberValue();
    const websiteValue = getWebsiteValue();


    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-z]{2,}))$/
    );
    const phoneRegex = /^\d+$/;
    const allValuesNotNull = Object.values(formData).every(value => value !== null && value !== '');
    const websiteRegex = new RegExp(/^www\.[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-z]{2,}$/);
    const CheckPassword = Object.values(validations).every(value => value == true);


    if (!allValuesNotNull) {
      Swal.fire({
        title: 'Error!',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        icon: 'error',
      });
      return;
    }
    
    if (!file) {
      Swal.fire({
        title: 'Error!',
        text: 'โปรดเลือกรูปภาพ',
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

    if (!CheckPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'กำหนดรหัสผ่านตามเงื่อนไข!',
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

    removeBtn.style.visibility = 'hidden';
    setLoading(true);

    try {

      const rescompanyId = await addData();

      if (rescompanyId == '0') {
        Swal.fire({
          title: 'เพิ่มข้อมูลล้มเหลว!',
          text: 'อีเมลซ้ำกับบุคคลอื่น!',
          icon: 'error',
        });
        return;
      }

      if (rescompanyId && file) {

        const resUploadLogo = await addLogo(file, rescompanyId);

        if (resUploadLogo == 200) {

          clearImageCache();
          const res = await Swal.fire({
            title: 'Success!',
            text: 'เพิ่มข้อมูลสำเร็จ',
            icon: 'success',
          });

          if (res) {
            nav('/', { replace: true });
          }
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
    } catch (error) {

      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'เกิดข้อผิดพลาด!',
        icon: 'error',
      });

    } finally {
      setLoading(false); // Set loading to false when the request finishes
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
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xxl flex flex-wrap items-center justify-between  mx-auto p-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-6" alt="Flowbite Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Business Card</span>
          </div>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
      </nav>
      <hr />
      <div className="container mx-auto flex items-center justify-center mt-8 w-full">
        <div className="bg-card p-10 rounded-lg shadow-lg w-full max-w-3xl justify-center items-center pl-[7.5rem]">
          <h1 className="text-2xl font-bold text-foreground mb-6">สมัครสมาชิก</h1>
          <form className="grid md:grid-cols-2 gap-4" onSubmit={uploadData}>
            <div>
              <Form.Label htmlFor="email">email</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="email" required />
            </div>
            <div>
              <Form.Label htmlFor="name">ชื่อบริษัท</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="name" required />
            </div>
            <div>
              <Form.Label htmlFor="businessType">ประเภทธุรกิจ</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="businessType" required />
            </div>
            <div>
              <Form.Label htmlFor="website">เว็บไซต์</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="website" required />
            </div>
            <div>
              <Form.Label htmlFor="yearFounded">ปีที่ก่อตั้ง</Form.Label>
              <Form.Control 
              className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" 
              type="date" 
              id="yearFounded" 
              max={today}
              required />
            </div>
            <div>
              <Form.Label htmlFor="phoneNumber">เบอร์โทรศัพท์ของบริษัท</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="phoneNumber" required />
            </div>
            <div>
              <Form.Label htmlFor="subdistrict">ตำบล</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="subdistrict" required />
            </div>
            <div>
              <Form.Label htmlFor="district">อำเภอ</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="district" required />
            </div>
            <div>
              <Form.Label htmlFor="province">จังหวัด</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="province" required />
            </div>
            <div>
              <Form.Label htmlFor="country">ประเทศ</Form.Label>
              <Form.Control className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring" type="text" id="country" required />
            </div>
            <div>
              <Form.Label htmlFor="password">รหัสผ่าน</Form.Label>
              <Form.Control
                className="mt-1 block w-full p-2 border border-border rounded-lg focus:ring focus:ring-ring"
                type={showPass ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required />
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
            <div className="md:col-span-2">
              <div className="mt-2">
                <Form.Group controlId="formFile">
                  <Form.Label>Upload File</Form.Label>
                  <hr />
                  <br />
                  <Form.Control
                    ref={backgroundInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg, .jpeg, .png"
                  />
                </Form.Group>
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
                      <Button id='removeBtn' variant="danger">Remove Image</Button>
                    </div></>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end mt-6">
              {!loading ?
                <Link to="/">
                  <Button
                    variant="outline-secondary"
                  >ยกเลิก</Button>
                </Link> : <div></div>}
              &nbsp;
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
          </form>
        </div>
      </div>
    </>
  );

}
