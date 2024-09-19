import { clsx, type ClassValue } from 'clsx';
import {
  getTableColumns,
  is,
  SelectedFields,
  SQL,
  sql,
  Table,
} from 'drizzle-orm';
import { twMerge } from 'tailwind-merge';
import { products } from './schema';
import * as schema from './schema';
import { PgTimestampString } from 'drizzle-orm/pg-core';
import { SelectResultFields } from 'drizzle-orm/query-builders/select.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeconds(seconds: number) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  let formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  let formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
}

export enum Role {
  APPLICANT = 'applicant',
  TRAINER = 'trainer',
  ADMIN = 'admin',
}

export function enumToPgEnum(myEnum: any): [string, ...string[]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as [
    string,
    ...string[]
  ];
}

export const getColStringForJSONBuildObj = (
  table: Table['_']['columns'],
  table_name: string
) => {
  let colString = '';
  const objectKeysLength = Object.keys(table).length;
  Object.keys(table).map((key, ind) => {
    colString += ` '${key}', ${table_name}.${table[key].name} `;
    if (ind < objectKeysLength - 1) {
      colString += ',';
    }
  });
  return colString;
};

export function jsonBuildObject<T extends SelectedFields<any, any>>(shape: T) {
  const chunks: SQL[] = [];
  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }
    chunks.push(sql.raw(`'${key}',`));
    if (is(value, PgTimestampString)) {
      chunks.push(sql`timezone('UTC', ${value})`);
    } else {
      chunks.push(sql`${value}`);
    }
  });
  return sql<SelectResultFields<T>>`coalesce(json_build_object(${sql.join(
    chunks
  )}), '{}')`;
}
