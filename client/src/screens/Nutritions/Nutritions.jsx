import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useNutritionMethodsHook from "./hooks/index";

//Styles
import "./style.scss";

const NutritionMethods = () => {
  const {
    getNutritionMethods,
    deleteNutritionMethod,
    addNutritionMethod,
    editNutritionMethod,
  } = useNutritionMethodsHook();

  const [nutritionMethods, setNutritionMethods] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [nutritionMethodObj, setNutritionMethodObj] = useState({
    _id: 0,
    name: "",
    protein: 0,
    fat: 0,
    energy: 0,
    carbs: 0
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getNutritionMethods();

      if (result) {
        setNutritionMethods(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setNutritionMethodObj({
        _id: 0,
        name: "",
        protein: 0,
        fat: 0,
        energy: 0,
        carbs: 0
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const nutritionMethod = nutritionMethods.find((u) => u._id === _id);
    setNutritionMethodObj(nutritionMethod);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setNutritionMethodObj(nutritionMethods.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / القيم الغذائية</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف الأكلة رقم ${nutritionMethodObj._id}`}
        onDelete={async () => {
          if (await deleteNutritionMethod(nutritionMethodObj._id)) {
            setNutritionMethods(
              nutritionMethods.filter((u) => u._id !== nutritionMethodObj._id)
            );
            setDeleteBoxVisible(false);
          }
        }}
      />
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة اكلة جديدة",
          onSave: async () => {
            const nutritionMethod = await addNutritionMethod(addFormRef);
            if (nutritionMethod) {
              setNutritionMethods([...nutritionMethods, nutritionMethod]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "اضافة",
          formRef: addFormRef,
        }}
        inputs={[
          {
            tag: "input",
            label: "الاسم",
            props: {
              type: "text",
              name: "name",
              placeholder: "الاسم",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  name: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "البروتينات",
            props: {
              type: "number",
              name: "protein",
              placeholder: "البروتينات",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  protein: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الطاقة",
            props: {
              type: "number",
              name: "energy",
              placeholder: "الطاقة",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  energy: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الدهون",
            props: {
              type: "number",
              name: "fat",
              placeholder: "الدهون",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  fat: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الكربوهيدرات",
            props: {
              type: "text",
              name: "carbs",
              placeholder: "الكربوهيدرات",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  carbs: e.target.value,
                }),
            },
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          name: `تعديل الأكلة رقم ${nutritionMethodObj._id}`,
          onSave: async () => {
            const result = await editNutritionMethod(editFormRef);
            if (result) {
              setNutritionMethods(
                nutritionMethods.map((u) => (u._id === result._id ? result : u))
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
              value: nutritionMethodObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "الاسم",
            props: {
              type: "text",
              value: nutritionMethodObj.name,
              name: "name",
              placeholder: "الاسم",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  name: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "البروتينات",
            props: {
              type: "number",
              value: nutritionMethodObj.protein,
              name: "protein",
              placeholder: "البروتينات",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  protein: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الطاقة",
            props: {
              type: "number",
              value: nutritionMethodObj.energy,
              name: "energy",
              placeholder: "الطاقة",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  energy: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الدهون",
            props: {
              type: "number",
              value: nutritionMethodObj.fat,
              name: "fat",
              placeholder: "الدهون",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  fat: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الكربوهيدرات",
            props: {
              type: "text",
              value: nutritionMethodObj.carbs,
              name: "carbs",
              placeholder: "الكربوهيدرات",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNutritionMethodObj({
                  ...nutritionMethodObj,
                  carbs: e.target.value,
                }),
            },
          },
        ]}
      />
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>القيم الغذائية</h6>
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
            headers={["#", "الاسم", "البروتينات", "الطاقة", "الدهون", "الكربوهيدرات"]}
            data={
              nutritionMethods &&
              nutritionMethods.map((u) => [
                u._id,
                u.name,
                u.protein,
                u.energy,
                u.fat,
                u.carbs,
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default NutritionMethods;
