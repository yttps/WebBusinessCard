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

export default function CreateCard() {
  const templateapi = new TemplateApi();
  const companyapi = new CompanyApi();
  const [TemplateBycompanyId, setTemplateBycompanyId] = useState<GetTemplateCompanyId[]>([]);
  const [UrlLogocompany, setUrlLogocompany] = useState('');
  const [isFetch, setIsFetch] = useState(false);
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }[]>([]);
  const [index, setIndex] = useState(0);
  const [getUserByCompanies, setGetUserByCompanies] = useState<GetUsersByCompany[] | null>(null);
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
        console.log('Canvas and context are ready');
        canvas.width = 900;
        canvas.height = 550;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `${background}`;



        img.onload = () => {
          console.log('Background image loaded');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          Object.keys(textMappings).forEach((key) => {
            if (positions[key]) {
              console.log(`Drawing text for key: ${key}`);
              const { x, y } = positions[key];
              ctx.font = '30px Bold';
              ctx.fillStyle = 'black';
              ctx.fillText(textMappings[key], x, y);
              console.log(`Text drawn at (${x}, ${y})`);
            } else {
              console.log(`Position for key ${key} not found`);
            }
          });

          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          logoImg.src = `${logo}`;

          logoImg.onload = () => {
            console.log('Logo image loaded');
            if (positions.logo) {
              const { x, y } = positions.logo;
              ctx.drawImage(logoImg, x, y, 100, 70);
              console.log(`Logo drawn at (${x}, ${y})`);

              canvas.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  resolve(url);
                } else {
                  console.error('Failed to create blob from canvas');
                  reject('Failed to create blob from canvas');
                }
              }, 'image/png');
            } else {
              console.error('Logo position not found');
              reject('Logo position not found');
            }
          };

          logoImg.onerror = () => {
            console.error('Failed to load logo image');
            reject('Failed to load logo image');
          };
        };

        img.onerror = () => {
          console.error('Failed to load background image');
          reject('Failed to load background image');
        };
      } else {
        console.error('Canvas or context not found');
        reject('Canvas or context not found');
      }
    });
  };


  const handleSelectedTemplate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, template: GetTemplateCompanyId) => {

    e.preventDefault();

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
            uid: user.id
          };

          newGeneratedFiles.push(data);

        } catch (error) {
          console.error('Error generating image:', error);
        }
      }

      if (newGeneratedFiles.length > 0) {

        await uploadSelectedTemplate(newGeneratedFiles);

      }
    }
  };

  async function uploadSelectedTemplate(cardUsers: { file: File, uid: string }[]) {
    console.log('check', cardUsers);
    const resUpload = await templateapi.uploadSelectedTemplate(cardUsers);
    console.log(resUpload);
    const allSuccess = resUpload.every((status: number) => status === 200);

    if (allSuccess) {
      Swal.fire({
        title: 'Success!',
        text: 'เลือกเทมเพลตสำเร็จ',
        icon: 'success',
      });

      nav('/ListEmployees', { replace: true });
    
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
          getTemplateByCompanyId(companyId);
          getEmployeesByCompany(companyId);
        }
      }
    }
  }, [isFetch, TemplateBycompanyId]);

  useEffect(() => {
    if (TemplateBycompanyId.length > 0) {
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

  if (TemplateBycompanyId.length === 0) {
    return <div>Not found Template Company</div>;
  }

  return (
    <div>
      <Header />
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {TemplateBycompanyId.map((template, idx) => (
          <Carousel.Item key={idx}>
            <CanvasTemplate background={template.background} textMappings={textMappings} positions={positions[idx]} logo={UrlLogocompany} />
            <Carousel.Caption>
              <h3>{template.name}</h3>
              <Button onClick={(e) => handleSelectedTemplate(e, template)}>เลือกเทมเพลต</Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      <br />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <br />
    </div>
  );
}
