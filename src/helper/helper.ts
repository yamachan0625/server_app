/**オブジェクトとそのキーを指定してバリューを昇降順にソートする */
export const objectArraySort = <T extends any[]>(
  data: T,
  key: string,
  order: 'desc' | 'asc'
): T => {
  const [num1, num2] = order === 'desc' ? [-1, 1] : [1, -1];
  return data.sort((a, b) => {
    if (a[key] > b[key]) {
      return num1;
    } else {
      return num2;
    }
  });
};
