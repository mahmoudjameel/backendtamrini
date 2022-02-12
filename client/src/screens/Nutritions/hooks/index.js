import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useNutritionMethodsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getNutritionMethods = async () => {
    try {
      let response = await axios.post("/api/nutritions/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.nutritions;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteNutritionMethod = async (_id) => {
    try {
      let response = await axios.post("/api/nutritions/delete", { _id });
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

  const addNutritionMethod = async (formRef) => {
    try {
      let nutritionMethodData = new FormData(formRef.current);

      console.log(formRef.current)
      let response = await axios.post(
        "/api/nutritions/add",
        nutritionMethodData
      );
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.nutrition;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editNutritionMethod = async (formRef) => {
    try {
      let nutritionMethodData = new FormData(formRef.current);

      let response = await axios.post(
        "/api/nutritions/edit",
        nutritionMethodData
      );
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.nutrition;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getNutritionMethods,
    deleteNutritionMethod,
    addNutritionMethod,
    editNutritionMethod,
  };
};

export default useNutritionMethodsHook;
