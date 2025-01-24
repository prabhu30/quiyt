import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourses } from "@/lib/context/courses";
import { useVideos } from "@/lib/context/Videos";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AiFillYoutube } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [courseContent, setCourseContent] = useState({
    title: "",
    courseVideos: [],
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const courseTitleRef = useRef();
  const videoLinkRef = useRef();
  const courses = useCourses();
  const videos = useVideos();
  const navigate = useNavigate();
  const { user } = useUser();

  const API_KEY = import.meta.env.YOUTUBE_API_KEY;

  useEffect(() => {
    const courseContentLS = localStorage.getItem("courseContent");
    // console.log(courseContentLS, typeof courseContentLS);
    if (courseContentLS) {
      // console.log("inside if block");
      try {
        const courseContentJson = JSON.parse(courseContentLS);
        // console.log("courseContentJSON: ", courseContentJson);
        setCourseContent(courseContentJson);
      } catch (err) {
        console.error("Failed to parse courseContent from localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    const saveToLocalStorage = setTimeout(() => {
      localStorage.setItem("courseContent", JSON.stringify(courseContent));
    }, 500); // Debounce delay

    return () => clearTimeout(saveToLocalStorage);
  }, [courseContent]);

  const handleAddVideo = async () => {
    try {
      setError("");

      const videoId = videoLinkRef.current.value.match(
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
      )?.[1];

      if (!videoId) {
        setError(
          "Invalid YouTube URL. Link should be in form of 'https://youtube.com/watch?v=<videoID>'"
        );

        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      }

      for (let index = 0; index < courseContent?.courseVideos.length; index++) {
        const { videoLink } = courseContent.courseVideos[index];
        if (videoLink == videoLinkRef.current.value) {
          setError("Video is already added to the course!");
          setTimeout(() => {
            setError("");
          }, 3000);
          return;
        }
      }

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: "snippet",
            id: videoId,
            key: API_KEY,
          },
        }
      );

      if (response.data.items.length > 0) {
        setCourseContent({
          title: courseTitleRef.current.value,
          courseVideos: [
            ...courseContent.courseVideos,
            {
              title: response.data.items[0].snippet.title,
              videoLink: videoLinkRef.current.value,
            },
          ],
        });
        videoLinkRef.current.value = "";
      } else {
        setError("No video found with the given URL.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.", err);
    }
  };

  const handleRemoveVideo = (index) => {
    const updatedVideosList = courseContent.courseVideos.filter(
      (video, i) => i != index
    );
    setCourseContent({
      ...courseContent,
      courseVideos: updatedVideosList,
    });
  };

  const handleCreateCourse = async () => {
    try {
      const courseObj = {
        course_title: courseTitleRef.current.value,
        author_id: user.id,
      };
      const addCourseResponse = await courses.add(courseObj);

      {
        courseContent.courseVideos.map(async (courseVideo) => {
          const videoObj = {
            video_title: courseVideo?.title,
            video_link: courseVideo?.videoLink,
            course_id: addCourseResponse.$id,
          };

          const addVideoResponse = await videos.add(videoObj);
          console.log(addVideoResponse);
        });
      }
      localStorage.removeItem("courseContent");
      setCourseContent({ title: "", courseVideos: [] });
      setMessage(
        "Course created successfully! Redirecting you to courses page in 3 seconds..."
      );
      setTimeout(() => {
        navigate("/courses");
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between mt-16">
      <div className="flex-1">
        <div>
          <Label className="text-3xl">Name of the course</Label>
          <Input
            placeholder="Complete React Course, VueJS A to Z, . . ."
            className="w-2/3 rounded-none mt-4 border-2 border-gray-500"
            ref={courseTitleRef}
          />
        </div>
        <div className="mt-16">
          <h1 className="text-3xl font-semibold">Add Youtube Video Links</h1>
          <p className="text-md italic mt-3">
            Copy link of video from youtube, paste it here and click add.
          </p>

          <Input
            placeholder="Link to the YouTube video (https://youtube.com/watch?v=<videoID>)"
            className="w-2/3 rounded-none my-4 border-2 border-gray-500"
            ref={videoLinkRef}
          />
          <div className="flex gap-4 items-center my-6 mb-8">
            <Button className="px-6" onClick={handleAddVideo}>
              Add
            </Button>
            <Button
              variant="destructive"
              className="px-6"
              onClick={handleCreateCourse}
            >
              Create Course
            </Button>
          </div>
        </div>

        {message && (
          <p className="text-green-600 font-semibold my-4">{message}</p>
        )}
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
      </div>

      <div className="border-4 border-purple-700 border-dotted flex-1 px-3">
        <h1 className="text-center text-2xl my-4 font-semibold">
          {courseContent?.courseVideos?.length === 0
            ? "Your course structure goes here"
            : "Course structure"}
        </h1>
        {courseContent?.courseVideos?.map(({ title }, index) => (
          <div
            key={index}
            className="flex gap-6 justify-center items-center text-lg my-4"
          >
            <span className="bg-blue-600 rounded-full px-2 text-white">
              {index + 1}
            </span>
            <span className="flex gap-2 bg-slate-200 px-4 py-2 rounded-xl w-[80%] text-base">
              <AiFillYoutube size={26} className="text-red-600" />
              <p className="font-semibold">{title}</p>
            </span>
            <Trash2Icon
              size={26}
              className="text-red-600 cursor-pointer"
              onClick={() => handleRemoveVideo(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateCourse;

// temporary (to be removed later)
// https://youtube.com/watch?v=2XF-HgauItk
