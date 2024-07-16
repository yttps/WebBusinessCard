import React, { useRef, useEffect } from 'react';

interface GenerateCardProps {
    background: string;
    textMappings: { [key: string]: string };
    positions: { [key: string]: { x: number; y: number } };
    logo: string;
    onImageGenerated: (imageBlob: Blob) => void;
}

const GenerateCard: React.FC<GenerateCardProps> = ({ background, textMappings, positions, logo, onImageGenerated }) => {
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas?.getContext('2d');

        if (!ctx) return;

        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = () => resolve(img);
                img.onerror = (err) => reject(err);
                img.src = src;
            });
        };

        const drawCanvas = async () => {

            try {

                const backgroundImg = await loadImage(background);
                const logoImg = await loadImage(logo);

                ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

                ctx.font = "20px Arial";
                ctx.fillStyle = "black";

                Object.keys(textMappings).forEach(key => {
                    const position = positions[key];
                    const text = textMappings[key];
                    if (position) {
                        ctx.fillText(text, position.x, position.y);
                    }
                });

                ctx.drawImage(logoImg, positions.logo.x, positions.logo.y);

                canvas.toBlob(blob => {
                    if (blob) {
                        onImageGenerated(blob);
                    }
                });

            } catch (error) {
                console.error("Error loading images or drawing canvas", error);
            }
        }

        drawCanvas();

    }, [background, textMappings, positions, logo, onImageGenerated]);

    return <canvas ref={canvasRef} width={900} height={600}></canvas>;
};

export default GenerateCard;
