import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useImageExercisesHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getImageExercises = async () => {
    try {
      let response = await axios.post("/api/home-exercise/get", { type: 1 });
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      console.log(data);
      return data.exercises;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteImageExercise = async (_id) => {
    try {
      let response = await axios.post("/api/home-exercise/delete", {
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

  const addImageExercise = async (formRef) => {
    try {
      let imageExerciseData = new FormData(formRef.current);

      let response = await axios.post(
        "/api/home-exercise/add",
        imageExerciseData
      );
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.exercise;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editImageExercise = async (formRef) => {
    try {
      let imageExerciseData = new FormData(formRef.current);
      imageExerciseData.set("type", 1);
      let response = await axios.post(
        "/api/home-exercise/edit",
        imageExerciseData
      );
      let data = await response.data;

      console.log(data);
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.exercise;
    } catch (e) {
      alert(e.message);
    }
  };

  const getCategories = async () => {
    try {
      let response = await axios.post("/api/home-exercise-categories/get");
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

  return {
    getImageExercises,
    deleteImageExercise,
    addImageExercise,
    editImageExercise,
    getCategories,
  };
};

export default useImageExercisesHook;
