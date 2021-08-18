import React       from 'react';
import {NextPage}  from 'next';
import MainHeading from '@src/components/main-heading/main-heading';

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

type UserObj = {
  login: string,
  name: string | null,
  avatarUrl: string,
  gravatarId: string,
  bio: string | null,
  htmlUrl: string,
  email: string | null,
  company: string | null,
  location: string | null,
  socialMedia: {[key: string]: string}
}

type RepoObj = {
  [key: string]: {
    htmlUrl: string,
    opgUrl: string,
    description: string | null,
    language: string
  }
}

type SkillsObj = {
  [key: string]: string
}
