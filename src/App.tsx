import { Suspense, useRef, useState } from "react";
import { Gameboy } from "./model/Game_boy_color";
import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";
import {
  Bounds,
  CameraControls,
  OrbitControls,
  useBounds,
} from "@react-three/drei";
import CartridgeModel from "./model/Gamebccartridge";
import * as THREE from "three";

function App() {
  const [cartridgeClicked, setCartridgeClicked] = useState<boolean>(false);
  const [gamePicked, setGamePicked] = useState<boolean>(false);
  const [groupFocused, setGroupFocused] = useState<boolean>(false);
  const gbRef = useRef<any>(null);
  const ref = useRef<any>(null);

  const SelectToZoom = ({ children }: any) => {
    const api = useBounds();
    const groupRef = useRef<any>(null);

    return (
      <group
        ref={groupRef}
        onClick={(e) => (
          e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
        )}
      >
        {children}
      </group>
    );
  };

  const ZoomToGameboy = ({ children }: any) => {
    const vec = new THREE.Vector3();
    const preZoom = new THREE.Vector3();
    useFrame((state) => {
      if (gamePicked) {
        console.log(gbRef.current.position);
        state.camera.lookAt(
          preZoom.set(
            gbRef.current.position.x,
            gbRef.current.position.y + 0,
            gbRef.current.position.z
          )
        );
        state.camera.position.lerp(vec.set(0.79, 1.1, 1), 0.1);
        state.camera.updateMatrixWorld();
      }
    });
    return (
      <group
        onClick={() => {
          if (groupFocused) setGamePicked(true);
        }}
      >
        {children}
      </group>
    );
  };

  const Rig = ({ children }: any) => {
    useFrame((state) => {
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        (state.mouse.x * Math.PI) / 50,
        0.05
      );
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        (state.mouse.y * Math.PI) / 50,
        0.05
      );
    });

    return (
      <group
        ref={ref}
        onClick={() => {
          setCartridgeClicked(true);
          setGroupFocused(true);
        }}
      >
        {children}
      </group>
    );
  };

  return (
    <>
      <Suspense>
        <Canvas camera={{ position: [1.2, 8, 3], zoom: 5 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[4, 1.5, 3]} intensity={2} />
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
          <Bounds fit clip observe margin={8}>
            <Rig>
              <SelectToZoom>
                <ZoomToGameboy>
                  <CartridgeModel
                    position={[1, 0, 1]}
                    rotation={[-1.5, 0, 7]}
                  />
                </ZoomToGameboy>
                <CartridgeModel
                  position={[1.1, 0, 1]}
                  rotation={[-1.5, 0, -0.5]}
                />
                <CartridgeModel
                  position={[1.2, 0, 1]}
                  rotation={[-1.5, 0, 0]}
                />
                <CartridgeModel
                  position={[1.3, 0.005, 1]}
                  rotation={[-1.5, 0, 0.5]}
                />

                <CartridgeModel
                  position={[1.3, 0, 1.1]}
                  rotation={[-1.5, 0, 0]}
                />
              </SelectToZoom>
            </Rig>
          </Bounds>
          <Gameboy scale={0.2} position={[0.7, 0, 0.3]} ref={gbRef} />
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
