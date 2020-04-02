/* eslint-disable @typescript-eslint/explicit-function-return-type */
import gql from 'graphql-tag';

import { useMutation } from '@apollo/react-hooks';

import {
  ToggleBucketMutationVariables,
  SelectBucketMutationVariables,
  ToggleScrapMutationVariables
} from '../client-types';

export const toggleBucketMutaion = gql`
  mutation toggleBucket($id: String!, $expanded: Boolean) {
    toggleBucket(id: $id, expanded: $expanded) @client
  }
`;

export function useMutationToggleBucket() {
  return useMutation<ToggleBucketMutationVariables>(toggleBucketMutaion);
}

export const selectBucketMutaion = gql`
  mutation selectBucket($id: String!) {
    selectBucket(id: $id) @client
  }
`;

export function useMutationSelectBucket() {
  return useMutation<SelectBucketMutationVariables>(selectBucketMutaion);
}

export const toggleScrapMutaion = gql`
  mutation toggleScrap($id: String!, $expanded: Boolean) {
    toggleScrap(id: $id, expanded: $expanded) @client
  }
`;

export function useMutationToggleScrap() {
  return useMutation<ToggleScrapMutationVariables>(toggleScrapMutaion);
}
