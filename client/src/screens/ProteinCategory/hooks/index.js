import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useProductsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getProteins = async () => {
    try {
      let response = await axios.post("/api/protein-categories/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.proteinsCats;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deletePrtein = async _id => {
    try {
      let response = await axios.post("/api/protein-categories/delete", { _id });
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

  const addProtein = async formRef => {
    try {
      let productData = new FormData(formRef.current);

      let response = await axios.post("/api/protein-categories/add", productData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.proteinCat;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editProtein = async formRef => {
    try {
      let productData = new FormData(formRef.current);

      let response = await axios.post("/api/protein-categories/edit", productData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.proteinCat;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getProteins,
    deletePrtein,
    addProtein,
    editProtein
  };
};

export default useProductsHook;
