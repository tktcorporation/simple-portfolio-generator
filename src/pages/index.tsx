import React                         from 'react';
import _                             from 'lodash';
import yaml                          from 'js-yaml';
import * as fs                       from 'fs';
import {UserObj}                     from '@src/types/user-obj.type';
import {ReposObj}                    from '@src/types/repos-obj.type';
import {SkillsObj}                   from '@src/types/skill-obj.type';
import {RepoData}                    from '@src/types/repo-data.type';
import {isConfigObj, ReposConfigObj} from '@src/types/config-obj.type';
import SideCol                       from '@src/components/side-col/side-col';

type HomeProps =
  {user: UserObj, repos: ReposObj, skills: SkillsObj, history: boolean, others: boolean}

const Home = ({user, repos, skills, history, others}: HomeProps): JSX.Element => {
  return (
    <>
      <SideCol {...{user}}/>
      {/*<MainCol {...{repos, skills, history, others}}/>*/}
    </>
  );
};

export default Home;

export async function getStaticProps(): Promise<{props: HomeProps, revalidate: number}> {
  let config = yaml.load(fs.readFileSync('./config/config.yml', 'utf-8')) as any;
  config     = _.mapValues(config, x => x === null ? {} : x);

  if (!isConfigObj(config)) throw new Error('config.yml include wrong');

  const user = await createUser(config.username);
  _.merge(user, config.user);

  const repos  = await createRepos(config.username);
  const skills = createSkills(repos); // configで上書きする前にlanguageからskillを作る

  _.merge(repos, await correctReposConfig(config.repos));

  _.merge(skills, config.skills);

  // historyとothersをymlから読み込みreturn
  return {
    props     : {user, repos, skills, history: config.history, others: config.others},
    revalidate: 60 * 60 * 24 * 3
  };
}

async function createUser(username: string): Promise<UserObj> {
  const {
          login, name, avatar_url, gravatar_id, bio, html_url,
          email, company, location, blog, twitter_username
        } = await fetch(`https://api.github.com/users/${username}`).then(res => res.json());

  if (!login) throw new Error('user is not exist');

  // 値がfalsyなプロパディ除いたオブジェクト
  const social_media = _.pickBy({blog, twitter_username});

  return {
    login, name, avatar_url, gravatar_id, bio, html_url,
    email, company, location, social_media
  };
}

async function createRepos(username: string): Promise<ReposObj> {
  let reposData: Array<RepoData> =
        await fetch(`https://api.github.com/users/${username}/repos`).then(res => res.json());

  reposData = reposData.filter(r => !r.fork);

  const promises = reposData.map(async repoData => {
    let {name, html_url, description, language} = repoData;

    const ogp_url = await getOgpUrl(html_url);
    description   = description || ''; // nullの場合に空文字にする

    return [name, {html_url, ogp_url, description, language}];
  });

  return Object.fromEntries(await Promise.all(promises));
}

// configで新しく設定されるリポジトリーのOGPを取得する
async function correctReposConfig(reposConfig: ReposConfigObj) {
  const promises = Object.entries(reposConfig).map(async ([key, value]) => {
    if (!('html_url' in value)) return [key, value];

    const {html_url, description} = value;
    const ogp_url                 = await getOgpUrl(html_url);

    return (
      [key, {html_url, ogp_url, description}]
    );
  });

  return Object.fromEntries(await Promise.all(promises));
}

async function getOgpUrl(htmlUrl: string): Promise<string> {
  const res        = await fetch(htmlUrl).then(res => res.text());
  const resultExec = /<meta +property *= *"og:image" +content *= *"(https?:\/\/[\w!?/+\-_~=;.,*&@#$%()'\[\]]+)" *\/?>/.exec(res);

  return resultExec ? resultExec[1] : '';
}

function createSkills(repos: ReposObj): SkillsObj {
  return _.reduce(repos, (obj, repo) => {
    if (repo.language && !(repo.language in obj))
      return _.set(obj, repo.language, '');
    else
      return obj;
  }, {});
}

// テスト用
export const __local__ = {
  createUser, createRepos, correctReposConfig, getOgpUrl, createSkills
};
