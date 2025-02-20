import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "../appwrite";
import { ID, Query } from "appwrite";

export const COURSES_DATABASE_ID = "678fc38f000034b5a490";
export const VIDEOS_COLLECTION_ID = "678fcc7d0038a49c1413";

const VideosContext = createContext();

export function useVideos() {
  return useContext(VideosContext);
}

export function VideosProvider(props) {
  const [videos, setVideos] = useState([]);

  async function add(video) {
    try {
      const response = await databases.createDocument(
        COURSES_DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        ID.unique(),
        video
      );
      setVideos((videos) => [response, ...videos].slice(0, 10));
      return response;
    } catch (err) {
      console.log(err); // handle error or show user a message
    }
  }

  async function remove(id) {
    try {
      await databases.deleteDocument(
        COURSES_DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        id
      );
      setVideos((videos) => videos.filter((video) => video.$id !== id));
      await init();
    } catch (err) {
      console.log(err);
    }
  }

  async function getVideosByCourseId(courseId) {
    try {
      const response = await databases.listDocuments(
        COURSES_DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        [Query.equal("course_id", courseId)]
      );

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function updateVideo(videoId, data) {
    try {
      console.log("video marking as complete with data : ", videoId);
      const response = await databases.updateDocument(
        COURSES_DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        videoId,
        data
      );
      console.log(response);

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function init() {
    try {
      const response = await databases.listDocuments(
        COURSES_DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
      setVideos(response.documents);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <VideosContext.Provider
      value={{ current: videos, add, remove, getVideosByCourseId, updateVideo }}
    >
      {props.children}
    </VideosContext.Provider>
  );
}
