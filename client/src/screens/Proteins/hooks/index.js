import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useProteinsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getProteins = async () => {
    try {
      let response = await axios.post("/api/proteins/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.proteins;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteProtein = async (_id) => {
    try {
      let response = await axios.post("/api/proteins/delete", { _id });
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

  const addProtein = async (formRef) => {
    try {
      let proteinData = new FormData(formRef.current);

      let response = await axios.post("/api/proteins/add", proteinData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.protein;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editProtein = async (formRef) => {
    try {

      let proteinData = new FormData(formRef.current);

      let response = await axios.post("/api/proteins/edit", proteinData);
      let data = await response.data;

      console.log(data);
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.protein;
    } catch (e) {
      alert(e.message);
    }
  };
  /*********************************************************/
  const getCategories = async () => {
    try {
      let response = await axios.post("/api/protein-categories/get");
      let data = await response.data;

      if (!data.status) {
        return false;
      }
      return data.proteinsCats;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getProteins,
    deleteProtein,
    addProtein,
    editProtein,
    getCategories
  };
};

export default useProteinsHook;
