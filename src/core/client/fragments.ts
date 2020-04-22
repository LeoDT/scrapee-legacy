export const bucketFields = /* GraphQL */ `
  fragment bucketFields on Bucket {
    __typename

    id
  }
`;

export const scrapFields = /* GraphQL */ `
  fragment scrapFields on Scrap {
    __typename

    id
    bucketId

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
  }
`;
