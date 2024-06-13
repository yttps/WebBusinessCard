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


  const [imageData, setImageData] = useState({
    base64textString: '',
    imageName: '',
    showImage: false,
  });

  const convertToBase64 = (event: ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;

    if (files && files.length > 0) {

      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setImageData({
          base64textString: reader.result as string,
          imageName: file.name,
          showImage: true,
        });
      };

      console.log(imageData.base64textString); //to use

      reader.onerror = (error) => {
        console.log('Error: ', error);
      };
    }
  };

  const addData = async () => {

    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const businessType = document.getElementById('businessType') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;
    const phoneNumber = document.getElementById('phoneNumber') as HTMLInputElement;
    const website = document.getElementById('website') as HTMLInputElement;
    const yearFounded = document.getElementById('yearFounded') as HTMLInputElement;
    //address
    const subdistrict = document.getElementById('subdistrict') as HTMLInputElement;
    const district = document.getElementById('district') as HTMLInputElement;
    const province = document.getElementById('province') as HTMLInputElement;
    const country = document.getElementById('country') as HTMLInputElement;

    const hasAySymbolEmail = email.value.includes('@');
    const hasAySymbolWeb = website.value.includes('@');
    const phoneRegex = /^\d+$/;

    if (!hasAySymbolEmail || !hasAySymbolWeb) {

      Swal.fire({
        title: 'Add Data Error!',
        text: 'อีเมลหรือเว็บไซต์ต้องมี "@" ',
        icon: 'error',
      });
      return;
    }

    else if (!phoneRegex.test(phoneNumber.value)) {
      Swal.fire({
        title: 'Add Data Error!',
        text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
        icon: 'error',
      });
      return;
    }

    else {

      if (email.value && password.value &&
        businessType.value && name.value &&
        phoneNumber.value && website.value && yearFounded.value && subdistrict.value &&
        district.value && province.value && country.value) {

        const res = await companyapi.AddDataCompany(email.value, password.value,
          businessType.value, name.value,
          phoneNumber.value, website.value, yearFounded.value, subdistrict.value,
          district.value, province.value, country.value);

        if (res == 200) {
          Swal.fire({
            title: 'Success!',
            text: 'เพิ่มข้อมูลสำเร็จ',
            icon: 'success',
          });
          // window.location.reload();
          companyapi.GetAllCompany();
          setShow(true);

        }
        if (res == 400) {
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
          title: 'Add Data Error!',
          text: 'กรอกข้อมูลให้ครบ',
          icon: 'error',
        });
        return;
      }
    }
  }

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
            <label className="btn btn-primary">
              Upload File
              <input type="file" id='selectImg' onChange={convertToBase64} />
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
          <Button variant="primary" onClick={addData}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCompany