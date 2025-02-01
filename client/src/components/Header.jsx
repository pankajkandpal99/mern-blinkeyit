import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Search from "./Search";
import { FaRegCircleUser } from "react-icons/fa6";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useMobile } from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserMenu from "./UserMenu";
import CartSummary from "./CartSummary";
import CartDetail from "./CartDetail";

const Header = () => {
  const navigate = useNavigate();
  const [isMobile] = useMobile();
  const { pathname } = useLocation();
  const isSearchPage = pathname === "/search";
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);

  const loginHandler = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    // if (!user?._id) {
    //   navigate("/login");
    //   return;
    // }

    if (pathname === "/user") return;
    navigate("/user");
  };

  return (
    <header className="h-24 lg:h-20 lg:px-5 lg:shadow-md sticky top-0 flex flex-col items-center justify-center gap-2 bg-white z-50">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center justify-between px-2">
          <Link to="/" className="h-full">
            <div className="h-full flex justify-center items-center">
              <img
                src={logo}
                alt="logo"
                width={170}
                height={60}
                className="hidden lg:block"
              />
              <img
                src={logo}
                alt="logo"
                width={120}
                height={60}
                className="lg:hidden"
              />
            </div>
          </Link>

          <div className="hidden lg:block">
            <Search />
          </div>

          <div className="">
            {/* user icons display in only mobile version */}
            <button
              className="text-neutral-600 lg:hidden hover:text-gray-500"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={25} />
            </button>

            {/* user icons display in only desktop version */}
            <div className="hidden lg:flex items-center gap-10">
              {user._id ? (
                <div className="relative">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setOpenUserMenu((prevValue) => !prevValue)}
                  >
                    <p className="">Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>

                  {openUserMenu && (
                    <div className="absolute right-0 top-12 shadow-lg">
                      <div className="bg-white rounded p-4 min-w-52">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={loginHandler}
                  className="text-lg px-2 hover:text-blue-600"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 text-gray-100 rounded"
              >
                <CartSummary />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* for mobile */}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {openCartSection && (
        <CartDetail close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
