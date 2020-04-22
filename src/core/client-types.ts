/* eslint-disable */
import { DateTime } from 'luxon';
export type Maybe<T> = T | undefined | null;

/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  IntString: number | string;
  DateTime: DateTime;
}



export interface Node {
  id: Scalars['ID'];
}

export interface Bucket  extends Node {
   __typename: 'Bucket';
  id: Scalars['ID'];
}

export interface CreateBucketInput {
  id: Scalars['ID'];
  parentId: Scalars['ID'];
}

export interface TrashBucketInput {
  id: Scalars['ID'];
}

export enum ScrapSource {
  Clipper = 'clipper'
}

export enum ScrapType {
  Text = 'text',
  File = 'file'
}

export interface ScrapContent {
   __typename: 'ScrapContent';
  key: Scalars['IntString'];
  type: ScrapType;
  value: Scalars['String'];
  originalHTML?: Maybe<Scalars['String']>;
  xPath?: Maybe<Scalars['String']>;
}

export interface Scrap  extends Node {
   __typename: 'Scrap';
  id: Scalars['ID'];
  bucketId: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  source?: Maybe<ScrapSource>;
  sourceUrl?: Maybe<Scalars['String']>;
  content: Array<ScrapContent>;
  createdAt: Scalars['DateTime'];
}

export enum JobStatus {
  Created = 'created',
  Queued = 'queued',
  Started = 'started',
  Failed = 'failed',
  Finished = 'finished'
}

export interface Job {
  type: Scalars['String'];
  priority: Scalars['Int'];
  status: JobStatus;
  failReason?: Maybe<Scalars['String']>;
}

export interface PersistMediaJob  extends Node, Job {
   __typename: 'PersistMediaJob';
  id: Scalars['ID'];
  type: Scalars['String'];
  priority: Scalars['Int'];
  status: JobStatus;
  failReason?: Maybe<Scalars['String']>;
  bucket?: Maybe<Bucket>;
  scrap?: Maybe<Scrap>;
}

export interface BucketPayload {
   __typename: 'BucketPayload';
  paths: Array<Scalars['String']>;
  scraps?: Maybe<Array<Scrap>>;
}

export interface Query {
   __typename: 'Query';
  test?: Maybe<Scalars['String']>;
  buckets: Array<Bucket>;
  bucket?: Maybe<Bucket>;
  scraps: Array<Scrap>;
  jobs?: Maybe<Array<Maybe<Job>>>;
}


export interface QueryBucketArgs {
  id: Scalars['String'];
}


export interface QueryScrapsArgs {
  bucketId: Scalars['ID'];
}

export interface Mutation {
   __typename: 'Mutation';
  createBucket?: Maybe<Bucket>;
  trashBucket?: Maybe<Scalars['Boolean']>;
}


export interface MutationCreateBucketArgs {
  input: CreateBucketInput;
}


export interface MutationTrashBucketArgs {
  input: TrashBucketInput;
}

export type BucketFieldsFragment = { __typename: 'Bucket', id: string };

export type ScrapFieldsFragment = { __typename: 'Scrap', id: string, bucketId: string, title?: Maybe<string>, source?: Maybe<ScrapSource>, sourceUrl?: Maybe<string>, createdAt: DateTime, content: Array<{ __typename: 'ScrapContent', key: number | string, type: ScrapType, value: string, originalHTML?: Maybe<string>, xPath?: Maybe<string> }> };

export type LoadBucketsQueryVariables = {};


export type LoadBucketsQuery = { __typename: 'Query', buckets: Array<(
    { __typename: 'Bucket' }
    & BucketFieldsFragment
  )> };

export type CreateBucketMutationVariables = {
  input: CreateBucketInput;
};


export type CreateBucketMutation = { __typename: 'Mutation', createBucket?: Maybe<(
    { __typename: 'Bucket' }
    & BucketFieldsFragment
  )> };

export type TrashBucketMutationVariables = {
  input: TrashBucketInput;
};


export type TrashBucketMutation = { __typename: 'Mutation', trashBucket?: Maybe<boolean> };

export type LoadScrapsQueryVariables = {
  id: Scalars['ID'];
};


export type LoadScrapsQuery = { __typename: 'Query', scraps: Array<(
    { __typename: 'Scrap' }
    & ScrapFieldsFragment
  )> };
