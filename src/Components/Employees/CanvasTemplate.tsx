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
                        //ctx.drawImage(logoImg, x, y, 200, 180);
                        drawLogo(ctx, logoImg, x, y, canvas.width, canvas.height);
                    }
                }
            };
        }
    }, [background, textMappings, positions, logo]);

    const drawLogo = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, canvasWidth: number, canvasHeight: number) => {
        const aspectRatio = image.width / image.height;
        let logoWidth = canvasWidth * 0.5;
        let logoHeight = logoWidth / aspectRatio;

        if (logoHeight > canvasHeight * 0.5) {
            logoHeight = canvasHeight * 0.5;
            logoWidth = logoHeight * aspectRatio;
        }

        ctx.drawImage(image, x, y, logoWidth, logoHeight);
    };

    return <canvas ref={canvasRef} width={950} height={550} />;
};

export default CanvasTemplate;
