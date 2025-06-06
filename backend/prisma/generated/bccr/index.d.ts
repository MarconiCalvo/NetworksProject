
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model sinpe_subscriptions
 * 
 */
export type sinpe_subscriptions = $Result.DefaultSelection<Prisma.$sinpe_subscriptionsPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Sinpe_subscriptions
 * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Sinpe_subscriptions
   * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.sinpe_subscriptions`: Exposes CRUD operations for the **sinpe_subscriptions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sinpe_subscriptions
    * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findMany()
    * ```
    */
  get sinpe_subscriptions(): Prisma.sinpe_subscriptionsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    sinpe_subscriptions: 'sinpe_subscriptions'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "sinpe_subscriptions"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      sinpe_subscriptions: {
        payload: Prisma.$sinpe_subscriptionsPayload<ExtArgs>
        fields: Prisma.sinpe_subscriptionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sinpe_subscriptionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sinpe_subscriptionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          findFirst: {
            args: Prisma.sinpe_subscriptionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sinpe_subscriptionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          findMany: {
            args: Prisma.sinpe_subscriptionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>[]
          }
          create: {
            args: Prisma.sinpe_subscriptionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          createMany: {
            args: Prisma.sinpe_subscriptionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.sinpe_subscriptionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>[]
          }
          delete: {
            args: Prisma.sinpe_subscriptionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          update: {
            args: Prisma.sinpe_subscriptionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          deleteMany: {
            args: Prisma.sinpe_subscriptionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sinpe_subscriptionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.sinpe_subscriptionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>[]
          }
          upsert: {
            args: Prisma.sinpe_subscriptionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          aggregate: {
            args: Prisma.Sinpe_subscriptionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSinpe_subscriptions>
          }
          groupBy: {
            args: Prisma.sinpe_subscriptionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Sinpe_subscriptionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.sinpe_subscriptionsCountArgs<ExtArgs>
            result: $Utils.Optional<Sinpe_subscriptionsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    sinpe_subscriptions?: sinpe_subscriptionsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model sinpe_subscriptions
   */

  export type AggregateSinpe_subscriptions = {
    _count: Sinpe_subscriptionsCountAggregateOutputType | null
    _min: Sinpe_subscriptionsMinAggregateOutputType | null
    _max: Sinpe_subscriptionsMaxAggregateOutputType | null
  }

  export type Sinpe_subscriptionsMinAggregateOutputType = {
    sinpe_number: string | null
    sinpe_bank_code: string | null
    sinpe_client_name: string | null
  }

  export type Sinpe_subscriptionsMaxAggregateOutputType = {
    sinpe_number: string | null
    sinpe_bank_code: string | null
    sinpe_client_name: string | null
  }

  export type Sinpe_subscriptionsCountAggregateOutputType = {
    sinpe_number: number
    sinpe_bank_code: number
    sinpe_client_name: number
    _all: number
  }


  export type Sinpe_subscriptionsMinAggregateInputType = {
    sinpe_number?: true
    sinpe_bank_code?: true
    sinpe_client_name?: true
  }

  export type Sinpe_subscriptionsMaxAggregateInputType = {
    sinpe_number?: true
    sinpe_bank_code?: true
    sinpe_client_name?: true
  }

  export type Sinpe_subscriptionsCountAggregateInputType = {
    sinpe_number?: true
    sinpe_bank_code?: true
    sinpe_client_name?: true
    _all?: true
  }

  export type Sinpe_subscriptionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sinpe_subscriptions to aggregate.
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sinpe_subscriptions to fetch.
     */
    orderBy?: sinpe_subscriptionsOrderByWithRelationInput | sinpe_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sinpe_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sinpe_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sinpe_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sinpe_subscriptions
    **/
    _count?: true | Sinpe_subscriptionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Sinpe_subscriptionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Sinpe_subscriptionsMaxAggregateInputType
  }

  export type GetSinpe_subscriptionsAggregateType<T extends Sinpe_subscriptionsAggregateArgs> = {
        [P in keyof T & keyof AggregateSinpe_subscriptions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSinpe_subscriptions[P]>
      : GetScalarType<T[P], AggregateSinpe_subscriptions[P]>
  }




  export type sinpe_subscriptionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sinpe_subscriptionsWhereInput
    orderBy?: sinpe_subscriptionsOrderByWithAggregationInput | sinpe_subscriptionsOrderByWithAggregationInput[]
    by: Sinpe_subscriptionsScalarFieldEnum[] | Sinpe_subscriptionsScalarFieldEnum
    having?: sinpe_subscriptionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Sinpe_subscriptionsCountAggregateInputType | true
    _min?: Sinpe_subscriptionsMinAggregateInputType
    _max?: Sinpe_subscriptionsMaxAggregateInputType
  }

  export type Sinpe_subscriptionsGroupByOutputType = {
    sinpe_number: string
    sinpe_bank_code: string
    sinpe_client_name: string
    _count: Sinpe_subscriptionsCountAggregateOutputType | null
    _min: Sinpe_subscriptionsMinAggregateOutputType | null
    _max: Sinpe_subscriptionsMaxAggregateOutputType | null
  }

  type GetSinpe_subscriptionsGroupByPayload<T extends sinpe_subscriptionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Sinpe_subscriptionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Sinpe_subscriptionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Sinpe_subscriptionsGroupByOutputType[P]>
            : GetScalarType<T[P], Sinpe_subscriptionsGroupByOutputType[P]>
        }
      >
    >


  export type sinpe_subscriptionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sinpe_number?: boolean
    sinpe_bank_code?: boolean
    sinpe_client_name?: boolean
  }, ExtArgs["result"]["sinpe_subscriptions"]>

  export type sinpe_subscriptionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sinpe_number?: boolean
    sinpe_bank_code?: boolean
    sinpe_client_name?: boolean
  }, ExtArgs["result"]["sinpe_subscriptions"]>

  export type sinpe_subscriptionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sinpe_number?: boolean
    sinpe_bank_code?: boolean
    sinpe_client_name?: boolean
  }, ExtArgs["result"]["sinpe_subscriptions"]>

  export type sinpe_subscriptionsSelectScalar = {
    sinpe_number?: boolean
    sinpe_bank_code?: boolean
    sinpe_client_name?: boolean
  }

  export type sinpe_subscriptionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"sinpe_number" | "sinpe_bank_code" | "sinpe_client_name", ExtArgs["result"]["sinpe_subscriptions"]>

  export type $sinpe_subscriptionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sinpe_subscriptions"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      sinpe_number: string
      sinpe_bank_code: string
      sinpe_client_name: string
    }, ExtArgs["result"]["sinpe_subscriptions"]>
    composites: {}
  }

  type sinpe_subscriptionsGetPayload<S extends boolean | null | undefined | sinpe_subscriptionsDefaultArgs> = $Result.GetResult<Prisma.$sinpe_subscriptionsPayload, S>

  type sinpe_subscriptionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<sinpe_subscriptionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Sinpe_subscriptionsCountAggregateInputType | true
    }

  export interface sinpe_subscriptionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sinpe_subscriptions'], meta: { name: 'sinpe_subscriptions' } }
    /**
     * Find zero or one Sinpe_subscriptions that matches the filter.
     * @param {sinpe_subscriptionsFindUniqueArgs} args - Arguments to find a Sinpe_subscriptions
     * @example
     * // Get one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sinpe_subscriptionsFindUniqueArgs>(args: SelectSubset<T, sinpe_subscriptionsFindUniqueArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sinpe_subscriptions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sinpe_subscriptionsFindUniqueOrThrowArgs} args - Arguments to find a Sinpe_subscriptions
     * @example
     * // Get one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sinpe_subscriptionsFindUniqueOrThrowArgs>(args: SelectSubset<T, sinpe_subscriptionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sinpe_subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsFindFirstArgs} args - Arguments to find a Sinpe_subscriptions
     * @example
     * // Get one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sinpe_subscriptionsFindFirstArgs>(args?: SelectSubset<T, sinpe_subscriptionsFindFirstArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sinpe_subscriptions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsFindFirstOrThrowArgs} args - Arguments to find a Sinpe_subscriptions
     * @example
     * // Get one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sinpe_subscriptionsFindFirstOrThrowArgs>(args?: SelectSubset<T, sinpe_subscriptionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sinpe_subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findMany()
     * 
     * // Get first 10 Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findMany({ take: 10 })
     * 
     * // Only select the `sinpe_number`
     * const sinpe_subscriptionsWithSinpe_numberOnly = await prisma.sinpe_subscriptions.findMany({ select: { sinpe_number: true } })
     * 
     */
    findMany<T extends sinpe_subscriptionsFindManyArgs>(args?: SelectSubset<T, sinpe_subscriptionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sinpe_subscriptions.
     * @param {sinpe_subscriptionsCreateArgs} args - Arguments to create a Sinpe_subscriptions.
     * @example
     * // Create one Sinpe_subscriptions
     * const Sinpe_subscriptions = await prisma.sinpe_subscriptions.create({
     *   data: {
     *     // ... data to create a Sinpe_subscriptions
     *   }
     * })
     * 
     */
    create<T extends sinpe_subscriptionsCreateArgs>(args: SelectSubset<T, sinpe_subscriptionsCreateArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sinpe_subscriptions.
     * @param {sinpe_subscriptionsCreateManyArgs} args - Arguments to create many Sinpe_subscriptions.
     * @example
     * // Create many Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sinpe_subscriptionsCreateManyArgs>(args?: SelectSubset<T, sinpe_subscriptionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sinpe_subscriptions and returns the data saved in the database.
     * @param {sinpe_subscriptionsCreateManyAndReturnArgs} args - Arguments to create many Sinpe_subscriptions.
     * @example
     * // Create many Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sinpe_subscriptions and only return the `sinpe_number`
     * const sinpe_subscriptionsWithSinpe_numberOnly = await prisma.sinpe_subscriptions.createManyAndReturn({
     *   select: { sinpe_number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends sinpe_subscriptionsCreateManyAndReturnArgs>(args?: SelectSubset<T, sinpe_subscriptionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sinpe_subscriptions.
     * @param {sinpe_subscriptionsDeleteArgs} args - Arguments to delete one Sinpe_subscriptions.
     * @example
     * // Delete one Sinpe_subscriptions
     * const Sinpe_subscriptions = await prisma.sinpe_subscriptions.delete({
     *   where: {
     *     // ... filter to delete one Sinpe_subscriptions
     *   }
     * })
     * 
     */
    delete<T extends sinpe_subscriptionsDeleteArgs>(args: SelectSubset<T, sinpe_subscriptionsDeleteArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sinpe_subscriptions.
     * @param {sinpe_subscriptionsUpdateArgs} args - Arguments to update one Sinpe_subscriptions.
     * @example
     * // Update one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sinpe_subscriptionsUpdateArgs>(args: SelectSubset<T, sinpe_subscriptionsUpdateArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sinpe_subscriptions.
     * @param {sinpe_subscriptionsDeleteManyArgs} args - Arguments to filter Sinpe_subscriptions to delete.
     * @example
     * // Delete a few Sinpe_subscriptions
     * const { count } = await prisma.sinpe_subscriptions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sinpe_subscriptionsDeleteManyArgs>(args?: SelectSubset<T, sinpe_subscriptionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sinpe_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sinpe_subscriptionsUpdateManyArgs>(args: SelectSubset<T, sinpe_subscriptionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sinpe_subscriptions and returns the data updated in the database.
     * @param {sinpe_subscriptionsUpdateManyAndReturnArgs} args - Arguments to update many Sinpe_subscriptions.
     * @example
     * // Update many Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sinpe_subscriptions and only return the `sinpe_number`
     * const sinpe_subscriptionsWithSinpe_numberOnly = await prisma.sinpe_subscriptions.updateManyAndReturn({
     *   select: { sinpe_number: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends sinpe_subscriptionsUpdateManyAndReturnArgs>(args: SelectSubset<T, sinpe_subscriptionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sinpe_subscriptions.
     * @param {sinpe_subscriptionsUpsertArgs} args - Arguments to update or create a Sinpe_subscriptions.
     * @example
     * // Update or create a Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.upsert({
     *   create: {
     *     // ... data to create a Sinpe_subscriptions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sinpe_subscriptions we want to update
     *   }
     * })
     */
    upsert<T extends sinpe_subscriptionsUpsertArgs>(args: SelectSubset<T, sinpe_subscriptionsUpsertArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sinpe_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsCountArgs} args - Arguments to filter Sinpe_subscriptions to count.
     * @example
     * // Count the number of Sinpe_subscriptions
     * const count = await prisma.sinpe_subscriptions.count({
     *   where: {
     *     // ... the filter for the Sinpe_subscriptions we want to count
     *   }
     * })
    **/
    count<T extends sinpe_subscriptionsCountArgs>(
      args?: Subset<T, sinpe_subscriptionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Sinpe_subscriptionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sinpe_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Sinpe_subscriptionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Sinpe_subscriptionsAggregateArgs>(args: Subset<T, Sinpe_subscriptionsAggregateArgs>): Prisma.PrismaPromise<GetSinpe_subscriptionsAggregateType<T>>

    /**
     * Group by Sinpe_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends sinpe_subscriptionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sinpe_subscriptionsGroupByArgs['orderBy'] }
        : { orderBy?: sinpe_subscriptionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, sinpe_subscriptionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSinpe_subscriptionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sinpe_subscriptions model
   */
  readonly fields: sinpe_subscriptionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sinpe_subscriptions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sinpe_subscriptionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the sinpe_subscriptions model
   */
  interface sinpe_subscriptionsFieldRefs {
    readonly sinpe_number: FieldRef<"sinpe_subscriptions", 'String'>
    readonly sinpe_bank_code: FieldRef<"sinpe_subscriptions", 'String'>
    readonly sinpe_client_name: FieldRef<"sinpe_subscriptions", 'String'>
  }
    

  // Custom InputTypes
  /**
   * sinpe_subscriptions findUnique
   */
  export type sinpe_subscriptionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where: sinpe_subscriptionsWhereUniqueInput
  }

  /**
   * sinpe_subscriptions findUniqueOrThrow
   */
  export type sinpe_subscriptionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where: sinpe_subscriptionsWhereUniqueInput
  }

  /**
   * sinpe_subscriptions findFirst
   */
  export type sinpe_subscriptionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sinpe_subscriptions to fetch.
     */
    orderBy?: sinpe_subscriptionsOrderByWithRelationInput | sinpe_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sinpe_subscriptions.
     */
    cursor?: sinpe_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sinpe_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sinpe_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sinpe_subscriptions.
     */
    distinct?: Sinpe_subscriptionsScalarFieldEnum | Sinpe_subscriptionsScalarFieldEnum[]
  }

  /**
   * sinpe_subscriptions findFirstOrThrow
   */
  export type sinpe_subscriptionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sinpe_subscriptions to fetch.
     */
    orderBy?: sinpe_subscriptionsOrderByWithRelationInput | sinpe_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sinpe_subscriptions.
     */
    cursor?: sinpe_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sinpe_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sinpe_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sinpe_subscriptions.
     */
    distinct?: Sinpe_subscriptionsScalarFieldEnum | Sinpe_subscriptionsScalarFieldEnum[]
  }

  /**
   * sinpe_subscriptions findMany
   */
  export type sinpe_subscriptionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sinpe_subscriptions to fetch.
     */
    orderBy?: sinpe_subscriptionsOrderByWithRelationInput | sinpe_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sinpe_subscriptions.
     */
    cursor?: sinpe_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sinpe_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sinpe_subscriptions.
     */
    skip?: number
    distinct?: Sinpe_subscriptionsScalarFieldEnum | Sinpe_subscriptionsScalarFieldEnum[]
  }

  /**
   * sinpe_subscriptions create
   */
  export type sinpe_subscriptionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * The data needed to create a sinpe_subscriptions.
     */
    data: XOR<sinpe_subscriptionsCreateInput, sinpe_subscriptionsUncheckedCreateInput>
  }

  /**
   * sinpe_subscriptions createMany
   */
  export type sinpe_subscriptionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sinpe_subscriptions.
     */
    data: sinpe_subscriptionsCreateManyInput | sinpe_subscriptionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sinpe_subscriptions createManyAndReturn
   */
  export type sinpe_subscriptionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * The data used to create many sinpe_subscriptions.
     */
    data: sinpe_subscriptionsCreateManyInput | sinpe_subscriptionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sinpe_subscriptions update
   */
  export type sinpe_subscriptionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * The data needed to update a sinpe_subscriptions.
     */
    data: XOR<sinpe_subscriptionsUpdateInput, sinpe_subscriptionsUncheckedUpdateInput>
    /**
     * Choose, which sinpe_subscriptions to update.
     */
    where: sinpe_subscriptionsWhereUniqueInput
  }

  /**
   * sinpe_subscriptions updateMany
   */
  export type sinpe_subscriptionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sinpe_subscriptions.
     */
    data: XOR<sinpe_subscriptionsUpdateManyMutationInput, sinpe_subscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which sinpe_subscriptions to update
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * Limit how many sinpe_subscriptions to update.
     */
    limit?: number
  }

  /**
   * sinpe_subscriptions updateManyAndReturn
   */
  export type sinpe_subscriptionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * The data used to update sinpe_subscriptions.
     */
    data: XOR<sinpe_subscriptionsUpdateManyMutationInput, sinpe_subscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which sinpe_subscriptions to update
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * Limit how many sinpe_subscriptions to update.
     */
    limit?: number
  }

  /**
   * sinpe_subscriptions upsert
   */
  export type sinpe_subscriptionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * The filter to search for the sinpe_subscriptions to update in case it exists.
     */
    where: sinpe_subscriptionsWhereUniqueInput
    /**
     * In case the sinpe_subscriptions found by the `where` argument doesn't exist, create a new sinpe_subscriptions with this data.
     */
    create: XOR<sinpe_subscriptionsCreateInput, sinpe_subscriptionsUncheckedCreateInput>
    /**
     * In case the sinpe_subscriptions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sinpe_subscriptionsUpdateInput, sinpe_subscriptionsUncheckedUpdateInput>
  }

  /**
   * sinpe_subscriptions delete
   */
  export type sinpe_subscriptionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter which sinpe_subscriptions to delete.
     */
    where: sinpe_subscriptionsWhereUniqueInput
  }

  /**
   * sinpe_subscriptions deleteMany
   */
  export type sinpe_subscriptionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sinpe_subscriptions to delete
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * Limit how many sinpe_subscriptions to delete.
     */
    limit?: number
  }

  /**
   * sinpe_subscriptions without action
   */
  export type sinpe_subscriptionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Sinpe_subscriptionsScalarFieldEnum: {
    sinpe_number: 'sinpe_number',
    sinpe_bank_code: 'sinpe_bank_code',
    sinpe_client_name: 'sinpe_client_name'
  };

  export type Sinpe_subscriptionsScalarFieldEnum = (typeof Sinpe_subscriptionsScalarFieldEnum)[keyof typeof Sinpe_subscriptionsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type sinpe_subscriptionsWhereInput = {
    AND?: sinpe_subscriptionsWhereInput | sinpe_subscriptionsWhereInput[]
    OR?: sinpe_subscriptionsWhereInput[]
    NOT?: sinpe_subscriptionsWhereInput | sinpe_subscriptionsWhereInput[]
    sinpe_number?: StringFilter<"sinpe_subscriptions"> | string
    sinpe_bank_code?: StringFilter<"sinpe_subscriptions"> | string
    sinpe_client_name?: StringFilter<"sinpe_subscriptions"> | string
  }

  export type sinpe_subscriptionsOrderByWithRelationInput = {
    sinpe_number?: SortOrder
    sinpe_bank_code?: SortOrder
    sinpe_client_name?: SortOrder
  }

  export type sinpe_subscriptionsWhereUniqueInput = Prisma.AtLeast<{
    sinpe_number?: string
    sinpe_client_name?: string
    AND?: sinpe_subscriptionsWhereInput | sinpe_subscriptionsWhereInput[]
    OR?: sinpe_subscriptionsWhereInput[]
    NOT?: sinpe_subscriptionsWhereInput | sinpe_subscriptionsWhereInput[]
    sinpe_bank_code?: StringFilter<"sinpe_subscriptions"> | string
  }, "sinpe_number" | "sinpe_client_name">

  export type sinpe_subscriptionsOrderByWithAggregationInput = {
    sinpe_number?: SortOrder
    sinpe_bank_code?: SortOrder
    sinpe_client_name?: SortOrder
    _count?: sinpe_subscriptionsCountOrderByAggregateInput
    _max?: sinpe_subscriptionsMaxOrderByAggregateInput
    _min?: sinpe_subscriptionsMinOrderByAggregateInput
  }

  export type sinpe_subscriptionsScalarWhereWithAggregatesInput = {
    AND?: sinpe_subscriptionsScalarWhereWithAggregatesInput | sinpe_subscriptionsScalarWhereWithAggregatesInput[]
    OR?: sinpe_subscriptionsScalarWhereWithAggregatesInput[]
    NOT?: sinpe_subscriptionsScalarWhereWithAggregatesInput | sinpe_subscriptionsScalarWhereWithAggregatesInput[]
    sinpe_number?: StringWithAggregatesFilter<"sinpe_subscriptions"> | string
    sinpe_bank_code?: StringWithAggregatesFilter<"sinpe_subscriptions"> | string
    sinpe_client_name?: StringWithAggregatesFilter<"sinpe_subscriptions"> | string
  }

  export type sinpe_subscriptionsCreateInput = {
    sinpe_number: string
    sinpe_bank_code: string
    sinpe_client_name: string
  }

  export type sinpe_subscriptionsUncheckedCreateInput = {
    sinpe_number: string
    sinpe_bank_code: string
    sinpe_client_name: string
  }

  export type sinpe_subscriptionsUpdateInput = {
    sinpe_number?: StringFieldUpdateOperationsInput | string
    sinpe_bank_code?: StringFieldUpdateOperationsInput | string
    sinpe_client_name?: StringFieldUpdateOperationsInput | string
  }

  export type sinpe_subscriptionsUncheckedUpdateInput = {
    sinpe_number?: StringFieldUpdateOperationsInput | string
    sinpe_bank_code?: StringFieldUpdateOperationsInput | string
    sinpe_client_name?: StringFieldUpdateOperationsInput | string
  }

  export type sinpe_subscriptionsCreateManyInput = {
    sinpe_number: string
    sinpe_bank_code: string
    sinpe_client_name: string
  }

  export type sinpe_subscriptionsUpdateManyMutationInput = {
    sinpe_number?: StringFieldUpdateOperationsInput | string
    sinpe_bank_code?: StringFieldUpdateOperationsInput | string
    sinpe_client_name?: StringFieldUpdateOperationsInput | string
  }

  export type sinpe_subscriptionsUncheckedUpdateManyInput = {
    sinpe_number?: StringFieldUpdateOperationsInput | string
    sinpe_bank_code?: StringFieldUpdateOperationsInput | string
    sinpe_client_name?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type sinpe_subscriptionsCountOrderByAggregateInput = {
    sinpe_number?: SortOrder
    sinpe_bank_code?: SortOrder
    sinpe_client_name?: SortOrder
  }

  export type sinpe_subscriptionsMaxOrderByAggregateInput = {
    sinpe_number?: SortOrder
    sinpe_bank_code?: SortOrder
    sinpe_client_name?: SortOrder
  }

  export type sinpe_subscriptionsMinOrderByAggregateInput = {
    sinpe_number?: SortOrder
    sinpe_bank_code?: SortOrder
    sinpe_client_name?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}