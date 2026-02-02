import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Button from "./components/Button";
import Navbar from "./components/Navbar";

const Profile = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
    website: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      fetchProfile(data.user.id);
    });
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is no rows
      console.error("Fetch profile error:", error);
    } else if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        website: profile.website,
      });

    if (error) {
      console.error("Save profile error:", error);
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile saved!");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-rose-500 via-rose-600 to-rose-500 flex items-center justify-center pt-20 pb-4 px-4">
        <Navbar onGoToProfile={() => {}} />
        <div className="w-full mt-14 max-w-md bg-gray-800 rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-center mb-6">
            <span
              onClick={onBack}
              className="text-3xl mr-2 cursor-pointer hover:text-rose-300 transition"
            >
              👤
            </span>
            <h1 className="text-3xl font-bold text-rose-500">
              Profile
            </h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-700 text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                value={profile.avatar_url}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 text-white"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={saveProfile}
              disabled={saving}
              className="w-full px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-200 mb-2"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={onBack}
              className="w-full px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;