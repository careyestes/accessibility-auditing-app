import { useState, useEffect } from "react";
import Head from 'next/head';
import styles from './layout.module.scss';
import Link from 'next/link';
import classNames from 'classnames';
import ThemeToggle from "./themeToggle";
import ViewToggle from "./viewToggle";

export const siteMeta = 'Accessibililty Auditing Tool';

export default function Layout({ children, location }) {

  const [theme, setTheme] = useState("light")
  const [view, setView] = useState("read")

  return (
    <div id="Container" className={classNames(styles.container, theme === "light" ? styles.lightTheme : styles.darkTheme, view === "read" ? styles.readMode : editMode)}>
      <Head>
        <link rel='icon' href='/favicon.png' />
        <meta name='og:title' content={siteMeta} />
      </Head>
      
      <header className={classNames(styles.header, { [ styles.single_post ] : location === 'post' })}>
        <nav>
          <div className={styles.titleContainer}>
            <Link href='/'>
              <h1 className="heading_small">
              <a className={styles.logo}>
                <svg viewBox="0 0 455 183" className={styles.tank}>
                  <path d="M243.9523926,139.022171l-0.0000153,42.2221375L450.6186218,183L455,169.244339C446.1741943,138.6092987,339.6673584,137.7501068,243.9523926,139.022171z"/>
                  <path d="M257.5079041,132.0221863l-24.1275635-1v31.999939l-14.316803-11.9999847l-3.555542,5.3333282l-67.5554199-47.9999008l-2.2222137-5.3333206H33.7305832l-27.5555-23.5555115l1.7777739-17.7777405h118.2219849c0,0,11.5555344-7.555542,21.3332901-7.555542S257.5079041,132.0221863,257.5079041,132.0221863z"/>
                  <path d="M127.5081711,51.0223503H10.1750746l-3.9999919-3.1111069c0,0-6.1750827-0.8888855-6.1750827-8.8888702s28.3972607-17.3332977,28.3972607-17.3332977l15.1110783-4.8888798V8.3557692c0,0,12.4444199-8.3557692,28.4443893-8.3557692s33.3332672,10.133543,33.3332672,10.133543l2.2222137,2.2222176h32.4443817l2.6666565,3.111105l6.6666565-0.4444437c0,0,0-5.7777662,4-5.7777662c3.9999847,0,65.7776337-0.4444437,65.7776337-0.4444437L227.5,13.6890917h11.1190643v11.8220835h-18.6666412l-5.7777557,3.2889977l-43.5554657,0.4444427c0,0,0.4444427,4.444437-5.777771,4.444437s-20.888855,0.4444427-20.888855,0.4444427l-0.8888855,4.8888779h-7.9999847L127.5081711,51.0223503z"/>
                  <polygon points="247.9523773,14.5779781 247.9523773,25.5111752 365.7299194,23.4668503 365.7299194,14.5779781 	"/>
                  <polygon points="374.0632324,14.5779781 374.0632324,23.7724037 402.9520569,21.6890755 402.9520569,17.2724171 	"/>
                  <path d="M267.9523621,131.466629c40.2662964-0.0544434,78.4831238,0.4633484,105.8886414,4L342.6188354,86.1334c-7.4702759-20.898407-24.7127686-29.293396-50.2221069-27.1110535l-9.333313-0.0000114c0,0-19.5555115-23.1110649-35.1110382-23.1110649s-83.9998322-0.4444466-91.1109314,0c-7.1110992,0.4444427-10.6666412,6.2222099-10.6666412,6.2222099L267.9523621,131.466629z"/>
                </svg>
                <span className={styles.acronymTitle}>AAT</span> <span className={styles.title}>Accessibility Auditing Tool</span>
              </a>
              </h1>
            </Link>
          </div>
          <div className={styles.buttonContainer}>
            {location == "home" ? "" : (
              <ViewToggle />
            )}
            <ThemeToggle />
          </div>
        </nav>
      </header>
      
      <main className={classNames(styles.main, { 'single_post' : location === 'post' })}>
        {children}
      </main>

      <footer className={ styles.footer }>
        &copy; { new Date().getFullYear() } .ready Accessibility Blog
      </footer>

    </div>
  );
}