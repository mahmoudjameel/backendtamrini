import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";

//Hooks
import useUsersHook from "./hooks/index";

//Styles
import "./style.scss";

const Users = () => {
  const { getUsers, deleteUser, addUser, editUser } = useUsersHook();

  const [users, setUsers] = useState([]);
  const [addBoxVisible, setAddBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [userObj, setUserObj] = useState({
    _id: 0,
    phoneNumber: "",
    username: "",
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "",
  });

  useEffect(() => {
    (async () => {
      setUsers(await getUsers());
    })();
  }, []);

  useEffect(() => {
    if (addBoxVisible)
      setUserObj({
        _id: 0,
        phoneNumber: "",
        username: "",
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: "",
      });
  }, [addBoxVisible]);

  const onClickEdit = (_id) => {
    const user = users.find((u) => u._id === _id);
    delete user.password;
    delete user.passwordConfirm;
    setUserObj(user);
    setEditBoxVisible(true);
  };
  const onClickDelete = (_id) => {
    setUserObj(users.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / المستخدمين</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف المستخدم رقم ${userObj._id}`}
        onDelete={async () => {
          if (await deleteUser(userObj._id)) {
            setUsers(users.filter((u) => u._id !== userObj._id));
            setDeleteBoxVisible(false);
          }
        }}
      />
      <DataBox
        visible={addBoxVisible}
        setVisible={setAddBoxVisible}
        options={{
          title: "اضافة مستخدم جديد",
          onSave: async () => {
            const user = await addUser(userObj);
            if (user) {
              setUsers([...users, user]);
              setAddBoxVisible(false);
            }
          },
          btnSave: "اضافة",
        }}
        inputs={[
          {
            tag: "input",
            label: "رقم الهاتف",
            props: {
              type: "text",
              placeholder: "رقم الهاتف",
              onChange: (e) =>
                setUserObj({ ...userObj, phoneNumber: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "البريد الالكتروني",
            props: {
              type: "email",
              placeholder: "البريد الالكتروني",
              onChange: (e) =>
                setUserObj({ ...userObj, email: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "اسم المستخدم",
            props: {
              type: "text",
              placeholder: "اسم المستخدم",
              onChange: (e) =>
                setUserObj({ ...userObj, username: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "الاسم",
            props: {
              type: "text",
              placeholder: "الاسم",
              onChange: (e) => setUserObj({ ...userObj, name: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "كلمة المرور",
            props: {
              type: "password",
              placeholder: "كلمة المرور",
              onChange: (e) =>
                setUserObj({ ...userObj, password: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "تأكيد كلمة المرور",
            props: {
              type: "password",
              placeholder: "تأكيد كلمة المرور",
              onChange: (e) =>
                setUserObj({ ...userObj, passwordConfirm: e.target.value }),
            },
          },
          {
            tag: "select",
            props: {
              onChange: (e) => setUserObj({ ...userObj, role: e.target.value }),
            },
            options: [
              {
                label: "المستوي",
                value: "",
              },
              {
                label: "مدير",
                value: "admin",
              },
              {
                label: "مستخدم",
                value: "user",
              },
            ],
          },
        ]}
      />
      <DataBox
        visible={editBoxVisible}
        setVisible={setEditBoxVisible}
        options={{
          title: `تعديل المستخدم رقم ${userObj._id}`,
          onSave: async () => {
            const user = await editUser(userObj);
            if (user) {
              setUsers(users.map((u) => (u._id === user._id ? user : u)));
              setEditBoxVisible(false);
            }
          },
          saveBtn: "تعديل",
        }}
        inputs={[
          {
            tag: "input",
            label: "رقم الهاتف",
            props: {
              type: "text",
              placeholder: "رقم الهاتف",
              value: userObj.phoneNumber,
              onChange: (e) =>
                setUserObj({ ...userObj, phoneNumber: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "البريد الالكتروني",
            props: {
              type: "email",
              placeholder: "البريد الالكتروني",
              value: userObj.email,
              onChange: (e) =>
                setUserObj({ ...userObj, email: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "اسم المستخدم",
            props: {
              type: "text",
              placeholder: "اسم المستخدم",
              value: userObj.username,
              onChange: (e) =>
                setUserObj({ ...userObj, username: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "الاسم",
            props: {
              type: "text",
              placeholder: "الاسم",
              value: userObj.name,
              onChange: (e) => setUserObj({ ...userObj, name: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "كلمة المرور",
            props: {
              type: "password",
              placeholder: "كلمة المرور",
              onChange: (e) =>
                setUserObj({ ...userObj, password: e.target.value }),
            },
          },
          {
            tag: "input",
            label: "تأكيد كلمة المرور",
            props: {
              type: "password",
              placeholder: "تأكيد كلمة المرور",
              onChange: (e) =>
                setUserObj({ ...userObj, passwordConfirm: e.target.value }),
            },
          },
          {
            tag: "select",
            props: {
              value: userObj.role,
              onChange: (e) => setUserObj({ ...userObj, role: e.target.value }),
            },
            options: [
              {
                label: "المستوي",
                value: "",
              },
              {
                label: "مدير",
                value: "admin",
              },
              {
                label: "مستخدم",
                value: "user",
              },
            ],
          },
        ]}
      />
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>المستخدمين</h6>
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
              "الاسم",
              "البريد الالكتروني",
              "اسم المستخدم",
              "رقم الهاتف",
              "المستوي",
              "تاريخ التسجيل",
            ]}
            data={
              users &&
              users.map((u) => [
                u._id,
                u.name,
                u.email,
                u.username,
                u.phoneNumber,
                u.role,
                u.createDate,
              ])
            }
          />
        </div>
      </div>
    </>
  );
};

export default Users;
