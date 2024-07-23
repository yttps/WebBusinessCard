import React, { useState } from 'react';
import '@/Components/Admin/CSS/AddCompany.css';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AddDepartment() {
  const [show, setShow] = useState(false);
  const [KeepDepartments, setKeepDepartments] = useState<{ name: string; phone: string }[]>([{ name: '', phone: '' }]);
  const companyapi = new CompanyApi();
  const nav = useNavigate();

  const handleClose = () => {
    setShow(false);
    setKeepDepartments([{ name: '', phone: '' }]);
  };

  const handleShow = () => setShow(true);

  const handleDepartmentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    const isEnglish = /^[a-zA-Z\s]*$/.test(value);

    const updatedValue = isEnglish ? value.toUpperCase() : value;

    const updatedDepartments = KeepDepartments.map((department, i) =>
      i === index ? { ...department, [name]: updatedValue } : department
    );

    setKeepDepartments(updatedDepartments);
  };

  const handleAddDepartment = () => {
    setKeepDepartments([...KeepDepartments, { name: '', phone: '' }]);
  };

  const uploadData = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    //Njw9AgE4nAcRHNuNMz3Y

    const phoneRegex = /^\d+$/;
    const textOnlyRegex = /^[a-zA-Z\s]+$/;
    const allPhonesNumber = KeepDepartments.every((dept) => phoneRegex.test(dept.phone));
    const allPhonesValid = KeepDepartments.every((dept) => dept.phone.trim() !== '');
    const checknameNotNumber = KeepDepartments.every((dept) => textOnlyRegex.test(dept.name));

    if (!checknameNotNumber) {
      Swal.fire({
        title: 'Error!',
        text: 'ชื่อแผนกต้องไม่เป็นตัวเลข!',
        icon: 'error',
      });
      return;
    }

    if (!allPhonesValid) {
      Swal.fire({
        title: 'Error!',
        text: 'กรอกเบอร์โทรให้ครบ!',
        icon: 'error',
      });
      return;
    }

    if (!allPhonesNumber) {
      Swal.fire({
        title: 'Error!',
        text: 'เบอร์โทรต้องเป็นตัวเลข!',
        icon: 'error',
      });
      return;
    }

    if (KeepDepartments.length > 0) {

      const resUploadData = await addData();

      if (resUploadData?.every((res) => res === 200)) {

        Swal.fire({
          title: 'Success!',
          text: 'เพิ่มข้อมูลแผนกสำเร็จ!',
          icon: 'success',
        }).then(() => {
          handleClose();
          nav('/ListDetailBranchAndDepartment');
          window.location.reload();
        });

      }  //เหลือเช็คกรณีไม่ซ้ำบางตัว
      else if (resUploadData?.every((res) => res === 400)) {
        Swal.fire({
          title: 'Error!',
          text: 'เพิ่มข้อมูลแผนกล้มเหลว!',
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

  const addData = async (): Promise<number[] | undefined> => {

    const statusCodes: number[] = [];
    try {

      const res = await companyapi.AddDepartments(KeepDepartments);
      statusCodes.push(...res);

    } catch (error) {
      console.error('Error adding departments:', error);
      statusCodes.push(400);
    }
    return statusCodes;
  };

  return (
    <>
      {/* <Button variant="success" onClick={handleShow}>
        เพิ่มแผนกบริษัท
      </Button> */}

      <div onClick={handleShow} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
        </svg>
        <span className="flex-1 ms-3 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-white">เพิ่มแผนกบริษัท</span>
      </div>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มแผนกบริษัท</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={uploadData}>
            <p>รายการแผนก - List departments</p>
            <hr />
            <br />
            <div className="checkbox-list">
              {KeepDepartments.map((department, index) => (
                <div key={index}>
                  <Form.Label htmlFor={`departmentName-${index}`}>{`ชื่อแผนกที่ ${index + 1}`}</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id={`departmentName-${index}`}
                    name="name"
                    value={department.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDepartmentChange(index, e)}
                    required
                  />
                  <br />
                  <Form.Label htmlFor={`phoneDepartment-${index}`}>{`เบอร์โทรแผนกที่ ${index + 1}`}</Form.Label>
                  <Form.Control
                    type="text"
                    id={`phoneDepartment-${index}`}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="phone"
                    value={department.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDepartmentChange(index, e)}
                    required
                  />
                  <br />
                </div>
              ))}
              <Button variant="success" onClick={handleAddDepartment}>กรอกแผนกเพิ่ม</Button>
            </div>
            <br />
            <hr />
            <div className="flex justify-end mt-4">
              <Button variant="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
              &nbsp;
              <Button variant="primary" type="submit">
                ตกลง
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddDepartment;
