import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useDietsHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getQuestions = async () => {
    try {
      let response = await axios.post("/api/questions/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.questions;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteQuestion = async (_id) => {
    try {
      let response = await axios.post("/api/questions/delete", { _id });
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

  const deleteAnswer = async (answer) => {
    // console.log(answer);
    try {
      let response = await axios.post("/api/questions/deleteAnswer", answer);
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

  return {
    getQuestions: getQuestions,
    deleteQuestion: deleteQuestion,
    deleteAnswer,
  };
};

export default useDietsHook;
