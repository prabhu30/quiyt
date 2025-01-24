import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCourses } from "@/lib/context/Courses";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const { user, isLoaded } = useUser();
  const courses = useCourses();
  const [userCourses, setUserCourses] = useState();

  useEffect(() => {
    const handleFetchCourses = async () => {
      const userCoursesRes = await courses.getCourseByAuthorId(user.id);
      console.log(userCoursesRes);
      setUserCourses(userCoursesRes?.documents);
    };

    if (isLoaded) {
      handleFetchCourses();
    }
  }, [courses, isLoaded]);

  return (
    <div className="mt-6">
      <h1 className="text-center text-3xl font-semibold mb-8">Your Courses</h1>
      {userCourses?.map(({ $id, course_title, $createdAt }) => (
        <Card
          key={$id}
          className="text-center w-fit border-4 border-purple-300 rounded-md"
        >
          <img src="/video-icon.png" className="w-48 mx-auto " />
          <CardHeader className="bg-purple-200">
            <CardTitle className="text-md sm:text-xl">{course_title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col bg-purple-200">
            <p className="text-sm">
              <span className="font-medium">Created on :</span>{" "}
              <span>{new Date($createdAt).toDateString()}</span>
            </p>
          </CardContent>
          <CardFooter className="bg-purple-200">
            <Link to={`/course/${$id}`} className="mx-auto">
              <Button className="px-6">Go to course</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Courses;
