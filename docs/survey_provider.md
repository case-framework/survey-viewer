# Using the online Survey provider

The Survey List provider allows to load surveys from a remote server implementing SurveyList Api (described below)

# Configuration

To activate the Survey loader provide the you need to provide the server URL in the 

For example, for a server running at localhost:8080

```bash
REACT_APP_SURVEY_URL=http://localhost:8080
REACT_APP_CSP_CONNECT_URLS=http://localhost:8080
```

Dont forget to add it to the `REACT_APP_CSP_CONNECT_URLS` variable if the remote server is not running on the same base Url as the survey-viewer app

# Server SurveyList API

The server has to provide two type of contents using the following URI(baseUrl is used here to represent the server Url) :

- {baseUrl}/list : list of available surveys as an json array of SurveyDescription object (see below)
- {baseUrl}/survey?id={id} where {id} is the id of the survey to load of the SurveyDescription object

```ts

interface SurveyDescription {
    id: string // Id to load the survey
    label: string
    description: { // Description label with language code as key
        [key:string]: string
    }
    time: string; // Time of the json file
    study: string; // StudyKey in the json file
}

```

An example implementation is provided by the [survey-provider-service](https://github.com/grippenet/survey-provider-service)