import * as schema from '@/lib/schema';

import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm';
type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;
import type { Exact } from 'type-fest';

type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferQueryModel<
  TableName extends keyof TSchema,
  QBConfig extends Exact<QueryConfig<TableName>, QBConfig> = {}
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;
