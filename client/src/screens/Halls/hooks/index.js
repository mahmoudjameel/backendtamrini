import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useHallsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getHalls = async () => {
    try {
      let response = await axios.post("/api/halls/get", { type: 1 });
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      console.log(data);
      return data.halls;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteHall = async (_id) => {
    try {
      let response = await axios.post("/api/halls/delete", {
        _id,
        type: 1,
      });
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

  const addHall = async (formRef) => {
    try {
      let hallData = new FormData(formRef.current);
      console.log(hallData.get("name"));

      let subscriptions = hallData.get("subscriptions"),
        name = hallData.get("name"),
        city = hallData.get("city"),
        brief = hallData.get("brief"),
        lng = hallData.get("lng"),
        lat = hallData.get("lat"),
        images = hallData.get("images");
      //Manibulate subscriptions
      subscriptions = subscriptions.split("\n");
      subscriptions = subscriptions.map((s) => ({
        name: s.split(",")[1],
        price: s.split(",")[0],
      }));
      hallData.set("subscriptions", JSON.stringify(subscriptions));

      let location = { lng: lng, lat: lat };
      hallData.location = location;

      let response = await axios.post("/api/halls/add", hallData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.hall;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editHall = async (formRef) => {
    try {
      let hallData = new FormData(formRef.current);

      let response = await axios.post("/api/halls/edit", hallData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.hall;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getHalls,
    deleteHall,
    addHall,
    editHall,
  };
};

export default useHallsHook;
