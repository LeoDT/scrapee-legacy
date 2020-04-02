/* eslint-disable @typescript-eslint/explicit-function-return-type */

import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import {
  LoadAllBucketsQuery,
  LoadBucketQuery,
  LoadBucketQueryVariables,
  LoadScrapsQuery,
  LoadScrapsQueryVariables,
  LibraryStateQuery
} from '../client-types';

import * as fragments from './fragments';

export const loadAllBucketsQuery = gql`
  ${fragments.bucketFields}

  query loadAllBuckets {
    allBuckets {
      buckets {
        ...bucketFields
      }
    }
  }
`;

export function useQueryLoadAllBuckets() {
  return useQuery<LoadAllBucketsQuery>(loadAllBucketsQuery);
}

export const loadBucketQuery = gql`
  ${fragments.bucketFields}

  query loadBucket($id: String!) {
    bucket(id: $id) @client {
      ...bucketFields
    }
  }
`;

export function useQueryLoadBucket(id: string) {
  return useQuery<LoadBucketQuery, LoadBucketQueryVariables>(loadBucketQuery, {
    variables: { id }
  });
}

export const loadScrapsQuery = gql`
  ${fragments.scrapFields}

  query loadScraps($bucketId: String!) {
    scraps(bucketId: $bucketId) {
      ...scrapFields
    }
  }
`;

export function useQueryLoadScraps(bucketId: string) {
  return useQuery<LoadScrapsQuery, LoadScrapsQueryVariables>(loadScrapsQuery, {
    variables: { bucketId }
  });
}

export function useLazyQueryLoadScraps() {
  return useLazyQuery<LoadScrapsQuery, LoadScrapsQueryVariables>(loadScrapsQuery);
}

export const libraryStateQuery = gql`
  query libraryState {
    libraryState @client {
      selectedBucketId
    }
  }
`;

export function useQueryLibraryState() {
  return useQuery<LibraryStateQuery>(libraryStateQuery);
}
