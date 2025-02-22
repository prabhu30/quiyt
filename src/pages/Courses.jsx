import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCourses } from "@/store/courseSlice";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";

const Courses = () => {
  const { user, isLoaded } = useUser();

  const {
    courses: userCourses,
    isLoading: isLoadingCourses,
    error,
  } = useSelector((state) => state.courses);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleFetchCourses = async () => dispatch(getCourses(user.id));
    if (isLoaded) handleFetchCourses();
  }, [dispatch, isLoaded, user]);

  if (error !== null) {
    return (
      <div className="text-center">
        <h1 className="text-3xl my-6 font-semibold">
          Error while fetching courses
        </h1>
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoadingCourses || !isLoaded) {
    return <MoonLoader className="mt-8 mx-auto" />;
  }

  return (
    <div className="mt-6 px-12">
      <h1 className="text-center text-3xl font-semibold mb-8">Your Courses</h1>

      {userCourses.length === 0 ? (
        <div className="mt-28 text-center text-2xl text-amber-800">
          <p className="mb-1">You haven&apos;t created any courses!</p>
          <p className="mb-5">Create a course to get started.</p>
          <Link to="/create-course">
            <Button>Create Course</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap justify-start gap-y-8 gap-4">
          {userCourses?.map(({ $id, course_title, $createdAt }) => (
            <Card
              key={$id}
              className="text-center w-72 border-4 border-purple-300 bg-purple-200 rounded-md"
            >
              <img src="/video-icon.png" className="px-12 bg-white mx-auto" />
              <CardHeader>
                <CardTitle className="text-md sm:text-xl">
                  {course_title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <p className="text-sm">
                  <span className="font-medium">Created on :</span>{" "}
                  <span>{new Date($createdAt).toDateString()}</span>
                </p>
              </CardContent>
              <CardFooter className="">
                <Link to={`/course/${$id}`} className="mx-auto">
                  <Button className="px-6">Go to course</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
