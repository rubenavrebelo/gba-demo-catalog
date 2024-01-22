import { Suspense, useRef } from "react";
import { Gameboy } from "./3dmodel/Game_boy_color";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import { Bounds, useBounds } from "@react-three/drei";
import CartridgeModel from "./3dmodel/Gamebccartridge";
import * as THREE from "three";
import { publish, subscribe, unsubscribe } from "./events/events";
import React from "react";
import { cartridges } from "./types/cartridge";
import { css, jsx } from "@emotion/react";
import { container, h1Css, sub } from "./styles/App.styles";

function App() {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(true);

  const gbRef = useRef<any>(null);
  const ref = useRef<any>(null);

  const renderGames = () => {
    return cartridges.map((c) => (
      <ZoomToGameboy>
        <CartridgeModel position={[c.x, c.z, c.y]} />
      </ZoomToGameboy>
    ));
  };

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
      const onChangeToHome = (id: string) => {
        const game = cartridges.find((c) => c.id === id);

        if (game) {
          camera.position.set(game.offsetX, game.offsetY, 4);
          camera.updateMatrixWorld();
        }
      };
      subscribe("goGameboy", (data: any) => onChangeToHome(data.detail));

      return () => {
        unsubscribe("goGameboy", (data: any) => onChangeToHome(data.detail));
      };
    });

    return (
      <group
        onClick={(e) => {
          setFocused(true);
          setTimeout(() => setButtonDisabled(false), 1500);
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

          <Bounds fit clip observe margin={10}>
            <Rig>
              <SelectToZoom>{renderGames()}</SelectToZoom>
              <Gameboy scale={0.2} ref={gbRef} />
            </Rig>
          </Bounds>
        </Canvas>
        {!focused && (
          <button
            style={{
              zIndex: 10000,
              position: "absolute",
              left: "50%",
              top: "50%",
            }}
            onClick={() => {
              publish("goHome", "redblue");
            }}
          />
        )}
        {focused && (
          <div css={container}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "32px 16px",
              }}
            >
              <p css={h1Css}>Pokemon Red and Blue TV Commercial</p>
              <div css={sub}>Year: 1998</div>
              <div
                style={{ fontSize: 13, fontFamily: "Roboto", fontWeight: 400 }}
              >
                {`Pokémon Red and Blue, released in 1996,
                revolutionized gaming. As iconic RPGs, they introduced players
                to the world of Pokémon, fostering a global phenomenon. The
                games encouraged social interaction through trading, laying the
                foundation for a timeless franchise that transcends video games,
                leaving an indelible mark on popular culture.`}
              </div>
              <button
                disabled={buttonDisabled}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  publish("goGameboy", "redblue");
                  setFocused(false);
                  setButtonDisabled(true);
                }}
              >
                Select Game
              </button>
            </div>
          </div>
        )}
      </Suspense>
    </>
  );
}

export default App;
