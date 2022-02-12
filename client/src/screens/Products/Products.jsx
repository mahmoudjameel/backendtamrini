import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useProductsHook from "./hooks/index";

//Styles
import "./style.scss";

const Products = () => {
  const {
    getProducts,
    deleteProduct,
    addProduct,
    editProduct,
    getCategories
  } = useProductsHook();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
    createDate: "",
    categoryId: ""
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getProducts();
      if (result) {
        setProducts(result);
      }
      const catResult = await getCategories();
      if (catResult) {
        setCategories(catResult.map(category => ({ label: category.title, value: category._id })))
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
        createDate: "",
        categoryId: ""
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
        <title>لوحة التحكم / المنتجات</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف المنتج رقم ${productObj._id}`}
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
            console.log("product", product);
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
            label: "عنوان المنتج",

            props: {
              type: "text",
              name: "title",
              maxLength: 100,
              placeholder: "عنوان المنتج",
              required: true,
              onChange: e =>
                setProductObj({ ...productObj, title: e.target.value })
            }
          },
          {
            tag: "textarea",
            label: "وصف المنتج",
            props: {
              type: "text",
              name: "description",
              placeholder: "وصف المنتج",
              required: true,

              onChange: e =>
                setProductObj({ ...productObj, description: e.target.value })
            }
          },
          {
            tag: "input",
            label: "السعر",
            props: {
              type: "text",
              name: "price",
              placeholder: "السعر",
              required: true,

              onChange: e =>
                setProductObj({ ...productObj, price: e.target.value })
            }
          },
          // {
          //   tag: "textarea",
          //   label: "نبذة عن الكوتش",
          //   props: {
          //     type: "text",
          //     name: "coachBrief",
          //     placeholder: "نبذة عن الكوتش",
          //     required: true,

          //     onChange: e =>
          //       setProductObj({ ...productObj, coachBrief: e.target.value })
          //   }
          // },
          {
            tag: "select",
            label: "القسم",
            props: {
              name: "categoryId",
              onChange: (e) => setProductObj({ ...productObj, categoryId: e.target.value }),
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
          title: `تعديل المستخدم رقم ${productObj._id}`,
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
            label: "عنوان المنتج",
            props: {
              type: "text",
              value: productObj.title,
              name: "title",
              placeholder: "عنوان المنتج",
              required: true,
              maxLength: 100,
              onChange: e =>
                setProductObj({ ...productObj, title: e.target.value })
            }
          },
          {
            tag: "textarea",
            label: "وصف المنتج",
            props: {
              type: "text",
              value: productObj.description,
              name: "description",
              placeholder: "وصف المنتج",
              required: true,
              onChange: e =>
                setProductObj({ ...productObj, description: e.target.value })
            }
          },
          {
            tag: "input",
            label: "السعر",
            props: {
              type: "text",
              name: "price",
              placeholder: "السعر",
              value: productObj.price,
              required: true,

              onChange: e =>
                setProductObj({ ...productObj, price: e.target.value })
            }
          },
          // {
          //   tag: "textarea",
          //   label: "نبذة عن الكوتش",
          //   props: {
          //     type: "text",
          //     name: "coachBrief",
          //     value: productObj.coachBrief,
          //     placeholder: "نبذة عن الكوتش",
          //     required: true,

          //     onChange: e =>
          //       setProductObj({ ...productObj, coachBrief: e.target.value })
          //   }
          // },
          {
            tag: "select",
            label: "القسم",
            props: {
              value: productObj?.categoryId?._id,
              name: "categoryId",
              onChange: (e) => setProductObj({ ...productObj, categoryId: e.target.value }),
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
          <h6>المنتجات</h6>
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
              "صورة المنتج",
              "اسم المنتج",
              "وصف المنتج",
              "السعر",
              "القسم",
              "تاريخ الإضافة"
            ]}
            data={
              products &&
              products.map(u => [
                u._id,
                { type: "img", src: u.mainImage },
                u.title,
                u.description,
                u.price,
                u?.categoryId?.title,
                u.createDate
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default Products;
