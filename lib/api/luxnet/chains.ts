// Convenience accessors for all Lux chain VMs via the shared SDK instance.

import { getLux } from './instance';

// Primary Network chains
export function getPChain() {
  return getLux().PChain();
}
export function getCChain() {
  return getLux().CChain();
}
export function getXChain() {
  return getLux().XChain();
}

// DAG chains
export function getAChain() {
  return getLux().AChain();
}
export function getBChain() {
  return getLux().BChain();
}
export function getDChain() {
  return getLux().DChain();
}
export function getGChain() {
  return getLux().GChain();
}
export function getIChain() {
  return getLux().IChain();
}
export function getKChain() {
  return getLux().KChain();
}
export function getOChain() {
  return getLux().OChain();
}
export function getQChain() {
  return getLux().QChain();
}
export function getRChain() {
  return getLux().RChain();
}
export function getTChain() {
  return getLux().TChain();
}
export function getZChain() {
  return getLux().ZChain();
}

// Utility APIs
export function getInfo() {
  return getLux().Info();
}
export function getHealth() {
  return getLux().Health();
}
export function getIndex() {
  return getLux().Index();
}
export function getMetrics() {
  return getLux().Metrics();
}
