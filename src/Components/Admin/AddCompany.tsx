import { useState, ChangeEvent } from 'react'
import '@/Components/Admin/CSS/AddCompany.css'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from "react-bootstrap";

function AddCompany() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const companyapi = new CompanyApi();
  const [file, setFile] = useState<File | null>(null);

  const [imageData] = useState({
    base64textString: '',
    imageName: '',
    showImage: false,
  });


  const uploadData = async () => {

    if (file) {

      const resUploadData = await addData();
      const resUploadLogo = await addLogo(file);

      if (resUploadData == 200 && resUploadLogo == 200) {

        Swal.fire({
          title: 'Success!',
          text: 'เพิ่มข้อมูลสำเร็จ',
          icon: 'success',
        });

        await companyapi.GetAllCompany();
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
    else{
      Swal.fire({
        title: 'Upload Error!',
        text: 'โปรดเลือกรูปภาพโลโก้ก่อน!',
        icon: 'error',
      });
      return;
    }
  }

  const addLogo = async (file: File): Promise<number | undefined> => {

    try {

      const res = await companyapi.UploadLogo(file);
      return res;

    } catch (error) {

      console.log('Error in addLogo method: ', error);
      return 500;
    }
  };

  const addData = async (): Promise<number | undefined> => {

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const businessType = (document.getElementById('businessType') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement).value;
    const website = (document.getElementById('website') as HTMLInputElement).value;
    const yearFounded = (document.getElementById('yearFounded') as HTMLInputElement).value;
    const subdistrict = (document.getElementById('subdistrict') as HTMLInputElement).value;
    const district = (document.getElementById('district') as HTMLInputElement).value;
    const province = (document.getElementById('province') as HTMLInputElement).value;
    const country = (document.getElementById('country') as HTMLInputElement).value;

    console.log("chk" , email , password , businessType , name , phoneNumber , website , yearFounded , subdistrict , district , province , country);

    const hasAySymbolEmail = email.includes('@');
    const hasAySymbolWeb = website.includes('@');
    const phoneRegex = /^\d+$/;

    if (!hasAySymbolEmail || !hasAySymbolWeb) {

      Swal.fire({
        title: 'Add Data Error!',
        text: 'อีเมลหรือเว็บไซต์ต้องมี "@" ',
        icon: 'error',
      });
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
        icon: 'error',
      });
      return;
    }

    if (email && password && businessType && name && 
        phoneNumber && website && yearFounded && subdistrict && 
        district && province && country) {

      const res = await companyapi.AddDataCompany(email, password, businessType, name, phoneNumber, website, yearFounded, subdistrict, district, province, country);
      console.log('chkkkkkk' , res);
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
          <Form.Label htmlFor="inputPassword5">email</Form.Label>
          <Form.Control type="text" id="email" required />
          <br />
          <Form.Label htmlFor="inputPassword5">รหัสผ่าน</Form.Label>
          <Form.Control type="text" id="password" required />
          <br />
          <Form.Label htmlFor="inputPassword5">ชื่อบริษัท</Form.Label>
          <Form.Control type="text" id="name" required />
          <br />
          <Form.Label htmlFor="inputPassword5">ประเภทธุรกิจ</Form.Label>
          <Form.Control type="text" id="businessType" required />
          <br />
          <Form.Label htmlFor="inputPassword5">เว็บไซต์</Form.Label>
          <Form.Control type="text" id="website" required />
          <br />
          <Form.Label htmlFor="inputPassword5">ปีที่ก่อตั้ง</Form.Label>
          <Form.Control type="datetime-local" id="yearFounded" required />
          <br />
          <Form.Label htmlFor="inputPassword5">เบอร์โทรศัพท์ของบริษัท</Form.Label>
          <Form.Control type="text" id="phoneNumber" required />
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
          <Form.Label htmlFor="inputPassword5">ประเทศ</Form.Label>
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

export default AddCompany