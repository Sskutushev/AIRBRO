#!/usr/bin/env node

// Script to run npm audit with custom logic for CI environment
// This allows us to continue the CI/CD pipeline while being aware of vulnerabilities

const { execSync } = require('child_process');

try {
  // Run npm audit and capture the output
  const result = execSync('npm audit --audit-level=critical --json', {
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf8',
    cwd: process.cwd()
  });

  const auditResult = JSON.parse(result);

  // Only fail if there are critical vulnerabilities
  if (auditResult.metadata.vulnerabilities.critical > 0) {
    console.error(`AUDIT FAILURE: ${auditResult.metadata.vulnerabilities.critical} critical vulnerabilities found`);
    process.exit(1);
  }

  // Log vulnerabilities at other levels but don't fail the build
  const totalVulnerabilities = auditResult.metadata.vulnerabilities.total;
  if (totalVulnerabilities > 0) {
    console.log(`AUDIT NOTICE: ${totalVulnerabilities} total vulnerabilities found`);
    console.log('This is acceptable for CI/CD to continue, but should be addressed');
    
    // Print a summary of vulnerabilities
    console.log(`Low: ${auditResult.metadata.vulnerabilities.low}`);
    console.log(`Moderate: ${auditResult.metadata.vulnerabilities.moderate}`);
    console.log(`High: ${auditResult.metadata.vulnerabilities.high}`);
    console.log(`Critical: ${auditResult.metadata.vulnerabilities.critical}`);
  } else {
    console.log('No vulnerabilities found!');
  }

  process.exit(0);
} catch (error) {
  // If the command fails because of vulnerabilities, check the json result
  if (error.stdout) {
    try {
      const auditResult = JSON.parse(error.stdout);
      if (auditResult.metadata.vulnerabilities.critical > 0) {
        console.error(`AUDIT FAILURE: ${auditResult.metadata.vulnerabilities.critical} critical vulnerabilities found`);
        process.exit(1);
      } else {
        // There are vulnerabilities but no critical ones
        console.log(`AUDIT NOTICE: Non-critical vulnerabilities found, continuing...`);
        console.log(`Total: ${auditResult.metadata.vulnerabilities.total}`);
        console.log(`Critical: ${auditResult.metadata.vulnerabilities.critical}`);
        process.exit(0);
      }
    } catch (parseError) {
      console.error('Could not parse audit output:', error);
      process.exit(1);
    }
  } else {
    console.error('Audit command failed:', error);
    process.exit(1);
  }
}