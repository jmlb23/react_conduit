import { Article, ArticleFeed, ArticlesFeed } from "./ArticleDTOS";
import { Comment } from "./CommentDTOS";
import { construct, Errors, isOther } from "./Error";
import { Profile } from "./ProfileDTOS";
import { LoginDTO as Login, Register, User, UserUpdate } from "./UserDTOS";

interface Api {
  //USER
  login(login: Login): Promise<User | Errors>
  addUser(register: Register): Promise<User | Errors>
  getUser(token: string): Promise<User | Errors>
  updateUser(token: string, user: UserUpdate): Promise<User | Errors>

  //PROFILE
  getProfile(username: string, token?: string): Promise<Profile | Errors>
  follow(token: string, username: string): Promise<Profile | Errors>
  unfollow(token: string, username: string): Promise<Profile | Errors>

  //Article
  feed(token: string): Promise<ArticlesFeed | Errors>
  getArticles(page: number, tag?: string, favorited?: string, author?: string): Promise<ArticlesFeed | Errors>
  createArticle(token: string, article: Article): Promise<ArticlesFeed | Errors>
  getArticle(slug: string): Promise<ArticleFeed | Errors>
  updateArticle(token: string, slug: string, article: Article): Promise<ArticleFeed | Errors>
  deleteArticle(token: string, slug: string): Promise<{} | Errors>

  //Comments
  getComments(slug: string): Promise<Comment[] | Errors>
  addComment(token: string, slug: string, comment: string): Promise<Comment | Errors>
  deleteComment(token: string, slug: string, id: number): Promise<{} | Errors>

  //FAVS
  addFavorite(token: string, slug: string): Promise<ArticleFeed | Errors>
  deleteFavorite(token: string, slug: string): Promise<{} | Errors>

  //TAGS
  getTags(): Promise<string[] | Errors>
}

class ApiImpl implements Api {
  private url = (...arg: string[]) => `https://api.realworld.show/api/${arg.join("/")}`;

  private middleware(response: Response): Response | Errors {
    return response.ok ? response : construct(response.status);
  }

  login(login: Login): Promise<User | Errors> {
    return fetch(this.url("users", "login"), { body: JSON.stringify({ "user": login }), method: "post", headers: { "Content-Type": "application/json" } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => (x as ({ user: User })).user) : x);
  }
  addUser(register: Register): Promise<User | Errors> {
    return fetch(this.url("users"), { body: JSON.stringify({ "user": register }), method: "post", headers: { "Content-Type": "application/json" } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => (x as ({ user: User })).user) : x);
  }
  getUser(token: string): Promise<User | Errors> {
    return fetch(this.url("user"), { method: "get", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => (x as ({ user: User })).user) : x);
  }
  updateUser(token: string, user: UserUpdate): Promise<User | Errors> {
    return fetch(this.url("user"), { body: JSON.stringify({ "user": user }), method: "put", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => (x as ({ user: User })).user) : x);

  }
  getProfile(username: string, token?: string): Promise<Errors | Profile> {
    const headers: Record<string, string> = token !== undefined ?
      { "Content-Type": "application/json", "Authorization": `Token ${token}` }
      : { "Content-Type": "application/json" };
    return window.fetch(this.url("profiles", username), { method: "get", headers: { ...headers } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => x.profile) : x);
  }

  follow(token: string, username: string): Promise<Errors | Profile> {
    return fetch(this.url("profiles", username, "follow"), { method: "post", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => ({ profile: x }.profile)) : x);
  }
  unfollow(token: string, username: string): Promise<Errors | Profile> {
    return fetch(this.url("profiles", username, "follow"), { method: "delete", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => ({ profile: x }.profile)) : x);
  }
  feed(token: string): Promise<Errors | ArticlesFeed> {
    return fetch(this.url("articles", "feed"), { method: "get", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json() : x);
  }
  getArticles(page: number, tag?: string, favorited?: string, author?: string): Promise<Errors | ArticlesFeed> {

    return fetch(`${this.url("articles")}?limit=20&offset=${page * 20}${tag !== undefined ? `&tag=${tag}` : ``}${favorited !== undefined ? `&favorited=${favorited}` : ``}${author !== undefined ? `&author=${author}` : ``}`, { method: "get", headers: { "Content-Type": "application/json" } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json() : x);
  }
  createArticle(token: string, article: Article): Promise<Errors | ArticlesFeed> {
    return fetch(this.url("articles"), { method: "post", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` }, body: JSON.stringify({ article: article }) })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json() : x);
  }
  getArticle(slug: string): Promise<Errors | ArticleFeed> {
    return fetch(this.url("articles", slug), { method: "get", headers: { "Content-Type": "application/json" } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => x.article) : x);
  }
  updateArticle(token: string, slug: string, article: Article): Promise<Errors | ArticleFeed> {
    return fetch(this.url("articles", slug), { method: "put", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` }, body: JSON.stringify({ article: article }) })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json() : x);
  }
  deleteArticle(token: string, slug: string): Promise<{} | Errors> {
    return fetch(this.url("articles", slug), { method: "delete", headers: { "Content-Type": "application/json" } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json() : x);
  }
  getComments(slug: string): Promise<Errors | Comment[]> {
    return fetch(this.url("articles", slug, "comments"), { method: "get", headers: { "Content-Type": "application/json" } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => x.comments) : x);
  }
  addComment(token: string, slug: string, comment: string): Promise<Errors | Comment> {
    return fetch(this.url("articles", slug, "comments"), { method: "post", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ comment: { body: comment } }) })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => x.comment) : x);
  }
  deleteComment(token: string, slug: string, id: number): Promise<{} | Errors> {
    return fetch(this.url("articles", slug, "comments", id.toString()), { method: "delete", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json() : x);
  }
  addFavorite(token: string, slug: string): Promise<Errors | ArticleFeed> {
    return fetch(this.url("articles", slug, "favorite"), { method: "post", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json() : x);
  }
  deleteFavorite(token: string, slug: string): Promise<{} | Errors> {
    return fetch(this.url("articles", slug, "favorite"), { method: "delete", headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json() : x);
  }
  getTags(): Promise<Errors | string[]> {
    return fetch(this.url("tags"), { method: "get", headers: { "Content-Type": "application/json" } })
      .then(this.middleware)
      .then(x => isOther(x) ? x.json().then(x => x.tags) : x);
  }

}

const apiClient: Api = new ApiImpl()

export type { Api };
export { apiClient };
