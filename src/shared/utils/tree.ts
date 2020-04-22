export interface TreeNode<T> {
  id: string;
  data: T;
  children: Array<TreeNode<T>>;
}

export function findChild<T>(node: TreeNode<T>, childId: string): TreeNode<T> | undefined {
  return node.children.find((c) => c.id === childId);
}

export function treeFromPaths<T>(data: T[], identifier: (data: T) => string): TreeNode<T> {
  const rootData = data.find((d) => identifier(d) === '');

  if (!rootData) throw Error('no root node found');

  const root: TreeNode<T> = {
    id: '',
    data: rootData,
    children: [],
  };

  data.forEach((d) => {
    const id = identifier(d);

    if (id !== '') {
      const splitted = id.split('/');
      let cursor: TreeNode<T> = root;

      splitted.forEach((l) => {
        const hit = findChild(cursor, l);

        if (hit) {
          cursor = hit;
        } else {
          const newNode = {
            id: l,
            data: d,
            children: [],
          };

          cursor.children.push(newNode);
          cursor = newNode;
        }
      });
    }
  });

  return root;
}
