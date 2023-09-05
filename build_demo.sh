#!/bin/bash

pnpm build
cp -f lib/lg-solution-formatter.esm.js demo/src/
cd demo

pnpm install
pnpm build
