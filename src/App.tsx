import { Suspense, useRef } from "react";
import { Gameboy } from "./3dmodel/Game_boy_color";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import { Bounds, useBounds } from "@react-three/drei";
import CartridgeModel from "./3dmodel/Gamebccartridge";
import * as THREE from "three";
import { publish, subscribe } from "./events/events";
import React from "react";

function App() {
  const [gameSelected, setGameSelected] = React.useState<any>("");

  const gbRef = useRef<any>(null);
  const ref = useRef<any>(null);

  const SelectToZoom = ({ children }: any) => {
    const api = useBounds();
    const groupRef = useRef<any>(null);

    return (
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          e.delta <= 2 && api.refresh(e.object).fit();
        }}
      >
        {children}
      </group>
    );
  };

  const ZoomToGameboy = ({ children }: any) => {
    const { camera } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
      const onChangeToHome = () => {
        camera.position.set(gameSelected ? 0.2 : 0, gameSelected ? -0.1 : 0, 4);
        camera.updateMatrixWorld();
      };
      subscribe("goGameboy", onChangeToHome);
    });

    return (
      <group
        onClick={(e) => {
          setGameSelected("abc");
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
        (state.mouse.x * Math.PI) / 20,
        0.05
      );
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        (state.mouse.y * Math.PI) / 50,
        0.05
      );
    });

    return <group ref={ref}>{children}</group>;
  };

  return (
    <>
      <Suspense>
        <Canvas
          camera={{
            position: [0, 0, 4],
            zoom: 10,
            onUpdate: (c: any) => c.updateProjectionMatrix(),
          }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0.7, 0, 0.3]} intensity={2} />
          <primitive object={new THREE.AxesHelper(10)} />

          <Bounds fit clip observe margin={10}>
            <Rig>
              <SelectToZoom>
                <ZoomToGameboy>
                  <CartridgeModel position={[0.5, 0.1, 0.3]} />
                </ZoomToGameboy>
                <ZoomToGameboy>
                  <CartridgeModel position={[0.5, 0, 0.3]} />
                </ZoomToGameboy>

                <CartridgeModel position={[0.5, -0.1, 0.3]} />
                <CartridgeModel position={[0.9, 0.1, 0.3]} />

                <CartridgeModel position={[0.9, 0, 0.3]} />
              </SelectToZoom>
              <Gameboy scale={0.2} ref={gbRef} />
            </Rig>
          </Bounds>
        </Canvas>
        <button
          style={{
            zIndex: 10000,
            position: "absolute",
            left: "50%",
            top: "50%",
          }}
          onClick={() => {
            publish("goHome", {});
          }}
        />
        {gameSelected && (
          <div
            style={{
              zIndex: 10001,
              position: "absolute",
              left: "65%",
              top: "50%",
            }}
          >
            {
              <div style={{ display: "flex", flexDirection: "column" }}>
                <text
                  style={{
                    fontFamily: "Roboto",
                    color: "white",
                    fontSize: 32,
                    lineHeight: "24px",
                    fontWeight: 500,
                  }}
                >
                  Pokemon Red and Blue TV Commercial
                </text>
                <text
                  style={{
                    fontFamily: "Roboto",
                    color: "white",
                    fontSize: 24,
                    lineHeight: "24px",
                    fontWeight: 500,
                  }}
                >
                  Year: 1998
                </text>
                <button onClick={() => publish("goGameboy", {})}>
                  Select Game
                </button>
              </div>
            }
          </div>
        )}
      </Suspense>
    </>
  );
}

export default App;
