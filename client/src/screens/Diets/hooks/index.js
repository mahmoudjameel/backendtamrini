import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useDietsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getDiets = async () => {
    try {
      let response = await axios.post("/api/diets/get");
      let data = await response.data;

      console.log(data);
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.diets;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteDiet = async (_id) => {
    try {
      let response = await axios.post("/api/diets/delete", { _id });
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

  const addDiet = async (formRef) => {
    try {
      let dietData = new FormData(formRef.current);

      console.log("vvvvvvvvvvvvvvvvvvvvvvvvv");
      console.log(dietData.get("name"));

      let name = dietData.get("name"),
        ingredients = dietData.get("ingredients"),
        preparation = dietData.get("preparation"),
        foodValue = dietData.get("foodValue"),
        images = dietData.get("images");

      console.log(name);
      let response = await axios.post("/api/diets/add", dietData);
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

    // try {
    //   let articleData = new FormData(formRef.current);

    //   let response = await axios.post("/api/articles/add", articleData);
    //   let data = await response.data;

    //   if (!data.status) {
    //     setNotifiers({ errors: data.errors });
    //     return false;
    //   }
    //   setNotifiers({ success: data.messages });
    //   return data.article;
    // } catch (e) {
    //   alert(e.message);
    // }
  };
  /******************************************************/

  const editDiet = async (formRef) => {
    try {
      let dietData = new FormData(formRef.current);

      let response = await axios.post("/api/diets/edit", dietData);
      let data = await response.data;
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.diet;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getDiets,
    deleteDiet,
    addDiet,
    editDiet,
  };
};

export default useDietsHook;
