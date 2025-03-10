export function ImageGrid(props: {
  images: {
    url: string;
    width: number;
    height: number;
  }[];
}) {
  const { images } = props;
  const height = 320;

  if (images.length === 1) {
    return (
      <img
        className="photo-filter"
        src={images[0].url}
        height={images[0].height}
        width={images[0].width}
        alt=""
      />
    );
  }

  return (
    <div className="flex gap-2 items-start overflow-scroll">
      {props.images.map((img, i) => {
        const style = {
          aspectRatio: img.width / img.height,
        };
        return (
          <img
            className="h-[230px] sm:h-[320px] photo-filter"
            key={i}
            src={img.url}
            height={height}
            style={style}
            loading="lazy"
            alt=""
          />
        );
      })}
    </div>
  );
}
