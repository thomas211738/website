
const YouTubeVideo = () => {

  return (
    <div className="flex justify-center items-center">
        <iframe
          width="400"
          height="250"
          src="https://www.youtube.com/embed/EVwqvkNbDvY?autoplay=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
    </div>
  );
};

export default YouTubeVideo;
