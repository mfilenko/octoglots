export class User {
  username: string;

  name: string;

  avatarUrl: string;

  followersCount: number;

  constructor(data: any) {
    this.username = data.login;
    this.name = data.name;
    this.avatarUrl = data.avatar_url;
    this.followersCount = data.followers;
  }
}
