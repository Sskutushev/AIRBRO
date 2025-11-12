# Commands to Deploy

Execute these commands in PowerShell to commit and push changes:

```powershell
cd "C:\Users\sskut\Desktop\AIRBRO"

# Commit changes
git commit -m "fix: resolve CORS and API configuration issues for production

- Fix CORS configuration to allow Railway and Vercel origins
- Add dynamic origin validation with better error logging  
- Update documentation structure with comprehensive guides
- Add ENVIRONMENT_SETUP.md for deployment configuration
- Create detailed docs: API, ARCHITECTURE, CI_CD, DEPLOYMENT, SECURITY, SEO, TESTING
- Remove outdated documentation files

This fixes authentication issues on Railway and Vercel deployments.

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>"

# Push to GitHub
git push origin main
```

## After Push

1. Wait for GitHub Actions CI/CD to complete (check Actions tab)
2. Railway will automatically deploy backend
3. Vercel will automatically deploy frontend
4. Follow POST_DEPLOY_CHECKLIST.md to configure environment variables
