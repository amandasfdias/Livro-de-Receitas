import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Check, X, RotateCw } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string, isDark: boolean, isTransparent: boolean) => void;
  onCancel: () => void;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

const getRadianAngle = (degreeValue: number) => {
  return (degreeValue * Math.PI) / 180;
};

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation: number = 0
  ): Promise<{ url: string, isDark: boolean, isTransparent: boolean }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const rotRad = getRadianAngle(rotation);
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) {
      throw new Error('No 2d context');
    }

    // Resize to max 400x400 for storage optimization
    const MAX_SIZE = 400;
    let targetWidth = pixelCrop.width;
    let targetHeight = pixelCrop.height;

    if (targetWidth > MAX_SIZE || targetHeight > MAX_SIZE) {
      if (targetWidth > targetHeight) {
        targetHeight = Math.round((targetHeight * MAX_SIZE) / targetWidth);
        targetWidth = MAX_SIZE;
      } else {
        targetWidth = Math.round((targetWidth * MAX_SIZE) / targetHeight);
        targetHeight = MAX_SIZE;
      }
    }

    croppedCanvas.width = targetWidth;
    croppedCanvas.height = targetHeight;

    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Calculate brightness
    const imageData = croppedCtx.getImageData(0, 0, targetWidth, targetHeight).data;
    let colorSum = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      // Perceived brightness formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      colorSum += brightness;
    }
    const avgBrightness = colorSum / (targetWidth * targetHeight);
    const isDark = avgBrightness < 128;

    const isPng = imageSrc.startsWith('data:image/png');
    const outputType = isPng ? 'image/png' : 'image/jpeg';
    const outputQuality = isPng ? undefined : 0.6;

    return {
      url: croppedCanvas.toDataURL(outputType, outputQuality),
      isDark,
      isTransparent: isPng
    };
  };

  const handleSave = async () => {
    try {
      if (!croppedAreaPixels) return;
      const { url, isDark, isTransparent } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(url, isDark, isTransparent);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex justify-between items-center p-4 bg-black/50 absolute top-0 w-full z-10">
        <button onClick={onCancel} className="text-white p-2">
          <X size={24} />
        </button>
        <button onClick={() => setRotation((prev) => (prev + 90) % 360)} className="text-white p-2">
          <RotateCw size={24} />
        </button>
        <button onClick={handleSave} className="text-white p-2">
          <Check size={24} />
        </button>
      </div>
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>
      <div className="p-4 bg-black absolute bottom-0 w-full z-10">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => {
            setZoom(Number(e.target.value));
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};
