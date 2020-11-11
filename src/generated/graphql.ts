import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};


export type Director = {
  __typename?: 'Director';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  age?: Maybe<Scalars['Int']>;
};

export type Movie = {
  __typename?: 'Movie';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  genre?: Maybe<Scalars['String']>;
  directorId?: Maybe<Scalars['String']>;
};

export type RefreshToken = {
  __typename?: 'RefreshToken';
  hash: Scalars['String'];
  expiry: Scalars['Date'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  password: Scalars['String'];
  refreshTokens: RefreshToken;
};

export type Auth = {
  __typename?: 'Auth';
  userId: Scalars['ID'];
  token: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type Matter = {
  __typename?: 'Matter';
  numberOfCase?: Maybe<Scalars['Int']>;
};

export type SkillName = {
  __typename?: 'SkillName';
  TypeScript: Scalars['Int'];
  JavaScript: Scalars['Int'];
  React: Scalars['Int'];
  Angular: Scalars['Int'];
  VueJs: Scalars['Int'];
  NodeJs: Scalars['Int'];
  NextJs: Scalars['Int'];
  NuxtJs: Scalars['Int'];
  ReactNative: Scalars['Int'];
  Flutter: Scalars['Int'];
  Electron: Scalars['Int'];
  Graphql: Scalars['Int'];
  Redux: Scalars['Int'];
  VueX: Scalars['Int'];
  Jest: Scalars['Int'];
  Cypress: Scalars['Int'];
  Webpack: Scalars['Int'];
};

export type Job = {
  __typename?: 'Job';
  siteName: Scalars['String'];
  jobData: SkillName;
  date: Scalars['Date'];
};

export type JobData = {
  __typename?: 'JobData';
  siteName: Scalars['String'];
  skillName: Array<Maybe<Scalars['String']>>;
  jobVacancies: Array<Maybe<Scalars['Int']>>;
  chartColor: Array<Maybe<Scalars['String']>>;
  chartBorderColor: Array<Maybe<Scalars['String']>>;
};

export type BarChartResponse = {
  __typename?: 'BarChartResponse';
  scrapingDate: Scalars['Date'];
  minDate: Scalars['Date'];
  jobData: Array<Maybe<JobData>>;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  movie?: Maybe<Movie>;
  director?: Maybe<Director>;
  movies?: Maybe<Array<Maybe<Movie>>>;
  directors?: Maybe<Array<Maybe<Director>>>;
  matters?: Maybe<Array<Maybe<Matter>>>;
  jobs?: Maybe<Array<Maybe<Job>>>;
  getBarChartList: BarChartResponse;
};


export type QueryMovieArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryGetBarChartListArgs = {
  date: Scalars['Date'];
  sortOrder: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signup: Auth;
  login: Auth;
  changePassword: User;
  addMovoie: Movie;
  updateMovie: Movie;
  deleteMovie: Movie;
  addDirector: Director;
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
  confirmNewPassword: Scalars['String'];
};


export type MutationAddMovoieArgs = {
  name: Scalars['String'];
  genre: Scalars['String'];
  directorId?: Maybe<Scalars['ID']>;
};


export type MutationUpdateMovieArgs = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  genre?: Maybe<Scalars['String']>;
  directorId?: Maybe<Scalars['Int']>;
};


export type MutationDeleteMovieArgs = {
  id: Scalars['ID'];
};


export type MutationAddDirectorArgs = {
  name?: Maybe<Scalars['String']>;
  age?: Maybe<Scalars['Int']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
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

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Director: ResolverTypeWrapper<Director>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Movie: ResolverTypeWrapper<Movie>;
  RefreshToken: ResolverTypeWrapper<RefreshToken>;
  User: ResolverTypeWrapper<User>;
  Auth: ResolverTypeWrapper<Auth>;
  Matter: ResolverTypeWrapper<Matter>;
  SkillName: ResolverTypeWrapper<SkillName>;
  Job: ResolverTypeWrapper<Job>;
  JobData: ResolverTypeWrapper<JobData>;
  BarChartResponse: ResolverTypeWrapper<BarChartResponse>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Date: Scalars['Date'];
  Director: Director;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Int: Scalars['Int'];
  Movie: Movie;
  RefreshToken: RefreshToken;
  User: User;
  Auth: Auth;
  Matter: Matter;
  SkillName: SkillName;
  Job: Job;
  JobData: JobData;
  BarChartResponse: BarChartResponse;
  Query: {};
  Mutation: {};
  Boolean: Scalars['Boolean'];
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DirectorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Director'] = ResolversParentTypes['Director']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  age?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MovieResolvers<ContextType = any, ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  genre?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  directorId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RefreshTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefreshToken'] = ResolversParentTypes['RefreshToken']> = {
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiry?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshTokens?: Resolver<ResolversTypes['RefreshToken'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type AuthResolvers<ContextType = any, ParentType extends ResolversParentTypes['Auth'] = ResolversParentTypes['Auth']> = {
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MatterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Matter'] = ResolversParentTypes['Matter']> = {
  numberOfCase?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SkillNameResolvers<ContextType = any, ParentType extends ResolversParentTypes['SkillName'] = ResolversParentTypes['SkillName']> = {
  TypeScript?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  JavaScript?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  React?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Angular?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  VueJs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  NodeJs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  NextJs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  NuxtJs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ReactNative?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Flutter?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Electron?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Graphql?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Redux?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  VueX?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Jest?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Cypress?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Webpack?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type JobResolvers<ContextType = any, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = {
  siteName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobData?: Resolver<ResolversTypes['SkillName'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type JobDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['JobData'] = ResolversParentTypes['JobData']> = {
  siteName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skillName?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  jobVacancies?: Resolver<Array<Maybe<ResolversTypes['Int']>>, ParentType, ContextType>;
  chartColor?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  chartBorderColor?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type BarChartResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['BarChartResponse'] = ResolversParentTypes['BarChartResponse']> = {
  scrapingDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  minDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  jobData?: Resolver<Array<Maybe<ResolversTypes['JobData']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  movie?: Resolver<Maybe<ResolversTypes['Movie']>, ParentType, ContextType, RequireFields<QueryMovieArgs, never>>;
  director?: Resolver<Maybe<ResolversTypes['Director']>, ParentType, ContextType>;
  movies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Movie']>>>, ParentType, ContextType>;
  directors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Director']>>>, ParentType, ContextType>;
  matters?: Resolver<Maybe<Array<Maybe<ResolversTypes['Matter']>>>, ParentType, ContextType>;
  jobs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Job']>>>, ParentType, ContextType>;
  getBarChartList?: Resolver<ResolversTypes['BarChartResponse'], ParentType, ContextType, RequireFields<QueryGetBarChartListArgs, 'date' | 'sortOrder'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  signup?: Resolver<ResolversTypes['Auth'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'password'>>;
  login?: Resolver<ResolversTypes['Auth'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  changePassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'currentPassword' | 'newPassword' | 'confirmNewPassword'>>;
  addMovoie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationAddMovoieArgs, 'name' | 'genre'>>;
  updateMovie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationUpdateMovieArgs, 'id'>>;
  deleteMovie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationDeleteMovieArgs, 'id'>>;
  addDirector?: Resolver<ResolversTypes['Director'], ParentType, ContextType, RequireFields<MutationAddDirectorArgs, never>>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Director?: DirectorResolvers<ContextType>;
  Movie?: MovieResolvers<ContextType>;
  RefreshToken?: RefreshTokenResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Auth?: AuthResolvers<ContextType>;
  Matter?: MatterResolvers<ContextType>;
  SkillName?: SkillNameResolvers<ContextType>;
  Job?: JobResolvers<ContextType>;
  JobData?: JobDataResolvers<ContextType>;
  BarChartResponse?: BarChartResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
