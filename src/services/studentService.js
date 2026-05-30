import API from "./api";

export const getStudents = async () => {
  const token = localStorage.getItem("token");

  return API.get("/students", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addStudent = async (data) => {
  const token = localStorage.getItem("token");

  return API.post(
    "/students",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteStudent = async (id) => {
  const token = localStorage.getItem("token");

  return API.delete(
    `/students/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateStudent = async (id, data) => {
  const token = localStorage.getItem("token");

  return API.put(
    `/students/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};