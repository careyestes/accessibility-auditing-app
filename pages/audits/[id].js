import Head from 'next/head';
import Layout from '../../components/layout';
import styles from './audit.module.scss';
import classNames from 'classnames';
import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';

import { getAllPostIds, getPostData } from '../../lib/audits';

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {

  
  const [issueCount, setIssueCount] = postData.issues.length ? React.useState(postData.issues.length) : "";
  const issueKey = postData.issues.length - 1
  const [showAddIssue, setShowAddIssue] = React.useState(false);
  const [siteSlug, updateSiteSlug] = React.useState(postData.slug)
  const [editingIssue, setEditingIssue] = React.useState(false);
  const [formUpdated, setforUpdated] = React.useState(false);

  function calculateScore() {
    let issueTabulation = Number(0);
    let overallScore = Number(0);
    postData.issues.map((item) => {
      issueTabulation += Number(item.severity);
    })
    overallScore = issueTabulation;
    return overallScore;
  }

  const score = issueCount === undefined ? "N/A" : Math.round(100 - (calculateScore() / issueCount));
  
  function toggleIssue() {
    if(showAddIssue) {
      setShowAddIssue(false)
    } else {
      setShowAddIssue(true)
    }
  }

  function toggleEditingIssue() {
    if(editingIssue) {
      setEditingIssue(false)
    } else {
      setEditingIssue(true)
    }
  }

  function changeSiteName(e) {
    let name = e.target.value
    name = name.replaceAll(" ", "-")
    name = name.toLowerCase()
    updateSiteSlug(name)
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

  const downloadExcel = (data) => {
    const siteinfo = XLSX.utils.json_to_sheet([data]);
    const issues = XLSX.utils.json_to_sheet(postData.issues);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, siteinfo, "Site Information");
    XLSX.utils.book_append_sheet(workbook, issues, "Issues");
    XLSX.writeFile(workbook, data.slug + ".xlsx");
  };


  useEffect(() => {
    const allWithClass = Array.from(
      document.getElementsByClassName('resize')
    );
    
    allWithClass.map((item) => {
      // console.log(item.scrollHeight);
      item.style.height = item.scrollHeight + 3 + "px";
    });
  }, []);

  
  return (
    <Layout location='post'>
      <Head>
        <title>Audit of {postData.sitename}</title>
      </Head>

      <form action="/api/form" method="post" className={styles.form}>
        <p className={classNames(styles.siteName, styles.topFormSections)}>
          <label htmlFor="sitename">Site Name: </label>
          <input id="sitename" name="sitename" type="text" className={ styles.siteDetails } defaultValue={postData.sitename} onChange={(e) => changeSiteName(e)} />
        </p>
        
        <p className={classNames(styles.slug,styles.topFormSections)}>
          <label htmlFor="slug">Slug: </label>
          <input id="slug" name="slug" type="text" readOnly value={siteSlug} />
        </p>

        <p className={classNames(styles.topFormSections)}>
          <label htmlFor="url">URL: </label>
          <input id="url" className={ styles.siteDetails } name="url" type="url" defaultValue={postData.url} />
        </p>
        
        <p className={classNames(styles.topFormSections)}>
          
          <label htmlFor="auditor">Auditor: </label>
          <input id="auditor" className={ styles.siteDetails } name="auditor" type="text" defaultValue={postData.auditor} />
          
          <label htmlFor="date">Date: </label>
          <input id="date" className={ styles.siteDetails } name="date" type="date" defaultValue={postData.date} />
        </p>
        
        <input type="hidden" readOnly name="issuenumber" value={postData.issues.length} />
        <input type="hidden" readOnly name="score" defaultValue={score} />

        <div className={classNames(styles.issuesContainer, showAddIssue ? styles.shown : styles.hidden)}>
          <div className={classNames(styles.addIssueContainer, showAddIssue ? styles.shown : styles.hidden)}>
            
            <div className={styles.row}>
              <div className={styles.rowColumn}>
                <label htmlFor="tool">Tool</label>
                <div className={styles.select}>
                  <select id="tool" name={ "tool_" + issueCount }>
                    <option>Axe</option>
                    <option>Lighthouse</option>
                    <option>Wave</option>
                    <option>Manual</option>
                  </select>
                  <span className={styles.focus}></span>
                </div>
              </div>
              
              <div className={styles.rowColumn}>
                <label htmlFor="mode">Mode</label>
                <div className={styles.select}>
                  <select id="mode" name={ "mode_" + issueCount }>
                    <option>N/A</option>
                    <option>Navigation</option>
                    <option>Snapshot</option>
                  </select>
                  <span className={styles.focus}></span>
                </div>
              </div>

              <div className={styles.rowColumn}>
                <label htmlFor="severity">Severity</label>
                <input id="severity" type="range" name={ "severity_" + issueCount } min="0" max="100" step="10" />
              </div>

            </div>

            <div className={styles.row}>
              <div className={styles.rowColumn}>
                <label htmlFor="issue">Issue</label>
                <input required={showAddIssue} id="issue" type="text" name={ "issue_" + issueCount } />
              </div>
            </div>
            
            <div className={styles.row}>
              <div className={styles.rowColumn + ' ' + styles.alignTop}>
                <label htmlFor="description">Description</label>
                <textarea rows="1" id="description" className="resize" name={ "description_" + issueCount } />
              </div>
            </div>
            
            <div className={styles.row}>
              <div className={styles.rowColumn + ' ' + styles.alignTop}>
                <label htmlFor="solution">Solution</label>
                <textarea rows="1" id="solution" className="resize" name={ "solution_" + issueCount } />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.rowColumn}>
                <label htmlFor="pages">Page(s)</label>
                <input className={styles.small} id="pages" type="text" name={ "pages_" + issueCount } />
              </div>
            </div>

          </div>
        </div>
        
        <div data-type="editOnly-Invisible" className={styles.fixedBottom}>
          <button className={styles.cancelButton} type="button" onClick={toggleIssue}>{ showAddIssue ? "Cancel" : "Add an Issue" }</button>
          <button className={styles.saveButton} type="submit">Save</button>
          <button className={styles.exportButton} onClick={() => downloadExcel(postData)}>Export to CSV</button>
        </div>

        <div className={classNames(styles.topFormSections)}>
          <div className={styles.issueCountContainer}>
            <label>Issues</label>
            <p id="issues" className={classNames(styles.issueCount)}>{issueCount}</p>
          </div>
          <div className={styles.scoreContainer}>
            <label>Score</label>
            <p id="score" className={classNames(styles.score, getScoreColor(score) )}>{isNaN(score) ? "0" : score }</p>
          </div>
          <div className={styles.summaryContainer}>
            <label htmlFor="summary">Summary: </label>
            <textarea rows="1" id="summary" className={classNames( styles.siteDetails, "resize" )} name="summary" defaultValue={postData.summary} />
          </div>
        </div>
        
        <div className={styles.existingIssues}>
          
          {postData.issues.slice(0).reverse().map((item, index) => {
            
            const [ currentIndex, updateCurrentIndex ] = React.useState(index);

            return (
              <div className={classNames(styles.issueList, item.done === "on" ? styles.done : "")} key={index} data-id={currentIndex}>

                <label data-type="editOnly" className={classNames(styles.doneCheckbox, styles.container)}>
                  <input id={ "isDone_" + currentIndex } type="checkbox" name={ "isDone_" + currentIndex } defaultChecked={"checked" ? item.done == "on" : ""} />
                  <span className={styles.checkmark}></span>
                  <span className={styles.checkLabel}>Done</span>
                </label>

                <label data-type="editOnly" className={classNames(styles.removeCheckbox, styles.container, issueCount === 1 ? "hidden" : "")}>
                  <input id={ "isRemoved_" + currentIndex } type="checkbox" name={ "isRemoved_" + currentIndex } />
                  <span className={styles.checkmark}></span>
                  <span className={styles.checkLabel}>Remove</span>
                </label>
                
                <div className={styles.row}>
                  <div className={styles.rowColumn}>
                      <label htmlFor={ "tool_" + currentIndex }>Tool</label>
                      <div data-type="editOnly" className={styles.select}>
                        <select id={ "tool_" + currentIndex } name={ "tool_" + currentIndex } defaultValue={ item.tool }>
                          <option value="Axe">Axe</option>
                          <option value="Lighthouse">Lighthouse</option>
                          <option value="Wave">Wave</option>
                          <option value="Manual">Manual</option>
                        </select>
                        <span className={styles.focus}></span>
                      </div>
                  </div>

                  <div className={styles.rowColumn}>
                    <label htmlFor={ "mode_" + currentIndex }>Mode</label>
                    <div data-type="editOnly" className={styles.select}>
                      <select id={ "mode_" + currentIndex } name={ "mode_" + currentIndex } defaultValue={ item.mode }>
                        <option value="N/A">N/A</option>
                        <option value="Navigation">Navigation</option>
                        <option value="Snapshot">Snapshot</option>
                      </select>
                      <span className={styles.focus}></span>
                    </div>
                  </div>

                  <div className={styles.rowColumn}>
                    <label htmlFor={ "severity_" + currentIndex }>Severity</label>
                    <input id={ "severity_" + currentIndex } type="range" name={ "severity_" + currentIndex } min="0" max="100" step="10" defaultValue={item.severity} />
                  </div>
                </div>
                
                <div className={styles.row}>
                  <div className={styles.rowColumn}>
                    <label htmlFor={ "issue_" + currentIndex }>Issue</label>
                    <input required id={ "issue_" + currentIndex } type="text" name={ "issue_" + currentIndex } defaultValue={item.issue} />
                    {/* <div className={classNames(styles.readOnly, editingIssue ? "hidden" : "")}>{item.issue}</div> */}
                    {/* <button className={ styles.inlineEdit } type="button" onClick={toggleEditingIssue}>Edit</button> */}
                  </div>
                </div>
                
                <div className={styles.row}>
                  <div className={styles.rowColumn + ' ' + styles.alignTop}>
                    <label htmlFor={ "description_" + currentIndex }>Description</label>
                    <textarea rows="1" id={ "description_" + currentIndex } className="resize" name={ "description_" + currentIndex } defaultValue={item.description} />
                  </div>
                </div>
                
                <div className={styles.row}>
                  <div className={styles.rowColumn + ' ' + styles.alignTop}>
                    <label htmlFor={ "solution_" + currentIndex }>Solution</label>
                    <textarea rows="1" id={ "solution_" + currentIndex } className="resize" name={ "solution_" + currentIndex } defaultValue={item.solution} />
                  </div>
                </div>
                
                <div className={styles.pagesContainer}>
                  <div className={styles.row}>
                    <div className={styles.rowColumn}>
                      <label htmlFor={ "pages_" + currentIndex }>Page(s):</label>
                      <input className={styles.small} id={ "pages_" + currentIndex } type="text" name={ "pages_" + currentIndex } defaultValue={item.pages} />
                    </div>
                  </div>              
                </div>
              </div>
            )
          })}
        
        </div>
        
      </form>
 
    </Layout>
  );
}