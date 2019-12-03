import flatten from 'lodash/flatten';

const filesInDirectory = (dir: DirectoryEntry): Promise<File[]> =>
  new Promise(resolve =>
    dir.createReader().readEntries(entries =>
      Promise.all(
        entries
          .filter(e => e.name[0] !== '.')
          .map(
            (e): Promise<File | File[]> =>
              e.isDirectory
                ? filesInDirectory(e as DirectoryEntry)
                : new Promise(resolve => (e as FileEntry).file((f: File) => resolve(f)))
          )
      )
        .then(files => flatten(files))
        .then(resolve)
    )
  );

const timestampForFilesInDirectory = (dir: DirectoryEntry): Promise<string> =>
  filesInDirectory(dir).then(files => files.map(f => f.name + f.lastModified).join());

const reload = (): void => {
  chrome.runtime.reload();
};

const watchChanges = (dir: DirectoryEntry, lastTimestamp = ''): void => {
  timestampForFilesInDirectory(dir).then(timestamp => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
    } else {
      reload();
    }
  });
};

chrome.management.getSelf(self => {
  if (self.installType === 'development') {
    chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
  }
});
