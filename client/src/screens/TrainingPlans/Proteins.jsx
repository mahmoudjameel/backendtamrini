import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useProteinsHook from "./hooks/index";

//Styles
import "./style.scss";

const Proteins = () => {
  const {
    getProteins,
    deleteProtein,
    addProtein,
    editProtein,
  } = useProteinsHook();

  const [proteins, setProteins] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [proteinObj, setProteinObj] = useState({
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
      const result = await getProteins();

      if (result) {
        setProteins(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setProteinObj({
        _id: 0,
        title: "",
        content: "",
        mainImage: "",
        createDate: "",
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const protein = proteins.find((u) => u._id === _id);
    setProteinObj(protein);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setProteinObj(proteins.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / البروتينات</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف المقالة رقم ${proteinObj._id}`}
        onDelete={async () => {
          if (await deleteProtein(proteinObj._id)) {
            setProteins(proteins.filter((u) => u._id !== proteinObj._id));
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
            const protein = await addProtein(addFormRef);
            if (protein) {
              setProteins([...proteins, protein]);
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
                setProteinObj({ ...proteinObj, title: e.target.value }),
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
                setProteinObj({ ...proteinObj, content: e.target.value }),
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

              onChange: (e) =>
                setProteinObj({ ...proteinObj, mainImage: e.target.files[0] }),
            },
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل المستخدم رقم ${proteinObj._id}`,
          onSave: async () => {
            const result = await editProtein(editFormRef);
            if (result) {
              setProteins(
                proteins.map((u) => (u._id === result._id ? result : u))
              );
              setEditBoxVisible(false);
            }
          },
          saveBtn: "تعديل",
          formRef: editFormRef,
        }}
        inputs={[
          {
            tag: "input",
            props: {
              type: "hidden",
              value: proteinObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "عنوان المقال",
            props: {
              type: "text",
              value: proteinObj.title,
              name: "title",
              placeholder: "عنوان المقال",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setProteinObj({ ...proteinObj, title: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: "محتوي المقال",
            props: {
              type: "text",
              value: proteinObj.content,
              name: "content",
              placeholder: "محتوي المقال",
              required: true,
              onChange: (e) =>
                setProteinObj({ ...proteinObj, content: e.target.value }),
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
              onChange: (e) =>
                setProteinObj({
                  ...proteinObj,
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
          <h6>البروتينات</h6>
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
              "اسم البروتين",
              "وصف البروتين",
              "تاريخ الإضافة",
            ]}
            data={
              proteins &&
              proteins.map((u) => [
                u._id,
                { type: "img", src: u.mainImage },
                u.name,
                u.description,
                u.createDate,
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default Proteins;
