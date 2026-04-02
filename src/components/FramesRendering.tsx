'use client';

import { useEffect, useRef, useState } from 'react';
import { useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';

interface FramesRenderingProps {
  scrollProgress: MotionValue<number>;
}

export default function FramesRendering({ scrollProgress }: FramesRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const totalFrames = 80;

  // Preload all frames on mount
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleLoad = () => {
      loadedCount++;
      // Once the first frame is loaded, draw it immediately to avoid empty canvas before scroll
      if (loadedCount === 1 || loadedCount === totalFrames) {
        requestAnimationFrame(() => drawFrame(0, loadedImages));
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
        const img = new window.Image();
        const frameNumber = i.toString().padStart(3, '0');
        img.src = `/frames/ezgif-frame-${frameNumber}.jpg`;
        img.onload = handleLoad;
        loadedImages.push(img);
    }
    
    setImages(loadedImages);
    
    // Resize handler
    const handleResize = () => {
        requestAnimationFrame(() => drawFrame(frameIndex.get(), loadedImages));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map progress (0 -> 1) to frame index (0 -> totalFrames - 1)
  const frameIndex = useTransform(scrollProgress, [0, 1], [0, totalFrames - 1]);

  const drawFrame = (index: number, imgSource = images) => {
    if (!canvasRef.current || imgSource.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // optimize for opaque background
    if (!ctx) return;

    // Clamp index to prevent out-of-bounds
    const clampedIndex = Math.max(0, Math.min(Math.floor(index), totalFrames - 1));
    const img = imgSource[clampedIndex];
    
    if (!img || !img.complete) return;

    // Handle high-dpi displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
    
    // Only resize canvas if dimensions actually changed
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    // Cover behavior maintaining aspect ratio
    const imgRatio = img.width / img.height;
    const canvasRatio = rect.width / rect.height;
    
    let drawWidth = rect.width;
    let drawHeight = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = rect.width / imgRatio;
      offsetY = (rect.height - drawHeight) / 2;
    } else {
      drawWidth = rect.height * imgRatio;
      offsetX = (rect.width - drawWidth) / 2;
    }

    // Deep black background
    ctx.fillStyle = '#000000'; 
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    requestAnimationFrame(() => {
        drawFrame(latest);
    });
  });

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-none outline-none"
      style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
      }}
    />
  );
}
