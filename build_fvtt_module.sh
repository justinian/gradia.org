#!/usr/bin/env bash

VERSION=$(date +'%y.%j.%H%M')
echo "Version is ${VERSION}"

if [ -f "${GITHUB_OUTPUT}" ]; then
    echo "version=${VERSION}" >> "${GITHUB_OUTPUT}"
fi

mkdir -p out/packs/

python3 ./id_replacer.py public/fvtt/pages
sed "s/__version__/${VERSION}/g" assets/fvtt/module.json > out/module.json

env bun x @foundryvtt/foundryvtt-cli package pack \
    --id gradia-org --type Module -n info \
    --in public/fvtt --out out/packs/ -v -r

rm out/gradia-org.zip
cd out; zip -v -r gradia-org.zip module.json packs
