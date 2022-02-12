import { useEffect, useRef } from "react";
import { useNotifierContext } from "../../providers";

const Notifier = () => {
  const { notifiers, setIsNotifierVisible } = useNotifierContext();

  const alarmsRef = useRef(null);

  useEffect(() => {
    window.onload = (e) => {
      if (alarmsRef.current) {
        alarmsRef.current.style.top = window.pageYOffset + 20 + "px";
        window.addEventListener("scroll", (e) => {
          alarmsRef.current.style.top = window.pageYOffset + 20 + "px";
        });
      }
    };
  }, []);
  return (
    <div className="alarms" ref={alarmsRef}>
      {notifiers.errors &&
        notifiers.errors.map((err, i) => (
          <div key={i} className="alarm alarm-errors">
            {err}
          </div>
        ))}
      {notifiers.success &&
        notifiers.success.map((suc, i) => (
          <div key={i} className="alarm alarm-success">
            {suc}
          </div>
        ))}
    </div>
  );
};

export default Notifier;
