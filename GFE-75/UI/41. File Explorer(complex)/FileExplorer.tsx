import { useState } from "react";

type FileData = Readonly<{
  id: number;
  name: string;
  children?: ReadonlyArray<FileData>;
}>;

export default function FileExplorer({
  data,
}: Readonly<{ data: ReadonlyArray<FileData> }>) {
  const [message, setMessage] = useState("Hello world");

  return (
    <div>
      <FileList data={data} />
    </div>
  );
}

export default function FileList({
  data,
}: Readonly<{
  fileList: ReadonlyArray<FileData>;
}>) {
  const directories = data.filter((fileItem) => fileItem.children);
  directories.sort((a, b) => a.name.localeCompare(b.name));

  const nonDirectories = data.filter((fileItem) => !fileItem.children);
  nonDirectories.sort((a, b) => a.name.localeCompare(b.name));

  const items = [...directories, ...nonDirectories];

  return (
    <ul className="file-list">
      {items.map((file) => (
        <FileObject key={file.id} file={file} />
      ))}
    </ul>
  );
}

export function FileObject({ file }: Readonly<{ file: FileData }>) {
  const [expanded, setExpanded] = useState(false);
  const { children: fileChildren, name: fileName } = file;
  // If the children field is present, the item is a directory.
  const isDirectory = Boolean(fileChildren);

  return (
    <li className="file-item">
      {isDirectory ? (
        <button
          className="file-item-button file-item-button--directory"
          type="button"
          onClick={() => setExpanded(!expanded)}
        >
          <span>{fileName}</span> [{expanded ? "-" : "+"}]
        </button>
      ) : (
        <span className="file-item-button">{fileName}</span>
      )}
      {fileChildren && fileChildren.length > 0 && expanded && (
        <FileList data={fileChildren} />
      )}
    </li>
  );
}

