"use client";

import React, { useState, useCallback } from "react";
import { Dice5, Settings2, Volume2, VolumeX, RotateCcw } from "lucide-react";
import Die from "./Die";
import { playDiceSound } from "./sound";

const DicePage: React.FC = () => {
  const [diceCount, setDiceCount] = useState<number>(1);
  const [diceValues, setDiceValues] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rotationOffsets, setRotationOffsets] = useState<
    { x: number; y: number }[]
  >([{ x: 0, y: 0 }]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const total = diceValues.reduce((a, b) => a + b, 0);

  const handleDiceCountChange = (newCount: number) => {
    setDiceCount(newCount);

    // 同步更新 diceValues，保留旧值，不足补 1
    setDiceValues((prev) => {
      const newValues = Array(newCount).fill(1);
      for (let i = 0; i < Math.min(prev.length, newCount); i++) {
        newValues[i] = prev[i];
      }
      return newValues;
    });

    // 同步更新 rotationOffsets
    setRotationOffsets((prev) => {
      const newOffsets = Array(newCount).fill({ x: 0, y: 0 });
      for (let i = 0; i < Math.min(prev.length, newCount); i++) {
        newOffsets[i] = prev[i];
      }
      return newOffsets;
    });
  };

  const handleRoll = useCallback(() => {
    if (isRolling) return;

    if (soundEnabled) {
      playDiceSound();
    }

    setIsRolling(true);

    // Generate new target values
    const newValues = Array(diceCount)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6) + 1);

    // Generate random rotations that are strictly multiples of 360 degrees
    // This ensures that when the animation ends, the dice is aligned to the grid,
    // allowing the 'base' rotation (determined by the dice value) to correctly display the face.
    const newOffsets = rotationOffsets.map((prev) => ({
      x: prev.x + 360 * (2 + Math.floor(Math.random() * 4)), // Spin 2-5 times
      y: prev.y + 360 * (2 + Math.floor(Math.random() * 4)),
    }));

    setRotationOffsets(newOffsets);
    setDiceValues(newValues);

    // Stop rolling animation after duration
    setTimeout(() => {
      setIsRolling(false);
    }, 600); // Matches CSS transition duration
  }, [diceCount, isRolling, rotationOffsets, soundEnabled]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-between font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="w-full p-4 md:p-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-md fixed top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Dice5 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            小曹棋牌室
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            aria-label={soundEnabled ? "关闭声音" : "开启声音"}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${
              showSettings
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
            aria-label="设置"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings Panel (Mobile/Desktop) */}
      <div
        className={`
        fixed top-16 md:top-20 right-4 z-40 bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-2xl transition-all duration-300 transform origin-top-right w-64
        ${
          showSettings
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }
      `}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">
              骰子数量:{" "}
              <span className="text-indigo-400 font-bold ml-1 text-lg">
                {diceCount}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={diceCount}
              onChange={(e) => handleDiceCountChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
              <span>1</span>
              <span>6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dice Area */}
      <main
        className="flex-1 w-full flex flex-col items-center justify-center py-20 px-4 min-h-[60vh] cursor-pointer"
        onClick={handleRoll}
      >
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 max-w-4xl mx-auto">
          {diceValues.map((value, index) => (
            <Die
              key={index}
              id={index}
              value={value}
              isRolling={isRolling}
              rotationOffset={rotationOffsets[index] || { x: 0, y: 0 }}
            />
          ))}
        </div>

        {/* Total Score Display */}
        <div
          className={`mt-12 transition-opacity duration-500 ${
            isRolling ? "opacity-50 blur-sm" : "opacity-100"
          }`}
        >
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl py-3 px-8 text-center shadow-xl">
            <span className="block text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">
              总点数
            </span>
            <span className="text-5xl md:text-6xl font-black text-indigo-400 tabular-nums leading-none">
              {total}
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="w-full p-6 pb-8 md:pb-10 flex justify-center sticky bottom-0 z-30 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRoll();
          }}
          disabled={isRolling}
          className="pointer-events-auto group relative inline-flex items-center justify-center gap-3 px-12 py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-full transition-all duration-200 shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.7)] disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
        >
          <RotateCcw className={`w-6 h-6 ${isRolling ? "animate-spin" : ""}`} />
          <span className="text-xl font-bold tracking-wide">
            {isRolling ? "投掷中..." : "开始投掷"}
          </span>
        </button>
      </footer>
    </div>
  );
};

export default DicePage;
