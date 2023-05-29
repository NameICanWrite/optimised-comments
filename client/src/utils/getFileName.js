const cutLength = 24;
const extensionLength = -4;

export const getFileName = (file) =>
   [...file.name]
      .slice(0, cutLength)
      .slice(0, extensionLength)
      .concat('... ' + [...file.name].slice(extensionLength).join(''))
      .join('');

