import { Link, useSearchParams } from "react-router-dom";
import logo from "/quiyt-new-logo.png";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();

  console.log(user);

  useEffect(() => {
    if (searchParams.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [searchParams]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setShowSignIn(false);
      setSearchParams({});
    }
  };

  return (
    <div className="py-1 px-12 flex justify-between items-center fixed z-10 bg-white w-full">
      <div>
        <Link to="/">
          <img src={logo} alt="Quiyt Logo" className="md:w-28 rounded" />
        </Link>
      </div>
      <div className="flex gap-8 items-center">
        <ul className="flex gap-8">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/create-course">Create Course</Link>
          <Link to="/courses">My Courses</Link>
        </ul>
        <div>
          <SignedOut>
            <Button
              variant="default"
              className=""
              onClick={() => setShowSignIn(true)}
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
          onClick={handleOverlayClick}
        >
          <SignIn />
        </div>
      )}
    </div>
  );
};

export default Navbar;
