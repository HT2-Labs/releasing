const getPreviousVersion = require('./getPreviousVersion');
const getTags = require('../utils/getTags');
const getLog = require('../utils/getLog');

const executeRegex = (regex, text, returnGroup) => {
  const result = regex.exec(text);
  if (result === null) {
    return undefined;
  }
  return result[returnGroup];
};

const getCommitType = (message) => {
  const regex = /^(\w+)(\(\w+\))?:/;
  return executeRegex(regex, message, 1);
};

const getCommitBody = (message) => {
  const regex = /^\w+(\(\w+\))?: (.*)/;
  return executeRegex(regex, message, 2);
};

const getCommitScope = (message) => {
  const regex = /^\w+\((\w+)\)/;
  return executeRegex(regex, message, 1);
};

const parseCommit = ({ hash, message }) => {
  return {
    type: getCommitType(message),
    body: getCommitBody(message),
    scope: getCommitScope(message),
    hash,
  };
};

const getBreakingChangeBody = (message) => {
  const regex = /^.+\nBREAKING CHANGE: (.*)/;
  return executeRegex(regex, message, 1);
};

const getBreakingChanges = (commits) => {
  const regex = /^.+\nBREAKING CHANGE: (.*)/;
  return commits.filter(({ body }) => {
    return regex.test(body);
  }).map(({ type, body: commitBody, scope, hash }) => {
    const body = getBreakingChangeBody(commitBody);
    return { type, body, scope, hash };
  });
};

const displayChange = ({ scope, body, hash }) => {
  const scopePart = scope === undefined ? [] : [`*${scope}*:`];
  const hashPart = `(${hash.slice(0, 7)})`;
  const parts = [...scopePart, body, hashPart];
  return parts.join(' ');
};

const displaySection = (section, commits) => {
  if (commits.length === 0) {
    return [];
  }
  return [[
    `### ${section}`,
    commits.map(displayChange),
  ].join('\n')];
};

const getVersionParts = (version) => {
  const latestVersion = /(\d+\.)*\d/.exec(latest)[0];
  const versionParts = latestVersion.split('.');
  return versionParts;
};

const getChangeLog = async () => {
  const { latest, all } = await getTags();
  const previousVersion = getPreviousVersion(all, latest);
  const logLines = await getLog({ from: previousVersion, to: latest });
  const commits = logLines.map(parseCommit);
  const breakingChanges = getBreakingChanges(commits);
  const fixes = commits.filter(({ type }) => type === 'fix');
  const perfs = commits.filter(({ type }) => type === 'perf');
  const feats = commits.filter(({ type }) => type === 'feat');
  const today = (new Date()).toISOString().slice(0, 10);
  const notes = [
    `# ${latest} (${today})\nChanges since ${previousVersion} are described below.`,
    ...displaySection('Features', feats),
    ...displaySection('Performance Improvements', perfs),
    ...displaySection('Bug Fixes', fixes),
    ...displaySection('BREAKING CHANGES', breakingChanges),
  ].join('\n\n');
  return { version: latest, notes };
};

module.exports = getChangeLog;