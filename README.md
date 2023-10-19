# Survey Viewer App

Survey Viewer is an online application to view/run a Survey from a json Survey Definition used by [Influenzanet Survey Engine](https://github.com/influenzanet/survey-engine.ts)

## Installing

This application is built as a Single Page Application with React Framework.

To install the application, clone this repo and run yarn to install the dependencies

```bash
yarn 
````

To run in in dev environment
```bash
yarn start
```

To build the app as a standalone website:
```bash 
yarn build
```

The deployable website will be in 'build' directory

## Survey Definition Source

2 ways are proposed to view a survey :

- Upload a JSON file containing the Survey Definition
- Use a Survey Provider Service : a list of available survey will be loaded from the service and downloaded directly from the service

An implementation for survey provider service is available in [Grippenet repository](https://github.com/grippenet/survey-provider-service). It serves survey list from files in a directory.

To use the service provider, the application must be compiled with some environment variables

- REACT_APP_SURVEY_URL: URL of the survey service
- REACT_APP_CSP_CONNECT_URLS: the URL also must be added to this variable to enable the app to connect to the survey service

Example
```bash
REACT_APP_SURVEY_URL=https://your.survey.service
# You may add  
REACT_APP_CSP_CONNECT_URLS=$REACT_APP_SURVEY_URL ...
```     

# Customize

Warning: These customizations are useable only after the application is built. So you need to use either dev server (`yarn start`) or to rebuild the static website (`yarn build`)

## Add a custom Response Component

To register a customComponent, you have to modify the script 'localConfig.ts' and make the function registerCustomComponents return the list of your component

```ts
export const registerCustomComponents = () : CustomSurveyResponseComponent[] | undefined => {
    return [
        {
            name: 'awesomeComponent', // Name of your component as it will be used in `role` field of the survey definition
            component: MyAwesomeComponent
        }
    ];
} 
```

## Add Flags

You can tell to the survey viewer which flags are handled by your platform (and for each what are the expected values). The Survey Context editor will propose the known list and enable more friendly editor than json editor.

You had to customize the 

```ts
export const registerParticipantFlags = () : ParticipantFlags => {
    return {
        'myflagkey': {
            label: 'The label to tell the user what is the purpose of this flag'
            values: [
                {
                    value: '1' // The value the flag can have
                    label: 'A friendly label to explain what is this value'
                }
            ]
        },
        // A real example (the 'prev' flag used in Influenzanet platform)
        'prev': {
            label:"Has ongoing symptoms",
            values: [
                {value:"0", label:"Does not have ongoing symptoms"}
                {value: "1", label:"Has ongoing symptoms"}
            ],
        },
    };
}

```