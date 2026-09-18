import { Environment, ContactShadows } from "@react-three/drei";
import Stethoscope from "./Stethoscope";

// The environment map is self-hosted (public/hdri/): the drei default preset
// pulls the HDR from raw.githack.com at runtime, which intermittently fails
// (403/503s observed) and used to blank the whole page. A same-origin file
// also works offline via the service worker. See HANDOVER §6.1.
export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <Stethoscope />
      <ContactShadows opacity={0.4} blur={2} far={5} position={[0, -1.5, 0]} />
      <Environment files="/hdri/potsdamer_platz_1k.hdr" />
    </>
  );
}
