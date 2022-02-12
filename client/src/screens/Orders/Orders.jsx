import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useOrdersHook from "./hooks/index";

//Styles
import "./style.scss";

const Orders = () => {
  const { getOrders, deleteOrder, addOrder, editOrder } = useOrdersHook();

  const [orders, setOrders] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [orderObj, setOrderObj] = useState({
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
      const result = await getOrders();

      if (result) {
        setOrders(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setOrderObj({
        _id: 0,
        title: "",
        content: "",
        mainImage: "",
        createDate: "",
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const order = orders.find((u) => u._id === _id);
    setOrderObj(order);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setOrderObj(orders.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / طلبات الشراء</title>
      </Helmet>
      {/* <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف المقالة رقم ${orderObj._id}`}
        onDelete={async () => {
          if (await deleteOrder(orderObj._id)) {
            setOrders(orders.filter((u) => u._id !== orderObj._id));
            setDeleteBoxVisible(false);
          }
        }}
      /> */}
      {/* <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة مقال جديد",
          onSave: async () => {
            const order = await addOrder(addFormRef);
            if (order) {
              setOrders([...orders, order]);
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
                setOrderObj({ ...orderObj, title: e.target.value }),
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
                setOrderObj({ ...orderObj, content: e.target.value }),
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
                setOrderObj({ ...orderObj, mainImage: e.target.files[0] }),
            },
          },
        ]}
      /> */}
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل الطلب رقم ${orderObj._id}`,
          onSave: async () => {
            const result = await editOrder(editFormRef);
            if (result) {
              setOrders(orders.map((u) => (u._id === result._id ? result : u)));
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
              value: orderObj._id,
              name: "_id"
            }
          },
          {
            tag: "select",
            label: "القسم",
            props: {
              value: orderObj.statusId,
              name: "statusId",
              onChange: (e) => setOrderObj({ ...orderObj, statusId: e.target.value }),
            },
            options: [{
              label: "لم يتم الدفع",
              value: 1
            }, {
              label: "تم الدفع",
              value: 2
            }, {
              label: "ملغي",
              value: 3
            }],
          },
        ]}
      />
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>طلبات الشراء</h6>
        </div>
        <div className="container">
          {/*<SearchBox />*/}
          {/* <div className="add-new">
            <button
              className="btn-add-new"
              onClick={() => setAddBoxVisible(true)}
            >
              أضف جديد
            </button>
          </div> */}
          <Table
            actions={{
              edit: onClickEdit,
              delete: onClickDelete,
            }}
            headers={[
              "#",
              "المشتري",
              " العنوان",
              "رقم الهاتف",
              "المنتج",
              "وسيلة الدفع",
              "حالة الدفع",
              "صورة تأكيد الدفع",
              "تاريخ الطلب",
            ]}
            data={
              orders &&
              orders.map((u) => [
                u._id,
                u.userId?.name,
                u.address,
                u.tel,
                u.productId?.title,
                u.paymentMethodId?.name,
                u.statusId == 1
                  ? "لم يتم الدفع"
                  : u.statusId == 2
                  ? "تم الدفع"
                  : u.statusId == 3
                  ? "ملغي"
                  : "غير معروف",
                { type: "img", src: u.paymentImage },
                u.createDate,
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default Orders;
