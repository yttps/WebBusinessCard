import { useState } from 'react'
import '@/Components/Admin/CSS/AddCompany.css'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import Swal from 'sweetalert2';
import { Button, Modal 
  // Form 
} from "react-bootstrap";


function AddDepartment() {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSelectedDepartments([]);
    setSelectedPositions({});  
  }

  const handleShow = () => setShow(true);
  const companyapi = new CompanyApi();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<{ [key: string]: string[] }>({});
  
  const handleDepartmentChange = (departmentName: string) => {
    setSelectedDepartments(prev => {
      const newDepartments = prev.includes(departmentName)
        ? prev.filter(name => name !== departmentName)
        : [...prev, departmentName];
  
      // Remove positions associated with the unchecked department
      if (!newDepartments.includes(departmentName)) {
        setSelectedPositions(prevPositions => {
          const { [departmentName]: _, ...rest } = prevPositions;
          return rest;
        });
      }
  
      return newDepartments;
    });
  };
  
  
  const handlePositionChange = (departmentName: string, positionName: string) => {
    setSelectedPositions(prev => {
      const updatedPositions = { ...prev };
      if (!updatedPositions[departmentName]) {
        updatedPositions[departmentName] = [];
      }
      updatedPositions[departmentName] = updatedPositions[departmentName].includes(positionName)
        ? updatedPositions[departmentName].filter(pos => pos !== positionName)
        : [...updatedPositions[departmentName], positionName];
      
      // Remove department if no positions are selected
      if (updatedPositions[departmentName].length === 0) {
        const { [departmentName]: _, ...rest } = updatedPositions;
        return rest;
      }
  
      return updatedPositions;
    });
  };

  const getSelectedPositionsArray = () => {
    return Object.values(selectedPositions).flat();
  }
  
  

  const departments = [
    {
      name: 'แผนกบริหาร (Management)',
      positions: [
        { en: 'Chairman', th: 'ประธาน' },
        { en: 'Vice Chairman', th: 'รองประธาน' },
        { en: 'President', th: 'ประธานกรรมการ' },
        { en: 'Vice-President', th: 'รองประธานกรรมการ' },
        { en: 'Senior Advisor', th: 'ที่ปรึกษาอาวุโส' },
        { en: 'Managing Director', th: 'กรรมการผู้จัดการ' },
        { en: 'Senior Executive Managing Director', th: 'ประธานกรรมการผู้บริหารระดับสูง' },
        { en: 'Board of Directors', th: 'คณะกรรมการผู้บริหาร' },
        { en: 'Directors', th: 'กรรมการ' },
        { en: 'The Management team', th: 'คณะบริหาร' },
        { en: 'Chief Executive Officer (C.E.O.)', th: 'หัวหน้าฝ่ายบริหารผู้มีอำนาจเต็ม' },
      ]
    },
    {
      name: 'แผนกทั่วไป (General)',
      positions: [
        { en: 'General Manager', th: 'ผู้จัดการทั่วไป' },
        { en: 'Manager', th: 'ผู้จัดการ' },
      ]
    },
    {
      name: 'แผนกสาขา (Branch)',
      positions: [
        { en: 'Branch Manager', th: 'ผู้จัดการสาขา' },
      ]
    },
    {
      name: 'แผนกแผนก (Department)',
      positions: [
        { en: 'Head of Department (Division Chief)', th: 'หัวหน้าแผนก' },
      ]
    },
  ];

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

  console.log("depart", selectedDepartments);
  console.log("position", selectedPositions);


  const uploadData = async () => {
    if (formData.name && formData.subdistrict && formData.district
      && formData.province && formData.country
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
  
    // console.log("Selected Departments:", selectedDepartments);
  };
  

  const addData = async (): Promise<number | undefined> => {

    const nameValue = getNameValue();
    const subdistrictValue = getSubdistrictValue();
    const districtValue = getDistrictValue();
    const provinceValue = getProvinceValue();
    const countryValue = getCountryValue();
    const selectedPositionsArray = getSelectedPositionsArray();

    if (nameValue &&
      subdistrictValue &&
      districtValue &&
      provinceValue &&
      countryValue) {

      const res = await companyapi.AddCompanyBranch(
        // selectedPositions,
        nameValue,
        subdistrictValue,
        districtValue,
        provinceValue,
        countryValue);

      console.log('selectedPositionsArray', selectedPositionsArray);
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
        เพิ่มแผนกบริษัท
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มแผนกบริษัท</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={uploadData}>
            <p>เลือกแผนก - Selected departments</p>
            <hr />
            <br />
            <div>
              {departments.map((department, departmentIndex) => (
                <div key={departmentIndex}>
                  <h5>{department.name}</h5>
                  <ul className="position-list">
                    {department.positions.map((position, positionIndex) => (
                      <li key={positionIndex}>
                        <input
                          type="checkbox"
                          id={`${department.name}-${position.en}`}
                          name={position.en}
                          value={position.en}
                          onChange={() => handlePositionChange(department.name, position.en)}
                          checked={
                            selectedPositions[department.name]
                              ? selectedPositions[department.name].includes(position.en)
                              : false
                          }
                        />
                        <label htmlFor={`${department.name}-${position.en}`}>{position.th}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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

export default AddDepartment