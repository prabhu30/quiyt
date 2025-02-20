import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourses } from "@/lib/context/Courses";
import { useVideos } from "@/lib/context/Videos";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AiFillYoutube } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const LOCAL_STORAGE_KEY = "courseContent";

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

  // Load saved course content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedContent) {
      try {
        setCourseContent(JSON.parse(savedContent));
      } catch (err) {
        console.error("Error parsing course content from localStorage:", err);
      }
    }
  }, []);

  // Save course content to localStorage on updates
  useEffect(() => {
    const saveToLocalStorage = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courseContent));
    }, 500);
    return () => clearTimeout(saveToLocalStorage);
  }, [courseContent]);

  // Helper to set temporary error messages
  const setTemporaryError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const extractYoutubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Add a video to the course
  const handleAddVideo = async () => {
    try {
      setError("");
      let videoLink = videoLinkRef.current.value;
      const videoId = extractYoutubeVideoId(videoLink);

      if (!videoId) {
        return setTemporaryError(
          "Invalid YouTube URL. Use 'https://youtube.com/watch?v=<videoID>'."
        );
      }

      if (
        courseContent.courseVideos.some(
          ({ videoLink: link }) => link === videoLink
        )
      ) {
        return setTemporaryError("Video is already added to the course!");
      }

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
      );

      if (response.data.items.length === 0) {
        return setTemporaryError("No video found with the given URL.");
      }

      const videoTitle = response.data.items[0].snippet.title;
      setCourseContent((prev) => ({
        ...prev,
        courseVideos: [...prev.courseVideos, { title: videoTitle, videoLink }],
      }));

      videoLinkRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
    }
  };

  // Remove a video from the course
  const handleRemoveVideo = (index) => {
    setCourseContent((prev) => ({
      ...prev,
      courseVideos: prev.courseVideos.filter((_, i) => i !== index),
    }));
  };

  // Create the course
  const handleCreateCourse = async () => {
    try {
      const courseTitle = courseTitleRef.current.value;
      const newCourse = await courses.add({
        course_title: courseTitle,
        author_id: user.id,
      });

      await Promise.all(
        courseContent.courseVideos.map((video) =>
          videos.add({
            video_title: video.title,
            video_link: video.videoLink,
            course_id: newCourse.$id,
            is_watched: false,
          })
        )
      );

      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCourseContent({ title: "", courseVideos: [] });
      setMessage("Course created successfully! Redirecting...");

      setTimeout(() => navigate("/courses"), 3000);
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="flex flex-col text-center px-12 lg:text-left lg:flex-row justify-between mt-16">
      <div className="flex-1">
        <Label className="text-lg md:text-2xl">Name of the course</Label>
        <Input
          placeholder="Complete React Course, VueJS A to Z, ..."
          className="w-full mt-4 mx-auto lg:mx-0 lg:w-2/3 text-amber-700 font-semibold rounded-none border-2 border-gray-500"
          ref={courseTitleRef}
        />

        <div className="mt-8 md:mt-16">
          <h1 className="text-lg md:text-2xl font-semibold">
            Add YouTube Video Links
          </h1>
          <p className="text-sm md:text-md italic mt-3">
            Copy a YouTube video link, paste it here, and click Add.
          </p>

          <Input
            placeholder="YouTube video link (https://youtube.com/watch?v=<videoID>)"
            className="w-full my-4 lg:mx-0 lg:w-2/3 rounded-none border-2 border-gray-500"
            ref={videoLinkRef}
          />
          <div className="flex gap-4 justify-center lg:justify-start items-center my-6">
            <Button onClick={handleAddVideo} className="px-8">
              Add
            </Button>
            <Button variant="destructive" onClick={handleCreateCourse}>
              Create Course
            </Button>
          </div>
        </div>

        {message && (
          <p className="text-green-600 font-semibold my-4">{message}</p>
        )}
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
      </div>

      <div className="border-4 border-purple-700 border-dotted flex-1 px-3 rounded-xl">
        <h1 className="text-center text-lg sm:text-2xl my-4 font-semibold">
          {courseContent.courseVideos.length === 0
            ? "Your course structure goes here"
            : "Course Structure"}
        </h1>
        {courseContent.courseVideos.map(({ title }, index) => (
          <div key={index} className="flex gap-6 items-center my-4">
            <span className="bg-blue-600 text-white rounded-full px-2">
              {index + 1}
            </span>
            <div className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-xl w-[80%]">
              <AiFillYoutube
                size={26}
                className="hidden md:inline-block text-red-600"
              />
              <p className="text-sm md:text-md font-semibold">{title}</p>
            </div>
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
