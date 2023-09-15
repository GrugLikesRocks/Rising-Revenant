import { useEffect, useState, useRef } from "react";

type CircleProps = {
  x: number;
  y: number;
  radius: number;
};

type Props = {
  circle: CircleProps;
  getCameraPosition: () => { x: number; y: number }; // Function to get camera position
};

const CircleShape = ({ circle, getCameraPosition }: Props) => {
  const [position, setPosition] = useState({ x: circle.x, y: circle.y });
  const initialCameraPos = useRef<any>(null);

  useEffect(() => {
    initialCameraPos.current = getCameraPosition();

    // Update circle position based on camera movement
    const updateCirclePosition = () => {
      const newCameraPos = getCameraPosition();
      if (newCameraPos && initialCameraPos.current) {
        const dx = newCameraPos.x - initialCameraPos.current.x;
        const dy = newCameraPos.y - initialCameraPos.current.y;

        setPosition({
          x: position.x - dx,
          y: position.y - dy,
        });

        initialCameraPos.current = newCameraPos;
      }
    };

    const intervalID = setInterval(updateCirclePosition, 1000 / 60);

    return () => {
      clearInterval(intervalID);
    };
  }, [position]);

  const style: React.CSSProperties  = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${circle.radius * 2}px`,
    height: `${circle.radius * 2}px`,
    borderRadius: "50%",
    backgroundColor: "blue",
  };

  return <div style={style}></div>;
};

export default CircleShape;





// const style: React.CSSProperties 