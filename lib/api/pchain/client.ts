import { getLux } from 'lib/api/luxnet/instance';

export function getPChain() {
  return getLux().PChain();
}

export function getInfo() {
  return getLux().Info();
}

export function getHealth() {
  return getLux().Health();
}
