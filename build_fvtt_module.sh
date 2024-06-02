#!/usr/bin/env bash

VERSION=$(date +'%y.%j.%H%M')
echo "::set-output name=version::${VERSION}"

mkdir -p packs/

python3 ./id_replacer.py public/fvtt/pages
sed "s/__version__/${VERSION}/g" public/fvtt/index.json > ./module.json
env bun x @foundryvtt/foundryvtt-cli package pack --id gradia-org --type Module -n info --in public/fvtt/pages --out packs/ -v

rm gradia-org.zip
zip -v -r gradia-org.zip module.json packs
