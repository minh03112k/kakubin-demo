import { useState, useRef, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { Button } from '@chakra-ui/react';

function MyComponent() {
  const [isRotating, setIsRotating] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isSpinningComplete, setIsSpinningComplete] = useState(false);
  const startXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const rotationThreshold = 1; // Define the rotation threshold for spinning completion

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsRotating(true);
    startXRef.current = event.clientX;
    // startYRef.current = event.clientY;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isRotating) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) {
        return;
      }

      const containerCenterX = containerRect.left + containerRect.width / 2;
      const containerCenterY = containerRect.top + containerRect.height / 2;
      const startX = startXRef.current ?? containerCenterX;
      const startY = startYRef.current ?? containerCenterY;
      const currentX = event.clientX;
      const currentY = event.clientY;
      const startAngle = Math.atan2(
        startY - containerCenterY,
        startX - containerCenterX
      );
      const currentAngle = Math.atan2(
        currentY - containerCenterY,
        currentX - containerCenterX
      );
      const diffAngle = currentAngle - startAngle;
      setAngle((angle) => angle + diffAngle * (180 / Math.PI));
      startXRef.current = currentX;
      startYRef.current = currentY;
    }
  };

  const handleMouseUp = () => {
    setIsRotating(false);
    // setAngle(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleRotate = () => {
    setIsSpinningComplete(false); // Reset the spinning complete status
    setAngle((angle) => angle + 180);
  };

  useEffect(() => {
    if (!isRotating && Math.abs(angle % 360) < rotationThreshold) {
      setIsSpinningComplete(true);
    } else {
      setIsSpinningComplete(false);
    }
  }, [isRotating, angle]);

  useEffect(() => {
    if (isSpinningComplete) {
      alert('Spinning complete!');
    }
  }, [isSpinningComplete]);

  const styleAngle = {
    transform: `rotate(${angle}deg)`,
  };

  const styleRotation = {
    transform: `rotate(${angle}deg)`,
    transition: 'transform 0.5s ease-in-out',
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <img
        src='/images/Screenshot_7.png'
        className={styles.object}
        onMouseDown={handleMouseDown}
        style={isRotating ? styleAngle : styleRotation}
      />
      <Button onClick={handleRotate}>Rotate 180</Button>
    </div>
  );
}

export default MyComponent;
