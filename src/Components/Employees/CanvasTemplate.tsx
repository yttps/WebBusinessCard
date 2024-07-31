// CanvasTemplate.tsx
import React, { useRef, useEffect } from 'react';

interface CanvasTemplateProps {
    background: string;
    textMappings: { [key: string]: string };
    positions: { [key: string]: { x: number; y: number, fontSize: string, fontColor: string, fontStyle: string } };
    logo: string;
}

const CanvasTemplate: React.FC<CanvasTemplateProps> = ({ background, textMappings, positions, logo }) => {
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (canvas && ctx) {
            const img = new Image();
            img.src = background;

            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                Object.keys(textMappings).forEach((key) => {
                    if (positions[key]) {
                        const { x, y, fontSize, fontColor, fontStyle } = positions[key];
                        ctx.font = `${fontSize}px ${fontStyle}`;
                        ctx.fillStyle = `${fontColor}`;
                        ctx.fillText(textMappings[key], x, y);
                    }
                });

                const logoImg = new Image();
                logoImg.src = logo;
                logoImg.onload = () => {
                    if (positions.logo) {
                        const { x, y } = positions.logo;
                        //ctx.drawImage(logoImg, x, y, 200, 100);
                        drawLogo(ctx, logoImg, x, y, 200, 100);
                    }
                }
            };
        }
    }, [background, textMappings, positions, logo]);

    const drawLogo = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, maxWidth: number, maxHeight: number) => {
    
        const imgWidth = img.width;
        const imgHeight = img.height;
      
        const aspectRatio = imgWidth / imgHeight;
      
        let drawWidth = maxWidth;
        let drawHeight = maxHeight;
      
        if (imgWidth > imgHeight) {
          drawHeight = maxWidth / aspectRatio;
        } else {
          drawWidth = maxHeight * aspectRatio;
        }
      
        if (drawHeight > maxHeight) {
          drawHeight = maxHeight;
          drawWidth = maxHeight * aspectRatio;
        }
      
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
    
      };

    return <canvas ref={canvasRef} width={950} height={550} />;
};

export default CanvasTemplate;
