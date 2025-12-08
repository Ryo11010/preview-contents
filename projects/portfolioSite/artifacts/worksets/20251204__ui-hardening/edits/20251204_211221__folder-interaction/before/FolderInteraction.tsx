import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- Components ---

// カードの中身（スケルトンUI）
const CardContent = ({ variant }: { variant: 'A' | 'B' | 'C' }) => {
  const lines = variant === 'A' 
    ? [ "w-1/2 h-4", "w-full h-24", "w-full h-2", "w-2/3 h-2", "flex gap-2 mt-4" ] 
    : variant === 'B' 
    ? [ "w-1/3 h-4", "w-full h-4", "w-full h-4", "w-3/4 h-20", "w-1/2 h-4 mt-2" ]
    : [ "w-1/4 h-8 mb-2", "w-full h-2", "w-full h-2", "w-full h-16 mt-2", "w-1/3 h-2" ];

  return (
    <div className="w-full h-full p-4 flex flex-col gap-3">
      {/* Header */}
      <div className={`bg-white/20 rounded-md ${lines[0]}`} />
      
      {/* Body */}
      {variant === 'A' ? (
        <>
           <div className={`bg-white/10 rounded-md ${lines[1]}`} />
           <div className="space-y-2">
             <div className={`bg-white/20 rounded-full ${lines[2]}`} />
             <div className={`bg-white/20 rounded-full ${lines[3]}`} />
           </div>
           <div className={lines[4]}>
              <div className="w-8 h-8 rounded-md bg-white/20" />
              <div className="w-8 h-8 rounded-md bg-white/20" />
              <div className="w-8 h-8 rounded-md bg-white/20" />
           </div>
        </>
      ) : variant === 'B' ? (
        <>
          <div className="space-y-2">
            <div className={`bg-white/10 rounded-full ${lines[1]}`} />
            <div className={`bg-white/10 rounded-full ${lines[2]}`} />
          </div>
          <div className={`bg-white/20 rounded-md ${lines[3]}`} />
          <div className={`bg-white/20 rounded-full ${lines[4]}`} />
        </>
      ) : (
        <>
           <div className="space-y-2">
             <div className={`bg-white/20 rounded-full ${lines[1]}`} />
             <div className={`bg-white/20 rounded-full ${lines[2]}`} />
           </div>
           <div className={`bg-white/10 rounded-md ${lines[3]}`} />
           <div className={`bg-white/20 rounded-full ${lines[4]}`} />
        </>
      )}
    </div>
  );
};

// 個別のファイルカード
const FileCard = ({ 
  index, 
  isOpen, 
  isHovered, 
  variant 
}: { 
  index: number; 
  isOpen: boolean; 
  isHovered: boolean;
  variant: 'A' | 'B' | 'C';
}) => {
  // 展開時 (クリック後)
  const openTransforms = [
    { x: -130, y: -200, rotate: -8 },  // 左
    { x: 0,    y: -210, rotate: 0 },   // 中央
    { x: 130,  y: -200, rotate: 8 },   // 右
  ];

  // ホバー時 (少し顔を出す)
  const hoverTransforms = [
    { x: -20, y: -70, rotate: -4 },
    { x: 0,   y: -80, rotate: 0 },
    { x: 20,  y: -70, rotate: 4 },
  ];

  // 通常時 (ポケットの中)
  const closedTransforms = [
    { x: 0, y: -10, rotate: 0 },
    { x: 0, y: -10, rotate: 0 },
    { x: 0, y: -10, rotate: 0 },
  ];

  // Z-indexの計算: 
  const getZIndex = () => {
    if (isOpen) {
      if (index === 1) return 30; // 中央最前面
      return 25; // 左右
    }
    return 10 + index; // 通常時
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        x: isOpen ? openTransforms[index].x : (isHovered ? hoverTransforms[index].x : closedTransforms[index].x),
        y: isOpen ? openTransforms[index].y : (isHovered ? hoverTransforms[index].y : closedTransforms[index].y),
        rotate: isOpen ? openTransforms[index].rotate : (isHovered ? hoverTransforms[index].rotate : closedTransforms[index].rotate),
        scale: 1,
        zIndex: getZIndex(),
      }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 22,
        mass: 0.8
      }}
      className="absolute bottom-0 left-0 right-0 mx-auto w-56 h-36 bg-[#2a2a2a] rounded-xl border border-white/10 shadow-2xl overflow-hidden origin-bottom"
    >
      <CardContent variant={variant} />
      {/* カード表面の微かな光沢とグラデーション */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5 pointer-events-none" />
    </motion.div>
  );
};

