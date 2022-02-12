import { useState, useEffect, useRef } from "react";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";
import {Helmet} from "react-helmet";

//Hooks
import useAdvertisementsHook from "./hooks/index";

//Styles
import "./style.scss";

const Advertisements = () => {
  const {
    getAdvertisement,
    deleteAdvertisement,
    addAdvertisement,
    editAdvertisement
  } = useAdvertisementsHook();

  const [advertisements, setAdvertisements] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [advertisementObj, setAdvertisementObj] = useState({
    _id: 0,
    image: "",
    link: ""
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getAdvertisement();

      if (result) {
        setAdvertisements(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setAdvertisementObj({
        _id: 0,
        image: "",
        link: ""
      });
  }, [addBoxVisible]);

  const onClickEdit = _id => {
    const advertisement = advertisements.find(u => u._id === _id);
    setAdvertisementObj(advertisement);
    setEditBoxVisible(true);
  };
  const onClickDelete = _id => {
    setAdvertisementObj(advertisements.find(u => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / الاعلانات</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف الاعلان رقم ${advertisementObj._id}`}
        onDelete={async () => {
          if (await deleteAdvertisement(advertisementObj._id)) {
            setAdvertisements(advertisements.filter(u => u._id !== advertisementObj._id));
            setDeleteBoxVisible(false);
          }
        }}
      />
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة اعلان جديد",
          onSave: async () => {
            const advertisement = await addAdvertisement(addFormRef);

            if (advertisement) {
              setAdvertisements([...advertisements, advertisement]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "اضافة",
          formRef: addFormRef
        }}
        inputs={[
          {
            tag: "input",
            label: "الصورة المصغرة",
            props: {
              type: "file",
              accept: ".jpg, .png, .jpeg",
              name: "image",
              placeholder: "الصورة المصغرة",
              required: true,

              onChange: e =>
                setAdvertisementObj({ ...advertisementObj, image: e.target.files[0] })
            }
          },
          {
            tag: "input",
            label: "الرابط",

            props: {
              type: "text",
              name: "link",
              placeholder: "الرابط",
              onChange: (e) =>
              setAdvertisementObj({ ...advertisementObj, link: e.target.value }),
            },
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل الاعلان رقم ${advertisementObj._id}`,
          onSave: async () => {
            const result = await editAdvertisement(editFormRef);
            console.log("result", result)
            if (result) {
              setAdvertisements(
                advertisements.map(u => (u._id === result._id ? result : u))
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
              value: advertisementObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "الصورة المصغرة",
            props: {
              type: "file",
              accept: ".jpg, .png, .jpeg",
              placeholder: "الصورة المصغرة",
              name: "image",
              onChange: e =>
                setAdvertisementObj({
                  ...advertisementObj,
                  image: URL.createObjectURL(e.target.files[0])
                })
            }
          },
          {
            tag: "input",
            label: "الرابط",

            props: {
              type: "text",
              name: "link",
              value: advertisementObj.link,
              placeholder: "الرابط",
              onChange: (e) =>
              setAdvertisementObj({ ...advertisementObj, link: e.target.value }),
            },
          },
        ]}
      />
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>الاعلانات</h6>
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
              "صورة الاعلان",
              "الرابط"
            ]}
            data={
              advertisements &&
              advertisements.map(u => [
                u._id,
                { type: "img", src: u.image },
                u.link || ""
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default Advertisements;
