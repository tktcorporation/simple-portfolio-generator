import React       from 'react';
import {UserObj}   from '@src/types/user-obj.type';
import {RepoObj}   from '@src/types/repos-obj.type';
import {SkillsObj} from '@src/types/skill-obj.type';

const Home: NextPage = () => {
  const {APP_NAME} = process.env;

  return (
    <MainHeading>
      Hello from <u>{APP_NAME}</u>.
    </MainHeading>
  );
};

export default Home;

type GetStaticProps =
  Promise<{props: {user: UserObj, repos: RepoObj, skills: SkillsObj, history: boolean, others: boolean}}>

export async function getStaticProps(): GetStaticProps {
  // config.ymlを読み込み

  // https://api.github.com/users/${username}にフェッチ、ユーザーデータを取得
  // ユーザーデータから分割代入でUserObjを作成
  // ymlのuserオブジェクトで上書き

  // https://api.github.com/users/${username}/reposにフェッチ、リポジトリデータを取得
  // フォークリポジトリを除いたリポジトリデータからイテレーターでReposObjを作成
  // 各リポジトリのOGPを取得
  // ymlのreposオブジェクトで上書き

  // ReposObjのLanguageからユニークなSkillsObjを作成(valueは空文字)
  // ymlにskillsがあれば置き換え

  // historyとothersをymlから読み込みreturn
}
