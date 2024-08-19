import { TemplateApi } from "@/ApiEndpoints/TemplateApi";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { GetTemplateCompanyId } from "@/Model/GetTemplateCompanyId";
import Carousel from 'react-bootstrap/Carousel';
import Header from "../Header/Header";
import { CompanyApi } from "@/ApiEndpoints/CompanyApi";
import { Button, Card } from "react-bootstrap";
import { GetUsersByCompany } from "@/Model/GetUsersByCompany";
import CanvasTemplate from "./CanvasTemplate";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import '@/Components/Employees/CSS/CreactCard.css';


export default function CreateCard() {
  const templateapi = useMemo(() => new TemplateApi(), []);
  const companyapi = useMemo(() => new CompanyApi(), []);
  const [TemplateBycompanyId, setTemplateBycompanyId] = useState<GetTemplateCompanyId[]>([]);
  const [UrlLogocompany, setUrlLogocompany] = useState('');
  const [isFetch, setIsFetch] = useState(false);
  const [index, setIndex] = useState(0);
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number; fontSize: string; fontColor: string; fontStyle: string } }[]>([]);
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


  const drawImage = (background: string, textMappings: { [key: string]: string },
    positions: { [key: string]: { x: number; y: number; fontSize: string; fontColor: string; fontStyle: string } }, logo: string
  ) => {
    return new Promise<string>((resolve, reject) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (canvas && ctx) {
        canvas.width = 950;
        canvas.height = 550;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `${background}`;

        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          Object.keys(textMappings).forEach((key) => {
            if (positions[key]) {
              const { x, y, fontSize, fontColor, fontStyle } = positions[key];
              ctx.font = `${fontSize}px ${fontStyle}`;
              ctx.fillStyle = `${fontColor}`;
              //ctx.fillText(textMappings[key], x, y);
              wrapText(ctx, textMappings[key], x, y, canvas.width - x, parseInt(fontSize));
            } else {
              console.log(`Position for key ${key} not found`);
            }
          });

          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          logoImg.src = `${logo}`;

          logoImg.onload = () => {
            if (positions.logo) {
              const { x, y, fontSize } = positions.logo;
              // ctx.drawImage(logoImg, x, y, 200, 100);
              drawLogo(ctx, logoImg, x, y, parseInt(fontSize));

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

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let lineNumber = 0;
  
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
  
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y + lineNumber * lineHeight);
        line = words[n] + ' ';
        lineNumber++;
      } else {
        line = testLine;
      }
    }
  
    ctx.fillText(line, x, y + lineNumber * lineHeight);
  };

  const drawLogo = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, logoSize: number) => {
    const aspectRatio = image.width / image.height;
    const logoWidth = logoSize;
    const logoHeight = logoWidth / aspectRatio;

    ctx.drawImage(image, x, y, logoWidth, logoHeight);
  };

  const handleDeleteTemplate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, templateId: string, templateStatus: number) => {

    e.preventDefault();

    if (templateStatus == 1) {
      Swal.fire({
        title: 'เทมเพลตนี้ใช้อยู่',
        text: 'โปรดเลือกเทมเพลตใหม่หรือสร้างเทมเพลตใหม่!',
        icon: 'error',
      });
      return;
    }



    const deleteTemplate = document.getElementById('deleteTemplate') as HTMLButtonElement;
    const addTemplate = document.getElementById('addTemplate') as HTMLButtonElement;
    const selectedTemplate = document.getElementById('selectedTemplate') as HTMLButtonElement;

    deleteTemplate.style.visibility = 'hidden';
    addTemplate.style.visibility = 'hidden';
    selectedTemplate.style.visibility = 'hidden';


    const result = await Swal.fire({
      title: 'ลบข้อมูล?',
      text: 'ยืนยันเพื่อทำการลบข้อมูล!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {

      setLoading(true);

      const res = await templateapi.deleteTemplate(templateId);

      if (res == 200) {

        setLoading(false);

        const res = await Swal.fire({
          title: 'Success!',
          text: 'ลบเทมเพลตสำเร็จ!',
          icon: 'success',
        });

        if (res) {
          nav('/ListEmployees', { replace: true });
        }
      }
    }

  }


  const handleSelectedTemplate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, template: GetTemplateCompanyId) => {

    e.preventDefault();

    if (template.status == 1) {

      Swal.fire({
        title: 'Error!',
        text: 'ใช้เทมเพลตอยู่แล้ว!',
        icon: 'warning',
      });
      return;
    }

    const deleteTemplate = document.getElementById('deleteTemplate') as HTMLButtonElement;
    const addTemplate = document.getElementById('addTemplate') as HTMLButtonElement;
    const selectedTemplate = document.getElementById('selectedTemplate') as HTMLButtonElement;

    deleteTemplate.style.visibility = 'hidden';
    addTemplate.style.visibility = 'hidden';
    selectedTemplate.style.visibility = 'hidden';
    setLoading(true);

    const temId = template.id;
    const positions = {
      companyAddress: {
        x: template.companyAddress.x,
        y: template.companyAddress.y,
        fontSize: template.companyAddress.fontSize,
        fontColor: template.companyAddress.fontColor,
        fontStyle: template.companyAddress.fontStyle,
      },
      companyName: {
        x: template.companyName.x,
        y: template.companyName.y,
        fontSize: template.companyName.fontSize,
        fontColor: template.companyName.fontColor,
        fontStyle: template.companyName.fontStyle,
      },
      departmentName: {
        x: template.departmentName.x,
        y: template.departmentName.y,
        fontSize: template.departmentName.fontSize,
        fontColor: template.departmentName.fontColor,
        fontStyle: template.departmentName.fontStyle,
      },
      email: {
        x: template.email.x,
        y: template.email.y,
        fontSize: template.email.fontSize,
        fontColor: template.email.fontColor,
        fontStyle: template.email.fontStyle,
      },
      fullname: {
        x: template.fullname.x,
        y: template.fullname.y,
        fontSize: template.fullname.fontSize,
        fontColor: template.fullname.fontColor,
        fontStyle: template.fullname.fontStyle,
      },
      logo: {
        x: template.logo.x,
        y: template.logo.y,
        fontSize: template.logo.fontSize,
        fontColor: template.logo.fontColor,
        fontStyle: template.logo.fontStyle,
      },
      phone: {
        x: template.phone.x,
        y: template.phone.y,
        fontSize: template.phone.fontSize,
        fontColor: template.phone.fontColor,
        fontStyle: template.phone.fontStyle,
      },
      phoneDepartment: {
        x: template.phoneDepartment.x,
        y: template.phoneDepartment.y,
        fontSize: template.phoneDepartment.fontSize,
        fontColor: template.phoneDepartment.fontColor,
        fontStyle: template.phoneDepartment.fontStyle,
      },
      position: {
        x: template.position.x,
        y: template.position.y,
        fontSize: template.position.fontSize,
        fontColor: template.position.fontColor,
        fontStyle: template.position.fontStyle,
      },
    };

    if (getUserByCompanies) {
      const newGeneratedFiles: { file: File; uid: string }[] = [];

      for (const user of getUserByCompanies) {

        console.log('Drawing with logo:', UrlLogocompany);

        const textMappings = {
          "fullname": `${user.firstname} ${user.lastname}`,
          "companyName": `${user.companybranch.company.name}`,
          "companyAddress": `${user.companybranch.address}`,
          "position": `${user.position}`,
          "email": `${user.email}`,
          "phoneDepartment": `Department phone:${user.department.phone}`,
          "phone": `${user.phone}`,
          "departmentName": `Department name:${user.department.name}`,
        };

        try {

          const imageUrl = await drawImage(template.background, textMappings, positions, UrlLogocompany);

          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `${user.id}.png`, { type: 'image/png' });

          const data = {
            file: file,
            uid: user.id,
          };

          newGeneratedFiles.push(data);
        } catch (error) {
          deleteTemplate.style.visibility = 'visible';
          addTemplate.style.visibility = 'visible';
          selectedTemplate.style.visibility = 'visible';
          setLoading(false);
          console.error('Error generating image:', error);
        } finally {
          deleteTemplate.style.visibility = 'visible';
          addTemplate.style.visibility = 'visible';
          selectedTemplate.style.visibility = 'visible';
          setLoading(false);
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
        setLoading(false);

        const res = await Swal.fire({
          title: 'Success!',
          text: 'เลือกเทมเพลตสำเร็จ',
          icon: 'success',
        });

        if (res) {
          nav('/ListEmployees', { replace: true });
        }
      }

    } else {
      setLoading(false);
      Swal.fire({
        title: 'Error!',
        text: 'บางไฟล์อัพโหลดไม่สำเร็จ',
        icon: 'error',
      });
    }
  }

  const getTemplateByCompanyId = useCallback(async (companyId: string) => {
    try {
      const resTemplateByid = await templateapi.getTemplateByCompanyId(companyId);
      console.log("chk", resTemplateByid);
      setTemplateBycompanyId(resTemplateByid);

      if (resTemplateByid) {
        const resDatacompany = await companyapi.GetLinkLogoCompanyById(companyId); // get link logo company
        setUrlLogocompany(resDatacompany);
        setIsFetch(true);
      }
    } catch (error) {
      console.error("Error fetching template by company ID:", error);
    }
  }, [setTemplateBycompanyId, setUrlLogocompany, setIsFetch, companyapi, templateapi]);

  const getEmployeesByCompany = useCallback(async (companyId: string) => {
    try {
      const resUsersByid = await companyapi.GetUsersByCompany(companyId);
      setGetUserByCompanies(resUsersByid);
      setIsFetch(true);
    } catch (error) {
      console.error("Error fetching employees by company ID:", error);
    }
  }, [setGetUserByCompanies, setIsFetch, companyapi]);

  function handletoCreateTemplate() {
    nav('/CreateTemplate');
  }



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
  }, [isFetch, getEmployeesByCompany, getTemplateByCompanyId]);

  useEffect(() => {
    if (TemplateBycompanyId?.length > 0) {

      const newPositions = TemplateBycompanyId.map((template) => ({
        companyAddress: {
          x: template.companyAddress.x,
          y: template.companyAddress.y,
          fontSize: template.companyAddress.fontSize,
          fontColor: template.companyAddress.fontColor,
          fontStyle: template.companyAddress.fontStyle,
        },
        companyName: {
          x: template.companyName.x,
          y: template.companyName.y,
          fontSize: template.companyName.fontSize,
          fontColor: template.companyName.fontColor,
          fontStyle: template.companyName.fontStyle,
        },
        departmentName: {
          x: template.departmentName.x,
          y: template.departmentName.y,
          fontSize: template.departmentName.fontSize,
          fontColor: template.departmentName.fontColor,
          fontStyle: template.departmentName.fontStyle,
        },
        email: {
          x: template.email.x,
          y: template.email.y,
          fontSize: template.email.fontSize,
          fontColor: template.email.fontColor,
          fontStyle: template.email.fontStyle,
        },
        fullname: {
          x: template.fullname.x,
          y: template.fullname.y,
          fontSize: template.fullname.fontSize,
          fontColor: template.fullname.fontColor,
          fontStyle: template.fullname.fontStyle,
        },
        logo: {
          x: template.logo.x,
          y: template.logo.y,
          fontSize: template.logo.fontSize,
          fontColor: template.logo.fontColor,
          fontStyle: template.logo.fontStyle,
        },
        phone: {
          x: template.phone.x,
          y: template.phone.y,
          fontSize: template.phone.fontSize,
          fontColor: template.phone.fontColor,
          fontStyle: template.phone.fontStyle,
        },
        phoneDepartment: {
          x: template.phoneDepartment.x,
          y: template.phoneDepartment.y,
          fontSize: template.phoneDepartment.fontSize,
          fontColor: template.phoneDepartment.fontColor,
          fontStyle: template.phoneDepartment.fontStyle,
        },
        position: {
          x: template.position.x,
          y: template.position.y,
          fontSize: template.position.fontSize,
          fontColor: template.position.fontColor,
          fontStyle: template.position.fontStyle,
        },
      }));

      setPositions(newPositions);
    }
  }, [TemplateBycompanyId]);



  if (!isFetch) {
    return (
      <>
        <div>
          <Header />
          <br />
          <div className="container">
            <div className="h-1/2 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              <div className='flex justify-content-center'>
                <h1>Loading data</h1>
                &nbsp;
                <l-tail-chase
                  size="20"
                  speed="1.75"
                  color="black"
                ></l-tail-chase>
              </div>
            </div>
          </div>
        </div>
      </>
    );

  }

  if (!TemplateBycompanyId) {
    return (
      <>
        <div>
          <Header />
          <br />
          <div className="container">
            <div className="h-1/2 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center">
                <img src="https://www.gokaidosports.in/Images/nodata.jpg" alt="" style={{ width: '50%' }} />
                <br />
                <p className="text-xl">ไม่พบข้อมูลเทมเพลต</p>
                <Button
                  variant="success"
                  className="mt-4"
                  onClick={handletoCreateTemplate}>
                  เพิ่มเทมเพลตนามบัตร
                </Button>
              </div>

            </div>
          </div>
        </div>
      </>
    );
  }

  if (TemplateBycompanyId) {
    return (
      <>
        <Header />
        <br />
        <div className="container">
          <div className="h-1/2 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl font-bold mb-4 pl-[50px] pt-[25px]">Selected Template</h1>
              <Button
                id="addTemplate"
                variant="success"
                className="flex-shrink-0 pr-2"
                onClick={handletoCreateTemplate}>
                เพิ่มเทมเพลตนามบัตร
              </Button>
            </div>

            <br />
            <hr />
            <br />
            <div className="flex justify-center">
              {TemplateBycompanyId.length > 0 ? (
                <Carousel activeIndex={index} onSelect={handleSelect} className="relative w-full">
                  {TemplateBycompanyId.map((template, idx) => (
                    <Carousel.Item key={idx} interval={5000}>
                      <div className="relative flex flex-col justify-between h-70 overflow-hidden rounded-lg md:h-[50rem]">
                        <div className="flex justify-center">

                          <Card style={{ width: '61.5rem', height: '44rem' }}>
                            <Card.Body >
                              <div className="rounded-lg bg-gray-50">
                                <CanvasTemplate
                                  background={template.background}
                                  textMappings={textMappings}
                                  positions={positions[idx]}
                                  logo={UrlLogocompany}
                                />
                              </div>
                              <Card.Title className="pt-2">Name Template : {template.name}</Card.Title>
                              {template.status == 0 ? (
                                <div className="flex justify-center space-x-4">
                                  <Button
                                    id="selectedTemplate"
                                    onClick={(e) => handleSelectedTemplate(e, template)}
                                    className="bg-green-500 text-red-50 hover:bg-green-600 py-2 px-4 rounded-lg">เลือกเทมเพลต</Button>
                                  <Button
                                    id="deleteTemplate"
                                    onClick={(e) => handleDeleteTemplate(e, template.id, template.status)}
                                    className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg">ลบเทมเพลต</Button>
                                </div>
                              ) : (
                                null
                              )}
                              {loading ?
                                <div className='flex justify-content-end'>
                                  <h1>กำลังตรวจสอบข้อมูล </h1>
                                  &nbsp;
                                  <l-tail-chase
                                    size="15"
                                    speed="1.75"
                                    color="black"
                                  ></l-tail-chase>
                                </div>
                                : <div></div>}
                            </Card.Body>
                          </Card>
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


}
