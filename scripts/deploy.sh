#!/bin/bash
# build, commit, push, and deploy to vercel

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Run this from the project root${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}⚠️  Node $NODE_VERSION detected, Node 20+ is required${NC}"
    exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}📝 Uncommitted changes:${NC}"
    git status --short
    read -p "Commit these and deploy? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🛑 Cancelled${NC}"
        exit 1
    fi
fi

# build first so a broken article never gets pushed
echo -e "${GREEN}🔨 Building...${NC}"
npm run build

git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo -e "${YELLOW}⚠️  Nothing to commit${NC}"
git push

if command -v vercel &> /dev/null; then
    vercel --prod
    echo -e "${GREEN}🎉 Deployed${NC}"
else
    echo -e "${YELLOW}Pushed. Vercel CLI not found (npm i -g vercel); if the repo is linked to Vercel it will deploy from the push.${NC}"
fi
