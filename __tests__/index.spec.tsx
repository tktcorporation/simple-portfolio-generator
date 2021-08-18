import {getStaticProps} from '@src/pages';
import * as fs          from 'fs';
import fetchMock        from 'jest-fetch-mock';
import {dump}           from 'js-yaml';
import {expect}         from '@jest/globals';

describe('初期化', () => {
  const originalData =
          fs.readFileSync('./config/config.yml', 'utf-8');
  const mock         = {
    user : {
      login           : 'ao-takeda',
      avatar_url      : 'https://avatars.githubusercontent.com/u/85210804?v=4',
      gravatar_id     : '',
      html_url        : 'https://github.com/ao-takeda',
      name            : null,
      company         : 'company',
      blog            : 'blog',
      location        : 'location',
      email           : null,
      bio             : 'bio',
      twitter_username: 'username'
    },
    repos:
      [
        {
          'name'       : 'ao-takeda.github.io',
          'html_url'   : 'https://github.com/ao-takeda/ao-takeda.github.io',
          'description': 'Code that\'ll help you kickstart a personal website that showcases your work as a software developer.',
          'fork'       : true,
          'language'   : 'HTML'
        },
        {
          'name'       : 'todo-app',
          'html_url'   : 'https://github.com/ao-takeda/todo-app',
          'description': null,
          'fork'       : false,
          'language'   : 'JavaScript'
        }
      ]
  };

  afterAll(() => {
    fs.writeFileSync('./config/config.yml', originalData);
  });

  beforeEach(() => {
    fetchMock.mockIf(/https:\/\/api\.github\.com\//, async req => {
      if (req.url.endsWith('/ao-takeda'))
        return JSON.stringify(mock.user);
      else if (req.url.endsWith('/repos'))
        return JSON.stringify(mock.repos);
      else
        return 'nof found';
    });
  });

  it('正しく初期化する', async () => {
    // before
    fs.writeFileSync('./config/config.yml',
                     dump({username: 'ao-takeda'}));

    // given
    const {user, repos, skills, history, others} = (await getStaticProps()).props;

    // then
    expect(user).toEqual({
                           login      : 'ao-takeda',
                           name       : null,
                           avatarUrl  : 'https://avatars.githubusercontent.com/u/85210804?v=4',
                           gravatarId : '',
                           bio        : 'bio',
                           htmlUrl    : 'https://github.com/ao-takeda',
                           email      : null,
                           company    : 'company',
                           location   : 'location',
                           socialMedia: {blog: 'blog', twitter_username: 'username'}
                         });
    expect(repos).toEqual({
                            'todo-app': {
                              htmlUrl    : 'https://github.com/ao-takeda/todo-app',
                              opgUrl     : 'https://opengraph.githubassets.com/fb3fcb259d73d758add0ded0f83a46e9fba01ed63a9116947e4b6c2988c5ac5b/ao-takeda/todo-app',
                              description: null,
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
                            username: 'ao-takeda',
                            user    : {
                              bio        : 'other bio',
                              email      : 'sample@sample.com',
                              company    : 'other company',
                              location   : 'other location',
                              socialMedia: {
                                blog            : 'other blog',
                                twitter_username: 'other username',
                                qiita_username  : 'username'
                              }
                            },
                            repos   : {
                              'todo-app': {
                                description: 'TODO管理アプリです'
                              },
                              'SSPG'    : {
                                htmlUrl    : 'url',
                                opgUrl     : 'url',
                                description: 'test',
                                language   : 'JavaScript'
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
                           login      : 'ao-takeda',
                           name       : null,
                           avatarUrl  : 'https://avatars.githubusercontent.com/u/85210804?v=4',
                           gravatarId : '',
                           bio        : 'other bio',
                           htmlUrl    : 'https://github.com/ao-takeda',
                           email      : 'sample@sample.com',
                           company    : 'other company',
                           location   : 'other location',
                           socialMedia: {
                             blog            : 'other blog',
                             twitter_username: 'other username',
                             qiita_username  : 'username'
                           }
                         });
    expect(repos).toEqual({
                            'todo-app': {
                              htmlUrl    : 'https://github.com/ao-takeda/todo-app',
                              opgUrl     : 'https://opengraph.githubassets.com/fb3fcb259d73d758add0ded0f83a46e9fba01ed63a9116947e4b6c2988c5ac5b/ao-takeda/todo-app',
                              description: 'TODO管理アプリです',
                              language   : 'JavaScript'
                            },
                            'SSPG'    : {
                              htmlUrl    : 'url',
                              opgUrl     : 'url',
                              description: 'test',
                              language   : 'JavaScript'
                            }
                          });
    expect(skills).toEqual({
                             'React': '完全に理解した',
                             'Next' : '完全に理解した'
                           });
    expect(history).toEqual(true);
    expect(others).toEqual(true);
  });
});
