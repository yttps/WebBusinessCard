import { useState } from 'react';
import '@/Components/Admin/CSS/AddCompany.css';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from 'react-bootstrap';

function AddDepartment() {
  const [show, setShow] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<{ name: string; phone: string }[]>([]);
  const companyapi = new CompanyApi();

  const handleClose = () => {
    setShow(false);
    setSelectedDepartments([]);
  };

  const handleShow = () => setShow(true);

  const handleDepartmentChange = (departmentName: string) => {
    setSelectedDepartments((prev) => {
      const isDepartmentSelected = prev.some((dept) => dept.name === departmentName);
      if (isDepartmentSelected) {
        return prev.filter((dept) => dept.name !== departmentName);
      } else {
        return [...prev, { name: departmentName, phone: '' }];
      }
    });
  };

  const handlePhoneChange = (departmentName: string, phone: string) => {
    setSelectedDepartments((prev) =>
      prev.map((dept) => (dept.name === departmentName ? { ...dept, phone } : dept))
    );
  };

  const getSelectedDepartmentData = () => {
    return selectedDepartments.map((dept) => ({ name: dept.name, phone: dept.phone }));
  };

  const departments = [
    { en: 'Chairman', th: 'ประธาน' },
    { en: 'Vice Chairman', th: 'รองประธาน' },
    { en: 'President', th: 'ประธานกรรมการ' },
    { en: 'Vice-President', th: 'รองประธานกรรมการ' },
    { en: 'Senior Advisor', th: 'ที่ปรึกษาอาวุโส' },
    { en: 'Managing Director', th: 'กรรมการผู้จัดการ' },
    { en: 'Senior Executive Managing Director', th: 'ประธานกรรมการผู้บริหารระดับสูง' },
    { en: 'Board of Directors', th: 'คณะกรรมการผู้บริหาร' },
    { en: 'Directors', th: 'กรรมการ' },
    { en: 'General Manager', th: 'ผู้จัดการทั่วไป' },
    { en: 'Manager', th: 'ผู้จัดการ' },
    { en: 'Branch Manager', th: 'ผู้จัดการสาขา' },
    { en: 'Head of Department (Division Chief)', th: 'หัวหน้าแผนก' },
    { en: 'The Management team', th: 'คณะบริหาร' },
    { en: 'Personnel Manager', th: 'ผู้จัดการฝ่ายบุคคล' },
    { en: 'Finance Manager', th: 'ผู้จัดการฝ่ายการเงิน' },
    { en: 'Sales Manager', th: 'ผู้จัดการฝ่ายขาย' },
    { en: 'Plant Manager', th: 'ผู้จัดการฝ่ายโรงงาน' },
    { en: 'Accounting Manager', th: 'ผู้จัดการฝ่ายบัญชี' },
    { en: 'Purchasing Manager', th: 'ผู้จัดการฝ่ายจัดซื้อ' },
    { en: 'Manufacturing Manager', th: 'ผู้จัดการฝ่ายผลิต' },
    { en: 'Export Manager', th: 'ผู้จัดการฝ่ายส่งออก' },
    { en: 'Production Control Manager', th: 'ผู้จัดการฝ่ายควบคุมการผลิต' },
    { en: 'Quality Control Manager', th: 'ผู้จัดการฝ่ายควบคุมคุณภาพ' },
    { en: 'Assurance Manager', th: 'ผู้จัดการฝ่ายประกันภัย' },
    { en: 'Technical Manager', th: 'ผู้จัดการฝ่ายเทคนิค' },
    { en: 'Marketing Manager', th: 'ผู้จัดการฝ่ายการตลาด' },
    { en: 'Service Manager', th: 'ผู้จัดการฝ่ายให้การบริการ' },
    { en: 'Credit and Legal Manager', th: 'ผู้จัดการฝ่ายให้สินเชื่อและกฎหมาย' },
    { en: 'Executive Secretary', th: 'เลขาผู้บริหาร' },
    { en: 'Research and Development Manager', th: 'ผู้จัดการฝ่ายวิจัยและพัฒนา' },
    { en: 'Products Manager', th: 'ผู้จัดการฝ่ายผลิตภัณฑ์' },
    { en: 'Secretary', th: 'เลขานุการ' },
    { en: 'Chief Executive Officer (C.E.O.)', th: 'หัวหน้าฝ่ายบริหารผู้มีอำนาจเต็ม' },
  ];

  const uploadData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedDepartments.length > 0 && selectedDepartments.every((dept) => dept.phone.trim() !== '')) {
      
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
    
    if (selectedDepartments.length > 0 && selectedDepartments.every((dept) => dept.phone.trim() !== '')) {
      const departmentData = getSelectedDepartmentData();
      const statusCodes: number[] = [];

    try {
      const res = await companyapi.AddDepartments(departmentData);
      statusCodes.push(...res); // Push all status codes from the array returned by AddDepartments
      console.log('Response statuses:', res);
    } catch (error) {
      console.error('Error adding departments:', error);
      statusCodes.push(400); // Push a failure status code
    }

    return statusCodes;

    } else {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'กรอกข้อมูลให้ครบ',
        icon: 'error',
      });
      return [];
    }
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
              {departments.map((department, index) => {
                const isSelected = selectedDepartments.some((dept) => dept.name === department.en);
                return (
                  <div key={`default-checkbox-${index}`} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id={`default-checkbox-${index}`}
                      label={`${department.en} (${department.th})`}
                      onChange={() => handleDepartmentChange(department.en)}
                      checked={isSelected}
                    />
                    {isSelected && (
                      <Form.Control
                        type="text"
                        placeholder={`เบอร์โทรศัพท์ของแผนก => ${department.th}`}
                        value={selectedDepartments.find((dept) => dept.name === department.en)?.phone || ''}
                        onChange={(e) => handlePhoneChange(department.en, e.target.value)}
                        className="mt-2"
                        required
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <br />
            <Button variant="secondary" onClick={handleClose}>
              ยกเลิก
            </Button>{' '}
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
