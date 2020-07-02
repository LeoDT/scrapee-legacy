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

export const loadBucketsQuery = /* GraphQL */ `
  ${bucketFields}

  query LoadBucketsQuery {
    buckets {
      ...bucketFields
    }
  }
`;

export const createScrapMutation = /* GraphQL */ `
  ${scrapFields}

  mutation CreateScrapMutation($input: CreateScrapInput!) {
    createScrap(input: $input) {
      ...scrapFields
    }
  }
`;

export const jobFields = /* GraphQL */ `
  fragment jobFields on Job {
    __typename

    id
    status
    type
  }
`;

export const loadJobsQuery = /* GraphQL */ `
  ${jobFields}

  query LoadJobsQuery {
    jobs {
      ...jobFields
    }
  }
`;
