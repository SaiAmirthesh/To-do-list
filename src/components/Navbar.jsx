import { supabase } from "../supabaseClient";
import logo from "../assets/checklist-DZsA-jFO.png";

function Navbar({ onGoToProfile }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="top-0 left-0 fixed p-10 w-full h-14 bg-gray-800 flex items-center justify-between px-6">
      {/* App Title */}
      <img src={logo} alt="logo" className="w-14 h-14"/>
      <h1 className="text-rose-500 font-bold text-lg ">
        Todo App
      </h1>

      {/* Profile and Logout Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGoToProfile}
          className="text-rose-500 text-2xl m-3 cursor-pointer hover:text-rose-300 transition"
        >
          👤
        </button>
        <button
          onClick={handleLogout}
          className="bg-rose-500 text-black px-4 cursor-pointer py-1.5 rounded-md font-medium hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
