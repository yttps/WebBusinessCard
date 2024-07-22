import { useState } from 'react'
import '@/Components/Admin/CSS/AddCompany.css'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";


interface FormData {
  name: string;
  subdistrict: string;
  district: string;
  province: string;
  country: string;
}


function AddCompanyBranch() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const companyapi = new CompanyApi();


  const getNameValue = (): string => {
    const nameElement = document.getElementById('name') as HTMLInputElement | null;
    return nameElement ? nameElement.value : '';
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

  const uploadData = async (event: React.FormEvent<HTMLFormElement>) => {

    const formData = {
      name: getNameValue(),
      subdistrict: getSubdistrictValue(),
      district: getDistrictValue(),
      province: getProvinceValue(),
      country: getCountryValue(),
    };
    console.log('check form data', formData);

    event.preventDefault();

    if (formData.name && formData.subdistrict &&
      formData.district && formData.province && formData.country
    ) {

      const resUploadData = await addData(formData);

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

      }
    }
    else {
      Swal.fire({
        title: 'Upload Error!',
        text: 'โปรดใส่ข้อมูลให้ครบและถูกต้อง',
        icon: 'error',
      });

    }
  };


  const addData = async (formData: FormData): Promise<number | undefined> => {

    if (formData.name && formData.subdistrict &&
      formData.district && formData.province && formData.country) {

      const res = await companyapi.AddCompanyBranch(
        formData.name,
        formData.subdistrict,
        formData.district,
        formData.province,
        formData.country);

      console.log('ssss', res);
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
      {/* <Button variant="success" onClick={handleShow}>
        เพิ่มสาขาบริษัท
      </Button> */}

      <div onClick={handleShow} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
        </svg>
        <span className="flex-1 ms-3 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-white">เพิ่มสาขาบริษัท</span>
      </div>

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
            <Button variant="secondary" onClick={handleClose}>
              ยกเลิก
            </Button>
            <Button variant="primary" type="submit">
              ตกลง
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );


}

export default AddCompanyBranch