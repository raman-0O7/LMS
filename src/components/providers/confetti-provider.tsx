"use client";

import ReactConfetti from "react-confetti";
import { useConfettiStore } from "@/hooks/use-confetti-store";

export default function ConfettiProvider() {
  const confetti = useConfettiStore();

  if(!confetti.isOpen) return <></>;

  return (
    <ReactConfetti 
      numberOfPieces={500}
      className="pointer-event-none z-[100]"
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  )
}
