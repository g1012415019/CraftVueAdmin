// 自定义排序函数集合
export const sorterFunctions: Record<string, (row1: any, row2: any, columnKey: string) => number> = {
  numberSorter: (row1, row2, columnKey) => {
    const val1 = Number(row1[columnKey]);
    const val2 = Number(row2[columnKey]);
    return val1 - val2;
  },
  dateSorter: (row1, row2, columnKey) => {
    const date1 = new Date(row1[columnKey]);
    const date2 = new Date(row2[columnKey]);
    return date1.getTime() - date2.getTime();
  },
};
