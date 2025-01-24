import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "../appwrite";
import { ID, Query } from "appwrite";

export const COURSES_DATABASE_ID = "678fc38f000034b5a490";
export const COURSES_COLLECTION_ID = "678fca0d002e7626e64a";

const CoursesContext = createContext();

export function useCourses() {
  return useContext(CoursesContext);
}

export function CoursesProvider(props) {
  const [courses, setCourses] = useState([]);

  async function add(course) {
    try {
      const response = await databases.createDocument(
        COURSES_DATABASE_ID,
        COURSES_COLLECTION_ID,
        ID.unique(),
        course
      );
      setCourses((courses) => [response, ...courses].slice(0, 10));
      return response;
    } catch (err) {
      console.log(err); // handle error or show user a message
    }
  }

  async function remove(id) {
    try {
      await databases.deleteDocument(
        COURSES_DATABASE_ID,
        COURSES_COLLECTION_ID,
        id
      );
      setCourses((courses) => courses.filter((course) => course.$id !== id));
      await init();
    } catch (err) {
      console.log(err);
    }
  }

  async function getCourseByAuthorId(authorId) {
    try {
      const response = await databases.listDocuments(
        COURSES_DATABASE_ID,
        COURSES_COLLECTION_ID,
        [Query.equal("author_id", authorId)]
      );

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function init() {
    try {
      const response = await databases.listDocuments(
        COURSES_DATABASE_ID,
        COURSES_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
      setCourses(response.documents);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <CoursesContext.Provider
      value={{ current: courses, add, remove, getCourseByAuthorId }}
    >
      {props.children}
    </CoursesContext.Provider>
  );
}
