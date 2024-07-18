### Title
Doselect Secure Browser

### Description
This project is a  web application for Doselect secure browser interface. The application is built with React CRA, SCSS for styling, and UBA to track various click, view ,error log activites.


### Use cases
Main UI interface for application.
All executable commands must be passed from there to Application.
Uba logs for both interface and application.


### Project Workflow.


1. TestaccessInput Page -> Candidate can direct input test link and access test in secure browser application .Failover case if browser does not prompt directly to Application.

2. Instruction Page -> Can open in any normal browser .
    Main cta 
        a. To download the Application
        b. To redirect to application (Doselect secure browser) by appending all qyeryParams (imp)
    QueryParams 
        a. dsTestUrl 
        b. testName
        c. CandidateEmail

3. Configure page (main component) -> This page will open in Application.
    Use case -> Will pass all required command to executed  . ALl commands are present in utils folder
        a. System notification check.
        b. Check all running process by appending name of whitelisted app from utils 
        c. Check for number of wired/wireless displays connected.

4. PreTestConfigure ->
    Usecase:
        a. Start some recurring command that executes after certain interval
        b. Send signal to Electron application that run BLOCK NAVIGATION SCRIPT.
        c. send signal to start test and redirect to ASSESSMENT-URL.


### Deployment
    1.
    2. Docker (need to configure seperate domain for each docker (central2 is configured)) : 
        a. Build image with DockerFile present in Project directory.
        b. Move to /etc/ngnix/sites-enabled.
        c. Create folder with name secure_browser
        d Append content as given below:
           ###################### -> below content only (dont copy these special character)

                            server {

                listen 80;
                client_max_body_size 4G;
                server_name securebrowser.central2.dev.sg1.chsh.in;

                proxy_read_timeout 600s;
                proxy_send_timeout 600s;
                keepalive_timeout 600s;

                location / {
                    proxy_redirect off;
                    proxy_set_header Host $host;
                    proxy_http_version 1.1;
                    real_ip_header X-Forwarded-For;
                    set_real_ip_from 0.0.0.0/0;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
                    proxy_pass http://localhost:5060;
                }
                }


        ####################################### ends

        e. Run command :
                         docker run --rm  -d -p 5060:3000 -v "$(pwd)/src:/webapps/do-secure-browser-interface/src" -v"$(pwd)/public:/webapps/do-secure-browser-interface/public" -v "$(pwd)/.env:/webapps/do-secure-browser-interface/.env" --name secure_browser do_secure_browser
                         

        3. Local : After installing all dependencies then Run :  Npm run start





 


