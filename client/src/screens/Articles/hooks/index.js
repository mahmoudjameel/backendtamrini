import axios from "axios";
import { useNotifierContext } from "../../../providers";

const useArticlesHook = () => {
  const { setNotifiers } = useNotifierContext();

  const getArticles = async () => {
    try {
      let response = await axios.post("/api/articles/get");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      return data.articles;
    } catch (e) {
      alert(e.message);
    }
  };

  /******************************************************/

  const deleteArticle = async (_id) => {
    try {
      let response = await axios.post("/api/articles/delete", { _id });
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

  const addArticle = async (formRef) => {
    try {
      let articleData = new FormData(formRef.current);

      let response = await axios.post("/api/articles/add", articleData);
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.article;
    } catch (e) {
      alert(e.message);
    }
  };
  /******************************************************/

  const editArticle = async (formRef) => {
    try {

      let articleData = new FormData(formRef.current);

      let response = await axios.post("/api/articles/edit", articleData);
      let data = await response.data;

      console.log(data);
      if (!data.status) {
        setNotifiers({ errors: data.errors });
        return false;
      }
      setNotifiers({ success: data.messages });
      return data.article;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    getArticles,
    deleteArticle,
    addArticle,
    editArticle,
  };
};

export default useArticlesHook;
