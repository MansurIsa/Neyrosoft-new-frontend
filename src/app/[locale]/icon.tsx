import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon generated from the brand marks so it follows the logo colours. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B304D",
          color: "#EE2037",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        N
      </div>
    ),
    size,
  );
}
