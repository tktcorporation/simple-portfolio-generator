import React                                          from 'react';
import _                                              from 'lodash';
import yaml                                           from 'js-yaml';
import * as fs                                        from 'fs';
import {UserObj}                                      from '@src/types/user-obj.type';
import {ReposObj}                                     from '@src/types/repos-obj.type';
import {SkillsObj}                                    from '@src/types/skill-obj.type';
import {RepoData}                                     from '@src/types/repo-data.type';
import {isConfigObj, ReposConfigObj}                  from '@src/types/config-obj.type';
import {isSocialMediaConfigObj, SocialMediaConfigObj} from '@src/types/social-media-config-obj.type';
import SideCol                                        from '@src/components/side-col/side-col';
import MainCol                                        from '@src/components/main-col/main-col';

type HomeProps =
  {user: UserObj, repos: ReposObj, skills: SkillsObj, history: string, others: string, socialMediaConfig: SocialMediaConfigObj}

const Home = ({user, repos, skills, history, others, socialMediaConfig}: HomeProps): JSX.Element => {
  return (
    <div className="d-md-flex min-height-full border-md-bottom">
      <SideCol {...{user, socialMediaConfig}}/>
      <MainCol {...{repos, skills, history, others}}/>
    </div>
  );
};

export default Home;

export async function getStaticProps(): Promise<{props: HomeProps, revalidate: number}> {
  let config = yaml.load(fs.readFileSync('./config/config.yml', 'utf-8')) as {[key: string]: any};

  // 値がnullなプロパティの値を、exclude_reposは空配列・それ以外は空オブジェクトに変換する
  config = Object.fromEntries(
    Object.entries(config)
          .map(([k, v]) => v === null ? k === 'exclude_repos' ? [k, []] : [k, {}]
                                      : [k, v]));

  if (!isConfigObj(config)) throw new Error();

  const user = await createUser(config.username);
  _.merge(user, config.user);

  let repos    = await createRepos(config.username);
  const skills = createSkills(repos); // configで上書きする前にlanguageからskillを作る

  _.merge(repos, await correctReposConfig(config.repos));
  repos = _.pickBy(repos, (_v, k) => !(config.exclude_repos.includes(k)));

  _.merge(skills, config.skills);

  const history = config.history ? fs.readFileSync('./config/history.md', 'utf-8')
                                 : '';
  const others  = config.others ? fs.readFileSync('./config/others.md', 'utf-8')
                                : '';

  const socialMediaConfig = yaml.load(fs.readFileSync('./config/social-media.yml', 'utf-8'));
  if (!isSocialMediaConfigObj(socialMediaConfig)) throw new Error();

  return {
    props     : {user, repos, skills, history, others, socialMediaConfig},
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
  const social_media = _.pickBy({blog, twitter: twitter_username});

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
