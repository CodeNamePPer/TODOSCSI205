'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { StaticImageData } from 'next/image';
import './animation.css';

import woodBg from './assets/wood_bg.jpg';
import basketballImg from './assets/basketball.jpg';
import footballImg from './assets/football.jpg';
import volleyballImg from './assets/volleyball.jpg';
import studentImg from './assets/student.jpg';
import cartoonImg from './assets/cartoon.jpg';
import logoImg from './assets/logo.jpg';

interface ImageOption {
  key: string;
  label: string;
  src: StaticImageData | string | null;
}

const imageOptions: ImageOption[] = [
  { key: 'none', label: 'None', src: null },
  { key: 'basketball', label: 'Basketball', src: basketballImg },
  { key: 'football', label: 'Football', src: footballImg },
  { key: 'volleyball', label: 'Volleyball', src: volleyballImg },
  { key: 'human', label: 'Human', src: studentImg },
  { key: 'cartoon', label: 'Cartoon', src: cartoonImg },
  { key: 'logo', label: 'Logo', src: logoImg },
];

const BALL_SIZE = 120;
const SPEED = 3.5;

const getImageSrc = (img: StaticImageData | string | null): string => {
  if (!img) return '';
  return typeof img === 'string' ? img : img.src;
};

export default function AnimationPage() {
  const [selected, setSelected] = useState<string>('basketball');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const courtRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const animIdRef = useRef<number | null>(null);

  const posRef = useRef({
    x: 0,
    y: 0,
    vx: SPEED,
    vy: SPEED,
    rot: 0,
    initialized: false,
  });

  // ตั้งตำแหน่งเริ่มต้นให้อยู่กึ่งกลางสนาม
  useEffect(() => {
    const updatePosition = () => {
      if (!courtRef.current || !ballRef.current) return;
      const courtWidth = courtRef.current.clientWidth;
      const courtHeight = courtRef.current.clientHeight;
      if (courtWidth === 0 || courtHeight === 0) return;

      if (!posRef.current.initialized) {
        const startX = (courtWidth - BALL_SIZE) / 2;
        const startY = (courtHeight - BALL_SIZE) / 2;
        posRef.current.x = startX;
        posRef.current.y = startY;
        posRef.current.vx = SPEED;
        posRef.current.vy = SPEED;
        posRef.current.rot = 0;
        posRef.current.initialized = true;
      } else {
        const maxX = courtWidth - BALL_SIZE;
        const maxY = courtHeight - BALL_SIZE;
        if (maxX > 0) posRef.current.x = Math.max(0, Math.min(posRef.current.x, maxX));
        if (maxY > 0) posRef.current.y = Math.max(0, Math.min(posRef.current.y, maxY));
      }

      ballRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) rotate(${posRef.current.rot}deg)`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // ลูปแอนิเมชันบอลเด้ง
  useEffect(() => {
    if (!isRunning) {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
        animIdRef.current = null;
      }
      return;
    }

    const step = () => {
      if (!courtRef.current || !ballRef.current) return;

      const courtWidth = courtRef.current.clientWidth;
      const courtHeight = courtRef.current.clientHeight;
      const maxX = courtWidth - BALL_SIZE;
      const maxY = courtHeight - BALL_SIZE;

      let { x, y, vx, vy, rot } = posRef.current;

      x += vx;
      y += vy;
      rot = (rot + 2.5) % 360;

      // ตรวจสอบการชนขอบสนาม
      if (x >= maxX) {
        x = maxX;
        vx = -Math.abs(vx);
      } else if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
      }

      if (y >= maxY) {
        y = maxY;
        vy = -Math.abs(vy);
      } else if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
      }

      posRef.current.x = x;
      posRef.current.y = y;
      posRef.current.vx = vx;
      posRef.current.vy = vy;
      posRef.current.rot = rot;

      ballRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

      animIdRef.current = requestAnimationFrame(step);
    };

    animIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
        animIdRef.current = null;
      }
    };
  }, [isRunning]);

  // รับค่าจากแป้นพิมพ์ (Spacebar = เริ่ม/หยุด, 0-6 = เลือกรูป)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
        return;
      }

      const keyMap: Record<string, string> = {
        '0': 'none',
        '1': 'basketball',
        '2': 'football',
        '3': 'volleyball',
        '4': 'human',
        '5': 'cartoon',
        '6': 'logo',
      };

      if (keyMap[e.key] !== undefined) {
        setSelected(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleRun = () => {
    setIsRunning((prev) => !prev);
  };

  const currentImage = imageOptions.find((img) => img.key === selected);
  const currentSrc = currentImage ? getImageSrc(currentImage.src) : '';
  const bgSrc = getImageSrc(woodBg);

  return (
    <div className="app-wrapper">
      <div
        className="court-area"
        ref={courtRef}
        style={{ backgroundImage: `url(${bgSrc})` }}
      >
        <div ref={ballRef} className="ball">
          {currentSrc ? (
            <img
              src={currentSrc}
              alt={currentImage?.label || 'Ball'}
              className="ball-img"
              draggable={false}
            />
          ) : (
            <div className="ball-placeholder"></div>
          )}
        </div>
      </div>

      <div className="button-bar">
        {isRunning ? (
          <button
            type="button"
            className="btn btn-danger btn-sm run-btn"
            onClick={(e) => {
              e.currentTarget.blur();
              handleToggleRun();
            }}
          >
            <svg className="btn-icon" viewBox="0 0 16 16">
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 2 11V5a1.5 1.5 0 0 1 1.5-1.5h2zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 7 11V5a1.5 1.5 0 0 1 1.5-1.5h2z" />
            </svg>
            PAUSE
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-success btn-sm run-btn"
            onClick={(e) => {
              e.currentTarget.blur();
              handleToggleRun();
            }}
          >
            <svg className="btn-icon" viewBox="0 0 16 16">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
            </svg>
            RUN
          </button>
        )}

        {imageOptions.map((img) => {
          const isSelected = selected === img.key;
          let btnClass = 'btn btn-sm select-btn ';
          if (isSelected) {
            btnClass += 'btn-primary';
          } else {
            btnClass +=
              img.key === 'none' ? 'btn-outline-secondary' : 'btn-outline-primary';
          }

          return (
            <button
              key={img.key}
              type="button"
              className={btnClass}
              onClick={(e) => {
                e.currentTarget.blur();
                setSelected(img.key);
              }}
            >
              {img.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}