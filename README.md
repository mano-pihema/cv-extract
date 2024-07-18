# CV Extract
CV Extractor uses LLamaIndex RAG to query your CV document with a set of query verbs such as List, Summarize and Extract. This is to assist job seekers in creating profiles on job board sites such as TradeMe and Seek. 

## Features
- Upload a CV document
- Query your document using the verbs and keywords.Keywords such as 'experience', 'education' and 'skills' are included   
- For instance 'List Experience' will return a list of your work experiences
- Each experience is its own card whose content can be copied 

## Demo
Here is a Demo of the App in action

[screen-capture (5).webm](https://github.com/user-attachments/assets/ebce85c3-c98c-463d-a14e-2d09d197d34d)


## Set up

1. **Clone the repository**:
   ```sh
   git clone https://github.com/mano-pihema/cv-extract.git
   ```
2. **Change dir**:
   ```sh
   cd cv-extract
   ```

3. **Create a .env file**:
   ```env
   OPEN_AI_KEY=YOUR OPENAI KEY
   VITE_STORAGE_URL='YOUR SUPABASE URL'
   VITE_ANON_STORAGE_KEY='YOUR SUPABASE KEY'
   ```
4. **Install dependencies**:
   ```sh
   npm install
   ```
5. **Run App**:
    ```sh
   npm run dev
   ```

## Learning Goals

The lifecycle of the App is as follows:
- The user uploads CV, this document is passed to a supabase bucket.
- The user defines the query they want to carry out.
- Both the query and bucket Url is passed to the backend.
- The cv is pulled down into the server in a temp file, where it is parsed from pdf to a txt file.
- Once that is complete the server then uses LLamaIndex RAG to query the txt file.
- This extracted data is then sent up to the client.

The main goal was to learn more about RAG use and integration. Secondary goals included learning to store documents in a bucket instead of on the server and parsing pdf documents.    

## Tech
![chakraui](https://img.shields.io/badge/chakraui-319795?style=for-the-badge&logo=chakraui&logoColor=white)
![react](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![open-ai](https://img.shields.io/badge/Openai-412991?style=for-the-badge&logo=openai&logoColor=white)
![node-js](https://img.shields.io/badge/Nodejs-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![supabase](https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)


