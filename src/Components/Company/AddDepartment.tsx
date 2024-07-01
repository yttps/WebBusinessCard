import React, { useState } from 'react';
import '@/Components/Admin/CSS/AddCompany.css';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from 'react-bootstrap';

function AddDepartment() {
  const [show, setShow] = useState(false);
  const [KeepDepartments, setKeepDepartments] = useState<{ name: string; phone: string }[]>([{ name: '', phone: '' }]);
  const companyapi = new CompanyApi();

  const handleClose = () => {
    setShow(false);
    setKeepDepartments([{ name: '', phone: '' }]);
  };

  const handleShow = () => setShow(true);

  const handleDepartmentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    const updatedDepartments = KeepDepartments.map((department, i) => 
      i === index ? { ...department, [name]: value } : department
    );
    setKeepDepartments(updatedDepartments);
  };

  const handleAddDepartment = () => {
    setKeepDepartments([...KeepDepartments, { name: '', phone: '' }]);
  };

  const uploadData = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (KeepDepartments.length > 0 && KeepDepartments.every((dept) => dept.phone.trim() !== '')) {
      const resUploadData = await addData();

      if (resUploadData?.every((res) => res === 200)) {
        Swal.fire({
          title: 'Success!',
          text: 'เพิ่มข้อมูลแผนกสำเร็จ!',
          icon: 'success',
        });
        handleClose();
      } else if (resUploadData?.every((res) => res === 400)) {
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
      console.log('keep data' , KeepDepartments);
      const res = await companyapi.AddDepartments(KeepDepartments);
      statusCodes.push(...res); 
      console.log('Response statuses:', res);
    } catch (error) {
      console.error('Error adding departments:', error);
      statusCodes.push(400); 
    }
    return statusCodes;
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        เพิ่มแผนกบริษัท
      </Button>

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
                  <Form.Label htmlFor={`departmentName-${index}`}>{`ชื่อแผนกที่ ${index+1}`}</Form.Label>
                  <Form.Control
                    type="text"
                    id={`departmentName-${index}`}
                    name="name"
                    value={department.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDepartmentChange(index, e)}
                    required
                  />
                  <br />
                  <Form.Label htmlFor={`phoneDepartment-${index}`}>{`เบอร์โทรแผนกที่ ${index+1}`}</Form.Label>
                  <Form.Control
                    type="text"
                    id={`phoneDepartment-${index}`}
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

export default AddDepartment;
