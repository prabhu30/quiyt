import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="mt-44 flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-6xl">Experience distraction-free learning</h1>
        <p className="text-xl w-2/3 mt-8 text-center mx-auto">
          Make a course with your own choice of youtube videos and kickstart
          your learning journey.
        </p>
        <Link to="/create-course" className="mx-auto mt-6">
          <Button className="p-6 text-lg hover:bg-slate-300 hover:text-black">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
