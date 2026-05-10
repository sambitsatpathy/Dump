#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './App.js';

const cli = meow(
  `
  Usage
    $ kaze [workspace-path]

  Options
    --name, -n   Name your pet  (default: Kaze)
    --help       Show this message

  Examples
    $ kaze .
    $ kaze ~/projects/my-app --name Bolt
    $ kaze /absolute/path/to/workspace
`,
  {
    importMeta: import.meta,
    flags: {
      name: {
        type: 'string',
        shortFlag: 'n',
        default: 'Kaze',
      },
    },
  }
);

const workspacePath = cli.input[0] ?? process.cwd();

render(
  <App workspacePath={workspacePath} petName={cli.flags.name} />,
  { exitOnCtrlC: true }
);
