import TypeWriter from "typewriter-effect";
import React from "react";

const FALLBACK_STRINGS = [
  "Explore o futuro da tecnologia",
  "Descubra a inovação que move o DF",
  "Entre em um novo universo virtual",
];

interface TextWritingProps {
  strings?: string[];
  className?: string;
}

const TextWriting: React.FC<TextWritingProps> = ({
  strings = FALLBACK_STRINGS,
  className = "",
}) => {
  const queue = strings.filter((text) => text.trim().length > 0);

  if (queue.length === 0) return null;

  return (
    <div
      className={`text-xl text-[#e8b443] font-semibold mb-8 ${className}`.trim()}
    >
      <TypeWriter
        options={{
          strings: queue,
          autoStart: true,
          loop: true,
        }}
      />
    </div>
  );
};

export default TextWriting;
