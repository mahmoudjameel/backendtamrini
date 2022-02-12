import axios from "axios";
import { useNotifierContext } from "../../../providers";

const usePaymentMethodsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getPaymentMethods = async () => {
    try {
      let response = await axios.post("/api/paymentMethods/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.paymentMethods;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deletePaymentMethod = async (_id) => {
    try {
      let response = await axios.post("/api/paymentMethods/delete", { _id });
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

  const addPaymentMethod = async (formRef) => {
    try {
      let paymentMethodData = new FormData(formRef.current);

      console.log(formRef.current)
      let response = await axios.post(
        "/api/paymentMethods/add",
        paymentMethodData
      );
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.paymentMethod;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editPaymentMethod = async (formRef) => {
    try {
      let paymentMethodData = new FormData(formRef.current);

      let response = await axios.post(
        "/api/paymentMethods/edit",
        paymentMethodData
      );
      let data = await response.data;

      console.log(data);
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.paymentMethod;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getPaymentMethods,
    deletePaymentMethod,
    addPaymentMethod,
    editPaymentMethod,
  };
};

export default usePaymentMethodsHook;
