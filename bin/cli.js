#!/usr/bin/env node

const { execSync } = require('child_process');

const run = cmd => {
  try {
    execSync(`${cmd}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${cmd}`, e);
    return false;
  }
  return true;
};

const repo_name = process.argv[2] ? process.argv[2] : '.';
const git_checkout_command = `git clone --depth 1 https://github.com/kevvvinreed/next-prisma ${repo_name}`;
const install_dependencies_command = `cd ${repo_name} && yarn`;

console.log(`Cloning the repository with name ${repo_name}`);
const checked_out = run(git_checkout_command);
if (!checked_out) process.exit(-1);

console.log(`Installing dependencies for ${repo_name}`);
const installed_dependencies = run(install_dependencies_command);
if (!installed_dependencies) process.exit(-1);

console.log(`Boilerplate successfully installed!`);
