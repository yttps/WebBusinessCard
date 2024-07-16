// CanvasTemplate.tsx
import React, { useRef, useEffect } from 'react';

interface CanvasTemplateProps {
    background: string;
    textMappings: { [key: string]: string };
    positions: { [key: string]: { x: number; y: number } };
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
                        const { x, y } = positions[key];
                        ctx.font = '30px Bold';
                        ctx.fillStyle = 'black';
                        ctx.fillText(textMappings[key], x, y);
                    }
                });

                const logoImg = new Image();
                logoImg.src = logo;
                logoImg.onload = () => {
                    if (positions.logo) {
                        const { x, y } = positions.logo;
                        ctx.drawImage(logoImg, x, y, 80, 50);
                    }
                }
            };
        }
    }, [background, textMappings, positions, logo]);

    return <canvas ref={canvasRef} width={950} height={550} />;
};

export default CanvasTemplate;