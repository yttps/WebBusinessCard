import React, { useEffect, useState, useRef, ChangeEvent, useCallback, useMemo } from "react";
import '@/Components/Employees/CSS/createTemplate.css'
import Header from "@/Components/Header/Header";

import { Card, Col, Form, Row } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { TemplateApi } from "@/ApiEndpoints/TemplateApi";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { CompanyApi } from "@/ApiEndpoints/CompanyApi";

interface CanvasOperation {
  type: 'text' | 'image';
  data: string;
  position: { x: number; y: number };
}

type TextPosition = {
  x: number;
  y: number;
  fontSize: string;
  fontColor: string;
  fontStyle: string;
};

type AllPosition = {
  [key: string]: TextPosition;
};

const textMappings: { [key: string]: string } = {
  "fullname": "Firstname Lastname",
  "companyName": "Company",
  "companyAddress": "Company Address",
  "position": "Position",
  "email": "Personal email",
  "phoneDepartment": "Phone Department",
  "phone": "Phone personal",
  "departmentName": "Department Name"
};

const CreateTemplate: React.FC = () => {


  const [allPositions, setAllPositions] = useState<AllPosition>({
    fullname: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
    companyName: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
    companyAddress: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
    position: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
    email: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
    phoneDepartment: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
    phone: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
    departmentName: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
    logo: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' }
  });


  const templateapi = new TemplateApi();

  const nav = useNavigate();
  const companyapi = useMemo(() => new CompanyApi(), []);
  const [getLogoCompany, setGetLogoCompany] = useState('');
  const [getCompanyId, setGetcompanyId] = useState<string | ''>('');
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | ''>('');
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [fontSize, setFontSize] = useState('15');
  const [canvasHistory, setCanvasHistory] = useState<(CanvasOperation | null)[]>([]);
  const [nameTemplate, setNameTemplate] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const uploadFontRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [selectedFont, setSelectedFont] = useState('');
  // const [uploadedFonts, setUploadedFonts] = useState<{ name: string, url: string }[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const setNameTem = (e: ChangeEvent<HTMLFormElement>) => {
    console.log(e.target.value);
    setNameTemplate(e.target.value);
  };

  const handleIncrement = () => {
    setFontSize((prevSize) => {
      const newSize = Math.min(parseInt(prevSize) + 1, 100); // +step 1 max 100
      console.log('up size', newSize);
      return newSize.toString();
    });
  };

  const handleDecrement = () => {
    setFontSize((prevSize) => {
      const newSize = Math.max(parseInt(prevSize) - 1, 15); // -step 1 min 15
      console.log('down size', newSize);
      return newSize.toString();
    });
  };

  useEffect(() => {

    if (background) {

      console.log('check file', background.size);
      const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;

      if (canvas) {

        const ctx = canvas.getContext('2d');

        if (ctx && background) {

          const reader = new FileReader();

          reader.onload = (e) => {

            const img = new Image();

            img.onload = () => {
              setBackgroundImage(img);
              redrawCanvas(img);
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(background);
        } else {
          console.error('Failed to get 2D context from canvas');
          setBackgroundImage(null);
          redrawCanvas(null);
        }
      }
    }
  }, [background]);




  // const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

  //   const file = event.target.files?.[0];

  //   if (uploadFontRef.current) {

  //     uploadFontRef.current.value = "";

  //     if (file) {
  //       const reader = new FileReader();

  //       reader.onload = () => {
  //         const fontUrl = reader.result as string;
  //         const fontName = file.name.split('.').slice(0, -1).join('.');
  //         const newFont = { name: fontName, url: fontUrl };

  //         setUploadedFonts((prevFonts) => [...prevFonts, newFont]);

  //         const newFontStyle = new FontFace(fontName, `url(${fontUrl})`);
  //         newFontStyle.load().then((loadedFont) => {
  //           console.log('fontUrl' ,fontUrl );
  //           console.log('fontName' ,fontName );
  //           document.fonts.add(loadedFont);
  //           setSelectedFont(fontName);
  //         });
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont(event.target.value);
  };


  //STEP 1 WHEN CLICK AND DRAGGING
  const handleDragStart = (event: React.DragEvent, item: string) => {

    if (selectedFont == '') {
      Swal.fire({
        title: 'Error!',
        text: 'เลือกรูปแบบฟอนต์!',
        icon: 'error',
      });
      return;
    }

    //add check positions alls value 
    const allPositionsNotNull = Object.values(allPositions).every(
      position => position.x !== 0 && position.y !== 0
    );

    if (allPositionsNotNull) {
      Swal.fire({
        title: 'Error!',
        text: 'กำหนดค่าครบแล้ว!',
        icon: 'error',
      });
      return;
    }

    console.log('USE START');
    event.dataTransfer.setData("text", item);
    setDraggedItem(item);

    const dragText = document.createElement("div");
    dragText.style.position = "absolute";
    dragText.style.top = "-99999px";
    dragText.style.fontSize = `${fontSize}px`;
    dragText.style.color = selectedColor;

    //check if textmapping 
    dragText.innerText = textMappings[item];
    document.body.appendChild(dragText);
    event.dataTransfer.setDragImage(dragText, 0, 0);

    setTimeout(() => {
      document.body.removeChild(dragText);
    }, 0);
  }


  const handleDragStartLogo = (event: React.DragEvent, item: string) => {

    const allPositionsNotNull = Object.values(allPositions).every(
      position => position.x !== 0 && position.y !== 0
    );

    if (allPositionsNotNull) {
      Swal.fire({
        title: 'Error!',
        text: 'กำหนดค่าครบแล้ว!',
        icon: 'error',
      });
      return;
    }

    console.log('USE DRAG');
    event.dataTransfer.setData("image", item);
    setDraggedItem(item);
  }

  //STEP 2 ON WHEN DRAGGING ON CANVAS AREA
  const handleDragOver = (e: React.DragEvent) => {
    console.log('USE DRAG OVER');
    e.preventDefault();
    const canvas = e.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('from logging', x, y);

  }

  //STEP 3 WHEN DROP OBJECT
  const handleDrop = (event: React.DragEvent) => {
    console.log('USE DRAG DROP');
    event.preventDefault();

    console.log('font size handle drop', fontSize);


    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


    const canvasTarget = event.currentTarget as HTMLCanvasElement;
    const rect = canvasTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (ctx) {

      if (textMappings[draggedItem]) {

        const draggedPosition = allPositions[draggedItem];

        if (draggedPosition && (draggedPosition.x !== 0 || draggedPosition.y !== 0)) {
          Swal.fire({
            title: 'Error!',
            text: `${draggedItem} ถูกเซ็ตค่าแล้ว!`,
            icon: 'error',
          });
          return;
        }

        const text = textMappings[draggedItem];
        ctx.fillStyle = selectedColor || draggedPosition.fontColor;
        ctx.textBaseline = 'middle';
        ctx.font = `${fontSize || draggedPosition.fontSize}px ${selectedFont}`;
        ctx.fillText(text, scaledX + 30, scaledY + 33);
        addToCanvasHistory({ type: 'text', data: text, position: { x: scaledX + 30, y: scaledY + 33 } });

        setAllPositions(prevPositions => ({
          ...prevPositions,
          [draggedItem]: {
            x: scaledX, y: scaledY + 40, fontSize: fontSize || draggedPosition.fontSize, fontColor: selectedColor || draggedPosition.fontColor,
            fontStyle: selectedFont || draggedPosition.fontStyle
          },
        }));
      } else if (draggedItem === 'image' && getLogoCompany) {
        console.log('Image loaded, drawing at:', x, y);

        const draggedPosition = allPositions[draggedItem];

        if (draggedPosition && (draggedPosition.x !== 0 || draggedPosition.y !== 0)) {
          Swal.fire({
            title: 'Error!',
            text: `${draggedItem} ถูกเซ็ตค่าแล้ว!`,
            icon: 'error',
          });
          return;
        }

        const image = new Image();
        image.src = getLogoCompany;

        const width = 220;
        const height = 120;

        image.onload = () => {
          ctx.drawImage(image, scaledX - 110, scaledY - 60, width, height);

          setAllPositions(prevPositions => ({
            ...prevPositions,
            ['logo']: { x: scaledX - 110, y: scaledY - 60, fontSize: width.toString(), fontColor: '', fontStyle: '' },
          }));

          addToCanvasHistory({
            type: 'image',
            data: getLogoCompany,
            position: { x: scaledX - 110, y: scaledY - 50 },
          });
        };
      }
    }
    setDraggedItem('');
  };


  // Function to add operation to canvas history
  const addToCanvasHistory = (operation: CanvasOperation) => {
    setCanvasHistory([...canvasHistory, operation]);
  }

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault();

    setLogo(null);
    setBackground(null);

    //add fontstyle
    setAllPositions({
      fullname: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
      companyName: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
      companyAddress: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
      position: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
      email: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
      phoneDepartment: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
      phone: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
      departmentName: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' },
      logo: { x: 0, y: 0, fontSize: '0', fontColor: '#000000', fontStyle: '' }
    });

    setCanvasHistory([]);
    setFontSize('0');
    setSelectedColor('#000000');
    setSelectedFont('');
    // Clear the canvas
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
  }


  // const handleUndo = () => {
  //   if (canvasHistory.length > 0) {
  //     const updatedHistory = [...canvasHistory];
  //     const lastOperation = updatedHistory.pop(); 
  //     setCanvasHistory(updatedHistory);

  //     const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
  //     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     if (background) {
  //       const img = new Image();
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         img.onload = () => {
  //           canvas.width = img.width;
  //           canvas.height = img.height;
  //           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //           // Redraw all text operations
  //           updatedHistory.forEach(operation => {
  //             if (operation && operation.type === 'text') {
  //               ctx.fillStyle = selectedColor;
  //               ctx.textBaseline = 'middle';
  //               ctx.font = fontSize + 'px Arial';
  //               ctx.fillText(operation.data, operation.position.x, operation.position.y);
  //             }
  //           });
  //         };
  //         img.src = e.target?.result as string;
  //       };
  //       reader.readAsDataURL(background);
  //     }

  //     // Remove the position of the undone text
  //     if (lastOperation && lastOperation.type === 'text') {
  //       setAllPositions(prevPositions => {
  //         const newPositions = { ...prevPositions };
  //         delete newPositions[lastOperation.data];
  //         return newPositions;
  //       });
  //     }
  //   }
  // };

  const handleSizeFonstChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(event.target.value);
    console.log('size', fontSize);
  }

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
    console.log('Color', selectedColor);
  }

  const handleImageBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const fileSize = file.size;

    if (backgroundInputRef.current) {

      if (fileSize > 2 * 1024 * 1024) {

        backgroundInputRef.current.value = "";
        Swal.fire({
          title: 'Error!',
          text: 'โปรดเลือกไฟล์ไม่เกิน 2 MB!',
          icon: 'error',
        });

        return;
      }

      checkImageDimensions(file);
    }
  }

  const checkImageDimensions = (file: File) => {
    const reader = new FileReader();
    const img = new Image();



    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      console.log('width', width);
      console.log('height', width);


      if (width === 1000 && height === 600) {
        setBackground(file);
      } else {
        if (backgroundInputRef.current) {
          backgroundInputRef.current.value = "";
          Swal.fire({
            title: 'Error!',
            text: 'กรุณาเลือกรูปขนาด 1000x600 พิกเซล.',
            icon: 'error',
          });
          return;
        }
      }
    }
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    for (const key in allPositions) {
      const position = allPositions[key];
      const { x: posX, y: posY, fontSize, fontColor, fontStyle } = position;

      ctx.font = `${fontSize}px ${fontStyle}`;
      ctx.fillStyle = fontColor;

      const parsedFontSize = parseInt(fontSize);
      const textWidth = ctx.measureText(textMappings[key]).width;

      if (
        scaledX >= posX &&
        scaledX <= posX + textWidth &&
        scaledY >= posY - parsedFontSize / 2 &&
        scaledY <= posY + parsedFontSize / 2
      ) {
        setDraggedItem(key);
        setDragOffset({ x: scaledX - posX, y: scaledY - posY });
        setIsDragging(true);
        break;
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !draggedItem) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const scaledX = x * scaleX - dragOffset.x;
    const scaledY = y * scaleY - dragOffset.y;

    setAllPositions((prevPositions) => ({
      ...prevPositions,
      [draggedItem]: { ...prevPositions[draggedItem], x: scaledX, y: scaledY },
    }));

    redrawCanvas(backgroundImage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedItem('');
  };

  const redrawCanvas = (bgImage: HTMLImageElement | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgImage) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);


    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    for (const key in allPositions) {
      const position = allPositions[key];
      const text = textMappings[key];
      const { x, y, fontSize, fontColor, fontStyle } = position;

      if (x !== 0 && y !== 0 && text) {
        ctx.fillStyle = fontColor;
        ctx.textBaseline = 'middle';
        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.fillText(text, x, y);
      }
    }
  };

  const handleUploadTemplate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault();

    const uploadBtn = document.getElementById('uploadBtn') as HTMLButtonElement;
    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;


    if (background && getLogoCompany) {

      const allPositionsNotNull = Object.values(allPositions).every(
        position => position.x !== 0 && position.y !== 0
      );

      if (!allPositionsNotNull) {
        Swal.fire({
          title: 'Error!',
          text: 'กรุณากำหนดค่าให้ครบ!',
          icon: 'error',
        });
        return;
      }

      if (nameTemplate == '') {
        Swal.fire({
          title: 'Error!',
          text: 'กรุณาเลือกพื้นหลัง!',
          icon: 'error',
        });
        return;
      }

      uploadBtn.style.visibility = 'hidden';
      resetBtn.style.visibility = 'hidden';
      setLoading(true);

      const status = '0';
      const uidTemplate = await uploadTemplateCompany(nameTemplate, getCompanyId, allPositions, status, fontSize, selectedColor, selectedFont)

      if (uidTemplate) {

        const resUrlTemplate = await uploadBgCompany(background, uidTemplate);

        if (resUrlTemplate) {

          setLoading(false);
          const res = await Swal.fire({
            title: 'Success!',
            text: 'สร้างเทมเพลตสำเร็จ!',
            icon: 'success',
          });

          if (res) {
            nav('/ListEmployees', { replace: true });
            window.location.reload();
          }
        }
      }

      if (!background && !logo) {

        setLoading(false);
        Swal.fire({
          title: 'Error!',
          text: 'สร้างเทมเพลตล้มเหลว!',
          icon: 'error',
        });
        return;
      }
    }
    else {

      setLoading(false);
      Swal.fire({
        title: 'Error!',
        text: 'โปรดเลือกพื้นหลัง!',
        icon: 'error',
      });
      return;
    }
  }

  const uploadTemplateCompany = async (nameTemplate: string, getCompanyId: string, allPositions: AllPosition,
    status: string, fontSize: string, selectedColor: string, fontStyle: string): Promise<string | undefined> => {

    try {

      const res = await templateapi.uploadTemplateCompany(nameTemplate, getCompanyId, allPositions, status, fontSize, selectedColor, fontStyle);

      return res;

    } catch (error) {
      console.error(error);
    }
  }


  const uploadBgCompany = async (background: File, uidTemplate: string) => {

    try {

      const folderName = 'background';
      const collection = 'templates';
      const res = await templateapi.uploadBgTemplate(background, uidTemplate, folderName, collection);
      return res;

    } catch (error) {
      console.error(error);
    }
  }

  const getDataCompanyById = useCallback(async (companyId: string) => {
    const res = await companyapi.GetDataCompanyById(companyId);

    if (res) {
      setGetLogoCompany(res.logo);
    }
  }, [companyapi]);

  useEffect(() => {

    const loggedInData = localStorage.getItem("LoggedIn");

    if (loggedInData) {

      const parsedData = JSON.parse(loggedInData);
      const CompanyId = parsedData.companyId;

      if (CompanyId) {
        setGetcompanyId(CompanyId);
        getDataCompanyById(CompanyId);
      }
    }
  }, [allPositions, getDataCompanyById])

  useEffect(() => {
    console.log('Font size Update', fontSize);
  }, [fontSize])

  console.log(allPositions);


  return (
    <>
      <Header />
      <div>
        {/* col-1*/}
        <Row>
          <Col>
            <div className="bg-blue-500 text-white border border-solid border-gray-300 p-4 w-full h-full items-center">
              <h2 className="text-lg font-bold mb-4">รายละเอียดข้อมูล</h2>
              <div className="flex-row justify-center">
                <p className="text-lg font-bold">ชื่อเทมเพลต</p>
                <Form onChange={setNameTem}>
                  <Form.Group>
                    <Form.Control
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      required />
                  </Form.Group>
                </Form>
              </div>
              <br />
              <p className="text-lg font-bold mb-2">เลือก Font</p>
              <div className="mb-4 w-full flex-row items-center justify-center pl-20">
                <Card style={{ width: '15rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Selected Font</Card.Title>
                    <hr className="pb-2" />
                    <select value={selectedFont} onChange={handleFontChange}>
                      <option value="">เลือกแบบ Font</option>
                      <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                      <option value="Arial Black" style={{ fontFamily: 'Arial Black' }}>Arial Black</option>
                      <option value="Arial Narrow" style={{ fontFamily: 'Arial Narrow' }}>Arial Narrow</option>
                      <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                      <option value="Tahoma" style={{ fontFamily: 'Tahoma' }}>Tahoma</option>
                      <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</option>
                      <option value="Impact" style={{ fontFamily: 'Impact' }}>Impact</option>
                      <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                      <option value="Times" style={{ fontFamily: 'Times' }}>Times</option>
                      <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                      <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                      <option value="Courier" style={{ fontFamily: 'Courier' }}>Courier</option>
                      <option value="Brush Script MT" style={{ fontFamily: 'Brush Script MT' }}>Brush Script MT</option>
                      <option value="Lucida Sans" style={{ fontFamily: 'Lucida Sans' }}>Lucida Sans</option>
                      <option value="Lucida Bright" style={{ fontFamily: 'Lucida Bright' }}>Lucida Bright</option>
                      <option value="Lucida Console" style={{ fontFamily: 'Lucida Console' }}>Lucida Console</option>
                      <option value="Garamond" style={{ fontFamily: 'Garamond' }}>Garamond</option>
                      <option value="Perpetua" style={{ fontFamily: 'Perpetua' }}>Perpetua</option>
                      <option value="Palatino" style={{ fontFamily: 'Palatino' }}>Palatino</option>
                      <option value="Century Gothic" style={{ fontFamily: 'Century Gothic' }}>Century Gothic</option>
                      <option value="Bookman" style={{ fontFamily: 'Bookman' }}>Bookman</option>
                      <option value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</option>
                      <option value="Papyrus" style={{ fontFamily: 'Papyrus' }}>Papyrus</option>
                      <option value="Cursive" style={{ fontFamily: 'Cursive' }}>Cursive</option>
                      <option value="Fantasy" style={{ fontFamily: 'Fantasy' }}>Fantasy</option>
                      {/* {uploadedFonts.map((font, index) => (
                        <option key={index} value={font.name}>
                          {font.name}
                        </option>
                      ))} */}
                    </select>
                  </Card.Body>
                </Card>
              </div>
              <p className="text-lg font-bold">รายละเอียดนามบัตร</p>
              <div className="md-4 grid grid-cols-2 gap-4">
                {Object.keys(textMappings).map((item, index) => {

                  const isPositionSet = allPositions[item].x !== 0 &&
                    allPositions[item].y !== 0;

                  return (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="mb-[-20px]"
                      style={{ backgroundColor: "transparent" }}>
                      <Card
                        style={{
                          width: '12rem', textAlign: 'center',
                          height: '5rem', margin: '0 auto', backgroundColor: isPositionSet ? 'gray' : 'white'
                        }}>
                        <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <Card.Title style={{ fontSize: '15px' }}>{item}</Card.Title>
                          <CIcon icon={icon.cilText} size="xl" className="text-success" />
                        </Card.Body>
                      </Card>
                      <br />
                    </div>
                  );

                })}
              </div>
              <br />
              <Card>
                <Card.Body>
                  <Card.Title style={{ fontSize: '15px' }}>อัปโหลด Font</Card.Title>
                  <hr />
                  <br />
                  <input
                    ref={uploadFontRef}
                    type="file"
                    accept=".ttf"
                  // onChange={handleFontUpload} 
                  />
                  <br />
                  <p className="text-x font-bold text-red-500 pt-2">* เลือกไฟล์ .ttf เท่านั้น</p>
                </Card.Body>
              </Card>
            </div>

            {/* col-2*/}
          </Col>
          <Col xs={6}>
            <div className="flex-1 bg-gray-100 border-l border-zinc-300 pl-4 pt-4 pb-5">
              <h1 className="text-xl font-bold mb-4">Preview Template</h1>
              <br />
              <hr />
              {background ? (
                <div id="div-1">
                  <canvas
                    className="scroll-ml-20px ml-[20px]"
                    id="imageCanvas"
                    width="850px"
                    height="410px"
                    ref={canvasRef}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    // onClick={handleClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ border: '1px solid #000000' }}>
                  </canvas>
                </div>
              ) : (
                <div id="div-1" className="flex justify-center items-center">
                  <img
                    src="https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
                    alt=""
                    style={{ width: '31rem', height: '35rem', paddingTop: '5rem' }} />
                </div>
              )}
            </div>


            {/* col-3*/}
          </Col>
          <Col>
            <div className="w-max bg-white border border-solid border-gray-300 p-4">
              <h2 className="text-lg font-bold mb-4">Font size & Pick Color</h2>
              <div className="md-4 grid grid-cols-2 gap-4">
                <Card style={{ width: '12rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Font size</Card.Title>
                    <input
                      type="range"
                      id="size-slider"
                      min="15"
                      max="100"
                      value={fontSize}
                      onChange={handleSizeFonstChange}
                    />
                    <div className="relative flex items-center max-w-[10rem]">
                      <button
                        type="button"
                        id="decrement-button"
                        onClick={handleDecrement}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                      >
                        <svg
                          className="w-3 h-3 text-gray-900 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 2"
                        >
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        id="quantity-input"
                        value={fontSize}
                        readOnly
                        className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <button
                        type="button"
                        id="increment-button"
                        onClick={handleIncrement}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                      >
                        <svg
                          className="w-3 h-3 text-gray-900 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 18"
                        >
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>

                  </Card.Body>
                </Card>
                <Card style={{ width: '12rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Color</Card.Title>
                    <input
                      type="color"
                      id="colorpicker"
                      value={selectedColor}
                      onChange={handleColorChange} />
                  </Card.Body>
                </Card>
              </div>
              <br />
              <h2 className="text-lg font-bold mb-4">Preview Logo</h2>
              <div className="flex justify-center items-center">
                <div draggable onDragStart={(e: React.DragEvent) => handleDragStartLogo(e, 'image')}>
                  <Card style={{ width: '15rem', textAlign: 'center' }}>
                    <Card.Body>
                      <Card.Title style={{ fontSize: '15px' }}>Preview Logo</Card.Title>
                      <hr />
                      <div id="preview-logo">
                        {getLogoCompany && <img src={getLogoCompany} alt="Logo Preview" style={{ maxWidth: '100%' }} />}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              <br />
              <h2 className="text-lg font-bold mb-4">Selected Background</h2>
              <div className="flex justify-center items-center">
                <Card style={{ width: '20rem', textAlign: 'center' }}>
                  <Card.Body className="w-[20rem]">
                    <Card.Title style={{ fontSize: '15px' }}>Upload Background</Card.Title>
                    <hr />
                    <form>
                      <input
                        type="file"
                        id="img"
                        ref={backgroundInputRef}
                        className="w-[12rem]"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleImageBackgroundChange} />
                    </form>
                    <br />
                    <p className="text-x font-bold text-red-500">* เลือกไฟล์ .jpg .jpeg .png เท่านั้น</p>
                  </Card.Body>
                </Card>
              </div>
              <br />
              <button id='resetBtn' onClick={handleReset} className="bg-danger text-secondary-foreground hover:bg-secondary/80 w-full py-2 mb-2">Reset</button>
              <button id='uploadBtn' onClick={handleUploadTemplate} className="bg-success text-primary-foreground hover:bg-primary/80 w-full py-2">Upload Template</button>
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
            </div>
          </Col>
        </Row>



        {/* <div className="min-h-screen h-[160vh] rounded-lg px-3 p-6 py-4 overflow-y-hidden bg-card bg-gray-50 shadow-lg dark:bg-gray-800">
          <div className="grid grid-cols-3 gap-4 h-full">
          </div>
        </div> */}
      </div>
    </>
  );
}

export default CreateTemplate;



