import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useArticlesHook from "./hooks/index";

//Styles
import "./style.scss";

const Articles = () => {
  const {
    getArticles,
    deleteArticle,
    addArticle,
    editArticle,
  } = useArticlesHook();

  const [articles, setArticles] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [articleObj, setArticleObj] = useState({
    _id: 0,
    title: "",
    content: "",
    mainImage: "",
    createDate: "",
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getArticles();

      if (result) {
        setArticles(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setArticleObj({
        _id: 0,
        title: "",
        content: "",
        mainImage: "",
        createDate: "",
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const article = articles.find((u) => u._id === _id);
    setArticleObj(article);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setArticleObj(articles.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / المقالات</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف المقالة رقم ${articleObj._id}`}
        onDelete={async () => {
          if (await deleteArticle(articleObj._id)) {
            setArticles(articles.filter((u) => u._id !== articleObj._id));
            setDeleteBoxVisible(false);
          }
        }}
      />
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة مقال جديد",
          onSave: async () => {
            const article = await addArticle(addFormRef);
            if (article) {
              setArticles([...articles, article]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "اضافة",
          formRef: addFormRef,
        }}
        inputs={[
          {
            tag: "input",
            label: "عنوان المقال",

            props: {
              type: "text",
              name: "title",
              maxLength: 100,
              placeholder: "عنوان المقال",
              required: true,
              onChange: (e) =>
                setArticleObj({ ...articleObj, title: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: "محتوي المقال",
            props: {
              type: "text",
              name: "content",
              placeholder: "محتوي المقال",
              required: true,

              onChange: (e) =>
                setArticleObj({ ...articleObj, content: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "الصورة المصغرة",
            props: {
              type: "file",
              accept: ".jpg, .png, .jpeg",
              name: "mainImage",
              placeholder: "الصورة المصغرة",
              required: true,
              multiple: true,

              onChange: (e) =>
                setArticleObj({ ...articleObj, mainImage: e.target.files[0] }),
            },
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل المقال رقم ${articleObj._id}`,
          onSave: async () => {
            const result = await editArticle(editFormRef);
            if (result) {
              setArticles(
                articles.map((u) => (u._id === result._id ? result : u))
              );
              setEditBoxVisible(false);
            }
          },
          saveBtn: "تعديل",
          formRef: editFormRef,
          images: articleObj.mainImage,
        }}
        inputs={[
          {
            tag: "input",
            props: {
              type: "hidden",
              value: articleObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "عنوان المقال",
            props: {
              type: "text",
              value: articleObj.title,
              name: "title",
              placeholder: "عنوان المقال",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setArticleObj({ ...articleObj, title: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: "محتوي المقال",
            props: {
              type: "text",
              value: articleObj.content,
              name: "content",
              placeholder: "محتوي المقال",
              required: true,
              onChange: (e) =>
                setArticleObj({ ...articleObj, content: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "الصورة المصغرة",
            props: {
              type: "file",
              accept: ".jpg, .png, .jpeg",
              placeholder: "الصورة المصغرة",
              name: "mainImage",
              multiple: true,
              onChange: (e) =>
                setArticleObj({
                  ...articleObj,
                  mainImage: URL.createObjectURL(e.target.files[0]),
                }),
            },
          },
        ]}
      />
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>المقالات</h6>
        </div>
        <div className="container">
          {/*<SearchBox />*/}
          <div className="add-new">
            <button
              className="btn-add-new"
              onClick={() => setAddBoxVisible(true)}
            >
              أضف جديد
            </button>
          </div>
          <Table
            actions={{
              edit: onClickEdit,
              delete: onClickDelete,
            }}
            headers={[
              "#",
              "الصورة المصغرة",
              "عنوان المقال",
              "محتوي المقال",
              "تاريخ الإضافة",
            ]}
            data={
              articles &&
              articles.map((u) => [
                u._id,
                { type: "slider", images: u.mainImage },
                u.title,
                u.content,
                u.createDate,
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default Articles;
