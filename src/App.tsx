import { Suspense, useRef, useState } from "react";
import Model from "./model/Game_boy_color";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import {
  Bounds,
  CameraControls,
  OrbitControls,
  useBounds,
} from "@react-three/drei";
import CartridgeModel from "./model/Gamebccartridge";
import * as THREE from "three";

const Rig = ({ children }: any) => {
  const ref = useRef<any>(null);
  useFrame((state) => {
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      (state.mouse.x * Math.PI) / 50,
      0.05
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      (state.mouse.y * Math.PI) / 20,
      0.05
    );
  });
  return <group ref={ref}>{children}</group>;
};

const SelectToZoom = ({ children }: any) => {
  const api = useBounds();
  return (
    <group
      onClick={(e) => (
        e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
      )}
      onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}
    >
      {children}
    </group>
  );
};

function App() {
  return (
    <>
      <Suspense>
        <Canvas camera={{ position: [1.5, 0, 2.6] }}>
          <ambientLight intensity={1} />
          <directionalLight position={[4, 1.5, 3]} intensity={2} />
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.75}
          />
          <Rig>
            <Bounds fit clip observe margin={2.5}>
              <SelectToZoom>
                <CartridgeModel position={[1, 0, 1.005]} rotation={[0, 0, 7]} />
                <CartridgeModel
                  position={[1.1, 0, 1]}
                  rotation={[0, 0, -0.5]}
                />
                <CartridgeModel position={[1.2, 0, 1]} rotation={[0, 0, 0]} />
                <CartridgeModel
                  position={[1.3, 0.005, 1]}
                  rotation={[-0.2, 0, 0.5]}
                />

                <CartridgeModel position={[1.3, 0, 1.1]} rotation={[0, 0, 0]} />
              </SelectToZoom>
            </Bounds>
            <Model />
          </Rig>
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
