import {__local__, getStaticProps} from '@src/pages';
import * as fs                     from 'fs';
import _                           from 'lodash';
import fetchMock                   from 'jest-fetch-mock';
import {dump}                      from 'js-yaml';
import {expect}                    from '@jest/globals';

const MOCKS = {
  user : {
    login           : 'ao0125',
    avatar_url      : 'https://avatars.githubusercontent.com/u/85210804?v=4',
    gravatar_id     : '',
    html_url        : 'https://github.com/ao0125',
    name            : null,
    company         : 'company',
    blog            : 'blog',
    location        : 'location',
    email           : null,
    bio             : 'bio',
    twitter_username: 'username' as string | null
  },
  repos:
    [
      {
        name       : 'ao0125.github.io',
        html_url   : 'https://github.com/ao0125/ao0125.github.io',
        description: 'Code that\'ll help you kickstart a personal website that showcases your work as a software developer.',
        fork       : true,
        language   : 'HTML'
      },
      {
        name       : 'todo-app',
        html_url   : 'https://github.com/ao0125/todo-app',
        description: null,
        fork       : false,
        language   : 'JavaScript'
      }
    ]
};

describe('補助関数', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.enableMocks();
  });

  describe('createUser', () => {
    it('正しく作る', async () => {
      // before
      fetchMock.mockResponseOnce(JSON.stringify(MOCKS.user));

      // given
      const user = await __local__.createUser('ao0125');

      // then
      expect(user).toEqual({
                             login       : 'ao0125',
                             name        : null,
                             avatar_url  : 'https://avatars.githubusercontent.com/u/85210804?v=4',
                             gravatar_id : '',
                             bio         : 'bio',
                             html_url    : 'https://github.com/ao0125',
                             email       : null,
                             company     : 'company',
                             location    : 'location',
                             social_media: {blog: 'blog', twitter_username: 'username'}
                           });
    });

    it('blog, twitter_usernameが与えられない場合social_mediaが空になる', async () => {
      //before
      const mockTmp            = _.cloneDeep(MOCKS.user);
      mockTmp.blog             = '';
      mockTmp.twitter_username = null;
      fetchMock.mockOnce(JSON.stringify(mockTmp));

      // given
      const user = await __local__.createUser('ao0125');

      // then
      expect(user).toEqual({
                             login       : 'ao0125',
                             name        : null,
                             avatar_url  : 'https://avatars.githubusercontent.com/u/85210804?v=4',
                             gravatar_id : '',
                             bio         : 'bio',
                             html_url    : 'https://github.com/ao0125',
                             email       : null,
                             company     : 'company',
                             location    : 'location',
                             social_media: {}
                           });
    });

    it('存在しないユーザー名を指定した場合エラーを起こす', async () => {
      // before
      fetchMock.mockOnce(JSON.stringify({message: 'Not Found'}));

      // given
      const promise = __local__.createUser('stranger');

      // then
      await expect(promise).rejects.toEqual(new Error('user is not exist'));
    });
  });

  describe('createRepos', () => {
    it('正しく作られ、フォークリポジトリは含まない', async () => {
      // before
      fetchMock.mockIf(/https:\/\//, async req => {
        if (req.url.endsWith('/repos'))
          return JSON.stringify(MOCKS.repos);
        else
          return '<html><head><meta property="og:image" content="https://image.jpg"/></head></html>';
      });

      // given
      const repos = await __local__.createRepos('takeda0125');

      // then
      expect(repos).toEqual({
                              'todo-app': {
                                html_url   : 'https://github.com/ao0125/todo-app',
                                ogp_url    : 'https://image.jpg',
                                description: '',
                                language   : 'JavaScript'
                              }
                            });
    });

    it('リポジトリが無い場合もエラーにならない', async () => {
      // before
      fetchMock.mockOnce(JSON.stringify([]));

      // given
      const reposObj = await __local__.createRepos('null');

      // then
      expect(reposObj).toEqual({});
    });
  });

  describe('correctReposConfig', () => {
    it('正しくコレクトする', async () => {
      // before
      fetchMock.mockOnce(
        '<html><head><meta property="og:image" content="https://image.jpg"/></head></html>'
      );

      const config = {
        'todo-app'        : {
          description: 'TODO管理アプリです',
          language   : ''
        },
        'personal-website': {
          html_url   : 'https://github.com/github/personal-website',
          description: 'test'
        }
      };

      // given
      const reposConfig = await __local__.correctReposConfig(config);

      // then
      expect(reposConfig).toEqual({
                                    'todo-app'        : {
                                      description: 'TODO管理アプリです',
                                      language   : ''
                                    },
                                    'personal-website': {
                                      html_url   : 'https://github.com/github/personal-website',
                                      ogp_url    : 'https://image.jpg',
                                      description: 'test'
                                    }
                                  });
    });

    it('空でもエラーにならない', async () => {
      // given
      const reposConfig = await __local__.correctReposConfig({});

      // then
      expect(reposConfig).toEqual({});
    });
  });

  describe('getOgpUrl', () => {
    it('ogpUrlを取得できる', async () => {
      // before
      fetchMock.mockOnce(
        '<html><head><meta property="og:image" content="https://image.jpg"/></head></html>'
      );

      // given
      const ogpUrl = await __local__.getOgpUrl('https://image.com');

      // then
      expect(ogpUrl)
        .toEqual('https://image.jpg');
    });

    it('ogpが無いURLを指定した場合、空の文字列を返す', async () => {
      // before
      fetchMock.mockOnce('<html></html>');

      // given
      const ogpUrl = await __local__.getOgpUrl('https://null.com');

      // then
      expect(ogpUrl).toEqual('');
    });
  });

  describe('createSkills', () => {
    it('ユニークなオブジェクトを作る', () => {
      // before
      const repos = {
        a: {html_url: '', ogp_url: '', description: '', language: 'test'},
        b: {html_url: '', ogp_url: '', description: '', language: 'test'},
        c: {html_url: '', ogp_url: '', description: '', language: 'test2'}
      };

      // given
      const skills = __local__.createSkills(repos);

      // then
      expect(skills).toEqual({test: '', test2: ''});
    });

    it('nullを除いたオブジェクトを作る', () => {
      // before
      const repos = {
        a: {html_url: '', ogp_url: '', description: '', language: null}
      };

      // given
      const skills = __local__.createSkills(repos);

      // then
      expect(skills).toEqual({});
    });
  });
});

