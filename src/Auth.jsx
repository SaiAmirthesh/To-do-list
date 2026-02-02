import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth({ setSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirm: false, 
          }
        }
      });

      if (error) {
        alert(`Sign up error: ${error.message}`);
        console.error("Sign up error:", error);
      } else {
        console.log("Sign up response:", data);
        if (data.user) {
          if (data.user.email_confirmed_at) {
            alert("Signup successful! You can now sign in.");
            if (data.session) {
              setSession(data.session);
              alert("Automatically signed in!");
            }
          } else {
            alert("Signup successful! Go to Supabase Dashboard → Authentication → Users → Find your email → Click 'Confirm user' to enable sign in.");
          }
        }
      }
    } catch (err) {
      alert(`Unexpected error: ${err.message}`);
      console.error("Sign up exception:", err);
    }
    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    try {
      console.log("Attempting sign in with:", { email, password: "***" });

      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Current session before sign in:", sessionData);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in response:", {
        user: data?.user ? "exists" : null,
        session: data?.session ? "exists" : null,
        error: error?.message
      });

      if (error) {
        alert(`Sign in error: ${error.message}`);
        console.error("Sign in error details:", error);

        // If invalid credentials, let's try to see if the user exists
        if (error.message.includes("Invalid login credentials")) {
          console.log("User might not exist or email not confirmed. Checking user status...");
        }
      } else if (data.session) {
        setSession(data.session);
        console.log("Signin successful")
      } 
    } catch (err) {
      alert(`Unexpected error: ${err.message}`);
      console.error("Sign in exception:", err);
    }
    setLoading(false);
  };


  return (
    <div className="w-screen h-screen bg-linear-to-br from-rose-500 via-rose-600 to-rose-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-rose-500 mb-8">
          Login / Signup
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 text-black"
          />

          <div className="flex gap-3 pt-4">
            <button
              onClick={signIn}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>

            <button
              onClick={signUp}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
