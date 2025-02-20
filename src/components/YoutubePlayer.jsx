const YoutubePlayer = ({ video_id }) => {
  return (
    <div className="flex justify-around">
      <iframe
        src={`https://www.youtube.com/embed/${video_id}?rel=0&title=0&controls=1`}
        className="w-[1024px] h-[576px] rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YoutubePlayer;
