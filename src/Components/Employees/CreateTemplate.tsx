import React, { useEffect, useState, useRef , ChangeEvent } from "react";
import '@/Components/Employees/CSS/createTemplate.css'
import Header from "@/Components/Header/Header";

import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { TemplateApi } from "@/ApiEndpoints/TemplateApi";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { CompanyApi } from "@/ApiEndpoints/CompanyApi";



const CreateTemplate: React.FC = () => {

  const templateapi = new TemplateApi();

  const nav = useNavigate();
  const companyapi = new CompanyApi();
  const [getLogoCompany, setGetLogoCompany] = useState('');
  const [getCompanyId, setGetcompanyId] = useState<string | ''>('');
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | ''>('');
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [fontSize, setFontSize] = useState('30');
  const [canvasHistory, setCanvasHistory] = useState<(CanvasOperation | null)[]>([]);
  const [dragText, setDragText] = useState<string>('');
  const [nameTemplate, setNameTemplate] = useState<string>('');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  console.log(logo, dragText, getCompanyId, templateapi);

  const setNameTem = (e: ChangeEvent<HTMLFormElement>) => {
    console.log(e.target.value);
    setNameTemplate(e.target.value);
  };

  useEffect(() => {

    if (background) {

      console.log('check file', background.size);
      const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;

      if (canvas) {

        const ctx = canvas.getContext('2d');

        if (ctx) {

          const reader = new FileReader();

          reader.onload = (e) => {

            const img = new Image();

            img.onload = () => {
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
        }
      }
    }
  }, [background])




  const [allPositions, setAllPositions] = useState<AllPosition>({
    "fullname": { x: 0, y: 0 },
    "companyName": { x: 0, y: 0 },
    "companyAddress": { x: 0, y: 0 },
    "position": { x: 0, y: 0 },
    "email": { x: 0, y: 0 },
    "phoneDepartment": { x: 0, y: 0 },
    "phone": { x: 0, y: 0 },
    "departmentName": { x: 0, y: 0 },
    "logo": { x: 0, y: 0 }
  });

  interface CanvasOperation {
    type: 'text' | 'image';
    data: string;
    position: { x: number; y: number };
  }

  type TextPosition = {
    x: number;
    y: number;
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

  //STEP 1 WHEN CLICK AND DRAGGING
  const handleDragStart = (event: React.DragEvent, item: string) => {

    //add check positions alls value 
    const allPositionsNotNull = Object.values(allPositions).every(
      position => position.x !== 0 && position.y !== 0
    );

    if(allPositionsNotNull){
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
    setDragText(item);

    const dragText = document.createElement("div");
    dragText.style.position = "absolute";
    dragText.style.top = "-99999px";
    dragText.style.fontSize = `${fontSize}px`;
    dragText.style.color = selectedColor;
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

    if(allPositionsNotNull){
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
    setDragText('');
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

        const text = textMappings[draggedItem];
        ctx.fillStyle = selectedColor;
        ctx.textBaseline = 'middle';
        ctx.font = fontSize + 'px Arial';
        ctx.fillText(text, scaledX, scaledY + 40);
        addToCanvasHistory({ type: 'text', data: text, position: { x: scaledX, y: scaledY + 40 } });


        setAllPositions(prevPositions => ({
          ...prevPositions,
          [draggedItem]: { x: scaledX, y: scaledY + 40 },
        }));

      } else if (draggedItem == 'image' && getLogoCompany) {

        console.log('Image loaded, drawing at:', x, y);

        const image = new Image();
        image.src = getLogoCompany;

        const width = 220;
        const height = 120;

        image.onload = () => {
          ctx.drawImage(image, scaledX - 110, scaledY - 50, width, height);

          setAllPositions(prevPositions => ({
            ...prevPositions,
            ['logo']: { x: scaledX - 110, y: scaledY - 50 },
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
  }

  // Function to add operation to canvas history
  const addToCanvasHistory = (operation: CanvasOperation) => {
    setCanvasHistory([...canvasHistory, operation]);
  }

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault();

    setLogo(null);
    setBackground(null);

    setAllPositions({
      "fullname": { x: 0, y: 0 },
      "companyName": { x: 0, y: 0 },
      "companyAddress": { x: 0, y: 0 },
      "position": { x: 0, y: 0 },
      "email": { x: 0, y: 0 },
      "phoneDepartment": { x: 0, y: 0 },
      "phone": { x: 0, y: 0 },
      "departmentName": { x: 0, y: 0 },
      "logo": { x: 0, y: 0 }
    });

    setCanvasHistory([]);
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

  // Function to handle undo operation
  const handleUndo = () => {
    if (canvasHistory.length > 0) {
      const updatedHistory = [...canvasHistory];
      const lastOperation = updatedHistory.pop(); // Remove the last item
      setCanvasHistory(updatedHistory);

      // Clear canvas
      const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw background
      if (background) {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Redraw all text operations
            updatedHistory.forEach(operation => {
              if (operation && operation.type === 'text') {
                ctx.fillStyle = selectedColor;
                ctx.textBaseline = 'middle';
                ctx.font = fontSize + 'px Arial';
                ctx.fillText(operation.data, operation.position.x, operation.position.y);
              }
            });
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(background);
      }

      // Remove the position of the undone text
      if (lastOperation && lastOperation.type === 'text') {
        setAllPositions(prevPositions => {
          const newPositions = { ...prevPositions };
          delete newPositions[lastOperation.data];
          return newPositions;
        });
      }
    }
  };

  console.log(handleUndo);

  const handleSizeFonstChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(event.target.value);
    console.log('size', fontSize);
  }

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  }

  const handleImageBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    setBackground(file);
  }


  const handleDragEnd = () => {
    setDragText('');
  }

  const handleUploadTemplate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault();

    if (background && getLogoCompany) {

      const allPositionsNotNull = Object.values(allPositions).every(
        position => position.x !== 0 && position.y !== 0
      );

      if (!allPositionsNotNull || nameTemplate == '') {
        Swal.fire({
          title: 'Error!',
          text: 'กรุณากำหนดค่าให้ครบ!',
          icon: 'error',
        });
        return;
      }

      const status = '0';
      const uidTemplate = await uploadTemplateCompany(nameTemplate , getCompanyId , allPositions , status)
      
      if (uidTemplate) {

        const resUrlTemplate = await uploadBgCompany(background , uidTemplate); 

        if (resUrlTemplate) {

          Swal.fire({
            title: 'Success!',
            text: 'สร้างเทมเพลตสำเร็จ!',
            icon: 'success',
          });

          nav('/ListEmployees', { replace: true });
        }


      }
      if (!background && !logo) {

        Swal.fire({
          title: 'Error!',
          text: 'สร้างเทมเพลตล้มเหลว!',
          icon: 'error',
        });
        return;
      }
    }
    else {
      Swal.fire({
        title: 'Error!',
        text: 'โปรดเลือกพื้นหลัง!',
        icon: 'error',
      });
      return;
    }
  }

  const uploadTemplateCompany = async (nameTemplate:string , getCompanyId:string , allPositions:AllPosition , status:string ):Promise<string | undefined> => {

    try {

      const res = await templateapi.uploadTemplateCompany(nameTemplate, getCompanyId, allPositions , status);
      
      return res;

    } catch (error) {
      console.error(error);
    }
  }


  const uploadBgCompany = async (background: File , uidTemplate : string) => {

    try {

      const folderName = 'background';
      const collection = 'templates';
      const res = await templateapi.uploadBgTemplate(background, uidTemplate, folderName, collection);
      return res;

    } catch (error) {
      console.error(error);
    }
  }

  const getDataCompanyById = async (companyId: string) => {

    const res = await companyapi.GetDataCompanyById(companyId);

    if(res){
      setGetLogoCompany(res.logo);
    }

  } 

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
  }, [allPositions])

  console.log(allPositions);


  return (
    <>
      <Header />
      <Container id="con">
        <Row>
          <Col sm={8} id="col1">
            <h1>Preview Image</h1>
            {background ? (
              <div id="div-1">
                <canvas
                  id="imageCanvas"
                  width='850px'
                  height='410px'
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}>
                </canvas>
              </div>
            ) : (
              <div id="div-1" className="empty-canvas-placeholder">
                <p>Please upload a background image to start</p>
              </div>
            )}
            <br />
          </Col>
          <Col sm={4} id="col2">
            <div id="div-2">
              <Form onChange={setNameTem}>
                <Form.Group className="mb-3">
                  <Form.Label>Name Template</Form.Label>
                  <Form.Control type="text" required/>
                </Form.Group>
              </Form>
              {Object.keys(textMappings).map((item, index) => (
                <div
                  id="drag-with-colour"
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  style={{ backgroundColor: "transparent", margin: '5px' }}>

                  <Card style={{ width: '15rem', textAlign: 'center', height: '5rem' }}>
                    <Card.Body>
                      <Card.Title style={{ fontSize: '15px' }}>{item}</Card.Title>
                      <CIcon id='text-icon' icon={icon.cilText} size="xl" className="text-success" />
                    </Card.Body>
                  </Card>
                  <br />
                </div>
              ))}
              <br />
              <div>
                <Card style={{ width: '15rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Font size</Card.Title>
                    <input
                      type="range"
                      id="size-slider"
                      min="30"
                      max="100"
                      value={fontSize}
                      onChange={handleSizeFonstChange} />
                    <h6>{fontSize}</h6>
                  </Card.Body>
                </Card>
              </div>
              <br />
              <div>
                <Card style={{ width: '15rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Color</Card.Title>
                    <input type="color"
                      id="colorpicker"
                      value={selectedColor}
                      onChange={handleColorChange} />
                  </Card.Body>
                </Card>
              </div>
              <br />
              <div>
                <Card style={{ width: '15rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Upload Background</Card.Title>
                    <hr />
                    <form>
                      <input
                        type="file"
                        id="img"
                        ref={backgroundInputRef}
                        className="background"
                        accept="image/*"
                        onChange={handleImageBackgroundChange} />
                    </form>
                  </Card.Body>
                </Card>
              </div>
              <br />
              <div draggable
                onDragStart={(e: React.DragEvent) => handleDragStartLogo(e, 'image')}>
                <Card style={{ width: '15rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Preview Logo</Card.Title>
                    <hr />
                    <div id="preview-logo">
                      {getLogoCompany &&
                        <img src={getLogoCompany} alt="Logo Preview" style={{ maxWidth: '100%' }} />
                      }
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <Button variant="warning" onClick={(e) => handleReset(e)}>Reset</Button>
              <br />
              {/* <Button variant="secondary" onClick={handleUndo}>Undo</Button> */}
              <br />
              <Button variant="success" onClick={(e) => handleUploadTemplate(e)}>Upload Template</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>

  );
}

export default CreateTemplate;



