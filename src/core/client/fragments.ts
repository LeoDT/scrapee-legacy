import gql from 'graphql-tag';

export const bucketFields = gql`
  fragment bucketFields on Bucket {
    id
    name @client
    expanded @client
  }
`;

export const scrapFields = gql`
  fragment scrapFields on Scrap {
    id
    title

    source
    sourceUrl

    content {
      key
      type
      value

      originalHTML
      xPath
    }

    createdAt

    expanded @client
  }
`;
