import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useDietsHook from "./hooks/index";

//Styles
import "./style.scss";

const Diets = () => {
  const {
    getDiets,
    deleteDiet,
    addDiet,
    editDiet,
  } = useDietsHook();

  const [diets, setDiets] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [dietObj, setdietObj] = useState({
    _id: 0,
    name: "",
    ingredients: "",
    preparation:"",
    foodValue:"",
    images: [],
    createDate: "",
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getDiets();

      if (result) {
        setDiets(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setdietObj({
        _id: 0,
        name: "",
        ingredients: "",
        mainImage: "",
        createDate: "",
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const article = diets.find((u) => u._id === _id);
    setdietObj(article);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setdietObj(diets.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم/ اكلات دايت</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف المقالة رقم ${dietObj._id}`}
        onDelete={async () => {
          console.log("cccccccc " + addFormRef)
          if (await deleteDiet(dietObj._id)) {
            setDiets(diets.filter((u) => u._id !== dietObj._id));
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
            console.log(addFormRef)
            const diet = await addDiet(addFormRef);
            if (diet) {
              setDiets([...diets, diet]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "اضافة",
          formRef: addFormRef,
        }}
        inputs={[
          {
            tag: "input",
            label: "اسم الاكلة ",

            props: {
              type: "text",
              name: "name",
              maxLength: 100,
              placeholder: " اسم الاكلة",
              required: true,
              onChange: (e) =>
                setdietObj({ ...dietObj, name: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: " المكونات",
            props: {
              type: "text",
              name: "ingredients",
              placeholder: " المكونات",
              required: true,

              onChange: (e) =>
                setdietObj({ ...dietObj, ingredients: e.target.value }),
            },
          },

          {
            tag: "textarea",
            label: " طريقة التحضير",
            props: {
              type: "text",
              name: "preparation",
              placeholder: " طريقة التحضير",
              required: true,

              onChange: (e) =>
                setdietObj({ ...dietObj, preparation: e.target.value }),
            },
          },
          
          {
            tag: "textarea",
            label: " القيمة الغذائية",
            props: {
              type: "text",
              name: "foodValue",
              placeholder: " القيمة الغذائية",
              required: true,

              onChange: (e) =>
                setdietObj({ ...dietObj, foodValue: e.target.value }),
            },
          },

          {
            tag: "input",
            label: "الصور",
            props: {
              type: "file",
              accept: ".jpg, .png, .jpeg",
              name: "images",
              placeholder: "الصور",
              multiple: true,
              required: true,

              onChange: (e) =>
                setdietObj({
                  ...dietObj,
                  images: e.target.files,
                }),
            },
          },
          
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل الاكلة رقم ${dietObj._id}`,
          onSave: async () => {
            const result = await editDiet(editFormRef);
            if (result) {
              setDiets(
                diets.map((u) => (u._id === result._id ? result : u))
              );
              setEditBoxVisible(false);
            }
          },
          saveBtn: "تعديل",
          formRef: editFormRef,
          images: dietObj.mainImage,
        }}
        inputs={[
          {
            tag: "input",
            props: {
              type: "hidden",
              value: dietObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "اسم الاكلة ",
            props: {
              type: "text",
              value: dietObj.name,
              name: "name",
              placeholder: " اسم الاكلة",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setdietObj({ ...dietObj, name: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: " المكونات",
            props: {
              type: "text",
              value: dietObj.ingredients,
              name: "ingredients",
              placeholder: "المكونات ",
              required: true,
              onChange: (e) =>
                setdietObj({ ...dietObj, ingredients: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: " طريقة التحضير",
            props: {
              type: "text",
              value: dietObj.preparation,
              name: "preparation",
              placeholder: "طريقة التحضير ",
              required: true,
              onChange: (e) =>
                setdietObj({ ...dietObj, preparation: e.target.value }),
            },
          },

          {
            tag: "textarea",
            label: " القيمة الغذائية",
            props: {
              type: "text",
              value: dietObj.foodValue,
              name: "foodValue",
              placeholder: "القيمة الغذائية ",
              required: true,
              onChange: (e) =>
                setdietObj({ ...dietObj, foodValue: e.target.value }),
            },
          },

          {
            tag: "input",
            label: "الصور ",
            props: {
              type: "file",
              accept: ".jpg, .png, .jpeg",
              placeholder: "الصورة المصغرة",
              name: "images",
              multiple: true,
              onChange: (e) =>
                setdietObj({
                  ...dietObj,
                  images: URL.createObjectURL(e.target.files[0]),
                }),
            },
          },
        ]}
      />
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6> اكلات دايت</h6>
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
              "اسم الاكلة",
              " الصور",
              " المكونات",
        
              "طريقة التحضير",
              "القيمة الغذائية",
              
              "تاريخ الإضافة",
            ]}
            data={
              diets &&
              diets.map((u) => [
                u._id,
                u.name,
                { type: "slider", images: u.images },
                u.ingredients,
                u.preparation,
                u.foodValue,
                u.createDate,
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default Diets;
