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
    getCategories
  } = useProteinsHook();

  const [proteins, setProteins] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  const [proteinObj, setProteinObj] = useState({
    _id: 0,
    name: "",
    description: "",
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

      const protCatResult = await getCategories();
      if (protCatResult) {
        setCategories(protCatResult.map(category => ({ label: category.name, value: category._id })))
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setProteinObj({
        _id: 0,
        name: "",
        description: "",
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
        name={`حذف البروتينة رقم ${proteinObj._id}`}
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
          name: "اضافة مقال جديد",
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
            label: "اسم البروتين",

            props: {
              type: "text",
              name: "name",
              maxLength: 100,
              placeholder: "اسم البروتين",
              required: true,
              onChange: (e) =>
                setProteinObj({ ...proteinObj, name: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: "وصف البروتين",
            props: {
              type: "text",
              name: "description",
              placeholder: "وصف البروتين",
              required: true,

              onChange: (e) =>
                setProteinObj({ ...proteinObj, description: e.target.value }),
            },
          },
          {
            tag: "select",
            label: "القسم",
            props: {
              name: "categoryId",
              onChange: (e) => setProteinObj({ ...proteinObj, categoryId: e.target.value }),
            },
            options: categories,
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
                setProteinObj({ ...proteinObj, mainImage: e.target.files[0] }),
            },
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          name: `تعديل المستخدم رقم ${proteinObj._id}`,
          onSave: async () => {
            const result = await editProtein(editFormRef);
            console.log("result", result)
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
            label: "اسم البروتين",
            props: {
              type: "text",
              value: proteinObj.name,
              name: "name",
              placeholder: "اسم البروتين",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setProteinObj({ ...proteinObj, name: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: "وصف البروتين",
            props: {
              type: "text",
              value: proteinObj.description,
              name: "description",
              placeholder: "وصف البروتين",
              required: true,
              onChange: (e) =>
                setProteinObj({ ...proteinObj, description: e.target.value }),
            },
          },
          {
            tag: "select",
            label: "القسم",
            props: {
              value: proteinObj?.categoryId?._id,
              name: "categoryId",
              onChange: (e) => setProteinObj({ ...proteinObj, categoryId: e.target.value }),
            },
            options: categories,
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
              "القسم",
              "تاريخ الإضافة",
            ]}
            data={
              proteins &&
              proteins.map((u) => [
                u._id,
                { type: "slider", images: u.mainImage },
                u.name,
                u.description,
                u.categoryId?.name,
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
