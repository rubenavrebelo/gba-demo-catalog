import { Suspense, useRef, useState } from "react";
import Model from "./model/Game_boy_color";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { CameraControls } from "@react-three/drei";

function App() {
  const cameraControlRef = useRef<CameraControls | null>(null);
  const [count, setCount] = useState(0);

  return (
    <>
      <Suspense>
        <Canvas camera={{ position: [2.5, 0.5, 2.3] }}>
          <ambientLight intensity={1} />
          <directionalLight position={[4, 1.5, 3]} intensity={2} />
          <CameraControls ref={cameraControlRef} />

          <Model />
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
