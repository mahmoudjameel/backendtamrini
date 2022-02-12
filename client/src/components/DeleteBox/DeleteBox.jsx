import { useRef, useEffect } from "react";

//Style
import "./style.scss";

const DeleteBox = ({ visible, setVisible, title, onDelete }) => {
  const deleteBoxRef = useRef(null);

  useEffect(() => {
    window.addEventListener("mouseup", containerHandler);
  }, []);

  const containerHandler = (e) => {
    e.preventDefault();

    if (deleteBoxRef.current && !deleteBoxRef.current.contains(e.target)) {
      setVisible(false);
    }
  };

  return (
    visible && (
      <div className="float-box-container">
        <div className="delete-box" ref={deleteBoxRef}>
          <div className="closing" onClick={() => setVisible(false)}>
            <span></span>
            <span></span>
          </div>
          <form method="POST" onSubmit={(e) => e.preventDefault()}>
            <input type="hidden" name="id" />
            <h3>{title}</h3>
            <div className="input-items">
              <div className="input-item">
                <button className="delete-btn" type="submit" onClick={onDelete}>
                  حذف
                </button>
              </div>
              <div className="input-item">
                <button className="abort-btn" onClick={() => setVisible(false)}>
                  الغاء
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default DeleteBox;
