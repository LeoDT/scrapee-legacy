/* eslint-disable */
import { DateTime } from 'luxon';
import { GraphQLServerContext } from './server/types'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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



export interface AppConfig {
   __typename?: 'AppConfig';
  rootPath: Scalars['String'];
}

export interface Node {
  id: Scalars['ID'];
}

export interface Bucket  extends Node {
   __typename?: 'Bucket';
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
   __typename?: 'ScrapContent';
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
   __typename?: 'Scrap';
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
   __typename?: 'FakeJobData';
  fake: Scalars['String'];
}

export interface PersistMediaJobData {
   __typename?: 'PersistMediaJobData';
  scrapId: Scalars['ID'];
}

export type JobData = PersistMediaJobData | FakeJobData;

export interface Job  extends Node {
   __typename?: 'Job';
  id: Scalars['ID'];
  type: JobType;
  priority: Scalars['Int'];
  status: JobStatus;
  failReason?: Maybe<Scalars['String']>;
  interval?: Maybe<Scalars['Int']>;
  data?: Maybe<JobData>;
}

export interface Query {
   __typename?: 'Query';
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
   __typename?: 'Mutation';
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

export interface Subscription {
   __typename?: 'Subscription';
  bucketsUpdate: Scalars['DateTime'];
  bucketUpdate: Bucket;
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
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  IntString: ResolverTypeWrapper<Scalars['IntString']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  AppConfig: ResolverTypeWrapper<AppConfig>,
  Node: ResolversTypes['Bucket'] | ResolversTypes['Scrap'] | ResolversTypes['Job'],
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Bucket: ResolverTypeWrapper<Bucket>,
  CreateBucketInput: CreateBucketInput,
  TrashBucketInput: TrashBucketInput,
  ScrapSource: ScrapSource,
  ScrapType: ScrapType,
  ScrapContent: ResolverTypeWrapper<ScrapContent>,
  ScrapContentInput: ScrapContentInput,
  Scrap: ResolverTypeWrapper<Scrap>,
  CreateScrapInput: CreateScrapInput,
  JobStatus: JobStatus,
  JobType: JobType,
  FakeJobData: ResolverTypeWrapper<FakeJobData>,
  PersistMediaJobData: ResolverTypeWrapper<PersistMediaJobData>,
  JobData: ResolversTypes['PersistMediaJobData'] | ResolversTypes['FakeJobData'],
  Job: ResolverTypeWrapper<Omit<Job, 'data'> & { data?: Maybe<ResolversTypes['JobData']> }>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Query: ResolverTypeWrapper<{}>,
  Mutation: ResolverTypeWrapper<{}>,
  Subscription: ResolverTypeWrapper<{}>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  IntString: Scalars['IntString'],
  DateTime: Scalars['DateTime'],
  AppConfig: AppConfig,
  Node: ResolversParentTypes['Bucket'] | ResolversParentTypes['Scrap'] | ResolversParentTypes['Job'],
  ID: Scalars['ID'],
  Bucket: Bucket,
  CreateBucketInput: CreateBucketInput,
  TrashBucketInput: TrashBucketInput,
  ScrapSource: ScrapSource,
  ScrapType: ScrapType,
  ScrapContent: ScrapContent,
  ScrapContentInput: ScrapContentInput,
  Scrap: Scrap,
  CreateScrapInput: CreateScrapInput,
  JobStatus: JobStatus,
  JobType: JobType,
  FakeJobData: FakeJobData,
  PersistMediaJobData: PersistMediaJobData,
  JobData: ResolversParentTypes['PersistMediaJobData'] | ResolversParentTypes['FakeJobData'],
  Job: Omit<Job, 'data'> & { data?: Maybe<ResolversParentTypes['JobData']> },
  Int: Scalars['Int'],
  Query: {},
  Mutation: {},
  Subscription: {},
}>;

export interface IntStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IntString'], any> {
  name: 'IntString'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type AppConfigResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['AppConfig'] = ResolversParentTypes['AppConfig']> = ResolversObject<{
  rootPath?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Bucket' | 'Scrap' | 'Job', ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
}>;

export type BucketResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Bucket'] = ResolversParentTypes['Bucket']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
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

export type ScrapResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Scrap'] = ResolversParentTypes['Scrap']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  bucketId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  content?: Resolver<Array<ResolversTypes['ScrapContent']>, ParentType, ContextType>,
  source?: Resolver<Maybe<ResolversTypes['ScrapSource']>, ParentType, ContextType>,
  sourceUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type FakeJobDataResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['FakeJobData'] = ResolversParentTypes['FakeJobData']> = ResolversObject<{
  fake?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type PersistMediaJobDataResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['PersistMediaJobData'] = ResolversParentTypes['PersistMediaJobData']> = ResolversObject<{
  scrapId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type JobDataResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['JobData'] = ResolversParentTypes['JobData']> = ResolversObject<{
  __resolveType: TypeResolveFn<'PersistMediaJobData' | 'FakeJobData', ParentType, ContextType>
}>;

export type JobResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['JobType'], ParentType, ContextType>,
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['JobStatus'], ParentType, ContextType>,
  failReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  interval?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  data?: Resolver<Maybe<ResolversTypes['JobData']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QueryResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  appConfig?: Resolver<ResolversTypes['AppConfig'], ParentType, ContextType>,
  test?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  buckets?: Resolver<Array<ResolversTypes['Bucket']>, ParentType, ContextType>,
  bucket?: Resolver<Maybe<ResolversTypes['Bucket']>, ParentType, ContextType, RequireFields<QueryBucketArgs, 'id'>>,
  scraps?: Resolver<Array<ResolversTypes['Scrap']>, ParentType, ContextType, RequireFields<QueryScrapsArgs, 'bucketId'>>,
  jobs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Job']>>>, ParentType, ContextType>,
}>;

export type MutationResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createBucket?: Resolver<Maybe<ResolversTypes['Bucket']>, ParentType, ContextType, RequireFields<MutationCreateBucketArgs, 'input'>>,
  trashBucket?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationTrashBucketArgs, 'input'>>,
  createScrap?: Resolver<Maybe<ResolversTypes['Scrap']>, ParentType, ContextType, RequireFields<MutationCreateScrapArgs, 'input'>>,
}>;

export type SubscriptionResolvers<ContextType = GraphQLServerContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  bucketsUpdate?: SubscriptionResolver<ResolversTypes['DateTime'], "bucketsUpdate", ParentType, ContextType>,
  bucketUpdate?: SubscriptionResolver<ResolversTypes['Bucket'], "bucketUpdate", ParentType, ContextType>,
}>;

export type Resolvers<ContextType = GraphQLServerContext> = ResolversObject<{
  IntString?: GraphQLScalarType,
  DateTime?: GraphQLScalarType,
  AppConfig?: AppConfigResolvers<ContextType>,
  Node?: NodeResolvers,
  Bucket?: BucketResolvers<ContextType>,
  ScrapContent?: ScrapContentResolvers<ContextType>,
  Scrap?: ScrapResolvers<ContextType>,
  FakeJobData?: FakeJobDataResolvers<ContextType>,
  PersistMediaJobData?: PersistMediaJobDataResolvers<ContextType>,
  JobData?: JobDataResolvers,
  Job?: JobResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = GraphQLServerContext> = Resolvers<ContextType>;
