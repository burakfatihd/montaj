import { Composition } from "remotion";
import { CentsReel, TOTAL } from "./CentsReel";

export const Root: React.FC = () => (
  <Composition
    id="CentsReel"
    component={CentsReel}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
