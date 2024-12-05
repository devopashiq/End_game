import { useState, useEffect } from "react";

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: 0, // Default for SSR
        height: 0,
    });

    useEffect(() => {
       
        const handleSize = () => {
           
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleSize(); // Update on mount
        window.addEventListener("resize", handleSize);

        return () => {
            
            window.removeEventListener("resize", handleSize);
        };
    }, []);

  

    return windowSize;
}
