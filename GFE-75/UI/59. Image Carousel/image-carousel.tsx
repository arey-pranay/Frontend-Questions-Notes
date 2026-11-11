import { useState, useEffect } from "react";
export default function ImageCarousel({
  images,
}: Readonly<{
  images: ReadonlyArray<{ src: string; alt: string }>;
}>) {
  const [currImg, setCurrImg] = useState(0);
  const moveForward = () => setCurrImg((prev) => (prev + 1) % images.length); // Loops back to 0
  const moveBackward = () =>
    setCurrImg((prev) => (prev - 1 + images.length) % images.length); // Loops to end
  const handleGlobalKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") moveForward();
    else if (event.key === "ArrowLeft") moveBackward();
  };
  useEffect(() => {
    // 2. Pass the exact same function reference to both methods
    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          overflow: "hidden",
        }}
      >
        {images.map(({ alt, src }) => (
          <img
            style={{
              transform: `translateX(calc(-${currImg} * 100%))`,
            }}
            key={src}
            alt={alt}
            src={src}
            width="100%"
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          margin: "1rem",
        }}
      >
        <button
          aria-label="Previous image"
          className="image-carousel__button image-carousel__button--prev"
          onClick={() => {
            const nextIndex = (currImg - 1 + images.length) % images.length;
            setCurrImg(nextIndex);
          }}
        >
          &#10094;
        </button>
        {currImg + 1} of {images.length}
        <button
          aria-label="Next image"
          className="image-carousel__button image-carousel__button--next"
          onClick={() => {
            const nextIndex = (currImg + 1) % images.length;
            setCurrImg(nextIndex);
          }}
        >
          &#10095;
        </button>
      </div>
    </>
  );
}

const images = [
  {
    src: 'https://picsum.photos/id/600/600/400',
    alt: 'Forest',
  },
  {
    src: 'https://picsum.photos/id/100/600/400',
    alt: 'Beach',
  },
  {
    src: 'https://picsum.photos/id/200/600/400',
    alt: 'Yak',
  },
  {
    src: 'https://picsum.photos/id/300/600/400',
    alt: 'Hay',
  },
  {
    src: 'https://picsum.photos/id/400/600/400',
    alt: 'Plants',
  },
  {
    src: 'https://picsum.photos/id/500/600/400',
    alt: 'Building',
  },
];
