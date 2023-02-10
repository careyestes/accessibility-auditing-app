import classNames from "classnames";
import { useState, useEffect } from "react";
import styles from './themeToggle.module.scss';

const ThemeToggle = () => {
  const [activeTheme, setActiveTheme] = useState("light");
  const inactiveTheme = activeTheme === "light" ? "dark" : "light";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    savedTheme && setActiveTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = activeTheme;
    window.localStorage.setItem("theme", activeTheme);
  }, [activeTheme]);

  return (
    <button 
      type="button"
      aria-label={`Change to ${inactiveTheme} mode`}
      title={`Change to ${inactiveTheme} mode`}
      className={classNames(styles.modeButton, activeTheme === "light" ? styles.lightTheme : styles.darkTheme)}
      onClick={() => setActiveTheme(inactiveTheme)}
    >
      <span className={styles.bezel}>
        <svg viewBox="0 0 30 30" className={styles.Moon}>
            <path d="M22.3956356,0.8336325c0.6809673,1.7317152,1.0677185,3.6114616,1.0677185,5.5848737c0,8.4412937-6.8430786,15.2843723-15.2843723,15.2843723c-2.9075685,0-5.6154799-0.8266163-7.9294949-2.2360096c2.2319012,5.6756802,7.7487135,9.6994991,14.2166538,9.6994991c8.4413528,0,15.2843723-6.8430805,15.2843723-15.2843733C29.7505131,8.3482113,26.7997131,3.5160582,22.3956356,0.8336325z"/>
        </svg>

        <svg viewBox="0 0 30 30" className={styles.Sun}>
            <path d="M14.9482031,5.9933162c-5.1416082,0-9.3248472,4.2447095-9.3248472,9.4618702s4.183239,9.4618702,9.3248472,9.4618702c5.1419954,0,9.3252344-4.244709,9.3252344-9.4618702S20.0901985,5.9933162,14.9482031,5.9933162z"/>
            <path d="M23.898283,8.4969273l0.3147488-1.8112745L24.75354,3.5750449l-2.9251137,1.0803163L20.125164,5.2844415C21.6053257,6.063345,22.8900509,7.164959,23.898283,8.4969273z"/>
            <path d="M27.0748863,11.628686l-1.7281208-0.6382084c0.5747013,1.372798,0.8932228,2.8816776,0.8932228,4.4647093c0,0.1604719-0.0172653,0.3165274-0.0237465,0.4754286l1.3992023-1.1913214L30,12.7090025L27.0748863,11.628686z"/>
            <path d="M26.6764202,20.392477l-0.9226761-1.6216507c-0.4896317,1.6395149-1.3382149,3.1175766-2.4439964,4.3570385h1.8102894h3.1128139L26.6764202,20.392477z"/>
            <path d="M16.5517883,26.7831955l1.3426151,1.1431313l2.3846054,2.0302925l0.5405083-3.1105595l0.3159103-1.8178997C19.7816391,25.9320545,18.2248211,26.5401325,16.5517883,26.7831955z"/>
            <path d="M9.0243168,25.1904964l0.2952585,1.6988964L9.8600845,30l2.3846054-2.0302925l1.3482742-1.1479893C11.9315367,26.6187477,10.3844891,26.0458584,9.0243168,25.1904964z"/>
            <path d="M4.2343593,19.049469l-0.826627,1.4527874l-1.5564303,2.7353878h3.1128609h1.7212043C5.5952082,22.0467644,4.749526,20.6259727,4.2343593,19.049469z"/>
            <path d="M3.6568038,15.4551868c0-1.5121193,0.2971447-2.9533749,0.8240154-4.2762156l-1.5557051,0.5745592L0,12.8337975l2.3846049,2.0303411l1.2978797,1.1050491C3.6749401,15.7975273,3.6568038,15.6286631,3.6568038,15.4551868z"/>
            <path d="M6.0107465,8.4803896c0.987967-1.3003645,2.2382569-2.3827419,3.6785188-3.1557074L8.097578,4.736824L5.1724639,3.6565568l0.5405574,3.1105587L6.0107465,8.4803896z"/>
            <path d="M14.9481544,3.9978669c0.8353319,0,1.6471596,0.0991786,2.4312763,0.2746184l-0.8746033-1.5370975L14.9483967,0l-1.5564308,2.7353878l-0.874507,1.5369992C13.3013811,4.0969963,14.1130638,3.9978669,14.9481544,3.9978669z"/>
        </svg>
      </span>

      <span className={styles.text}>{activeTheme}</span>
    </button>
  );
};

export default ThemeToggle;