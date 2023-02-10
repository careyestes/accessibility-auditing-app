import classNames from "classnames";
import { useState, useEffect } from "react";
import styles from './viewToggle.module.scss';

const ViewToggle = () => {
  const [activeView, setActiveView] = useState("read");
  const inactiveView = activeView === "read" ? "edit" : "read";

  useEffect(() => {
    const savedView = window.localStorage.getItem("view");
    savedView && setActiveView(savedView);
  }, []);

  useEffect(() => {
    document.body.dataset.view = activeView;
    window.localStorage.setItem("view", activeView);
  }, [activeView]);

  return (
    <button 
      type="button"
      aria-label={`Change to ${inactiveView} mode`}
      title={`Change to ${inactiveView} mode`}
      className={classNames(styles.modeButton, activeView === "read" ? styles.readView : styles.editView)}
      onClick={() => setActiveView(inactiveView)}
    >
      <span className={styles.bezel}></span>
      <span className={styles.text}>{activeView}</span>
    </button>
  );
};

export default ViewToggle;