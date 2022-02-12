import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import usePaymentMethodsHook from "./hooks/index";

//Styles
import "./style.scss";

const PaymentMethods = () => {
  const {
    getPaymentMethods,
    deletePaymentMethod,
    addPaymentMethod,
    editPaymentMethod,
  } = usePaymentMethodsHook();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [paymentMethodObj, setPaymentMethodObj] = useState({
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
      const result = await getPaymentMethods();

      if (result) {
        setPaymentMethods(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setPaymentMethodObj({
        _id: 0,
        name: "",
        description: "",
        mainImage: "",
        createDate: "",
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const paymentMethod = paymentMethods.find((u) => u._id === _id);
    setPaymentMethodObj(paymentMethod);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setPaymentMethodObj(paymentMethods.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / وسائل الدفع</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف وسيلة الدفع رقم ${paymentMethodObj._id}`}
        onDelete={async () => {
          if (await deletePaymentMethod(paymentMethodObj._id)) {
            setPaymentMethods(
              paymentMethods.filter((u) => u._id !== paymentMethodObj._id)
            );
            setDeleteBoxVisible(false);
          }
        }}
      />
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة وسيلة دفع جديد",
          onSave: async () => {
            const paymentMethod = await addPaymentMethod(addFormRef);
            if (paymentMethod) {
              setPaymentMethods([...paymentMethods, paymentMethod]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "اضافة",
          formRef: addFormRef,
        }}
        inputs={[
          {
            tag: "input",
            label: "اسم وسيلة دفع",

            props: {
              type: "text",
              name: "name",
              maxLength: 100,
              placeholder: "اسم وسيلة دفع",
              required: true,
              onChange: (e) =>
                setPaymentMethodObj({
                  ...paymentMethodObj,
                  name: e.target.value,
                }),
            },
          },
          {
            tag: "textarea",
            label: "خطوات الدفع",
            props: {
              type: "text",
              name: "description",
              placeholder: "خطوات الدفع",
              required: true,

              onChange: (e) =>
                setPaymentMethodObj({
                  ...paymentMethodObj,
                  description: e.target.value,
                }),
            },
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          name: `تعديل المستخدم رقم ${paymentMethodObj._id}`,
          onSave: async () => {
            const result = await editPaymentMethod(editFormRef);
            if (result) {
              setPaymentMethods(
                paymentMethods.map((u) => (u._id === result._id ? result : u))
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
              value: paymentMethodObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "اسم وسيلة دفع",
            props: {
              type: "text",
              value: paymentMethodObj.name,
              name: "name",
              placeholder: "اسم وسيلة دفع",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setPaymentMethodObj({
                  ...paymentMethodObj,
                  name: e.target.value,
                }),
            },
          },
          {
            tag: "textarea",
            label: "خطوات الدفع",
            props: {
              type: "text",
              value: paymentMethodObj.description,
              name: "description",
              placeholder: "خطوات الدفع",
              required: true,
              onChange: (e) =>
                setPaymentMethodObj({
                  ...paymentMethodObj,
                  description: e.target.value,
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
              onChange: (e) =>
                setPaymentMethodObj({
                  ...paymentMethodObj,
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
          <h6>وسائل الدفع</h6>
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
            headers={["#", "اسم وسيلة الدفع", "خطوات الدفع"]}
            data={
              paymentMethods &&
              paymentMethods.map((u) => [u._id, u.name, u.description])
            }
          />
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;
