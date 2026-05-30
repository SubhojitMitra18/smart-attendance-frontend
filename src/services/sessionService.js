import API from "./api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getActiveSessions = async () => {
  return API.get(
    "/sessions/active",
    getAuthHeader()
  );
};

export const startSession = async (data) => {
  return API.post(
    "/sessions/start",
    data,
    getAuthHeader()
  );
};

export const endSession = async (id) => {
  return API.put(
    `/sessions/end/${id}`,
    {},
    getAuthHeader()
  );
};