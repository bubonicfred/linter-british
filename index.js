/** @babel */
/* global atom:true */

const lint = require('./lint');

let activated = false;

export const activate = () => {
  activated = true;
};

export const deactivate = () => {
  activated = false;
};

export const provideLinter = () => ({
  name: 'British',
  scope: 'file',
  lintsOnChange: true,
  grammarScopes: ['*'],
  lint: async textEditor => {
    if (!activated) return [];

    if (atom.inDevMode()) console.time('lint-british'); // eslint-disable-line no-console

    const editorPath = textEditor.getPath();
    const editorText = textEditor.buffer.getText();

    const results = lint(editorPath, editorText);

    if (atom.inDevMode()) console.timeEnd('lint-british'); // eslint-disable-line no-console

    return results;
  },
});
