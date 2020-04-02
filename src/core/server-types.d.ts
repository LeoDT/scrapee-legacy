/* eslint-disable */
import { DateTime } from 'luxon';
import { GraphQLServerContext } from './server/types'
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
  id: Scalars['ID'];
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

export interface Mutation {
  createBucket?: Maybe<Scalars['String']>;
}


export interface MutationCreateBucketArgs {
  input?: Maybe<CreateBucketInput>;
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
  test?: Maybe<Scalars['String']>;
  allBuckets: BucketList;
  bucket?: Maybe<Bucket>;
  scraps: Array<Scrap>;
  jobs?: Maybe<Array<Maybe<Job>>>;
}


export interface QueryBucketArgs {
  id: Scalars['String'];
}


export interface QueryScrapsArgs {
  bucketId: Scalars['String'];
}

export interface Scrap {
  id: Scalars['ID'];
  parent?: Maybe<Bucket>;
  title?: Maybe<Scalars['String']>;
  source?: Maybe<ScrapSource>;
  sourceUrl?: Maybe<Scalars['String']>;
  content: Array<ScrapContent>;
  createdAt: Scalars['DateTime'];
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
  String: ResolverTypeWrapper<Scalars['String']>,
  BucketList: ResolverTypeWrapper<BucketList>,
  Bucket: ResolverTypeWrapper<Bucket>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Scrap: ResolverTypeWrapper<Scrap>,
  ScrapSource: ScrapSource,
  ScrapContent: ResolverTypeWrapper<ScrapContent>,
  IntString: ResolverTypeWrapper<Scalars['IntString']>,
  ScrapType: ScrapType,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  Job: ResolversTypes['PersistMediaJob'],
  Int: ResolverTypeWrapper<Scalars['Int']>,
  JobStatus: JobStatus,
  Mutation: ResolverTypeWrapper<{}>,
  CreateBucketInput: CreateBucketInput,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  PersistMediaJob: ResolverTypeWrapper<PersistMediaJob>,
  BucketPayload: ResolverTypeWrapper<BucketPayload>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  String: Scalars['String'],
  BucketList: BucketList,
  Bucket: Bucket,
  ID: Scalars['ID'],
  Scrap: Scrap,
  ScrapSource: ScrapSource,
  ScrapContent: ScrapContent,
  IntString: Scalars['IntString'],
  ScrapType: ScrapType,
  DateTime: Scalars['DateTime'],
  Job: ResolversParentTypes['PersistMediaJob'],
  Int: Scalars['Int'],
  JobStatus: JobStatus,
  Mutation: {},
  CreateBucketInput: CreateBucketInput,
  Boolean: Scalars['Boolean'],
  PersistMediaJob: PersistMediaJob,
  BucketPayload: BucketPayload,
}>;

export type BucketResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Bucket'] = ResolversParentTypes['Bucket']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type BucketListResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['BucketList'] = ResolversParentTypes['BucketList']> = ResolversObject<{
  buckets?: Resolver<Array<ResolversTypes['Bucket']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type BucketPayloadResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['BucketPayload'] = ResolversParentTypes['BucketPayload']> = ResolversObject<{
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

export type JobResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = ResolversObject<{
  __resolveType: TypeResolveFn<'PersistMediaJob', ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['JobStatus'], ParentType, ContextType>,
  failReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type MutationResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createBucket?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationCreateBucketArgs, never>>,
}>;

export type PersistMediaJobResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['PersistMediaJob'] = ResolversParentTypes['PersistMediaJob']> = ResolversObject<{
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['JobStatus'], ParentType, ContextType>,
  failReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  bucket?: Resolver<Maybe<ResolversTypes['Bucket']>, ParentType, ContextType>,
  scrap?: Resolver<Maybe<ResolversTypes['Scrap']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QueryResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  test?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  allBuckets?: Resolver<ResolversTypes['BucketList'], ParentType, ContextType>,
  bucket?: Resolver<Maybe<ResolversTypes['Bucket']>, ParentType, ContextType, RequireFields<QueryBucketArgs, 'id'>>,
  scraps?: Resolver<Array<ResolversTypes['Scrap']>, ParentType, ContextType, RequireFields<QueryScrapsArgs, 'bucketId'>>,
  jobs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Job']>>>, ParentType, ContextType>,
}>;

export type ScrapResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Scrap'] = ResolversParentTypes['Scrap']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  parent?: Resolver<Maybe<ResolversTypes['Bucket']>, ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  source?: Resolver<Maybe<ResolversTypes['ScrapSource']>, ParentType, ContextType>,
  sourceUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  content?: Resolver<Array<ResolversTypes['ScrapContent']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ScrapContentResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['ScrapContent'] = ResolversParentTypes['ScrapContent']> = ResolversObject<{
  key?: Resolver<ResolversTypes['IntString'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ScrapType'], ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  originalHTML?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  xPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type Resolvers<ContextType = GraphQLServerContext> = ResolversObject<{
  Bucket?: BucketResolvers<ContextType>,
  BucketList?: BucketListResolvers<ContextType>,
  BucketPayload?: BucketPayloadResolvers<ContextType>,
  DateTime?: GraphQLScalarType,
  IntString?: GraphQLScalarType,
  Job?: JobResolvers,
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
export type IResolvers<ContextType = GraphQLServerContext> = Resolvers<ContextType>;
