import YoutubePlayer from "@/components/YoutubePlayer";
import { useVideos } from "@/lib/context/Videos";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleCheck, TvMinimalPlay } from "lucide-react";

const Course = () => {
  const { isLoaded } = useUser();
  const { id } = useParams();
  const videos = useVideos();
  const [courseVideos, setCourseVideos] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [videoUuid, setVideoUuid] = useState("");

  useEffect(() => {
    const fetchCourseVideos = async () => {
      const response = await videos.getVideosByCourseId(id);
      setCourseVideos(response?.documents || []);
    };

    if (isLoaded) {
      fetchCourseVideos();
    }
  }, [isLoaded, videos, id]);

  useEffect(() => {
    if (courseVideos.length > 0) {
      const unwatchedVideos = courseVideos.filter(
        (video) => video?.is_watched == false
      );
      const firstUnwatchedVideoId = extractYoutubeVideoId(
        unwatchedVideos[0]?.video_link
      );
      setVideoId(firstUnwatchedVideoId);
    }
  }, [courseVideos]);

  const handleSelectVideo = (videoUuid, video_id) => {
    setVideoUuid(videoUuid);
    setVideoId(video_id);
  };

  const extractYoutubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const markVideoAsComplete = async (videoUuid) => {
    console.log("marking video as complete...");
    const isWatched = { is_watched: true };
    const response = await videos.updateVideo(videoUuid, isWatched);
    setCourseVideos(response?.documents || []);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-200 border-r border-gray-300 p-4 mt-2 rounded-lg">
        <h2 className="text-2xl font-semibold m-4 text-amber-700">
          Course Videos
        </h2>
        <ScrollArea className="h-full">
          {courseVideos.length > 0 ? (
            courseVideos.map(({ $id, video_title, video_link, is_watched }) => {
              const video_id = extractYoutubeVideoId(video_link);
              return (
                <TooltipProvider key={$id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          className={`text-md my-1 h-12 hover:rounded hover:bg-gray-300 ${
                            videoId === video_id ? "bg-gray-300" : ""
                          }`}
                          onClick={() => handleSelectVideo($id, video_id)}
                        >
                          {is_watched ? (
                            <CircleCheck fill="#88e788" />
                          ) : (
                            <TvMinimalPlay />
                          )}
                          {video_title}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{video_title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })
          ) : (
            <p className="text-gray-500">
              No videos available for this course.
            </p>
          )}
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {videoId ? (
          <div className="flex flex-col items-end -mt-14">
            <Button
              className="mb-3 text-right"
              onClick={() => markVideoAsComplete(videoUuid)}
            >
              <CircleCheck /> Mark as complete
            </Button>
            <YoutubePlayer video_id={videoId} />
          </div>
        ) : (
          <p className="text-gray-700 text-2xl">Select a video to play</p>
        )}
      </main>
    </div>
  );
};

export default Course;
