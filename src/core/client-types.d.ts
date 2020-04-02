/* eslint-disable */
import { DateTime } from 'luxon';
import { GraphQLClientContext } from './client/types'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };

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

export interface Bucket {
  expanded: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
}

export interface BucketList {
  buckets: Array<Bucket>;
}

export interface BucketPayload {
  paths: Array<Scalars['String']>;
  scraps?: Maybe<Array<Scrap>>;
}

export interface CreateBucketInput {
  parentId: Scalars['String'];
}



export interface Job {
  type: Scalars['String'];
  priority: Scalars['Int'];
  status: JobStatus;
  failReason?: Maybe<Scalars['String']>;
}

export enum JobStatus {
  Created = 'created',
  Queued = 'queued',
  Started = 'started',
  Failed = 'failed',
  Finished = 'finished'
}

export interface LibraryState {
  selectedBucketId: Scalars['String'];
}

export interface Mutation {
  createBucket?: Maybe<Scalars['String']>;
  selectBucket?: Maybe<Scalars['Boolean']>;
  toggleBucket?: Maybe<Scalars['Boolean']>;
  toggleScrap?: Maybe<Scalars['Boolean']>;
}


export interface MutationCreateBucketArgs {
  input?: Maybe<CreateBucketInput>;
}


export interface MutationSelectBucketArgs {
  id: Scalars['String'];
}


export interface MutationToggleBucketArgs {
  id: Scalars['String'];
  expanded?: Maybe<Scalars['Boolean']>;
}


export interface MutationToggleScrapArgs {
  id: Scalars['String'];
  expanded?: Maybe<Scalars['Boolean']>;
}

export interface PersistMediaJob  extends Job {
  type: Scalars['String'];
  priority: Scalars['Int'];
  status: JobStatus;
  failReason?: Maybe<Scalars['String']>;
  bucket?: Maybe<Bucket>;
  scrap?: Maybe<Scrap>;
}

export interface Query {
  allBuckets: BucketList;
  bucket?: Maybe<Bucket>;
  jobs?: Maybe<Array<Maybe<Job>>>;
  libraryState: LibraryState;
  scraps: Array<Scrap>;
  test?: Maybe<Scalars['String']>;
}


export interface QueryBucketArgs {
  id: Scalars['String'];
}


export interface QueryScrapsArgs {
  bucketId: Scalars['String'];
}

export interface Scrap {
  content: Array<ScrapContent>;
  createdAt: Scalars['DateTime'];
  expanded: Scalars['Boolean'];
  id: Scalars['ID'];
  parent?: Maybe<Bucket>;
  source?: Maybe<ScrapSource>;
  sourceUrl?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
}

export interface ScrapContent {
  key: Scalars['IntString'];
  type: ScrapType;
  value: Scalars['String'];
  originalHTML?: Maybe<Scalars['String']>;
  xPath?: Maybe<Scalars['String']>;
}

export enum ScrapSource {
  Clipper = 'clipper'
}

export enum ScrapType {
  Text = 'text',
  File = 'file'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>,
  BucketList: ResolverTypeWrapper<BucketList>,
  Bucket: ResolverTypeWrapper<Bucket>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Job: ResolversTypes['PersistMediaJob'],
  Int: ResolverTypeWrapper<Scalars['Int']>,
  JobStatus: JobStatus,
  LibraryState: ResolverTypeWrapper<LibraryState>,
  Scrap: ResolverTypeWrapper<Scrap>,
  ScrapContent: ResolverTypeWrapper<ScrapContent>,
  IntString: ResolverTypeWrapper<Scalars['IntString']>,
  ScrapType: ScrapType,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  ScrapSource: ScrapSource,
  Mutation: ResolverTypeWrapper<{}>,
  CreateBucketInput: CreateBucketInput,
  PersistMediaJob: ResolverTypeWrapper<PersistMediaJob>,
  BucketPayload: ResolverTypeWrapper<BucketPayload>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  BucketList: BucketList,
  Bucket: Bucket,
  Boolean: Scalars['Boolean'],
  ID: Scalars['ID'],
  String: Scalars['String'],
  Job: ResolversParentTypes['PersistMediaJob'],
  Int: Scalars['Int'],
  JobStatus: JobStatus,
  LibraryState: LibraryState,
  Scrap: Scrap,
  ScrapContent: ScrapContent,
  IntString: Scalars['IntString'],
  ScrapType: ScrapType,
  DateTime: Scalars['DateTime'],
  ScrapSource: ScrapSource,
  Mutation: {},
  CreateBucketInput: CreateBucketInput,
  PersistMediaJob: PersistMediaJob,
  BucketPayload: BucketPayload,
}>;

