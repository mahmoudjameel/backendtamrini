import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Table, DataBox, SearchBox, DeleteBox } from "../../components";
import QuestionTable from "../../components/Table/QuestionTable";

//Hooks
import useDietsHook from "./hooks/index";

//Styles
import "./style.scss";

const Questions = () => {
  const {
    getQuestions,
    deleteQuestion,
    deleteAnswer
  } = useDietsHook();

  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState([]);

  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);

  const [deleteBoxVisibleAnswers, setDeleteBoxVisibleAnswers] = useState(false)
  const [answersVisible, setAnswersVisible] = useState(false)
  const [questionsVisible, setQuestionsVisible] = useState(true)

  const [questionId, setQuestionId] = useState(0)


  const [questionObj, setQuestionObj] = useState({
    _id: 0,
    question: "",
    time: "",
  });

  const [answernObj, setAnswerObj] = useState({
    _id: 0,
    questionId:0
  });



  useEffect(() => {
    (async () => {
      const result = await getQuestions();

      if (result) {
        setQuestions(result);
      }
    })();
  }, []);


  const onClickEdit = (_id) => {
    const question = questions.find((u) => u._id === _id);
    setQuestionId(question._id)
    const a = question.answers;
     setAnswers(a)
    setQuestionsVisible(false)
    setAnswersVisible(true);

  };

  const onClickDelete = (_id) => {
    setQuestionObj(questions.find((u) => u._id === _id));
    setDeleteBoxVisible(true);
  };

  const onClickDeleteAnswer = (_id) => {

    const a = answers.find((u) => u._id === _id)

    setAnswerObj({_id:_id,questionId:questionId});

    setDeleteBoxVisibleAnswers(true);
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم/ الاسئله</title>
      </Helmet>
      <DeleteBox
        visible={deleteBoxVisible}
        setVisible={setDeleteBoxVisible}
        title={`حذف السؤال رقم ${questionObj._id}`}
        onDelete={async () => {
        
          if (await deleteQuestion(questionObj._id)) {
            setQuestions(questions.filter((u) => u._id !== questionObj._id));
            setDeleteBoxVisible(false);
          }
        }}
      />

      {/* delete box for answers */}

      <DeleteBox
        visible={deleteBoxVisibleAnswers}
        setVisible={setDeleteBoxVisibleAnswers}
        title={`حذف الجواب رقم ${answernObj._id}`}
        onDelete={async () => {
        
          if (await deleteAnswer(answernObj)) {
            setAnswers(answers.filter((u) => u._id !== answernObj._id));
            setDeleteBoxVisibleAnswers(false);
          }
        }}
      />

<div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>  الاسئله</h6>
        </div>
    
{ questionsVisible ?    

        <div className="container">
          {/*<SearchBox />*/}
          <QuestionTable
            actions={{
              edit: onClickEdit,
              delete: onClickDelete,
            }}
            headers={[
              "#",
              " السؤال",                    
              "تاريخ الإضافة",
           
            ]}
            data={
              questions &&
              questions.map((u) => [
                u._id,
                u.question,
                u.time,
                
              ])
            }
          />
        </div>  : ""}

        {/* answers */}

        {
   answersVisible ? 

        
    <div className="container">

<div className="add-new">
            <button
              className="btn-add-new"
              onClick={() => {setAnswersVisible(false); setQuestionsVisible(true)}}
            >
             الرجوع الى الاسئلة
            </button>
          </div>
          
          <Table
            actions={{
              
               delete: onClickDeleteAnswer,
            }}
            headers={[
              "#",
              " الجواب",  
              "تاريخ الإضافة"                 
            ]}
            data={
              answers &&
              answers.map((u,i) => [
              
                u._id,
                u.answer,
                u.time,
                
              ])
            }
            
          />
        </div>
         : "" }
      </div>
    </>
  );
};

export default Questions;
