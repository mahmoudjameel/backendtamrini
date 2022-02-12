import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useAdvertisementsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getAdvertisement = async () => {
    try {
      let response = await axios.post("/api/advertisements/get");
      let data = await response.data;
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.advertisements;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteAdvertisement = async _id => {
    try {
      let response = await axios.post("/api/advertisements/delete", { _id });
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

  const addAdvertisement = async formRef => {
    try {
      let productData = new FormData(formRef.current);

      let response = await axios.post("/api/advertisements/add", productData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.advertisement;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editAdvertisement = async formRef => {
    try {
      let productData = new FormData(formRef.current);

      let response = await axios.post("/api/advertisements/edit", productData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.advertisement;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getAdvertisement,
    deleteAdvertisement,
    addAdvertisement,
    editAdvertisement
  };
};

export default useAdvertisementsHook;
