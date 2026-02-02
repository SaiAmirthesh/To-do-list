import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import TodoList from "./TodoList";
import Profile from "./Profile";

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState("todos");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const renderView = () => {
    if (view === "todos") {
      return <TodoList onGoToProfile={() => setView("profile")} />;
    } else if (view === "profile") {
      return <Profile onBack={() => setView("todos")} />;
    }
  };

  return (
    <div>
      {!session ? (
        <Auth setSession={setSession} />
      ) : (
        renderView()
      )}
    </div>
  );
}

export default App;