export type BucketResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['Bucket'] = ResolversParentTypes['Bucket']> = ResolversObject<{
  expanded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type BucketListResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['BucketList'] = ResolversParentTypes['BucketList']> = ResolversObject<{
  buckets?: Resolver<Array<ResolversTypes['Bucket']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type BucketPayloadResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['BucketPayload'] = ResolversParentTypes['BucketPayload']> = ResolversObject<{
  paths?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  scraps?: Resolver<Maybe<Array<ResolversTypes['Scrap']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface IntStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IntString'], any> {
  name: 'IntString'
}

export type JobResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = ResolversObject<{
  __resolveType: TypeResolveFn<'PersistMediaJob', ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['JobStatus'], ParentType, ContextType>,
  failReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type LibraryStateResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['LibraryState'] = ResolversParentTypes['LibraryState']> = ResolversObject<{
  selectedBucketId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type MutationResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createBucket?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationCreateBucketArgs, never>>,
  selectBucket?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSelectBucketArgs, 'id'>>,
  toggleBucket?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationToggleBucketArgs, 'id'>>,
  toggleScrap?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationToggleScrapArgs, 'id'>>,
}>;

export type PersistMediaJobResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['PersistMediaJob'] = ResolversParentTypes['PersistMediaJob']> = ResolversObject<{
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['JobStatus'], ParentType, ContextType>,
  failReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  bucket?: Resolver<Maybe<ResolversTypes['Bucket']>, ParentType, ContextType>,
  scrap?: Resolver<Maybe<ResolversTypes['Scrap']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QueryResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allBuckets?: Resolver<ResolversTypes['BucketList'], ParentType, ContextType>,
  bucket?: Resolver<Maybe<ResolversTypes['Bucket']>, ParentType, ContextType, RequireFields<QueryBucketArgs, 'id'>>,
  jobs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Job']>>>, ParentType, ContextType>,
  libraryState?: Resolver<ResolversTypes['LibraryState'], ParentType, ContextType>,
  scraps?: Resolver<Array<ResolversTypes['Scrap']>, ParentType, ContextType, RequireFields<QueryScrapsArgs, 'bucketId'>>,
  test?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type ScrapResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['Scrap'] = ResolversParentTypes['Scrap']> = ResolversObject<{
  content?: Resolver<Array<ResolversTypes['ScrapContent']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  expanded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  parent?: Resolver<Maybe<ResolversTypes['Bucket']>, ParentType, ContextType>,
  source?: Resolver<Maybe<ResolversTypes['ScrapSource']>, ParentType, ContextType>,
  sourceUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ScrapContentResolvers<ContextType = GraphQLClientContext, ParentType extends ResolversParentTypes['ScrapContent'] = ResolversParentTypes['ScrapContent']> = ResolversObject<{
  key?: Resolver<ResolversTypes['IntString'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ScrapType'], ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  originalHTML?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  xPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type Resolvers<ContextType = GraphQLClientContext> = ResolversObject<{
  Bucket?: BucketResolvers<ContextType>,
  BucketList?: BucketListResolvers<ContextType>,
  BucketPayload?: BucketPayloadResolvers<ContextType>,
  DateTime?: GraphQLScalarType,
  IntString?: GraphQLScalarType,
  Job?: JobResolvers,
  LibraryState?: LibraryStateResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  PersistMediaJob?: PersistMediaJobResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Scrap?: ScrapResolvers<ContextType>,
  ScrapContent?: ScrapContentResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = GraphQLClientContext> = Resolvers<ContextType>;

export type BucketFieldsFragment = { __typename: 'Bucket', id: string, name: string, expanded: boolean };

export type ScrapFieldsFragment = { __typename: 'Scrap', id: string, title?: Maybe<string>, source?: Maybe<ScrapSource>, sourceUrl?: Maybe<string>, createdAt: DateTime, expanded: boolean, content: Array<{ __typename: 'ScrapContent', key: number | string, type: ScrapType, value: string, originalHTML?: Maybe<string>, xPath?: Maybe<string> }> };

export type ToggleBucketMutationVariables = {
  id: Scalars['String'];
  expanded?: Maybe<Scalars['Boolean']>;
};


export type ToggleBucketMutation = { __typename: 'Mutation', toggleBucket?: Maybe<boolean> };

export type SelectBucketMutationVariables = {
  id: Scalars['String'];
};


export type SelectBucketMutation = { __typename: 'Mutation', selectBucket?: Maybe<boolean> };

export type ToggleScrapMutationVariables = {
  id: Scalars['String'];
  expanded?: Maybe<Scalars['Boolean']>;
};


export type ToggleScrapMutation = { __typename: 'Mutation', toggleScrap?: Maybe<boolean> };

export type LoadAllBucketsQueryVariables = {};


export type LoadAllBucketsQuery = { __typename: 'Query', allBuckets: { __typename: 'BucketList', buckets: Array<(
      { __typename: 'Bucket' }
      & BucketFieldsFragment
    )> } };

export type LoadBucketQueryVariables = {
  id: Scalars['String'];
};


export type LoadBucketQuery = { __typename: 'Query', bucket?: Maybe<(
    { __typename: 'Bucket' }
    & BucketFieldsFragment
  )> };

export type LoadScrapsQueryVariables = {
  bucketId: Scalars['String'];
};


export type LoadScrapsQuery = { __typename: 'Query', scraps: Array<(
    { __typename: 'Scrap' }
    & ScrapFieldsFragment
  )> };

export type LibraryStateQueryVariables = {};


export type LibraryStateQuery = { __typename: 'Query', libraryState: { __typename: 'LibraryState', selectedBucketId: string } };
