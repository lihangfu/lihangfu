import React from "react";

export interface DieProps {
  id: number;
  value: number;
  isRolling: boolean;
  rotationOffset: { x: number; y: number };
}

// Map of dot positions for each face (1-6) using a 3x3 grid
const PIP_POSITIONS: Record<number, number[]> = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const FACE_ROTATIONS: Record<number, string> = {
  1: "rotateY(0deg)",
  2: "rotateX(90deg)",
  3: "rotateY(90deg)",
  4: "rotateY(-90deg)",
  5: "rotateX(-90deg)",
  6: "rotateY(180deg)",
};

const Die: React.FC<DieProps> = ({ value, isRolling, rotationOffset }) => {
  // Base rotations to bring face to front (Identity is Face 1)
  const getBaseRotation = (val: number) => {
    switch (val) {
      case 1:
        return { x: 0, y: 0 };
      case 2:
        return { x: -90, y: 0 };
      case 3:
        return { x: 0, y: -90 };
      case 4:
        return { x: 0, y: 90 };
      case 5:
        return { x: 90, y: 0 };
      case 6:
        return { x: 0, y: 180 }; // Changed from x:180 to y:180 to preserve upright orientation
      default:
        return { x: 0, y: 0 };
    }
  };

  const base = getBaseRotation(value);

  // Apply the cumulative rotation offset
  const style = {
    transform: `rotateX(${base.x + rotationOffset.x}deg) rotateY(${
      base.y + rotationOffset.y
    }deg)`,
    transition: isRolling
      ? "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
      : "transform 0.1s linear",
    width: "var(--dice-size)",
    height: "var(--dice-size)",
  };

  const renderFace = (faceNumber: number) => (
    <div
      key={faceNumber}
      className="absolute inset-0 bg-white rounded-xl shadow-[inset_0_0_15px_rgba(0,0,0,0.15),0_0_2px_rgba(0,0,0,0.2)] border border-slate-200 backface-hidden flex items-center justify-center p-2"
      style={{
        transform: `${FACE_ROTATIONS[faceNumber]} translateZ(var(--dice-half))`,
      }}
    >
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 p-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className="flex items-center justify-center">
            {PIP_POSITIONS[faceNumber].includes(idx) && (
              <div
                className="w-full h-full rounded-full bg-slate-800 shadow-sm"
                style={{ transform: "scale(0.85)" }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="m-4 flex items-center justify-center"
      style={{ width: "var(--dice-size)", height: "var(--dice-size)", perspective: "1000px" }}
    >
      <div className="relative" style={{ ...style, transformStyle: "preserve-3d" }}>
        {[1, 2, 3, 4, 5, 6].map((num) => renderFace(num))}
      </div>
    </div>
  );
};

export default React.memo(Die);
