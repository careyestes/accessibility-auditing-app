import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'audits/');

export default async function handler(req, res) {

  try {
    
    const body = req.body
    const fileName = postsDirectory + body.slug + '.md'
    const issueCount = body.issuenumber
    let issueArray = ""
    

    // First check for file. If exists, rewrite. If nah, make it.
    try {
      if (fs.existsSync(fileName)) {
        
        // Apply Perms
        console.log("Giving only read/write perms for " + fileName);
        fs.chmodSync(fileName, fs.constants.S_IRUSR | fs.constants.S_IWUSR );

        // Make sure you got the perms curly. I'll remove these console check eventually. They are good for dev though.
        fs.access(fileName, fs.constants.R_OK | fs.constants.W_OK, (err) => {
          console.log('\n> Checking Permission for reading and writing to file');
          if (err)
            console.error('No Read and Write access');
          else
            console.log('File can be read and written');
        });
      
      } else {

        // writeFile function with filename, content and callback function
        fs.writeFile(postsDirectory + body.slug + '.md', body.slug, function (err) {
          if (err) throw err;
          console.log('File is created successfully.');
        });

      }
    } catch(err) {
      console.error(err)
    }

    for (let i = 0; i <= issueCount; i++) {
      
      if(!body['isRemoved_' + i] && body['issue_' + i ] != "") {
        
        let sanitizedIssue = body['issue_' + i ].replace(/"/g, '\\"');
        let sanitizedDescription = body['description_' + i ].replace(/"/g, '\\"');
        let sanitizedSolution = body['solution_' + i ].replace(/"/g, '\\"');
        
        issueArray += '  {\n' +
        '    done: "' + body['isDone_' + i ] + '", \n' +
        '    tool: "' + body['tool_' + i ] + '", \n' +
        '    mode: "' + body['mode_' + i ] + '", \n' +
        '    severity: "' + body['severity_' + i ] + '", \n' +
        '    issue: "' + sanitizedIssue + '", \n' +
        '    description: "' + sanitizedDescription + '", \n' +
        '    solution: "' + sanitizedSolution +  '", \n' +
        '    pages: "' + body['pages_' + i ] + '", \n' + 
      '  },\n';
      
      } else {
      
      }
    }

    console.log(body);
    
    const content = 
      '---\n' +
      'sitename: "' + body.sitename + '"\n' +
      'slug: "' + body.slug + '"\n' +
      'url: "' + body.url + '"\n' +
      'auditor: "' + body.auditor + '"\n' +
      'date: "' + body.date + '"\n' +
      'score: ' + body.score + '\n' +
      'summary: "' + body.summary + '"\n' +
      'issues: [\n' + issueArray + ']\n---';
    
    fs.writeFile(fileName, content, err2 => {
      if (err2) {
        console.log(err2);
        return;
      }
    
      res.redirect(302, "/audits/"+body.slug)
    
    });
  
  } catch {
  
    res.status(500).send({ error: 'failed to fetch data' })
  
  }
}
