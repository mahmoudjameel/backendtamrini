import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useVideoExercisesHook from "./hooks/index";

//Styles
import "./style.scss";

const VideoExercises = () => {
  const {
    getVideoExercises,
    deleteVideoExercise,
    addVideoExercise,
    editVideoExercise,
    getCategories
  } = useVideoExercisesHook();

  const [videoExercises, setVideoExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [videoExerciseObj, setVideoExerciseObj] = useState({
    _id: 0,
    title: "",
    description: "",
    videos: [],
    createDate: "",
    categoryId: ""
  });

  const addFormRef = useRef(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await getVideoExercises();

      if (result) {
        setVideoExercises(result);
      }
      // const catResult = await getCategories();
      // if (catResult) {
      //   setCategories(catResult.map(category => ({ label: category.name, value: category._id })))
      // }
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setVideoExerciseObj({
        _id: 0,
        title: "",
        description: "",
        videos: [],
        createDate: "",
        categoryId: ""
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const videoExercise = videoExercises.find((u) => u._id === _id);
    setVideoExerciseObj(videoExercise);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setVideoExerciseObj(videoExercises.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / قسم البحث عن تمرين</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف التمرين رقم ${videoExerciseObj._id}`}
        onDelete={async () => {
          if (await deleteVideoExercise(videoExerciseObj._id)) {
            setVideoExercises(
              videoExercises.filter((u) => u._id !== videoExerciseObj._id)
            );
            setDeleteBoxVisible(false);
          }
        }}
      />
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة تمرين جديد",
          onSave: async () => {
            const videoExercise = await addVideoExercise(addFormRef);

            if (videoExercise) {
              setVideoExercises([...videoExercises, videoExercise]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "اضافة",
          formRef: addFormRef,
        }}
        inputs={[
          {
            tag: "input",
            label: "عنوان التمرين",

            props: {
              type: "text",
              name: "title",
              maxLength: 100,
              placeholder: "عنوان التمرين",
              required: true,
              onChange: (e) =>
                setVideoExerciseObj({
                  ...videoExerciseObj,
                  title: e.target.value,
                }),
            },
          },
          // {
          //   tag: "select",
          //   label: "القسم",
          //   props: {
          //     name: "categoryId",
          //     onChange: (e) => setVideoExerciseObj({ ...videoExerciseObj, categoryId: e.target.value }),
          //   },
          //   options: categories,
          // },
          {
            tag: "textarea",
            label: "محتوي التمرين",
            props: {
              type: "text",
              name: "description",
              placeholder: "محتوي التمرين",
              required: true,

              onChange: (e) =>
                setVideoExerciseObj({
                  ...videoExerciseObj,
                  description: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الفيديو",
            props: {
              name: "videoId",
              placeholder: "قم بنسخ رقم تعريف الفيديو",
              required: true,

              onChange: (e) =>
                setVideoExerciseObj({
                  ...videoExerciseObj,
                  videos: e.target.files,
                }),
            },
          },
          {
            tag: "input",
            props: {
              name: "type",
              type: "hidden",
              value: 2,
            },
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل التمرين رقم ${videoExerciseObj._id}`,
          onSave: async () => {
            const result = await editVideoExercise(editFormRef);
            if (result) {
              setVideoExercises(
                videoExercises.map((u) => (u._id === result._id ? result : u))
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
              value: videoExerciseObj._id,
              name: "_id",
            },
          },
          {
            tag: "input",
            label: "عنوان التمرين",
            props: {
              type: "text",
              value: videoExerciseObj.title,
              name: "title",
              placeholder: "عنوان التمرين",
              required: true,
              maxLength: 100,
              onChange: (e) =>
                setVideoExerciseObj({
                  ...videoExerciseObj,
                  title: e.target.value,
                }),
            },
          },
          // {
          //   tag: "select",
          //   label: "القسم",
          //   props: {
          //     value: videoExerciseObj?.categoryId?._id,
          //     name: "categoryId",
          //     onChange: (e) => setVideoExerciseObj({ ...videoExerciseObj, categoryId: e.target.value }),
          //   },
          //   options: categories,
          // },
          {
            tag: "textarea",
            label: "محتوي التمرين",
            props: {
              type: "text",
              value: videoExerciseObj.description,
              name: "description",
              placeholder: "محتوي التمرين",
              required: true,
              onChange: (e) =>
                setVideoExerciseObj({
                  ...videoExerciseObj,
                  description: e.target.value,
                }),
            },
          },
          {
            tag: "input",
            label: "الفيديو",
            props: {
              name: "videoId",
              value: videoExerciseObj.videoId,
              placeholder: "قم بنسخ رقم تعريف الفيديو",
              required: true,

              onChange: (e) =>
                setVideoExerciseObj({
                  ...videoExerciseObj,
                  videos: e.target.files,
                }),
            },
          },
          {
            tag: "input",
            props: {
              name: "type",
              type: "hidden",
              value: 2,
            },
          },
        ]}
      />
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>قسم البحث عن تمرين</h6>
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
              "الفيديو",
              "العنوان",
              "محتوي التمرينة",
              "تاريخ الإضافة",
            ]}
            data={
              videoExercises &&
              videoExercises.map((u) => [
                u._id,
                { type: "video", videoId: u.videoId },
                u.title,
                u.description,
                u.createDate,
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default VideoExercises;