describe('getStaticProps', () => {
  const originalData =
          fs.readFileSync('./config/config.yml', 'utf-8');

  afterAll(() => {
    fs.writeFileSync('./config/config.yml', originalData);
    fetchMock.disableMocks();
  });

  beforeEach(() => {
    fetchMock.mockIf(/https:\/\//, async req => {
      if (req.url.endsWith('/ao0125'))
        return JSON.stringify(MOCKS.user);
      else if (req.url.endsWith('/repos'))
        return JSON.stringify(MOCKS.repos);
      else
        return '<html><head><meta property="og:image" content="https://image.jpg"/></head></html>';
    });
  });

  it('正しく初期化する', async () => {
    // before
    fs.writeFileSync('./config/config.yml',
                     dump({
                            username: 'ao0125',
                            user    : {},
                            repos   : {},
                            skills  : {},
                            history : false,
                            others  : false
                          }));

    // given
    const {user, repos, skills, history, others} = (await getStaticProps()).props;

    // then
    expect(user).toEqual({
                           login       : 'ao0125',
                           name        : null,
                           avatar_url  : 'https://avatars.githubusercontent.com/u/85210804?v=4',
                           gravatar_id : '',
                           bio         : 'bio',
                           html_url    : 'https://github.com/ao0125',
                           email       : null,
                           company     : 'company',
                           location    : 'location',
                           social_media: {blog: 'blog', twitter_username: 'username'}
                         });
    expect(repos).toEqual({
                            'todo-app': {
                              html_url   : 'https://github.com/ao0125/todo-app',
                              ogp_url    : 'https://image.jpg',
                              description: '',
                              language   : 'JavaScript'
                            }
                          });
    expect(skills).toEqual({'JavaScript': ''});
    expect(history).toEqual(false);
    expect(others).toEqual(false);
  });

  it('config.ymlが書かれている場合も正しく初期化する', async () => {
    // before
    fs.writeFileSync('./config/config.yml',
                     dump({
                            username: 'ao0125',
                            user    : {
                              bio         : 'other bio',
                              email       : 'sample@sample.com',
                              company     : 'other company',
                              location    : 'other location',
                              social_media: {
                                twitter_username: 'other username',
                                qiita_username  : 'username'
                              }
                            },
                            repos   : {
                              'todo-app'        : {
                                description: 'TODO管理アプリです',
                                language   : ''
                              },
                              'personal-website': {
                                html_url   : 'https://github.com/github/personal-website',
                                description: 'test'
                              }
                            },
                            skills  : {
                              'React': '完全に理解した',
                              'Next' : '完全に理解した'
                            },
                            history : true,
                            others  : true
                          }));

    // given
    const {user, repos, skills, history, others} = (await getStaticProps()).props;

    // then
    expect(user).toEqual({
                           login       : 'ao0125',
                           name        : null,
                           avatar_url  : 'https://avatars.githubusercontent.com/u/85210804?v=4',
                           gravatar_id : '',
                           bio         : 'other bio',
                           html_url    : 'https://github.com/ao0125',
                           email       : 'sample@sample.com',
                           company     : 'other company',
                           location    : 'other location',
                           social_media: {
                             blog            : 'blog',
                             twitter_username: 'other username',
                             qiita_username  : 'username'
                           }
                         });
    expect(repos).toEqual({
                            'todo-app'        : {
                              html_url   : 'https://github.com/ao0125/todo-app',
                              ogp_url    : 'https://image.jpg',
                              description: 'TODO管理アプリです',
                              language   : ''
                            },
                            'personal-website': {
                              html_url   : 'https://github.com/github/personal-website',
                              ogp_url    : 'https://image.jpg',
                              description: 'test'
                            }
                          });
    expect(skills).toEqual({
                             'JavaScript': '',
                             'React'     : '完全に理解した',
                             'Next'      : '完全に理解した'
                           });
    expect(history).toEqual(true);
    expect(others).toEqual(true);
  });
});

describe('getStaticProps-本番-', () => {
  const originalData =
          fs.readFileSync('./config/config.yml', 'utf-8');

  afterAll(() => {
    fs.writeFileSync('./config/config.yml', originalData);
  });

  it('usernameだけの時エラーが起きない', async () => {
    // before
    fs.writeFileSync('./config/config.yml', dump({
                                                   username: 'takeda0125',
                                                   user    : null,
                                                   repos   : null,
                                                   skills  : null,
                                                   history : false,
                                                   others  : false
                                                 }));

    // given
    const props = await getStaticProps();

    // then
    expect(props).toEqual(expect.anything());
  });
});
