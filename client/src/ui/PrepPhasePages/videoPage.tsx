import { useEffect, useState } from 'react';

const seconds = 65;

export const VideoComponent = ({ onVideoDone }: { onVideoDone: () => void }) => {
  const [showSkipText, setShowSkipText] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      onVideoDone();
    }, 1000 * seconds);

    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    // Set a timer to show the "skip skip" text after 5 seconds
    const textTimerId = setTimeout(() => {
      setShowSkipText(true);
    }, 5000);

    return () => clearTimeout(textTimerId);
  }, []);

    // this only needs to be like this for the debug, once the game ships take out the dependency
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === ' ') {
          onVideoDone();
        }
      };
  
      window.addEventListener('keydown', handleKeyPress);
  
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, []);
  


  return (
    <>
        {showSkipText && (
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '24px',
              opacity: "0.8",
              transition: 'opacity 1s ease-in-out',
              zIndex: "100"
            }}
          >
            Skip By Pressing the Space Bar
          </div>
        )}
      

      <iframe
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: '10',
          backgroundColor: 'black',
          boxSizing: 'border-box',
          border: 'none',
        }}
        src="https://www.youtube.com/embed/yKRl7h3XFF0?autoplay=1&controls=0&disablekb=1&mute=1"
      ></iframe>
    </>
  );
};