// フタの厚みと表面を組み合わせたコンポーネント (厚みレイヤーを削除)
const FrontPlate = ({ isOpen, isHovered }) => {
    const SURFACE_HEIGHT = 160; // 表面の高さ (px) - 元の高さに戻す
    
    return (
        <motion.div
            animate={{
                rotateX: isOpen ? -60 : 0,
                y: 0, // y移動のロジックを削除
                z: isOpen ? 0 : 5, 
            }}
            transition={{ 
                type: "spring", 
                stiffness: 150, 
                damping: 15,
                mass: 1.2
            }}
            style={{ 
                transformStyle: "preserve-3d",
                transformOrigin: "bottom center",
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', 
            }}
            // フタ全体の高さを元に戻す
            className="relative z-40 w-72 h-[160px] bg-transparent backdrop-blur-md rounded-[24px]"
        >
            {/* 以前の厚みレイヤー (1. 厚みの側面) は完全に削除 */}
            
            {/* 2. フタの表面 (Glass Panel) - 最前面 */}
            <div
                className="absolute top-0 w-full h-full z-50" 
                style={{
                    height: `${SURFACE_HEIGHT}px`,
                    opacity: isOpen ? 0.3 : 1, 
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(5,5,5,0.9) 100%)',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    // 左右の縁に厚みハイライト（立体的な面取り）を再適用
                    boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.15), inset -1px 0 0 rgba(255,255,255,0.15)', 
                    borderRadius: '24px',
                    overflow: 'hidden',
                }}
            >
                {/* ノイズテクスチャ */}
                <div className="absolute inset-0 opacity-[0.12] bg-[url('https://www.transparenttextures.com/patterns/noise.png')] mix-blend-overlay pointer-events-none" />

                {/* ガラスの反射光 (上部からのグラデーション) */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none" />
                
                {/* カードが透けて見える部分の演出 */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />

                {/* 指アイコン (ホバー時のみ表示) */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered && !isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <div className="w-2 h-2 bg-white rounded-full opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};


export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFolder = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-[#bfbfbf] flex items-center justify-center p-8 font-sans overflow-hidden">
      
      {/* コンテナ */}
      <div 
        className="relative w-72 h-80 flex items-end justify-center pb-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleFolder}
        style={{ perspective: 1000 }} // 親要素に perspective を設定して立体感を出す
      >
        {/* --- Back Plate (背面の黒いボード) --- */}
        <motion.div
            animate={{
                scale: isOpen ? 0.98 : 1,
            }}
            className="absolute bottom-8 w-72 h-48 bg-[#1f1f1f] rounded-3xl z-0"
            style={{
                borderRadius: '24px',
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.6)'
            }}
        >
            {/* タブ (左上の突起) */}
            <div className="absolute -top-5 left-0 w-28 h-10 bg-[#1f1f1f] rounded-t-2xl border-t border-white/5" />
            
            {/* 背面の質感 */}
            <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay rounded-3xl" />
        </motion.div>


        {/* --- Cards (中身) --- */}
        <div className="absolute bottom-12 w-full flex justify-center items-end pointer-events-none">
             <FileCard index={0} isOpen={isOpen} isHovered={isHovered} variant="A" />
             <FileCard index={1} isOpen={isOpen} isHovered={isHovered} variant="B" />
             <FileCard index={2} isOpen={isOpen} isHovered={isHovered} variant="C" />
        </div>


        {/* --- Front Plate (前面のすりガラス - フタ全体) --- */}
        <FrontPlate isOpen={isOpen} isHovered={isHovered} />
        
      </div>
      
      {/* キャプション */}
      <div className="absolute bottom-10 text-[#666] text-sm font-medium tracking-wide">
        {isOpen ? "Click to close" : "Click to expand"}
      </div>

    </div>
  );
}