import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useUsersHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getUsers = async () => {
    try {
      let response = await axios.post("/api/users/get");
      let data = await response.data;

      if (!data.status) return setNotifiers({ errors: data.errors });
      return data.users;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteUser = async (_id) => {
    try {
      let response = await axios.post("/api/users/delete", { _id });
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return true;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const addUser = async (user = {}) => {
    try {
      let response = await axios.post("/api/users/register", user);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.user;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editUser = async (user = {}) => {
    try {
      let response = await axios.post("/api/users/edit", user);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.user;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getUsers,
    deleteUser,
    addUser,
    editUser,
  };
};

export default useUsersHook;
