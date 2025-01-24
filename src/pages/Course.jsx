import YoutubePlayer from "@/components/YoutubePlayer";
import { useVideos } from "@/lib/context/Videos";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Course = () => {
  const { isLoaded } = useUser();
  const { id } = useParams();
  const videos = useVideos();
  const [courseVideos, setCourseVideos] = useState();
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    const fetchCourseVideos = async () => {
      const response = await videos.getVideosByCourseId(id);
      setCourseVideos(response?.documents);
    };

    if (isLoaded) {
      fetchCourseVideos();
    }
  }, [isLoaded, videos]);

  return (
    <>
      <div>
        {courseVideos?.map(({ $id, video_title, video_link }) => {
          const index = video_link.indexOf("?v=");
          const video_id = video_link.slice(index + 3, index + 14);
          return (
            <p key={$id} onClick={() => setVideoId(video_id)}>
              {video_title}
            </p>
          );
        })}
      </div>
      {videoId != "" && <YoutubePlayer video_id={videoId} />}
    </>
  );
};

export default Course;
