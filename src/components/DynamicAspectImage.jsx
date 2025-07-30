import React from "react";

function DynamicAspectImage({ src, alt }) {
  return (
    <div className="aspect-4-5 bg-black rounded-md overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="aspect-img"
        style={{
          objectFit: "cover",
          objectPosition: "center",
          width: "100%",
          height: "100%",
          display: "block"
        }}
      />
    </div>
  );
}

export default DynamicAspectImage; 