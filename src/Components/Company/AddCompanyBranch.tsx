import { useState } from 'react'
import '@/Components/Admin/CSS/AddCompany.css'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";

function AddCompanyBranch() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false); 
  const handleShow = () => setShow(true);
  const companyapi = new CompanyApi();
  

  const getNameValue = (): string => {
    const emailElement = document.getElementById('name') as HTMLInputElement | null;
    return emailElement ? emailElement.value : '';
  };

  const getSubdistrictValue = (): string => {
    const passwordElement = document.getElementById('subdistrict') as HTMLInputElement | null;
    return passwordElement ? passwordElement.value : '';
  };

  const getDistrictValue = (): string => {
    const businessTypeElement = document.getElementById('district') as HTMLInputElement | null;
    return businessTypeElement ? businessTypeElement.value : '';
  };

  const getProvinceValue = (): string => {
    const nameElement = document.getElementById('province') as HTMLInputElement | null;
    return nameElement ? nameElement.value : '';
  };

  const getCountryValue = (): string => {
    const phoneNumberElement = document.getElementById('country') as HTMLInputElement | null;
    return phoneNumberElement ? phoneNumberElement.value : '';
  };


  const formData = {
    name: getNameValue(),
    subdistrict: getSubdistrictValue(),
    district: getDistrictValue(),
    province: getProvinceValue(),
    country: getCountryValue(),
  };


  const uploadData = async () => {

    console.log('check form data'  , formData);
    if (formData.name && formData.subdistrict && 
      formData.district && formData.province && formData.country
    ) {
  
      const resUploadData = await addData();
  
      if (resUploadData == 200) {
  
        Swal.fire({
          title: 'Success!',
          text: 'เพิ่มข้อมูลสำเร็จ',
          icon: 'success',
        });
  
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
    }
    else {
      Swal.fire({
        title: 'Upload Error!',
        text: 'โปรดใส่ข้อมูลให้ครบและถูกต้อง',
        icon: 'error',
      });
      return;
    }
  };
  

  const addData = async (): Promise<number | undefined> => {

    const nameValue = getNameValue();
    const subdistrictValue = getSubdistrictValue();
    const districtValue = getDistrictValue();
    const provinceValue = getProvinceValue();
    const countryValue = getCountryValue();

    if (nameValue &&
      subdistrictValue &&
      districtValue &&
      provinceValue &&
      countryValue) {

      const res = await companyapi.AddCompanyBranch(
        nameValue,
        subdistrictValue,
        districtValue,
        provinceValue,
        countryValue);

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


  return (
    <>
      <Button variant="success" onClick={handleShow}>
        เพิ่มสาขาบริษัท
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มสาขาบริษัท</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={uploadData}>
            <p>ชื่อสาขา - Name branch</p>
            <hr />
            <br />
            <Form.Label htmlFor="name">ชื่อสาขา</Form.Label>
            <Form.Control type="text" id="name" required />
            <br />
            <p>ที่อยู่ - Address</p>
            <hr />
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
          </form>
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

export default AddCompanyBranch