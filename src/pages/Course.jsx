import YoutubePlayer from "@/components/YoutubePlayer";
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
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  TvMinimalPlay,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { extractYoutubeVideoId } from "@/utils/helpers";
import { getVideos, updateVideo } from "@/store/videoSlice";
import { MoonLoader } from "react-spinners";

const Course = () => {
  const { isLoaded } = useUser();
  const { id } = useParams();
  const [selectedVideo, setSelectedVideo] = useState({
    dbVideoId: "",
    ytVideoId: "",
    videoIndex: 0,
  });

  const {
    videos,
    isLoading: isLoadingVideos,
    error: errorVideos,
  } = useSelector((state) => state.videos);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourseVideos = async () => dispatch(getVideos(id));
    if (isLoaded) fetchCourseVideos();
  }, [dispatch, isLoaded, id]);

  useEffect(() => {
    if (videos.length > 0) {
      const unwatchedVideos = videos.filter(
        (video) => video?.is_watched == false
      );

      if (unwatchedVideos.length > 0) {
        setSelectedVideo({
          ytVideoId: extractYoutubeVideoId(unwatchedVideos[0]?.video_link),
          dbVideoId: unwatchedVideos[0]?.$id,
          videoIndex: videos.indexOf(unwatchedVideos[0]),
        });
      } else {
        setSelectedVideo({
          ytVideoId: extractYoutubeVideoId(videos[0]?.video_link),
          dbVideoId: videos[0]?.$id,
          videoIndex: 0,
        });
      }
    }
  }, []);

  const handleSelectVideo = (databaseVideoId, youtubeVideoId, index) => {
    setSelectedVideo({
      dbVideoId: databaseVideoId,
      ytVideoId: youtubeVideoId,
      videoIndex: index,
    });
  };

  const handlePrevVideo = () => {
    const currIndex = selectedVideo?.videoIndex;
    setSelectedVideo({
      dbVideoId: videos[currIndex - 1].$id,
      ytVideoId: extractYoutubeVideoId(videos[currIndex - 1].video_link),
      videoIndex: currIndex - 1,
    });
  };

  const handleNextVideo = () => {
    const currIndex = selectedVideo?.videoIndex;
    setSelectedVideo({
      dbVideoId: videos[currIndex + 1].$id,
      ytVideoId: extractYoutubeVideoId(videos[currIndex + 1].video_link),
      videoIndex: currIndex + 1,
    });
  };

  const toggleVideoComplete = async (dbVideoId) => {
    try {
      const currStatus = videos[selectedVideo?.videoIndex].is_watched;
      const resultAction = await dispatch(
        updateVideo({ videoId: dbVideoId, data: { is_watched: !currStatus } })
      );

      if (updateVideo.fulfilled.match(resultAction))
        console.log("Video updated successfully:", resultAction.payload);
      else console.error("Failed to update video:", resultAction.payload);
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  if (isLoadingVideos) {
    return <MoonLoader className="mt-8 mx-auto" />;
  }

  if (errorVideos) {
    return (
      <div>
        <h1 className="mt-8 text-3xl text-red-500 font-semibold">
          Something went wrong
        </h1>
      </div>
    );
  }

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-200 border-r border-gray-300 p-4 mt-2 rounded-lg h-screen">
        <h2 className="text-2xl font-semibold m-4 text-amber-700">
          Course Videos
        </h2>
        <ScrollArea>
          {videos?.length > 0 ? (
            videos.map(
              ({ $id, video_title, video_link, is_watched }, index) => {
                const video_id = extractYoutubeVideoId(video_link);
                return (
                  <TooltipProvider key={$id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            className={`text-md my-1 h-12 hover:rounded w-full flex justify-start hover:bg-gray-300 ${
                              selectedVideo?.ytVideoId === video_id
                                ? "bg-gray-300"
                                : ""
                            }`}
                            onClick={() =>
                              handleSelectVideo($id, video_id, index)
                            }
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
              }
            )
          ) : (
            <p className="text-gray-500">
              No videos available for this course.
            </p>
          )}
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col mt-16 items-center justify-center h-max">
        {selectedVideo?.ytVideoId ? (
          <div className="flex flex-col -mt-14 select-none">
            <div className="flex justify-between items-center">
              <Button
                className="mb-3 text-right hover:bg-green-600"
                onClick={() => toggleVideoComplete(selectedVideo?.dbVideoId)}
              >
                <CircleCheck />
                {videos[selectedVideo?.videoIndex]?.is_watched === true
                  ? "Mark as not complete"
                  : "Mark as complete"}
              </Button>
              <div className="flex gap-2">
                <Button
                  className="px-3 py-1 mb-3 bg-slate-300 text-black hover:bg-slate-400"
                  disabled={selectedVideo?.dbVideoId === videos[0]?.$id}
                  onClick={handlePrevVideo}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  className="px-3 py-1 mb-3 bg-slate-300 text-black hover:bg-slate-400"
                  disabled={
                    selectedVideo?.dbVideoId === videos[videos.length - 1]?.$id
                  }
                  onClick={handleNextVideo}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
            <YoutubePlayer
              video_id={selectedVideo?.ytVideoId}
              className="select-none"
            />
          </div>
        ) : (
          <p className="text-gray-700 text-2xl lg:mt-48">
            Select a video to play
          </p>
        )}
      </main>
    </div>
  );
};

export default Course;
