import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useNotificationsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getNotifications = async () => {
    try {
      let response = await axios.post("/api/articles/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.articles;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteNotification = async (_id) => {
    try {
      let response = await axios.post("/api/articles/delete", { _id });
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

  const sendNotification = async (formRef) => {
    try {
      let notificationData = new FormData(formRef.current);

      let response = await axios.post(
        "/api/notifications/send",
        notificationData
      );
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editNotification = async (formRef) => {
    try {
      let articleData = new FormData(formRef.current);

      let response = await axios.post("/api/articles/edit", articleData);
      let data = await response.data;

      console.log(data);
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.article;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getNotification: getNotifications,
    deleteNotification: deleteNotification,
    sendNotification: sendNotification,
    editNotification: editNotification,
  };
};

export default useNotificationsHook;
