#!/bin/bash

pnpm build
cp -f lib/lg-solution-formatter.esm.* demo/src/
cd demo

pnpm install
pnpm build
