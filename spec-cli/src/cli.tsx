import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { Extract } from './commands/extract.js';
import { Check }   from './commands/check.js';

const cli = meow(`
  Usage
    $ spec <command> <path> [options]

  Commands
    extract <path>   Render extraction results
    check   <path>   Render gap report

  Options
    --repo-name   Repo identifier (extract only)
    --layer       ui | backend | fullstack (extract only)
    --no-check    Skip auto-run of checker after extract
    --format      sarif | json | md (check only)
    --severity    high | medium | low | info (check filter)
`, {
  importMeta: import.meta,
  flags: {
    repoName: { type: 'string' },
    layer:    { type: 'string' },
    noCheck:  { type: 'boolean', default: false },
    format:   { type: 'string',  default: 'sarif' },
    severity: { type: 'string',  default: 'low' },
  }
});

const [command, targetPath] = cli.input;

if (command === "extract") {
  render(<Extract
    path={targetPath ?? "."}
    repoName={cli.flags.repoName}
    layer={cli.flags.layer}
    runCheck={!cli.flags.noCheck}
  />);
} else if (command === "check") {
  render(<Check
    path={targetPath ?? "./specs"}
    minSeverity={cli.flags.severity as 'high' | 'medium' | 'low' | 'info'}
    format={cli.flags.format}
  />);
} else {
  cli.showHelp();
}
