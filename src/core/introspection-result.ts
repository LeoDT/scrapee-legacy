/* eslint-disable */


      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": [
      {
        "kind": "INTERFACE",
        "name": "Job",
        "possibleTypes": [
          {
            "name": "PersistMediaJob"
          }
        ]
      }
    ]
  }
};
      export default result;
    