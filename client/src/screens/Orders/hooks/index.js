import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useOrdersHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getOrders = async () => {
    try {
      let response = await axios.post("/api/orders/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.orders;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteOrder = async (_id) => {
    try {
      let response = await axios.post("/api/orders/delete", { _id });
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

  const addOrder = async (formRef) => {
    try {
      let orderData = new FormData(formRef.current);

      let response = await axios.post("/api/orders/add", orderData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.order;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editOrder = async (formRef) => {
    try {

      let orderData = new FormData(formRef.current);

      let response = await axios.post("/api/orders/edit", orderData);
      let data = await response.data;

      console.log(data);
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.order;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getOrders,
    deleteOrder,
    addOrder,
    editOrder,
  };
};

export default useOrdersHook;
