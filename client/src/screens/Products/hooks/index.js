import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useProductsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getCategories = async () => {
    try {
      let response = await axios.post("/api/product-categories/get");
      let data = await response.data;

      if (!data.status) {
        // setNotifiers({ errors: data.errors });
        return false;
      }
      return data.products;
    } catch (e) {
      alert(e.message);
    }
  };

  const getProducts = async () => {
    try {
      let response = await axios.post("/api/products/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.products;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteProduct = async _id => {
    try {
      let response = await axios.post("/api/products/delete", { _id });
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

  const addProduct = async formRef => {
    try {
      let productData = new FormData(formRef.current);

      let response = await axios.post("/api/products/add", productData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.product;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editProduct = async formRef => {
    try {
      let productData = new FormData(formRef.current);

      let response = await axios.post("/api/products/edit", productData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.product;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getProducts,
    deleteProduct,
    addProduct,
    editProduct,
    getCategories
  };
};

export default useProductsHook;
