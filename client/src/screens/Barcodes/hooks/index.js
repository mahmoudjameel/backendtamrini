import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useArticlesHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getBarcodes = async () => {
    try {
      let response = await axios.post("/api/barcodes/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.barcodes;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteBarcode = async (_id) => {
    try {
      let response = await axios.post("/api/barcodes/delete", { _id });
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

  const addBarcode = async (formRef) => {
    try {
      let barcodeData = new FormData(formRef.current);

      let response = await axios.post("/api/barcodes/add", barcodeData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.barcode;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editBarcode = async (formRef) => {
    try {
      let barcodeData = new FormData(formRef.current);

      console.log(formRef.current);

      let response = await axios.post("/api/barcodes/edit", barcodeData);
      let data = await response.data;

      console.log(data);
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.barcode;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getBarcodes: getBarcodes,
    deleteBarcode: deleteBarcode,
    addBarcode: addBarcode,
    editBarcode: editBarcode,
  };
};

export default useArticlesHook;
