import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useProductsHook from "./hooks/index";

//Styles
import "./style.scss";

const ProductsCategory = () => {
  const {
    getProducts,
    deleteProduct,
    addProduct,
    editProduct
  } = useProductsHook();

  const [products, setProducts] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [productObj, setProductObj] = useState({
    _id: 0,
    title: "",
    price: "",
    description: "",
    coachBrief: "",
    mainImage: "",
    createDate: ""
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getProducts();

      if (result) {
        setProducts(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setProductObj({
        _id: 0,
        title: "",
        price: "",
        description: "",
        coachBrief: "",
        mainImage: "",
        createDate: ""
      });
  }, [addBoxVisible]);

  const onClickEdit = _id => {
    const product = products.find(u => u._id === _id);
    setProductObj(product);
    setEditBoxVisible(true);
  };
  const onClickDelete = _id => {
    setProductObj(products.find(u => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / أقسام المتجر</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف القسم رقم ${productObj._id}`}
        onDelete={async () => {
          if (await deleteProduct(productObj._id)) {
            setProducts(products.filter(u => u._id !== productObj._id));
            setDeleteBoxVisible(false);
          }
        }}
      />
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة منتج جديد",
          onSave: async () => {
            const product = await addProduct(addFormRef);

            if (product) {
              setProducts([...products, product]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "اضافة",
          formRef: addFormRef
        }}
        inputs={[
          {
            tag: "input",
            label: "اسم القسم",

            props: {
              type: "text",
              name: "title",
              maxLength: 100,
              placeholder: "اسم القسم",
              required: true,
              onChange: e =>
                setProductObj({ ...productObj, title: e.target.value })
            }
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

              onChange: e =>
                setProductObj({ ...productObj, mainImage: e.target.files[0] })
            }
          }
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل القسم رقم ${productObj._id}`,
          onSave: async () => {
            const result = await editProduct(editFormRef);

            if (result) {
              setProducts(
                products.map(u => (u._id === result._id ? result : u))
              );
              setEditBoxVisible(false);
            }
          },
          saveBtn: "تعديل",
          formRef: editFormRef
        }}
        inputs={[
          {
            tag: "input",
            props: {
              type: "hidden",
              value: productObj._id,
              name: "_id"
            }
          },
          {
            tag: "input",
            label: "اسم القسم",
            props: {
              type: "text",
              value: productObj.title,
              name: "title",
              placeholder: "اسم القسم",
              required: true,
              maxLength: 100,
              onChange: e =>
                setProductObj({ ...productObj, title: e.target.value })
            }
          },
          {
            tag: "input",
            label: "الصورة المصغرة",
            props: {
              type: "file",
              accept: ".jpg, .png, .jpeg",
              placeholder: "الصورة المصغرة",
              name: "mainImage",
              onChange: e =>
                setProductObj({
                  ...productObj,
                  mainImage: URL.createObjectURL(e.target.files[0])
                })
            }
          }
        ]}
      />
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>أقسام المتجر</h6>
        </div>
        <div className="container">
          {/* <SearchBox /> */}
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
              delete: onClickDelete
            }}
            headers={[
              "#",
              "صورة القسم",
              "اسم القسم",
              "تاريخ الإضافة"
            ]}
            data={
              products &&
              products.map(u => [
                u._id,
                { type: "img", src: u.mainImage },
                u.title,
                u.createDate
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default ProductsCategory;
