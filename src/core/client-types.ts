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



export interface AppConfig {
   __typename: 'AppConfig';
  rootPath: Scalars['String'];
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

export interface ScrapContentInput {
  key?: Maybe<Scalars['IntString']>;
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
  content: Array<ScrapContent>;
  source?: Maybe<ScrapSource>;
  sourceUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
}

export interface CreateScrapInput {
  bucketId: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  content: Array<ScrapContentInput>;
  source?: Maybe<ScrapSource>;
  sourceUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
}

export enum JobStatus {
  Created = 'created',
  Started = 'started',
  Failed = 'failed',
  Finished = 'finished'
}

export enum JobType {
  PersistMedia = 'persistMedia'
}

export interface FakeJobData {
   __typename: 'FakeJobData';
  fake: Scalars['String'];
}

export interface PersistMediaJobData {
   __typename: 'PersistMediaJobData';
  scrapId: Scalars['ID'];
}

export type JobData = PersistMediaJobData | FakeJobData;

export interface Job  extends Node {
   __typename: 'Job';
  id: Scalars['ID'];
  type: JobType;
  priority: Scalars['Int'];
  status: JobStatus;
  failReason?: Maybe<Scalars['String']>;
  interval?: Maybe<Scalars['Int']>;
  data?: Maybe<JobData>;
}

export interface Query {
   __typename: 'Query';
  appConfig: AppConfig;
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
  createScrap?: Maybe<Scrap>;
}


export interface MutationCreateBucketArgs {
  input: CreateBucketInput;
}


export interface MutationTrashBucketArgs {
  input: TrashBucketInput;
}


export interface MutationCreateScrapArgs {
  input: CreateScrapInput;
}

export type BucketFieldsFragment = { __typename: 'Bucket', id: string };

export type ScrapFieldsFragment = { __typename: 'Scrap', id: string, bucketId: string, title?: Maybe<string>, source?: Maybe<ScrapSource>, sourceUrl?: Maybe<string>, createdAt: DateTime, content: Array<{ __typename: 'ScrapContent', key: number | string, type: ScrapType, value: string, originalHTML?: Maybe<string>, xPath?: Maybe<string> }> };

export type LoadBucketsQueryVariables = {};


export type LoadBucketsQuery = { __typename: 'Query', buckets: Array<(
    { __typename: 'Bucket' }
    & BucketFieldsFragment
  )> };

export type CreateScrapMutationVariables = {
  input: CreateScrapInput;
};


export type CreateScrapMutation = { __typename: 'Mutation', createScrap?: Maybe<(
    { __typename: 'Scrap' }
    & ScrapFieldsFragment
  )> };

export type JobFieldsFragment = { __typename: 'Job', id: string, status: JobStatus, type: JobType };

export type LoadJobsQueryVariables = {};


export type LoadJobsQuery = { __typename: 'Query', jobs?: Maybe<Array<Maybe<(
    { __typename: 'Job' }
    & JobFieldsFragment
  )>>> };

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

export type LoadAppConfigQueryVariables = {};


export type LoadAppConfigQuery = { __typename: 'Query', appConfig: { __typename: 'AppConfig', rootPath: string } };
