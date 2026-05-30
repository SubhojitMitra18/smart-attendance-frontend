import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";


function TeacherLogin() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/teacher/dashboard");
    }
  }, [navigate]);


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post(
        "/teachers/login",
        formData
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "teacher",
        JSON.stringify({
          id: res.data.teacher._id,
          name: res.data.teacher.name,
          email: res.data.teacher.email,
        })
      );


      alert("Login Successful");

      navigate("/teacher/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Teacher Login
        </h1>


        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4"
          required
        />


        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4"
          required
        />


        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >

          {
            loading
              ? "Logging In..."
              : "Login"
          }

        </button>

      </form>

    </div>
  );
}

export default TeacherLogin;