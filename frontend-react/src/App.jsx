import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostForm from "./pages/PostForm";
import SavedPosts from "./pages/SavedPosts";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/post/:id"    element={<PostDetail />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/new-post"    element={<PostForm />} />
        <Route path="/edit/:id"    element={<PostForm />} />
        <Route path="/saved"       element={<SavedPosts />} />
      </Routes>
    </>
  );
};

export default App;
