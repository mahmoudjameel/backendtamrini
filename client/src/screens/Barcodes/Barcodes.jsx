import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useArticlesHook from "./hooks/index";

//Styles
import "./style.scss";

const Barcodes = () => {
  const {
     getBarcodes,
    deleteBarcode,
    addBarcode,
    editBarcode,
  } = useArticlesHook();

  const [barcodes, setBarcodes] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [barcodeObj, setBarcodeObj] = useState({
    _id: 0,
    name:"",
    code:"",
    type:"",
    protein: 0,
    fat: 0,
    energy: 0,
    carbs: 0,
    mainImage: "",
    createDate: "",
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getBarcodes();

      if (result) {
        setBarcodes(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setBarcodeObj({
        _id: 0,
        name:"",
        code:"",
        type:"",
        weight:0,
        protein: 0,
        fat: 0,
        energy: 0,
        carbs: 0,
        mainImage: "",
        createDate: "",
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const barcode = barcodes.find((u) => u._id === _id);
    setBarcodeObj(barcode);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setBarcodeObj(barcodes.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / البحث عن طريق الباركود</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف باركود رقم ${barcodeObj._id}`}
        onDelete={async () => {
          if (await deleteBarcode(barcodeObj._id)) {
            setBarcodes(barcodes.filter((u) => u._id !== barcodeObj._id));
            setDeleteBoxVisible(false);
          }
        }}
      />
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة باركود جديد",
          onSave: async () => {
            const article = await addBarcode(addFormRef);
            if (article) {
              setBarcodes([...barcodes, article]);
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
                setBarcodeObj({
                    ...barcodeObj,
                    name: e.target.value,
                  }),
              },
            },
            {
              tag: "input",
              label: "الباركود",
              props: {
                type: "text",
                name: "code",
                placeholder: "الباركود",
                required: true,
                maxLength: 100,
                onChange: (e) =>
                setBarcodeObj({
                    ...barcodeObj,
                    code: e.target.value,
                  }),
              },
            },

            {
              tag: "input",
              label: "نوع  الباركود",
              props: {
                type: "text",
                name: "type",
                placeholder: "نوع  الباركود",
                required: true,
                maxLength: 100,
                onChange: (e) =>
                setBarcodeObj({
                    ...barcodeObj,
                    type: e.target.value,
                  }),
              },
            },

            {
              tag: "input",
              label: "الوزن",
              props: {
                type: "number",
                name: "weight",
                placeholder: "الوزن",
                required: true,
                maxLength: 100,
                onChange: (e) =>
                setBarcodeObj({
                    ...barcodeObj,
                    weight: e.target.value,
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
                setBarcodeObj({
                    ...barcodeObj,
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
                setBarcodeObj({
                    ...barcodeObj,
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
                setBarcodeObj({
                    ...barcodeObj,
                    fat: e.target.value,
                  }),
              },
            },
            {
              tag: "input",
              label: "الكربوهيدرات",
              props: {
                type: "number",
                name: "carbs",
                placeholder: "الكربوهيدرات",
                required: true,
                maxLength: 100,
                onChange: (e) =>
                setBarcodeObj({
                    ...barcodeObj,
                    carbs: e.target.value,
                  }),
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
                setBarcodeObj({ ...barcodeObj, mainImage: e.target.files[0] }),
            },
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل باركود رقم ${barcodeObj._id}`,
          onSave: async () => {
            const result = await editBarcode(editFormRef);
            if (result) {
              setBarcodes(
                barcodes.map((u) => (u._id === result._id ? result : u))
              );
              setEditBoxVisible(false);
            }
          },
          saveBtn: "تعديل",
          formRef: editFormRef,
          images: barcodeObj.mainImage,
        }}
        inputs={[
          {
            tag: "input",
            props: {
              type: "hidden",
              value: barcodeObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "الاسم ",
            props: {
              type: "text",
              value: barcodeObj.name,
              name: "name",
              placeholder: " الاسم",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setBarcodeObj({ ...barcodeObj, name: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "الباركود ",
            props: {
              type: "text",
              value: barcodeObj.code,
              name: "code",
              placeholder: " الباركود",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setBarcodeObj({ ...barcodeObj, code: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "نوع الباركود ",
            props: {
              type: "text",
              value: barcodeObj.type,
              name: "type",
              placeholder: " نوع الباركود",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setBarcodeObj({ ...barcodeObj, type: e.target.value }),
            },
          },

          {
            tag: "input",
            label: "الوزن",
            props: {
              type: "number",
              value: barcodeObj.weight,
              name: "weight",
              placeholder: "الوزن",
              required: true,
              maxLength: 100,
              onChange: (e) =>
              setBarcodeObj({
                  ...barcodeObj,
                  weight: e.target.value,
                }),
            }
          },
          {
            tag: "input",
            label: "البروتينات",
            props: {
              type: "number",
              value: barcodeObj.protein,
              name: "protein",
              placeholder: "البروتينات",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setBarcodeObj({
                  ...barcodeObj,
                  protein: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الطاقة",
            props: {
              type: "number",
              value: barcodeObj.energy,
              name: "energy",
              placeholder: "الطاقة",
              required: true,
              maxLength: 100,
              onChange: (e) =>
              setBarcodeObj({
                  ...barcodeObj,
                  energy: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الدهون",
            props: {
              type: "number",
              value: barcodeObj.fat,
              name: "fat",
              placeholder: "الدهون",
              required: true,
              maxLength: 100,
              onChange: (e) =>
              setBarcodeObj({
                  ...barcodeObj,
                  fat: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الكربوهيدرات",
            props: {
              type: "text",
              value: barcodeObj.carbs,
              name: "carbs",
              placeholder: "الكربوهيدرات",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setBarcodeObj({
                  ...barcodeObj,
                  carbs: e.target.value,
                }),
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
                setBarcodeObj({
                  ...barcodeObj,
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
          <h6>البحث عن طريق الباركود</h6>
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
              "الاسم ",
              "الصورة المصغرة",
              "الباركود ",
              "الوزن",
              "نوع الباركود ",
              "البروتينات ",
              " الطاقة",
              " الدهون",
              " الكربوهيدرات",
              "تاريخ الإضافة",
              
            ]}
            data={
              barcodes &&
              barcodes.map((u) => [
                u._id,
                u.name,
                { type: "slider", images: u.mainImage },
                u.code,
                u.type,
                u.weight,
                u.protein,
                u.energy,
                u.fat,
                u.carbs,
                u.createDate
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default Barcodes;
