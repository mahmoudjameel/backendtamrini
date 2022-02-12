import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useNotificationsHook from "./hooks/index";

//Styles
import "./style.scss";

const Notifications = () => {
  const {
    getNotification,
    deleteNotification,
    sendNotification,
    editNotification,
  } = useNotificationsHook();

  const [notifications, setNotifications] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [notificationObj, setNotificationObj] = useState({
    _id: 0,
    title: "",
    body: "",
 //   data: "",
    createDate: "",
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getNotification();

      if (result) {
        setNotifications(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setNotificationObj({
        _id: 0,
        title: "",
        body: "",
     //   data: "",
        createDate: "",
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const notification = notifications.find((u) => u._id === _id);
    setNotificationObj(notification);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setNotificationObj(notifications.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / إشعار</title>
      </Helmet>
      {/* <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف إشعار رقم ${notificationObj._id}`}
        onDelete={async () => {
          if (await deleteNotificatio(notificationObj._id)) {
            setNotifications(notifications.filter((u) => u._id !== notificationObj._id));
            setDeleteBoxVisible(false);
          }
        }}
      /> */}
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "  إرسال إشعار",
          onSave: async () => {
            const not = await sendNotification(addFormRef);
            if (not) {
              setNotifications([...notifications, not]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "إرسال إشعار",
          formRef: addFormRef,
        }}
        inputs={[
          {
            tag: "input",
            label: "عنوان إشعار",

            props: {
              type: "text",
              name: "title",
              maxLength: 100,
              placeholder: "عنوان إشعار",
              required: true,
              onChange: (e) =>
                setNotificationObj({ ...notificationObj, title: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: "محتوي إشعار",
            props: {
              type: "text",
              name: "body",
              placeholder: "محتوي إشعار",
              required: true,

              onChange: (e) =>
                setNotificationObj({ ...notificationObj, body: e.target.value }),
            },
          },
          // {
          //   tag: "textarea",
          //   label: "محتوي إشعار",
          //   props: {
          //     type: "text",
          //     name: "data",
          //     placeholder: "الداتا ",
          //     required: true,

          //     onChange: (e) =>
          //       setNotificationObj({ ...notificationObj, data: e.target.value }),
          //   },
          // },

        ]}
      />
      {/* <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل المقال رقم ${notificationObj._id}`,
          onSave: async () => {
            const result = await editArticle(editFormRef);
            if (result) {
              setNotifications(
                notifications.map((u) => (u._id === result._id ? result : u))
              );
              setEditBoxVisible(false);
            }
          },
          saveBtn: "تعديل",
          formRef: editFormRef,
          images: notificationObj.mainImage,
        }}
        inputs={[
          {
            tag: "input",
            props: {
              type: "hidden",
              value: notificationObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "عنوان المقال",
            props: {
              type: "text",
              value: notificationObj.title,
              name: "title",
              placeholder: "عنوان المقال",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setNotificationObj({ ...notificationObj, title: e.target.value }),
            },
          },
          {
            tag: "textarea",
            label: "محتوي المقال",
            props: {
              type: "text",
              value: notificationObj.content,
              name: "content",
              placeholder: "محتوي المقال",
              required: true,
              onChange: (e) =>
                setNotificationObj({ ...notificationObj, content: e.target.value }),
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
                setNotificationObj({
                  ...notificationObj,
                  mainImage: URL.createObjectURL(e.target.files[0]),
                }),
            },
          },
        ]}
      /> */}

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
          {/* <Table
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
              notifications &&
              notifications.map((u) => [
                u._id,
                { type: "slider", images: u.mainImage },
                u.title,
                u.content,
                u.createDate,
              ])
            }
          /> */}
        </div>
      </div>
    </>
  );
};

export default Notifications;
