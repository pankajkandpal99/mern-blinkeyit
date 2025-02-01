import { useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { IoClose } from "react-icons/io5";
// import { useMobile } from "../hooks/useMobile";
// import { useEffect } from "react";

const UserMobileMenuPage = () => {
  const navigate = useNavigate();
  // const [isMobile] = useMobile(); // Custom hook for detecting mobile view

  // useEffect(() => {
  //   if (!isMobile) {
  //     navigate(-1); // Or use window.location.reload() to reload the page
  //   }
  // }, [isMobile, navigate]);

  // if (!isMobile) return null;

  return (
    <section className="bg-white border py-4 px-3 relative">
      <button
        className="absolute right-4 top-4 p-1 text-gray-600 hover:text-red-500 
        transition-colors focus:outline-none rounded-full hover:bg-gray-200 
        active:bg-gray-300 shadow-sm"
        aria-label="Close"
        // onClick={() => window.history.back()}
        onClick={() => {
          return navigate(-1);
        }} // go to previous page
      >
        <IoClose size={26} />
      </button>

      <div className="container mx-auto">
        <UserMenu />
      </div>
    </section>
  );
};

export default UserMobileMenuPage;
