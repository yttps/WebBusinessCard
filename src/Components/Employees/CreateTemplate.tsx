import React, { useEffect, useState } from "react";
import '@/Components/Employees/CSS/createTemplate.css'
import Header from "@/Components/Header/Header";

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';


// import { useNavigate } from "react-router-dom";
// import { CompanyApi } from "@/ApiEndpoints/CompanyApi";
// import GetEmployeeById from "@/Model/GetEmployeeById";



export default function CreateTemplate() {

  // const [GetEmployeeById, setGetEmployeeById] = useState<GetEmployeeById[]>([]);
  const [GetDataUserLogin, setGetDataUserLogin] = useState('');
  const [IsFatched, setIsFetch] = useState(false);
  // const nav = useNavigate();
  // const companyapi = new CompanyApi();



  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | ''>('');
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [fontSize, setFontSize] = useState('10');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [canvasHistory, setCanvasHistory] = useState<(CanvasOperation | null)[]>([]);

  console.log(logo , GetDataUserLogin);

  
  const [allPositions, setAllPositions] = useState<AllPosition>({
    "Firstname Lastname": { x: 0, y: 0 },
    "Company": { x: 0, y: 0 },
    "Company Address": { x: 0, y: 0 },
    "Position": { x: 0, y: 0 },
    "Personal email": { x: 0, y: 0 },
    "Phone Department": { x: 0, y: 0 },
    "Phone personal": { x: 0, y: 0 }
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
    "Firstname Lastname": "Firstname Lastname",
    "Company": "Company",
    "Company Address": "Company Address",
    "Position": "Position",
    "Personal email": "Personal email",
    "Phone Department": "Phone Department",
    "Phone personal": "Phone personal"
  };

  async function GetDetailEmployeeAndUserLogin() {

    const dataUserLogin = localStorage.getItem("loggedin");

    // const DataEmployeeById = await 

    if (dataUserLogin) {
      setIsFetch(true);
      setGetDataUserLogin(dataUserLogin);
    }
    else {
      console.log('Not found user login');
    }

  }

  // async function getImageLogo() {

  //   const storedData = localStorage.getItem('loggedin');

  //   if (storedData) {
  //     console.log('Not found user login');
  //   }
  //   else {
  //     console.log('Not found user login');
  //   }
  // }

  //STEP 1 WHEN CLICK AND DRAGGING
  const handleDragStart = (event: React.DragEvent, item: string) => {
    console.log('USE START');
    event.dataTransfer.setData("text", item);
    setDraggedItem(item);
  }

  const handleDragStartLogo = (event: React.DragEvent, item: string) => {
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
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const canvasTarget = event.currentTarget as HTMLCanvasElement;
    const rect = canvasTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (ctx) {

      if (textMappings[draggedItem]) {

        const text = textMappings[draggedItem];
        ctx.fillStyle = selectedColor;
        ctx.textBaseline = 'middle';
        ctx.font = fontSize + 'px Arial';
        ctx.fillText(text, x, y);
        addToCanvasHistory({ type: 'text', data: text, position: { x, y } });
        setAllPositions(prevPositions => ({
          ...prevPositions,
          [draggedItem]: { x, y }
        }));

      } else if (draggedItem == 'image' && ctx) {
        const image = new Image();
        image.src = logoPreview as string;

        const width = 180;
        const height = 100;

        image.onload = () => {
          ctx.drawImage(image, x, y, width, height);
          addToCanvasHistory({ type: 'image', data: logoPreview as string, position: { x, y } });
        };
      }
    }
    setDraggedItem('');
  }

  // Function to add operation to canvas history
  const addToCanvasHistory = (operation: CanvasOperation) => {
    setCanvasHistory([...canvasHistory, operation]);
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
    console.log('check file', background?.size);

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
        reader.readAsDataURL(file);
      } else {
        console.error('Failed to get 2D context from canvas');
      }
    }
  }

  const handleImageLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];


    if (file) {

      setLogo(file);


      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {

    if (!IsFatched) {
      GetDetailEmployeeAndUserLogin();
    }
  }, [IsFatched , allPositions])


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
              {Object.keys(textMappings).map((item, index) => (
                <div key={index} draggable onDragStart={(e) => handleDragStart(e, item)}>
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
                      min="10"
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
                        className="background"
                        accept="image/*"
                        onChange={handleImageBackgroundChange} />
                    </form>
                  </Card.Body>
                </Card>
              </div>
              <br />
              <div>
                <Card style={{ width: '15rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Upload Logo</Card.Title>
                    <hr />
                    <form>
                      <input
                        type="file"
                        id="img"
                        className="Logo"
                        accept="image/*"
                        onChange={handleImageLogoChange} />
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
                      {logoPreview && <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '100%' }} />}
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <br />
              <Button variant="secondary" onClick={handleUndo}>Undo</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>

  );
}



