#!/bin/bash
# Installa le dipendenze di sviluppo necessarie
npm install
npm install --save-dev @types/node

# Esegui la build
npm run build
