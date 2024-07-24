import { TemplateApi } from "@/ApiEndpoints/TemplateApi";
import React, { useEffect, useState, useRef } from "react";
import { GetTemplateCompanyId } from "@/Model/GetTemplateCompanyId";
import Carousel from 'react-bootstrap/Carousel';
import Header from "../Header/Header";
import { CompanyApi } from "@/ApiEndpoints/CompanyApi";
import { Button } from "react-bootstrap";
import { GetUsersByCompany } from "@/Model/GetUsersByCompany";
import CanvasTemplate from "./CanvasTemplate";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import '@/Components/Employees/CSS/CreactCard.css';

export default function CreateCard() {
  const templateapi = new TemplateApi();
  const companyapi = new CompanyApi();
  const [TemplateBycompanyId, setTemplateBycompanyId] = useState<GetTemplateCompanyId[]>([]);
  const [UrlLogocompany, setUrlLogocompany] = useState('');
  const [isFetch, setIsFetch] = useState(false);
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }[]>([]);
  const [index, setIndex] = useState(0);
  const [getUserByCompanies, setGetUserByCompanies] = useState<GetUsersByCompany[] | null>(null);
  const [companyId, setCompanyId] = useState('');
  const nav = useNavigate();


  const canvasRef = useRef<HTMLCanvasElement>(null);

  const textMappings: { [key: string]: string } = {
    "fullname": "Firstname Lastname",
    "companyName": "Company",
    "companyAddress": "Company Address",
    "position": "Position",
    "email": "Personal email",
    "phoneDepartment": "Phone Department",
    "phone": "Phone personal",
    "departmentName": "Department Name",
  };

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };


  const drawImage = (background: string, textMappings: { [key: string]: string }, positions: { [key: string]: { x: number; y: number } }, logo: string) => {
    return new Promise<string>((resolve, reject) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (canvas && ctx) {
        canvas.width = 900;
        canvas.height = 550;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `${background}`;



        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          Object.keys(textMappings).forEach((key) => {
            if (positions[key]) {
              const { x, y } = positions[key];
              ctx.font = '30px Bold';
              ctx.fillStyle = 'black';
              ctx.fillText(textMappings[key], x, y);
            } else {
              console.log(`Position for key ${key} not found`);
            }
          });

          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          logoImg.src = `${logo}`;

          logoImg.onload = () => {
            if (positions.logo) {
              const { x, y } = positions.logo;
              ctx.drawImage(logoImg, x, y, 180, 100);

              canvas.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  resolve(url);
                } else {
                  reject('Failed to create blob from canvas');
                }
              }, 'image/png');
            } else {
              reject('Logo position not found');
            }
          };

          logoImg.onerror = () => {
            reject('Failed to load logo image');
          };
        };

        img.onerror = () => {
          reject('Failed to load background image');
        };
      } else {
        reject('Canvas or context not found');
      }
    });
  };

  const handleDeleteTemplate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, templateId: string) => {

    e.preventDefault();


    const result = await Swal.fire({
      title: 'ลบข้อมูล?',
      text: 'ยืนยันเพื่อทำการลบข้อมูล!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {

      const res = await templateapi.deleteTemplate(templateId);

      if (res == 200) {
        await Swal.fire({
          title: 'Success!',
          text: 'ลบข้อมูลสำเร็จ!',
          icon: 'success',
        });
        nav('/ListEmployees', { replace: true });
      }
    }

  }


  const handleSelectedTemplate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, template: GetTemplateCompanyId) => {

    e.preventDefault();
    const temId = template.id;

    const position = {
      companyAddress: { x: template.companyAddress.x, y: template.companyAddress.y },
      companyName: { x: template.companyName.x, y: template.companyName.y },
      departmentName: { x: template.departmentName.x, y: template.departmentName.y },
      email: { x: template.email.x, y: template.email.y },
      fullname: { x: template.fullname.x, y: template.fullname.y },
      logo: { x: template.logo.x, y: template.logo.y },
      phone: { x: template.phone.x, y: template.phone.y },
      phoneDepartment: { x: template.phoneDepartment.x, y: template.phoneDepartment.y },
      position: { x: template.position.x, y: template.position.y }
    };

    if (getUserByCompanies) {

      const newGeneratedFiles: { file: File; uid: string }[] = [];


      for (const user of getUserByCompanies) {

        console.log('Drawing with background:', template.background);
        console.log('Drawing with logo:', UrlLogocompany);

        const textMappings = {
          "fullname": `${user.firstname} ${user.lastname}`,
          "companyName": `${user.companybranch.company.name}`,
          "companyAddress": `${user.companybranch.address}`,
          "position": `${user.position}`,
          "email": `${user.email}`,
          "phoneDepartment": `${user.department.phone}`,
          "phone": `${user.phone}`,
          "departmentName": `${user.department.name}`,
        };

        try {
          const imageUrl = await drawImage(template.background, textMappings, position, UrlLogocompany);
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `${user.id}.png`, { type: 'image/png' });

          const data = {
            file: file,
            uid: user.id,
          };

          newGeneratedFiles.push(data);

        } catch (error) {
          console.error('Error generating image:', error);
        }
      }

      if (newGeneratedFiles.length > 0) {

        await uploadSelectedTemplate(newGeneratedFiles, temId);

      }
    }
  };

  async function uploadSelectedTemplate(cardUsers: { file: File, uid: string }[], temId: string) {

    const status = '1';
    const resUpload = await templateapi.uploadSelectedTemplate(cardUsers);
    const allSuccess = resUpload.every((status: number) => status === 200);

    if (allSuccess) {

      const resUpdateStatus = await templateapi.updateStatus(temId, status, companyId);

      if (resUpdateStatus) {
        Swal.fire({
          title: 'Success!',
          text: 'เลือกเทมเพลตสำเร็จ',
          icon: 'success',
        });

        nav('/ListEmployees', { replace: true });
      }


    } else {
      Swal.fire({
        title: 'Error!',
        text: 'บางไฟล์อัพโหลดไม่สำเร็จ',
        icon: 'error',
      });
    }
  }

  const getTemplateByCompanyId = async (companyId: string) => {
    const resTemplateByid = await templateapi.getTemplateByCompanyId(companyId);
    console.log("chk", resTemplateByid);
    setTemplateBycompanyId(resTemplateByid);

    if (resTemplateByid) {
      const resDatacompany = await companyapi.GetLinkLogoCompanyById(companyId); // get link logo company
      setUrlLogocompany(resDatacompany);
      setIsFetch(true);
    }
  };

  const getEmployeesByCompany = async (companyId: string) => {
    const resUsersByid = await companyapi.GetUsersByCompany(companyId);
    setGetUserByCompanies(resUsersByid);
    setIsFetch(true);
  };

  useEffect(() => {
    if (!isFetch) {
      const loggedInData = localStorage.getItem("LoggedIn");

      if (loggedInData) {
        const parsedData = JSON.parse(loggedInData);
        const companyId = parsedData.companyId;

        if (companyId) {
          setCompanyId(companyId)
          getTemplateByCompanyId(companyId);
          getEmployeesByCompany(companyId);
        }
      }
    }
  }, [isFetch]);

  useEffect(() => {
    if (TemplateBycompanyId?.length > 0) {
      const newPositions = TemplateBycompanyId.map((template) => ({
        fullname: template.fullname,
        companyName: template.companyName,
        companyAddress: template.companyAddress,
        position: template.position,
        email: template.email,
        phoneDepartment: template.phoneDepartment,
        phone: template.phone,
        departmentName: template.departmentName,
        logo: template.logo
      }));
      setPositions(newPositions);
    }
  }, [TemplateBycompanyId]);


  if (!isFetch) {
    return <div>Loading...</div>;
  }

  if (TemplateBycompanyId?.length === 0) {
    return <div>Not found Template Company</div>;
  }

  return (
    <>
      <Header />
      <br />
      <div className="container">
        <div className="h-1/2 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <h1 className="text-xl font-bold mb-4 pl-[50px] pt-[25px]">Selected Template</h1>
          <br />
          <hr />
          <br />
          <div className="flex justify-center">
            {TemplateBycompanyId.length > 0 ? (
              <Carousel activeIndex={index} onSelect={handleSelect} className="relative w-full">
                {TemplateBycompanyId.map((template, idx) => (
                  <Carousel.Item key={idx} interval={5000}>
                    <div className="relative flex flex-col justify-between h-56 overflow-hidden rounded-lg md:h-[30rem]">
                      {/* CanvasTemplate */}
                      <div className="flex justify-center">
                        <CanvasTemplate
                          background={template.background}
                          textMappings={textMappings}
                          positions={positions[idx]}
                          logo={UrlLogocompany}
                        />
                        <Carousel.Caption>
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 p-4 text-white">
                            <h3>Name : {template.name}</h3>
                            <div className="flex justify-center space-x-4">
                            <Button
                              onClick={(e) => handleSelectedTemplate(e, template)}
                              className="bg-green-500 text-red-50 hover:bg-green-600 py-2 px-4 rounded-lg">เลือกเทมเพลต</Button>
                            <Button
                              onClick={(e) => handleDeleteTemplate(e, template.id)}
                              className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg">ลบเทมเพลต</Button>
                          </div>
                          </div>
                        </Carousel.Caption>
                      </div>
                    </div>
                  </Carousel.Item>
                ))}

              </Carousel>
            ) : (
              <div className="text-center mt-4">
                <p>ไม่พบเทมเพลต</p>
              </div>
            )}
          </div>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </>
  );
}
