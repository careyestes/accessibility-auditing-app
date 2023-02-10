import Head from 'next/head';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/layout';
import { getSortedAuditData } from '../lib/audits';
import styles from './index.module.scss';
import classNames from 'classnames';

export async function getStaticProps() {
  const allAuditsData = getSortedAuditData();
  return {
    props: {
      allAuditsData,
    },
  };
}


export default function Home({ allAuditsData }) {

  function formatDate(d) {
    let formattedDate = new Date(d);
    return formattedDate.toLocaleDateString();
  }

  function getScoreColor(s) {
    let color;
    if(s <= 40) {
      color = styles.severe;
    } else if(s > 40 && s <= 80) {
      color = styles.moderate;
    } else if(s > 80) {
      color = styles.good;
    }

    return color;
  }

  console.log(allAuditsData);

  return (
    <Layout location='home'>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      
      <section>
        
        <div className={styles.buttonContainer}>
          <Link href={`/audits/template`}>
            <a>Create New Audit</a>
          </Link>
        </div>

        <ul className={styles.post_list}>

          {allAuditsData.length > 0 ? (
            allAuditsData.map(({ id, sitename, date, url, auditor, score }) => (
              
              sitename === "" ? "" : (
                <li className="list-item" key={id} >
                  <Link href={`/audits/${id}`}>
                    <a>
                      <div className={styles.infoContainer}>
                        <p>{sitename}</p>
                        <p className={styles.meta}>
                          <time dateTime={date}><small>on:</small> { formatDate(date) }</time>
                          <span><small>by:</small> {auditor}</span>
                          {url === "" ? "" : (
                            <span><small>url:</small> {url}</span>
                          )}
                        </p>
                      </div>
                      { isNaN(score) ? "" : (
                        <div className={styles.scoreContainer}>
                            <label>Score</label>
                            <p id="score" className={classNames(styles.score, getScoreColor(score) )}>{ score }</p>
                        </div>
                      )}
                    </a>
                  </Link>
                </li>
              )
            ))
          ) : (
            <p>No audits have been created yet.</p>
          )}
          </ul>

      </section>
    </Layout>
  );
}