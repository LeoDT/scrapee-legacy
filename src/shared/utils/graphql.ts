/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapValues } from 'lodash';
import {
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  Kind,
} from 'graphql';

import { DateTime as LuxonDateTime } from 'luxon';

const MAX_INT = 2147483647;
const MIN_INT = -2147483648;
const coerceIntString = (value: number | string): number | string => {
  if (typeof value === 'string') return value;

  if (Number.isInteger(value)) {
    if (value < MIN_INT || value > MAX_INT) {
      throw new TypeError(
        `Value is integer but outside of valid range for 32-bit signed integer: ${String(value)}`
      );
    }

    return value;
  }

  return value;
};

export const IntString = new GraphQLScalarType({
  name: 'IntString',
  serialize: coerceIntString,
  parseValue: coerceIntString,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return coerceIntString(parseInt(ast.value, 10));
    }

    if (ast.kind === Kind.STRING) {
      return ast.value;
    }

    return undefined;
  },
});

export const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize: (d: LuxonDateTime) => d.toISO(),
  parseValue: (d: string) => LuxonDateTime.fromISO(d),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return LuxonDateTime.fromISO(ast.value);
    }

    return null;
  },
});

export const customScalars: Record<string, GraphQLScalarType> = {
  IntString,
  DateTime,
};

export function getActualType(
  type: GraphQLOutputType
): GraphQLObjectType<any, any> | GraphQLScalarType | null {
  if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
    return getActualType(type.ofType);
  }

  if (type instanceof GraphQLObjectType || type instanceof GraphQLScalarType) {
    return type;
  }

  return null;
}

export function isTypeImplementNode(type: GraphQLObjectType): boolean {
  return Boolean(type.getInterfaces().find((i) => i.name === 'Node'));
}

export function parseValue<T>(value: any, type: GraphQLObjectType): T {
  return mapValues(value, (v, k) => {
    const field = type.getFields()?.[k];

    if (field) {
      const t = getActualType(field.type);

      if (t && t instanceof GraphQLScalarType) {
        const scalar = customScalars[t.name];

        if (scalar) {
          return scalar.parseValue(v);
        }
      }
    }

    return v;
  });
}
