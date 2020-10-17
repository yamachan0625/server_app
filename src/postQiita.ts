import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { ItemData, TagData, StockData } from './interfaces/QiitaAPI';
import { objectArraySort } from './helper/helper';

export const postQiita = async () => {
  const postList = [
    { tag: 'React', id: 'e7192db6692fab8b6508' },
    { tag: 'Typescript', id: 'fd055caf688b959a1240' },
    { tag: 'Javascript', id: '3710bb2841d7db3fc1c4' },
    { tag: 'Next.js', id: '768cddd26837e101247f' },
  ];

  const now = dayjs().add(9, 'hour');
  const BASE_URL = 'https://qiita.com/api/v2';
  const authorization_token = `Bearer ${process.env.QIITA_AUTH_TOKEN}`;

  const fetch = (path, page = 1) => {
    const axiosConfig: AxiosRequestConfig = {
      params: {
        page: page,
        per_page: 100,
      },
      headers: {
        Authorization: authorization_token,
      },
    };

    return axios
      .get(`${BASE_URL}${path}`, axiosConfig)
      .then((response) => response.data);
  };

  const patch = (title, body, tag, id) => {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: authorization_token,
      },
    };
    return axios
      .patch(
        `${BASE_URL}/items/${id}`,
        {
          body: body,
          private: false,
          tags: [{ name: `${tag}` }],
          title: title,
        },
        axiosConfig
      )
      .then((response) => response.data);
  };

  postList.forEach(async (post) => {
    const tagData: TagData = await fetch(`/tags/${post.tag}`).catch((error) => {
      console.log(error);
    });

    /**POSTで使用する為のデータを整形し返す */
    const getFormatData: ItemData = await (async () => {
      const response: ItemData = await fetch(`/tags/${post.tag}/items`).catch(
        (error) => {
          console.log(error);
        }
      );

      /**一週間以内の記事かつLGTMが3以上の記事 */
      const filterData = (() => {
        const beforeWeek = now.subtract(1, 'week').format();

        return response.filter((data) => {
          return beforeWeek < data.created_at && 3 <= data.likes_count;
        });
      })();

      const likeCountDesc = objectArraySort<ItemData>(
        filterData,
        'likes_count',
        'desc'
      );

      const retryFetch = async (
        i: number,
        retryCount = 1,
        stockCount = 0
      ): Promise<number> => {
        if (retryCount > 10) return 1000;
        const response: StockData = await fetch(
          `/items/${likeCountDesc[i].id}/stockers`,
          retryCount
        ).catch((error) => {
          console.log(error);
        });
        // 一度に100件しか取得できない為100件以上の時は次のページでAPIをコールする
        if (response.length === 100) {
          return await retryFetch(
            i,
            retryCount + 1,
            stockCount + response.length
          );
        }

        return response.length + stockCount;
      };

      /**stock_countとtotal_like_and_stockをデータに追加 */
      const addPropatyStockRelated = await (async () => {
        const newData = likeCountDesc;
        // NOTE: forEachではコールバックは無視される為非同期処理が終わるまで待つことができない
        for (let i = 0; i < likeCountDesc.length; i++) {
          const stockCount = await retryFetch(i);
          newData[i]['stock_count'] = stockCount;
          newData[i]['total_like_and_stock'] =
            stockCount + newData[i].likes_count;
        }
        return newData;
      })();

      /**LGTM数とストック数の合計値の降順 */
      const likePlusStockDesc = objectArraySort<ItemData>(
        addPropatyStockRelated,
        'total_like_and_stock',
        'desc'
      );

      // 配列の中身を10件になるように削る
      const formatDataLength = (data: ItemData) => {
        if (data.length > 10) {
          return data.splice(0, 10);
        }
        return data;
      };

      const formatCompleteData = formatDataLength(likePlusStockDesc);

      return formatCompleteData;
    })();

    const title = `【${tagData.id}】LGTM数 + ストック数ランキング【毎日自動更新】`;

    const body = (() => {
      const nowFormat = now.format('YYYY/MM/DD');
      const beforeWeekFormat = now.subtract(1, 'week').format('YYYY/MM/DD');

      const first =
        '# はじめに\nLGTM数 + ストック数の合計値が高い記事こそが真に価値のある記事ではないだろうか⭐︎\nという思いからLGTM数 + ストック数の合計でランキングをつけ自動で投稿できようにしました。\n自分の気になるタグの有益な記事が埋もれるのを防げたら最高です。';

      const tagOverview = `# 集計タグ\n**タグ名：**${
        '`' + tagData.id + '`'
      }\n**フォロワー数：**${tagData.followers_count}\n**記事数：**${
        tagData.items_count
      }`;

      const aggregateOverview = `# 集計概要\n**集計方法：**毎日7時に Qiita API v2をcronにて定期実行し集計\n**集計期間：**${beforeWeekFormat} ~ ${nowFormat}\n**集計内容：**LGTM数 + ストック数合計値\n**集計対象：**LGTM数3件以上`;

      const mainBody = getFormatData.reduce((acc, data, i) => {
        const formatCreatedAt = dayjs(data.created_at).format(
          'YYYY/MM/DD/h:mm A'
        );
        const tags = data.tags.reduce((acc, tag, i) => {
          const space = i === 0 ? '' : '  ';
          return acc + space + '`' + tag.name + '`';
        }, '');

        const body = `# ${i + 1}位：[${data.title}](${data.url})(${
          data.total_like_and_stock
        }P)\n**LGTM数：${data.likes_count}**  **ストック数：${
          data.stock_count
        }**\n${tags}\n[@${data.user.id}](http://qiita.com/${
          data.user.id
        })さんの投稿（${formatCreatedAt}）\n`;
        return acc + body;
      }, '');

      return (
        first + '\n' + tagOverview + '\n' + aggregateOverview + '\n' + mainBody
      );
    })();

    await patch(title, body, post.tag, post.id).catch((error) => {
      console.log(error);
    });

    // デバッグ用
    // getFormatData.forEach((data: any) => {
    //   console.log('いいねとストックの合計:', data.title);
    //   console.log('いいねとストックの合計:', data.total_like_and_stock);
    //   console.log('いいね:', data.likes_count);
    //   console.log('ストック数:', data.stock_count);
    //   console.log('作成日:', data.created_at);
    //   console.log(
    //     '-----------------------------------------------------------------'
    //   );
    // });
  });
};
